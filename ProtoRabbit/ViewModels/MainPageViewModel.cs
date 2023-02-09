using System.Diagnostics;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProtoRabbit.Services;
using RabbitMQ.Client;

namespace ProtoRabbit.ViewModels;

public partial class MainPageViewModel : ObservableObject
{

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

    [ObservableProperty]
    private string jsonMessage = "{ \"message\": \"Hello\"}";

    private readonly RabbitClientFactory _rabbitClientFactory;
    private RabbitClient _rabbitClient;

    public MainPageViewModel(RabbitClientFactory rabbitClientFactory)
    {
        _rabbitClientFactory = rabbitClientFactory;
    }

    [RelayCommand]
    public async Task Connect()
    {
        _rabbitClient = _rabbitClientFactory.GetClientForServer(host, username, password, port);
        _rabbitClient.OnShutdown = ConnectionShutDown;
        Connected = true;
        Debug.WriteLine("Connected");
    }

    private void ConnectionShutDown()
    {
        Connected = false;
        Debug.WriteLine($"Disconnected.");
    }

    [RelayCommand]
    public void Disconnect()
    {
        _rabbitClient.Close();
    }

    [RelayCommand]
    public void Send()
    {
        if(_rabbitClient == null || _rabbitClient.IsClosed)
        {
            return;
        }

        var msgObj = System.Text.Json.JsonSerializer.Deserialize(JsonMessage, typeof(object));
        var msg = System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(msgObj);
        _rabbitClient.Send("proto.data", "c", msg);
    }
}