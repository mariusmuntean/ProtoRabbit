using System.Collections.ObjectModel;
using System.Diagnostics;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProtoRabbit.Services;

namespace ProtoRabbit.ViewModels;

public partial class SubscribeAndReceiveMessageViewModel : ObservableObject
{
    private readonly RabbitClient _rabbitClient;

    public SubscribeAndReceiveMessageViewModel(RabbitClient rabbitClient)
    {
        _rabbitClient = rabbitClient;
        _rabbitClient.AddOnConnectionShutdownAction(ConnectionShutDown);

        _subscriptions = new ObservableCollection<Subscription>();
    }

    [ObservableProperty] private ObservableCollection<Subscription> _subscriptions;
    [ObservableProperty] private Subscription _currentSubscription;

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

    public void StartNewSubscription(Subscription subscription, Type messageType)
    {
        Subscriptions.Add(subscription);
        subscription.StartConsuming(messageType, wrapper => { });
        CurrentSubscription = subscription;
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