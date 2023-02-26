using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProtoRabbit.Services;
using ProtoRabbit.Views.Pages;

namespace ProtoRabbit.ViewModels;

public partial class MainPageViewModel : ObservableObject, IQueryAttributable
{
    [ObservableProperty] private ConnectionViewModel _connectionVM;
    [ObservableProperty] private SendMessageViewModel _sendMessageVM;
    [ObservableProperty] private SubscribeAndReceiveMessageViewModel _subscribeAndReceiveMessageViewModel;

    public MainPageViewModel(ConnectionViewModel connectionViewModel, SendMessageViewModel sendMessageViewModel, SubscribeAndReceiveMessageViewModel subscribeAndReceiveMessageViewModel)
    {
        ConnectionVM = connectionViewModel;
        ConnectionVM.PropertyChanged += (s, e) => { Console.WriteLine(e.PropertyName); };
        SendMessageVM = sendMessageViewModel;
        SubscribeAndReceiveMessageViewModel = subscribeAndReceiveMessageViewModel;
    }

    [RelayCommand]
    public async Task OpenSubscriptionEditor()
    {
        await Shell.Current.GoToAsync(
            $"{nameof(NewSubscriptionPage)}?{nameof(ConnectionVM.Host)}={ConnectionVM.Host}&{nameof(ConnectionVM.Username)}={ConnectionVM.Username}&{nameof(ConnectionVM.Password)}={ConnectionVM.Password}&{nameof(ConnectionVM.Port)}={ConnectionVM.Port}");
    }

    public void ApplyQueryAttributes(IDictionary<string, object> query)
    {
        if (query != null && query.ContainsKey("Subscription")
                          && query["Subscription"] is Subscription subscription
                          && query["Type"] is Type type
           )
        {
            SubscribeAndReceiveMessageViewModel.StartNewSubscription(subscription, type);

            // clearing the dict otherwise even simple back navigation will return a full dict
            query.Clear();
        }
    }
}