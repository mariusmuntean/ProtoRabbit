using System.Diagnostics;
using System.Text.Json;
using ProtoBuf;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace ProtoRabbit.Services;

public abstract class Subscription
{
    protected readonly IConnection _connection;
    private readonly string _exchange;
    protected readonly string _routingKey;
    protected readonly string _queueName;
    protected readonly string _subscriptionName;

    protected Subscription(IConnection connection, string exchange, string routingKey, string queueName, string subscriptionName)
    {
        _exchange = exchange;
        _routingKey = routingKey;
        _queueName = queueName;
        _subscriptionName = subscriptionName;
        _connection = connection;
    }

    public string Exchange => _exchange;

    public string RoutingKey => _routingKey;

    public string QueueName => _queueName;

    public string SubscriptionName => _subscriptionName;
}

public class Subscription<TMessage> : Subscription
{
    private readonly Action<MessageWrapper<TMessage>> _onNewMessage;

    public Subscription(
        IConnection connection,
        string exchange,
        string routingKey,
        string queueName,
        string subscriptionName,
        Action<MessageWrapper<TMessage>> onNewMessage) : base(connection, exchange, routingKey, queueName, subscriptionName)
    {
        _onNewMessage = onNewMessage;

        var channel = _connection.CreateModel();
        var response = channel.QueueDeclare(queueName, false, true, true);
        channel.QueueBind(response.QueueName, exchange, routingKey);

        var consumer = new EventingBasicConsumer(channel);
        consumer.Received += OnReceived;

        var f = channel.BasicConsume(queueName, autoAck: true, consumer: consumer);
    }

    private void OnReceived(object sender, BasicDeliverEventArgs e)
    {
        try
        {
            using var ms = new MemoryStream(e.Body.ToArray());
            var message = Serializer.Deserialize<TMessage>(ms);
            var jsonMessage = JsonSerializer.Serialize(message);
            Debug.WriteLine($"{DateTime.Now} {Exchange} {RoutingKey} {QueueName} -> {jsonMessage}");
            _onNewMessage?.Invoke(new MessageWrapper<TMessage>(DateTime.Now, Exchange, RoutingKey, QueueName, message));
        }
        catch (Exception exception)
        {
            Debug.WriteLine(exception.ToString());
        }
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