using RabbitMQ.Client;

namespace ProtoRabbit.Services;

public class RabbitClient
{
    private readonly ConnectionManager _connectionManager;
    private readonly AsyncMessagePublisher _asyncMessagePublisher;
    private IConnection _connection;
    private Action _onShutdown;

    public RabbitClient(ConnectionManager connectionManager, AsyncMessagePublisher asyncMessagePublisher)
    {
        _connectionManager = connectionManager;
        _asyncMessagePublisher = asyncMessagePublisher;
    }

    public void Connect(string host, string username, string password, int port)
    {
        if (_connection is not null)
        {
            _connection.ConnectionShutdown -= OnConnectionShutdown;
        }

        _connection = _connectionManager.Connect(host, username, password, port);
        _connection.ConnectionShutdown += OnConnectionShutdown;
    }

    /// <summary>
    /// Closes the connection to the server.
    /// </summary>
    public void CloseConnection(string reasonTex = null) => _connectionManager.CloseCurrentConnection(reasonTex);

    public bool IsClosed => _connection is null || !_connection.IsOpen;

    /// <summary>
    /// Optional action to be called when the connection is shut down. Receives the cause.
    /// </summary>
    public Action OnShutdown
    {
        set => _onShutdown = value;
    }

    public async Task<ulong> Send(string exchange, string routingKey, byte[] @event)
    {
        return await _asyncMessagePublisher.Send(exchange, routingKey, @event);
    }

    private void OnConnectionShutdown(object sender, ShutdownEventArgs e)
    {
        _onShutdown?.Invoke();
    }
}