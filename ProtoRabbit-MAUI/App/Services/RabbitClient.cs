using RabbitMQ.Client;

namespace ProtoRabbit.Services;

public class RabbitClient : IRabbitClient
{
    private readonly ConnectionManager _connectionManager;
    private readonly AsyncMessagePublisher _asyncMessagePublisher;
    private IConnection _connection;

    private readonly List<Action> _onConnectionShutdownActions;

    public RabbitClient(ConnectionManager connectionManager, AsyncMessagePublisher asyncMessagePublisher)
    {
        _connectionManager = connectionManager;
        _asyncMessagePublisher = asyncMessagePublisher;

        _onConnectionShutdownActions = new List<Action>();
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
    /// Add an optional action to be called when the connection is shut down.
    /// </summary>
    /// <param name="onConnectionShutdown"></param>
    public void AddOnConnectionShutdownAction(Action onConnectionShutdown)
    {
        ArgumentNullException.ThrowIfNull(onConnectionShutdown);
        _onConnectionShutdownActions.Add(onConnectionShutdown);
    }

    /// <summary>
    /// Remove a previously added action for handling the connection shutting down.
    /// </summary>
    /// <param name="onConnectionShutdown"></param>
    /// <returns>True if the specified action was removed, false otherwise, e.g. if the action was not previously registered.</returns>
    public bool RemoveOnConnectionShutdownAction(Action onConnectionShutdown)
    {
        ArgumentNullException.ThrowIfNull(onConnectionShutdown);
        return _onConnectionShutdownActions.Remove(onConnectionShutdown);
    }

    public async Task<ulong> Send(string exchange, string routingKey, byte[] @event)
    {
        return await _asyncMessagePublisher.Send(exchange, routingKey, @event);
    }

    private void OnConnectionShutdown(object sender, ShutdownEventArgs e)
    {
        foreach (var onConnectionShutdownAction in _onConnectionShutdownActions)
        {
            onConnectionShutdownAction.Invoke();
        }
    }
}