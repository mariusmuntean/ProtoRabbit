using System.Collections.Concurrent;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace ProtoRabbit.Services;

public class AsyncMessagePublisher
{
    private readonly HashSet<IModel> _activeChannels = new HashSet<IModel>();
    private readonly ConcurrentDictionary<ulong, TaskCompletionSource<ulong>> _messageIdToTcsMap = new ConcurrentDictionary<ulong, TaskCompletionSource<ulong>>();


    public Task<ulong> Send(IModel channel, string exchange, string routingKey, byte[] @event)
    {
        ArgumentNullException.ThrowIfNull(channel, nameof(channel));
        SetUpChannelIfNew(channel);

        // Part 1 of the async message publishing - store the message ID and the TaskCompletion Source
        var messageKey = channel.NextPublishSeqNo;
        var tcs = new TaskCompletionSource<ulong>();
        if (!_messageIdToTcsMap.TryAdd(messageKey, tcs))
        {
            throw new Exception($"Message no '{messageKey}' already enqueued");
        }

        channel.BasicPublish(exchange, routingKey, body: @event, mandatory: true);

        return tcs.Task;
    }

    private void SetUpChannelIfNew(IModel channel)
    {
        if (_activeChannels.Contains(channel))
        {
            return;
        }

        channel.ConfirmSelect();

        channel.ModelShutdown += OnModelShutdown;
        channel.BasicAcks += NewChannel_BasicAcks;
        channel.BasicNacks += NewChannel_BasicNacks;

        _activeChannels.Add(channel);
    }


    // Part 2 of async message handling
    private void NewChannel_BasicAcks(object sender, BasicAckEventArgs e)
    {
        // See the docs for handling 'multiple'. Here we're dealing with the simple case. https://www.rabbitmq.com/tutorials/tutorial-seven-dotnet.html

        if (_messageIdToTcsMap.TryGetValue(e.DeliveryTag, out var tcs))
        {
            tcs.SetResult(e.DeliveryTag);
            _messageIdToTcsMap.Remove(e.DeliveryTag, out var _);
        }
    }

    // Part 2 of async message handling
    private void NewChannel_BasicNacks(object sender, BasicNackEventArgs e)
    {
        if (_messageIdToTcsMap.TryGetValue(e.DeliveryTag, out var tcs))
        {
            tcs.SetException(new Exception($"Message {e.DeliveryTag} not acknowledged"));
            _messageIdToTcsMap.Remove(e.DeliveryTag, out var _);
        }
    }

    // Part 2 of async message handling
    private void OnModelShutdown(object sender, ShutdownEventArgs e)
    {
        foreach (var (messageKey, tcs) in _messageIdToTcsMap)
        {
            tcs.SetException(new Exception($"Underlying channel was shut down. {e}"));
            _messageIdToTcsMap.Remove(messageKey, out var _);
        }
    }
}