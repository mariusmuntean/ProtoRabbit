using System.Collections.ObjectModel;
using System.Diagnostics;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProtoRabbit.Services;
using ProtoRabbit.Views.Pages;

namespace ProtoRabbit.ViewModels;

public partial class MainPageViewModel : ObservableObject, IQueryAttributable
{
    [ObservableProperty] private ConnectionViewModel _connectionVM;
    [ObservableProperty] private SendMessageViewModel _sendMessageVM;

    [ObservableProperty] private ObservableCollection<Subscription> _subscriptions;
    [ObservableProperty] private Subscription _currentSubscription;

    private readonly RabbitClient _rabbitClient;

    public MainPageViewModel(ConnectionViewModel connectionViewModel, SendMessageViewModel sendMessageViewModel, RabbitClient rabbitClient)
    {
        ConnectionVM = connectionViewModel;
        ConnectionVM.PropertyChanged += (s, e) => { Console.WriteLine(e.PropertyName); };

        SendMessageVM = sendMessageViewModel;

        _rabbitClient = rabbitClient;
        _rabbitClient.AddOnConnectionShutdownAction(ConnectionShutDown);

        _subscriptions = new ObservableCollection<Subscription>();
    }

    [RelayCommand]
    public async Task OpenSubscriptionEditor()
    {
        await Shell.Current.GoToAsync(
            $"{nameof(NewSubscriptionPage)}?{nameof(ConnectionVM.Host)}={ConnectionVM.Host}&{nameof(ConnectionVM.Username)}={ConnectionVM.Username}&{nameof(ConnectionVM.Password)}={ConnectionVM.Password}&{nameof(ConnectionVM.Port)}={ConnectionVM.Port}");
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