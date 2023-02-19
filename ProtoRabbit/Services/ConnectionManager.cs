using RabbitMQ.Client;

namespace ProtoRabbit.Services;

public class ConnectionManager
{
    private readonly CachingConnectionFactory _cachingConnectionFactory;

    public ConnectionManager(CachingConnectionFactory cachingConnectionFactory)
    {
        _cachingConnectionFactory = cachingConnectionFactory;
    }

    public IConnection Connect(string host, string username, string password, int port)
    {
        if (CurrentConnection is not null && CurrentConnection.IsOpen)
        {
            CurrentConnection.Close(1, "Establishing new connection");
        }

        CurrentConnection = _cachingConnectionFactory.GetConnectionForServer(host, username, password, port);
        return CurrentConnection;
    }

    public IConnection CurrentConnection { get; set; }

    public void CloseCurrentConnection(string reasonTex = null)
    {
        CurrentConnection?.Close(1, reasonTex);
    }
}