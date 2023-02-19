using RabbitMQ.Client;

namespace ProtoRabbit.Services;

public class RabbitClientFactory
{
    private readonly CachingConnectionFactory _cachingConnectionFactory;

    public RabbitClientFactory(CachingConnectionFactory cachingConnectionFactory)
    {
        _cachingConnectionFactory = cachingConnectionFactory;
    }

    public RabbitClient GetClientForServer(string host, string username, string password, int port)
    {
        var connection = _cachingConnectionFactory.GetConnectionForServer(host, username, password, port);
        return new RabbitClient(connection);
    }
}

public class RabbitClient
{
    private readonly IConnection _connection;
    private IModel _channel;
    private Action _onShutdown;

    private AsyncMessagePublisher _messagePublisher;

    public RabbitClient(IConnection connection)
    {
        _connection = connection;
        _connection.ConnectionShutdown += OnConnectionShutdown;

        _messagePublisher = new AsyncMessagePublisher();
    }

    private void OnConnectionShutdown(object sender, ShutdownEventArgs e)
    {
        _onShutdown?.Invoke();
    }

    /// <summary>
    /// Optional action to be called when the connection is shut down. Receives the cause.
    /// </summary>
    public Action OnShutdown
    {
        set => _onShutdown = value;
    }

    public async Task<ulong> Send(string exchange, string routingKey, byte[] @event)
    {
        var channel = GetChannel();
        return await _messagePublisher.Send(channel, exchange, routingKey, @event);
    }

    /// <summary>
    /// Closes the internal channel to the server. Don't use a closed client.
    /// </summary>
    public void Close()
    {
        _channel.Close();
    }

    public bool IsClosed => !_connection.IsOpen;

    private IModel GetChannel()
    {
        if (_channel is null)
        {
            _channel = GetNewChannelWithHandlers();
        }
        else if (_channel.IsClosed)
        {
            _channel.Dispose();
            _channel = GetNewChannelWithHandlers();
        }

        return _channel;
    }

    private IModel GetNewChannelWithHandlers()
    {
        var newChannel = _connection.CreateModel();
        return newChannel;
    }
}