using System.Diagnostics;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RabbitMQ.Client;

namespace ProtoRabbit.ViewModels;

public partial class MainPageViewModel : ObservableObject
{
    IConnection connection = null;

    [ObservableProperty]
    private string host = "localhost";

    [ObservableProperty]
    private string username = "guest";

    [ObservableProperty]
    private string password = "guest";

    [ObservableProperty]
    private int port = 5672;

    [ObservableProperty]
    private bool connected = false;

    [RelayCommand]
    public async Task Connect()
    {
        var connectionFactory = new ConnectionFactory();
        connectionFactory.HostName = Host;
        connectionFactory.Port = Port;
        connectionFactory.UserName = Username;
        connectionFactory.Password = Password;

        connection?.Abort();
        connection = connectionFactory.CreateConnection();
        connection.ConnectionShutdown += ConnectionShutDown;
        Connected = true;
        Debug.WriteLine("Connected");
    }

    private void ConnectionShutDown(object sender, ShutdownEventArgs e)
    {
        Connected = false;
        connection.ConnectionShutdown -= ConnectionShutDown;
        connection = null;
        Debug.WriteLine("Disconnected");
    }

    [RelayCommand]
    public async Task Disconnect()
    {
        connection?.Abort();
    }

    [RelayCommand]
    public async Task Send()
    {
        var connectionFactory = new ConnectionFactory();
        connectionFactory.HostName = Host;
        connectionFactory.Port = Port;
        connectionFactory.UserName = Username;
        connectionFactory.Password = Password;

        var connection = connectionFactory.CreateConnection();
        var channel = connection.CreateModel();

        var msg = System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(new { Message = "Hi" });

        channel.BasicPublish("proto.data", "c", null, msg);
    }
}