using RabbitMQ.Client;

namespace ProtoRabbit.Services;

public class CachingConnectionFactory
{
    readonly Dictionary<(string host, string username, string password, int port), IConnection> _serverToConnectionMap = new Dictionary<(string host, string username, string password, int port), IConnection>();
    private readonly ConnectionFactory _connectionFactory;

    public CachingConnectionFactory(ConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public IConnection GetConnectionForServer(string host, string username, string password, int port)
    {
        var server = (host, username, password, port);
        if (!_serverToConnectionMap.ContainsKey(server))
        {
            _connectionFactory.HostName = host;
            _connectionFactory.UserName = username;
            _connectionFactory.Password = password;
            _connectionFactory.Port = port;

            var newConnection = _connectionFactory.CreateConnection("ProtoRabbit");
            _serverToConnectionMap[server] = newConnection;
        }

        var connection = _serverToConnectionMap[server];
        return connection;
    }
}