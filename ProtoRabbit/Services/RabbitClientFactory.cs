using System;
using RabbitMQ.Client;

namespace ProtoRabbit.Services;

public class RabbitClientFactory
{
    Dictionary<(string host, string username, string password, int port), IConnection> _serverToConnectionMap = new Dictionary<(string host, string username, string password, int port), IConnection>();

    public RabbitClient GetClientForServer(string host, string username, string password, int port)
    {
        (string host, string username, string password, int port) server = (host, username, password, port);
        if (!_serverToConnectionMap.ContainsKey(server))
        {
            var connectionFactory = new ConnectionFactory();
            connectionFactory.HostName = host;
            connectionFactory.UserName = username;
            connectionFactory.Password = password;
            connectionFactory.Port = port;

            var newConnection = connectionFactory.CreateConnection("ProtoRabbit");
            _serverToConnectionMap[server] = newConnection;
        }

        var connection = _serverToConnectionMap[server];
        var channel = connection.CreateModel();
        return new RabbitClient(channel);
    }
}


public class RabbitClient
{
    private readonly IModel _channel;
    private Action _onShutdown;

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
        set => _onShutdown = value;
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
        _onShutdown?.Invoke();
        _onShutdown = null;
    }
}