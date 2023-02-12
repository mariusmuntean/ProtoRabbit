using System.Diagnostics;
using System.Threading.Tasks;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProtoRabbit.Services;
using RabbitMQ.Client;
using System.Text.Json;

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
    private string exchange = "proto.data";

    [ObservableProperty]
    private string routingKey = "c";

    [ObservableProperty]
    private string jsonMessage = @"{ ""message"": ""Hello""}";


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
        if (_rabbitClient == null || _rabbitClient.IsClosed)
        {
            return;
        }

        Debug.WriteLine(JsonMessage);
        var msgObj = System.Text.Json.JsonSerializer.Deserialize(JsonMessage, typeof(object));
        var msg = System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(msgObj);
        _rabbitClient.Send(Exchange, RoutingKey, msg);

        var t = Toast.Make($"Sent {JsonMessage}", CommunityToolkit.Maui.Core.ToastDuration.Long);
        t.Show();
    }

    [RelayCommand]
    public void PrettifyMessage()
    {
        try
        {
            JsonMessage = JsonSerializer.Serialize(JsonSerializer.Deserialize(JsonMessage, typeof(object)), typeof(object), new JsonSerializerOptions { WriteIndented = true });
        }
        catch (Exception ex)
        {

            Toast.Make($"Prettify Failed {ex.ToString()}", CommunityToolkit.Maui.Core.ToastDuration.Long).Show();
        }
    }
}