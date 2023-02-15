﻿using RabbitMQ.Client;

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