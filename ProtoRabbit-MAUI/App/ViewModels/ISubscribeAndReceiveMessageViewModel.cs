using System.ComponentModel;
using ProtoRabbit.Services;
using PropertyChangingEventHandler = System.ComponentModel.PropertyChangingEventHandler;

namespace ProtoRabbit.ViewModels;

public interface ISubscribeAndReceiveMessageViewModel
{
    /// <inheritdoc cref="SubscribeAndReceiveMessageViewModel._subscriptions"/>
    global::System.Collections.ObjectModel.ObservableCollection<global::ProtoRabbit.Services.Subscription> Subscriptions { get; set; }

    /// <inheritdoc cref="SubscribeAndReceiveMessageViewModel._currentSubscription"/>
    global::ProtoRabbit.Services.Subscription CurrentSubscription { get; set; }

    /// <summary>Gets an <see cref="global::CommunityToolkit.Mvvm.Input.IRelayCommand"/> instance wrapping <see cref="SubscribeAndReceiveMessageViewModel.SelectedSubscriptionChanged"/>.</summary>
    global::CommunityToolkit.Mvvm.Input.IRelayCommand SelectedSubscriptionChangedCommand { get; }

    /// <summary>Gets an <see cref="global::CommunityToolkit.Mvvm.Input.IRelayCommand{T}"/> instance wrapping <see cref="SubscribeAndReceiveMessageViewModel.StopSubscription"/>.</summary>
    global::CommunityToolkit.Mvvm.Input.IRelayCommand<global::ProtoRabbit.Services.Subscription> StopSubscriptionCommand { get; }

    void SelectedSubscriptionChanged();
    void StopSubscription(Subscription subscriptionToRemove);
    void StartNewSubscription(Subscription subscription, Type messageType);
    event PropertyChangedEventHandler PropertyChanged;
    event PropertyChangingEventHandler PropertyChanging;
}