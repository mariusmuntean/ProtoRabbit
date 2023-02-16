using System;
using System.Diagnostics;
using System.Text.Json;
using ProtoBuf;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace ProtoRabbit.Services;

public class Subscription
{
    protected readonly IConnection _connection;
    private readonly string _exchange;
    protected readonly string _routingKey;
    protected readonly string _queueName;
    protected readonly string _subscriptionName;

    EventHandler<BasicDeliverEventArgs> _onReceived;

    private IModel _channel;
    private EventingBasicConsumer _consumer;

    public Subscription(IConnection connection,
        string exchange,
        string routingKey,
        string queueName,
        string subscriptionName)
    {
        _exchange = exchange;
        _routingKey = routingKey;
        _queueName = queueName;
        _subscriptionName = subscriptionName;
        _connection = connection;
    }

    public Guid Id { get; } = Guid.NewGuid();

    public string Exchange => _exchange;

    public string RoutingKey => _routingKey;

    public string QueueName => _queueName;

    public string SubscriptionName => _subscriptionName;

    public void StartConsuming(Type messageType, Action<MessageWrapper<object>> onMessage)
    {
        _channel = _connection.CreateModel();
        var response = _channel.QueueDeclare(_queueName, false, true, true);
        _channel.QueueBind(response.QueueName, _exchange, _routingKey);

        _consumer = new EventingBasicConsumer(_channel);

        _onReceived = GetOnReceived(messageType, onMessage);
        _consumer.Received += _onReceived;
        _channel.BasicConsume(_queueName, autoAck: true, consumer: _consumer);
    }

    public void StopConsuming()
    {
        _channel.Close();
        _consumer.Received -= _onReceived;
        _consumer = null;
        _channel.Dispose();
    }

    private EventHandler<BasicDeliverEventArgs> GetOnReceived(Type messageType, Action<MessageWrapper<object>> onMessage)
    {
        void OnReceived(object sender, BasicDeliverEventArgs e)
        {
            try
            {
                using var ms = new MemoryStream(e.Body.ToArray());
                var message = Serializer.Deserialize(messageType, ms);
                var jsonMessage = JsonSerializer.Serialize(message);
                Debug.WriteLine($"{DateTime.Now} {_exchange} {_routingKey} {_queueName} -> {jsonMessage}");
                onMessage?.Invoke(new MessageWrapper<object>(DateTime.Now, Exchange, RoutingKey, QueueName, message));
            }
            catch (Exception exception)
            {
                Debug.WriteLine(exception.ToString());
            }
        }

        return OnReceived;
    }
}

public class MessageWrapper<TMessage>
{
    public MessageWrapper(DateTime dateTime, string exchange, string routingKey, string queue, TMessage message)
    {
        DateTime = dateTime;
        Exchange = exchange;
        RoutingKey = routingKey;
        Queue = queue;
        Message = message;
    }

    public DateTime DateTime { get; }
    public string Exchange { get; }
    public string RoutingKey { get; }
    public string Queue { get; }
    public TMessage Message { get; }
}