using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProtoRabbit.Services;
using ProtoRabbit.Services.Messages;

namespace ProtoRabbit.ViewModels;

[QueryProperty(nameof(Host), nameof(Host))]
[QueryProperty(nameof(Username), nameof(Username))]
[QueryProperty(nameof(Password), nameof(Password))]
[QueryProperty(nameof(Port), nameof(Port))]
public partial class SubscriptionEditorViewModel : ObservableObject
{
    public const string ReceivableMessageQueryId = nameof(ReceivableMessageQueryId);
    private readonly CachingConnectionFactory _cachingConnectionFactory;

    [ObservableProperty] private List<ReceivableMessageBase> receivableMessages;
    [ObservableProperty] private ReceivableMessageBase receivableMessage;

    [ObservableProperty] private string host;
    [ObservableProperty] private string username;
    [ObservableProperty] private string password;
    [ObservableProperty] private int port;

    [ObservableProperty] private string exchange;
    [ObservableProperty] private string routingKey;
    [ObservableProperty] private string queueName;
    [ObservableProperty] private string subscriptionName;

    public SubscriptionEditorViewModel(CachingConnectionFactory cachingConnectionFactory)
    {
        _cachingConnectionFactory = cachingConnectionFactory;
        receivableMessages = new List<ReceivableMessageBase> {new CreateReceivableMessage(), new DeleteReceivableMessage()};
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
        var newConnection = _cachingConnectionFactory.GetConnectionForServer(Host, Username, Password, Port);
        var newSub = new Subscription(
            newConnection,
            Exchange, RoutingKey, QueueName, SubscriptionName
        );
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