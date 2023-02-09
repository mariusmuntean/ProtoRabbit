using System;
using RabbitMQ.Client;

namespace ProtoRabbit.Services;

public class RabbitClientFactory
{
    Dictionary<(string host, string username, string password, int port), RabbitClient> _serverToClientMap = new Dictionary<(string host, string username, string password, int port), RabbitClient>();

    public RabbitClient GetClientForServer(string host, string username, string password, int port)
    {
        (string host, string username, string password, int port) server = (host, username, password, port);
        if (!_serverToClientMap.ContainsKey(server))
        {
            var connectionFactory = new ConnectionFactory();
            connectionFactory.HostName = host;
            connectionFactory.UserName = username;
            connectionFactory.Password = password;
            connectionFactory.Port = port;

            var connection = connectionFactory.CreateConnection("ProtoRabbit");
            var channel = connection.CreateModel();
            _serverToClientMap[server] = new RabbitClient(channel);
        }

        return _serverToClientMap[server];
    }
}


public class RabbitClient
{
    private readonly IModel _channel;
    private WeakReference<Action> _onShutdown;

    public RabbitClient(IModel channel)
    {
        _channel = channel;
        _channel.ModelShutdown += OnModelShutdown;
    }

    /// <summary>
    /// Optional action to be called when the connection is shut down. Receives the cause.
    /// </summary>
    public Action OnShutdown
    {
        set => _onShutdown = new WeakReference<Action>(value);
    }

    public void Send(string exchange, string routingKey, byte[] @event)
    {
        _channel.BasicPublish(exchange, routingKey, body: @event);
    }

    /// <summary>
    /// Closes the internal channel to the server. Don't use a closed client.
    /// </summary>
    public void Close()
    {
        _channel.Close();
    }

    public bool IsClosed => _channel == null || _channel.IsClosed;

    private void OnModelShutdown(object sender, ShutdownEventArgs e)
    {
        if (_onShutdown.TryGetTarget(out var action))
        {
            action();
        }
    }
}