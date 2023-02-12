using System.Diagnostics;
using System.Text.Json;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProtoRabbit.Messages;
using ProtoRabbit.Services;

namespace ProtoRabbit.ViewModels;

public partial class MainPageViewModel : ObservableObject
{
    [ObservableProperty] private string host = "localhost";

    [ObservableProperty] private string username = "guest";

    [ObservableProperty] private string password = "guest";

    [ObservableProperty] private int port = 5672;

    [ObservableProperty] private bool connected = false;

    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(SendCommand))] private string exchange = null;

    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(SendCommand))] private string routingKey = null;

    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(SendCommand))] private string jsonMessage = null;
    [ObservableProperty ] private string protoFile = null;

    [ObservableProperty] private List<SendableMessageBase> sendableMessages;
    [ObservableProperty] private SendableMessageBase sendableMessage;


    private readonly RabbitClientFactory _rabbitClientFactory;
    private RabbitClient _rabbitClient;

    public MainPageViewModel(RabbitClientFactory rabbitClientFactory)
    {
        _rabbitClientFactory = rabbitClientFactory;

        sendableMessages = new List<SendableMessageBase> { new CreateSendableMessage(), new DeleteSendableMessage() }; // ToDo use reflection to load all subclasses
        sendableMessage = sendableMessages.Last();
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

    [RelayCommand(CanExecute = nameof(CanSend))]
    public void Send()
    {
        if (_rabbitClient == null || _rabbitClient.IsClosed)
        {
            return;
        }

        Debug.WriteLine(JsonMessage);
        var msgObj = JsonSerializer.Deserialize(JsonMessage, typeof(object));
        var msg = JsonSerializer.SerializeToUtf8Bytes(msgObj);
        _rabbitClient.Send(Exchange, RoutingKey, msg);

        var t = Toast.Make($"Sent {JsonMessage}", ToastDuration.Long);
        t.Show();
    }

    public bool CanSend() => !string.IsNullOrWhiteSpace(Exchange) && !string.IsNullOrWhiteSpace(RoutingKey) && !string.IsNullOrWhiteSpace(JsonMessage);

    [RelayCommand]
    public void PrettifyMessage()
    {
        try
        {
            JsonMessage = JsonSerializer.Serialize(JsonSerializer.Deserialize(JsonMessage, typeof(object)), typeof(object), new JsonSerializerOptions { WriteIndented = true });
        }
        catch (Exception ex)
        {
            Toast.Make($"Prettify Failed {ex.ToString()}", ToastDuration.Long).Show();
        }
    }

    [RelayCommand]
    public void SendableMessageIndexChanged()
    {
        var sendableMessage = SendableMessage;
        Exchange = sendableMessage.PreferredExchangeName;
        RoutingKey = sendableMessage.PreferredRoutingKey;
        JsonMessage = sendableMessage.SampleJsonMessage;
        ProtoFile = sendableMessage.ProtoSchema;
    }
}