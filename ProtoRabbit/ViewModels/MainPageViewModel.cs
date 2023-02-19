using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.Controls;
using ProtoBuf;
using ProtoRabbit.Services;
using ProtoRabbit.Services.Messages;
using ProtoRabbit.Views;

namespace ProtoRabbit.ViewModels;

public partial class MainPageViewModel : ObservableObject, IQueryAttributable
{
    [ObservableProperty] private string _host = "localhost";

    [ObservableProperty] private string _username = "guest";

    [ObservableProperty] private string _password = "guest";

    [ObservableProperty] private int _port = 5672;

    [ObservableProperty] private bool _connected = false;

    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(SendCommand))]
    private string _exchange = null;

    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(SendCommand))]
    private string _routingKey = null;

    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(SendCommand))]
    private string _jsonMessage = null;

    [ObservableProperty] private string _protoFile = null;

    [ObservableProperty] private List<SendableMessageBase> _sendableMessages;
    [ObservableProperty] private SendableMessageBase _sendableMessage;
    [ObservableProperty] private int _sendableMessageIndex;

    private readonly Dictionary<Subscription, ObservableCollection<string>> _subscriptionToMessageMap;
    [ObservableProperty] private ObservableCollection<Subscription> _subscriptions;
    [ObservableProperty] private Subscription _currentSubscription;
    [ObservableProperty] private ObservableCollection<string> _currentSubscriptionMessages;

    private readonly RabbitClient _rabbitClient;

    public MainPageViewModel(RabbitClient rabbitClient)
    {
        _rabbitClient = rabbitClient;

        _sendableMessages = new List<SendableMessageBase> {new CreateSendableMessage(), new DeleteSendableMessage()}; // ToDo use reflection to load all subclasses

        _subscriptionToMessageMap = new Dictionary<Subscription, ObservableCollection<string>>();
        _subscriptions = new ObservableCollection<Subscription>();
    }

    [RelayCommand]
    public void Connect()
    {
        _rabbitClient.OnShutdown = ConnectionShutDown;
        _rabbitClient.Connect(Host, Username, Password, Port);
        Connected = true;
        Debug.WriteLine("Connected");
    }

    [RelayCommand]
    public void Disconnect()
    {
        _rabbitClient.CloseConnection();
    }

    [RelayCommand(CanExecute = nameof(CanSend))]
    public async Task Send()
    {
        if (_rabbitClient == null || _rabbitClient.IsClosed || SendableMessage is null)
        {
            return;
        }

        try
        {
            Debug.WriteLine($"Sending :{JsonMessage}");
            var msgObj = JsonSerializer.Deserialize(JsonMessage, _sendableMessage.MessageType);

            var destStream = new MemoryStream();
            Serializer.Serialize(destStream, msgObj);
            await _rabbitClient.Send(Exchange, RoutingKey, destStream.ToArray());
        }
        catch (Exception e)
        {
            await Toast.Make($"Failed to send {JsonMessage}. {e}", ToastDuration.Long).Show();
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
            Toast.Make($"Prettify Failed {ex}", ToastDuration.Long).Show();
        }
    }

    [RelayCommand]
    public void SendableMessageIndexChanged()
    {
        if (SendableMessageIndex == -1)
        {
            return;
        }

        SendableMessage = SendableMessages[SendableMessageIndex];

        Exchange = SendableMessage.PreferredExchangeName;
        RoutingKey = SendableMessage.PreferredRoutingKey;
        JsonMessage = SendableMessage.SampleJsonMessage;
        ProtoFile = SendableMessage.ProtoSchema;
    }

    [RelayCommand]
    public async Task OpenSubscriptionEditor()
    {
        await Shell.Current.GoToAsync($"{nameof(NewSubscriptionPage)}?{nameof(Host)}={Host}&{nameof(Username)}={Username}&{nameof(Password)}={Password}&{nameof(Port)}={Port}");
    }


    [RelayCommand]
    public void SelectedSubscriptionChanged()
    {
        CurrentSubscriptionMessages = _subscriptionToMessageMap[CurrentSubscription];
    }

    [RelayCommand]
    public void StopSubscription(Subscription subscriptionToRemove)
    {
        if (subscriptionToRemove is null)
        {
            Toast.Make("No subscription selected.", ToastDuration.Long).Show();
            return;
        }

        Debug.WriteLine($"Stopping subscription {subscriptionToRemove.Id} for messages in exchange {subscriptionToRemove.Exchange} with routing key {subscriptionToRemove.RoutingKey}");
        subscriptionToRemove.StopConsuming();
        Subscriptions.Remove(subscriptionToRemove);

        if (_subscriptionToMessageMap.ContainsKey(subscriptionToRemove))
        {
            _subscriptionToMessageMap[subscriptionToRemove].Clear();
        }
    }

    public void ApplyQueryAttributes(IDictionary<string, object> query)
    {
        if (query != null && query.ContainsKey("Subscription")
                          && query["Subscription"] is Subscription subscription
                          && query["Type"] is Type type
           )
        {
            Subscriptions.Add(subscription);
            _subscriptionToMessageMap[subscription] = new ObservableCollection<string>();
            subscription.StartConsuming(type, wrapper =>
            {
                string message = $"{wrapper.DateTime} {JsonSerializer.Serialize(wrapper.Message)}";
                _subscriptionToMessageMap[subscription].Add(message);
            });

            // clearing the dict otherwise even simple back navigation will return a full dict
            query.Clear();
        }
    }

    private void ConnectionShutDown()
    {
        Connected = false;
        Debug.WriteLine("Disconnected.");
    }
}