using System.Collections.Concurrent;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace ProtoRabbit.Services;

public class AsyncMessagePublisher
{
    private readonly ConcurrentDictionary<ulong, TaskCompletionSource<ulong>> _messageIdToTcsMap = new();

    private readonly ConnectionManager _connectionManager;
    private IModel _activeChannel;

    public AsyncMessagePublisher(ConnectionManager connectionManager)
    {
        _connectionManager = connectionManager;
    }

    public Task<ulong> Send(string exchange, string routingKey, byte[] @event)
    {
        var channel = GetChannel();
        var task = GetTaskForMessagePublishing(channel);

        channel.BasicPublish(exchange, routingKey, body: @event, mandatory: true);

        return task;
    }

    private IModel GetChannel()
    {
        if (_activeChannel is null || _activeChannel.IsClosed)
        {
            _activeChannel?.Dispose();

            var connection = _connectionManager.CurrentConnection ?? throw new Exception("The connection manager has currently no open connection. Cannot create a new channel.");
            _activeChannel = connection.CreateModel();
            _activeChannel.ConfirmSelect();
            _activeChannel.ModelShutdown += OnModelShutdown;
            _activeChannel.BasicAcks += NewChannel_BasicAcks;
            _activeChannel.BasicNacks += NewChannel_BasicNacks;
        }

        return _activeChannel;
    }

    #region Part 1 of the async message publishing - store the message ID and the TaskCompletion Source

    private Task<ulong> GetTaskForMessagePublishing(IModel channel)
    {
        var messageKey = channel.NextPublishSeqNo;
        var tcs = new TaskCompletionSource<ulong>();
        if (!_messageIdToTcsMap.TryAdd(messageKey, tcs))
        {
            throw new Exception($"Message no '{messageKey}' already enqueued");
        }

        var task = tcs.Task;


        return task;
    }

    #endregion

    #region Part 2 of async message handling - Set a result or fail running tasks

    private void NewChannel_BasicAcks(object sender, BasicAckEventArgs e)
    {
        // See the docs for handling 'multiple'. Here we're dealing with the simple case. https://www.rabbitmq.com/tutorials/tutorial-seven-dotnet.html

        if (_messageIdToTcsMap.TryGetValue(e.DeliveryTag, out var tcs))
        {
            tcs.SetResult(e.DeliveryTag);
            _messageIdToTcsMap.Remove(e.DeliveryTag, out var _);
        }
    }

    private void NewChannel_BasicNacks(object sender, BasicNackEventArgs e)
    {
        if (_messageIdToTcsMap.TryGetValue(e.DeliveryTag, out var tcs))
        {
            tcs.SetException(new Exception($"Message {e.DeliveryTag} not acknowledged"));
            _messageIdToTcsMap.Remove(e.DeliveryTag, out var _);
        }
    }

    private void OnModelShutdown(object sender, ShutdownEventArgs e)
    {
        // Transition all running tasks to Faulted
        foreach (var (messageKey, tcs) in _messageIdToTcsMap)
        {
            tcs.SetException(new Exception($"Underlying channel was shut down. {e}"));
            _messageIdToTcsMap.Remove(messageKey, out var _);
        }

        // Remove event handler from current channel model and set to null to be collected
        _activeChannel.ModelShutdown -= OnModelShutdown;
        _activeChannel.Dispose();
        _activeChannel = null;
    }

    #endregion
}