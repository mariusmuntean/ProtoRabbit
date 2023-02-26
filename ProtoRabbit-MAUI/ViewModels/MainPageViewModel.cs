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
using ProtoRabbit.Views.Pages;

namespace ProtoRabbit.ViewModels;

public partial class MainPageViewModel : ObservableObject, IQueryAttributable
{
    [ObservableProperty] private ConnectionViewModel _connectionVM;

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

    [ObservableProperty] private ObservableCollection<Subscription> _subscriptions;
    [ObservableProperty] private Subscription _currentSubscription;

    private readonly RabbitClient _rabbitClient;

    public MainPageViewModel(ConnectionViewModel connectionViewModel, RabbitClient rabbitClient)
    {
        ConnectionVM = connectionViewModel;
        ConnectionVM.PropertyChanged += (s, e) =>
        {
            Console.WriteLine(e.PropertyName);
        };

        _rabbitClient = rabbitClient;
        _rabbitClient.AddOnConnectionShutdownAction(ConnectionShutDown);

        _sendableMessages = new List<SendableMessageBase> {new CreateSendableMessage(), new DeleteSendableMessage()}; // ToDo use reflection to load all subclasses
        _sendableMessageIndex = -1;

        _subscriptions = new ObservableCollection<Subscription>();
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
            var msgObj = JsonSerializer.Deserialize(JsonMessage, SendableMessage.MessageType);

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
        await Shell.Current.GoToAsync($"{nameof(NewSubscriptionPage)}?{nameof(ConnectionVM.Host)}={ConnectionVM.Host}&{nameof(ConnectionVM.Username)}={ConnectionVM.Username}&{nameof(ConnectionVM.Password)}={ConnectionVM.Password}&{nameof(ConnectionVM.Port)}={ConnectionVM.Port}");
    }


    [RelayCommand]
    public void SelectedSubscriptionChanged()
    {
        // CurrentSubscriptionMessages = _subscriptionToMessageMap[CurrentSubscription];
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

        if (subscriptionToRemove == CurrentSubscription)
        {
            CurrentSubscription = null;
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
            subscription.StartConsuming(type, wrapper => { });
            CurrentSubscription = subscription;

            // clearing the dict otherwise even simple back navigation will return a full dict
            query.Clear();
        }
    }

    private void ConnectionShutDown()
    {
        foreach (var sub in Subscriptions)
        {
            sub.StopConsuming();
        }

        Subscriptions.Clear();
        CurrentSubscription = null;
    }
}