using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Text.Json;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProtoBuf;
using ProtoRabbit.Pages;
using ProtoRabbit.Services;
using ProtoRabbit.Services.Messages;

namespace ProtoRabbit.ViewModels;

public partial class MainPageViewModel : ObservableObject, IQueryAttributable
{
    [ObservableProperty] private string host = "localhost";

    [ObservableProperty] private string username = "guest";

    [ObservableProperty] private string password = "guest";

    [ObservableProperty] private int port = 5672;

    [ObservableProperty] private bool connected = false;

    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(SendCommand))]
    private string exchange = null;

    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(SendCommand))]
    private string routingKey = null;

    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(SendCommand))]
    private string jsonMessage = null;

    [ObservableProperty] private string protoFile = null;

    [ObservableProperty] private List<SendableMessageBase> sendableMessages;
    [ObservableProperty] private SendableMessageBase sendableMessage;

    [ObservableProperty] private ObservableCollection<Subscription> _subscriptions = new ObservableCollection<Subscription>();

    private readonly CachingConnectionFactory _cachingConnectionFactory;
    private readonly RabbitClientFactory _rabbitClientFactory;
    private RabbitClient _rabbitClient;

    public MainPageViewModel(RabbitClientFactory rabbitClientFactory, CachingConnectionFactory cachingConnectionFactory)
    {
        _rabbitClientFactory = rabbitClientFactory;
        _cachingConnectionFactory = cachingConnectionFactory;

        sendableMessages = new List<SendableMessageBase> {new CreateSendableMessage(), new DeleteSendableMessage()}; // ToDo use reflection to load all subclasses


        var dummySub = new Subscription(
            _cachingConnectionFactory.GetConnectionForServer(host, username, password, port),
            "proto.data",
            "create",
            "proto.data.create",
            "Create Messages"
        );
        dummySub.StartConsuming(typeof(Create), wrapper => { Debug.WriteLine((wrapper.Message as Create)?.Prop1); });
        _subscriptions.Add(dummySub);
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
        if (_rabbitClient == null || _rabbitClient.IsClosed || sendableMessage is null)
        {
            return;
        }

        try
        {
            Debug.WriteLine($"Sending :{JsonMessage}");
            var msgObj = JsonSerializer.Deserialize(JsonMessage, sendableMessage.MessageType);

            var destStream = new MemoryStream();
            Serializer.Serialize(destStream, msgObj);
            _rabbitClient.Send(Exchange, RoutingKey, destStream.ToArray());
        }
        catch (Exception e)
        {
            Toast.Make($"Failed to send {JsonMessage}. {e}", ToastDuration.Long).Show();
        }
    }

    public bool CanSend() => !string.IsNullOrWhiteSpace(Exchange) && !string.IsNullOrWhiteSpace(RoutingKey) && !string.IsNullOrWhiteSpace(JsonMessage);

    [RelayCommand]
    public void PrettifyMessage()
    {
        try
        {
            JsonMessage = JsonSerializer.Serialize(JsonSerializer.Deserialize(JsonMessage, typeof(object)), typeof(object), new JsonSerializerOptions {WriteIndented = true});
        }
        catch (Exception ex)
        {
            Toast.Make($"Prettify Failed {ex.ToString()}", ToastDuration.Long).Show();
        }
    }

    [RelayCommand]
    public void SendableMessageIndexChanged()
    {
        Exchange = SendableMessage.PreferredExchangeName;
        RoutingKey = SendableMessage.PreferredRoutingKey;
        JsonMessage = SendableMessage.SampleJsonMessage;
        ProtoFile = SendableMessage.ProtoSchema;
    }

    [RelayCommand]
    public async Task OpenSubscriptionEditor()
    {
        await Shell.Current.GoToAsync($"{nameof(SubscriptionEditorPage)}?{nameof(Host)}={Host}&{nameof(Username)}={Username}&{nameof(Password)}={Password}&{nameof(Port)}={Port}");
    }

    public void ApplyQueryAttributes(IDictionary<string, object> query)
    {
        if (query != null && query.ContainsKey("Subscription")
                          && query["Subscription"] is Subscription subscription
                          && query["Type"] is Type type
           )
        {
            Subscriptions.Add(subscription);
            subscription.StartConsuming(type, wrapper => Debug.WriteLine(JsonSerializer.Serialize(wrapper.Message)));
        }
    }
}