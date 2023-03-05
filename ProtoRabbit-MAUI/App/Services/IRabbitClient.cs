namespace ProtoRabbit.Services;

public interface IRabbitClient
{
    void Connect(string host, string username, string password, int port);

    /// <summary>
    /// Closes the connection to the server.
    /// </summary>
    void CloseConnection(string reasonTex = null);

    bool IsClosed { get; }

    /// <summary>
    /// Add an optional action to be called when the connection is shut down.
    /// </summary>
    /// <param name="onConnectionShutdown"></param>
    void AddOnConnectionShutdownAction(Action onConnectionShutdown);

    /// <summary>
    /// Remove a previously added action for handling the connection shutting down.
    /// </summary>
    /// <param name="onConnectionShutdown"></param>
    /// <returns>True if the specified action was removed, false otherwise, e.g. if the action was not previously registered.</returns>
    bool RemoveOnConnectionShutdownAction(Action onConnectionShutdown);

    Task<ulong> Send(string exchange, string routingKey, byte[] @event);
}