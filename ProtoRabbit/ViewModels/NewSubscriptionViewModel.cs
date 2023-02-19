using System.Collections.Generic;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Maui.Controls;
using ProtoRabbit.Services;
using ProtoRabbit.Services.Messages;

namespace ProtoRabbit.ViewModels;

public partial class NewSubscriptionViewModel : ObservableObject
{
    private readonly ConnectionManager _connectionManager;

    [ObservableProperty] private List<ReceivableMessageBase> _receivableMessages;
    [ObservableProperty] private ReceivableMessageBase _receivableMessage;

    [ObservableProperty] private string _exchange;
    [ObservableProperty] private string _routingKey;
    [ObservableProperty] private string _queueName;
    [ObservableProperty] private string _subscriptionName;

    public NewSubscriptionViewModel(ConnectionManager connectionManager)
    {
        _connectionManager = connectionManager;
        _receivableMessages = new List<ReceivableMessageBase> {new CreateReceivableMessage(), new DeleteReceivableMessage()};
    }

    [RelayCommand]
    public void ReceivableMessageChanged()
    {
        Exchange = ReceivableMessage?.PreferredExchangeName;
        RoutingKey = ReceivableMessage?.PreferredRoutingKey;
        QueueName = ReceivableMessage?.TargetQueueName;
        SubscriptionName = $"{Exchange}.{RoutingKey}";
    }

    [RelayCommand]
    public async Task Create()
    {
        var newConnection = _connectionManager.CurrentConnection;
        var newSub = new Subscription(newConnection, Exchange, RoutingKey, QueueName, SubscriptionName);
        await Shell.Current.GoToAsync("..",
            true,
            new Dictionary<string, object>
            {
                {"Subscription", newSub},
                {"Type", ReceivableMessage.MessageType}
            });
    }

    [RelayCommand]
    public async Task Cancel()
    {
        await Shell.Current.GoToAsync("..", true);
    }
}