using System.Collections.ObjectModel;
using System.Windows.Input;
using Microsoft.Maui.Controls;
using ProtoRabbit.Services;

namespace ProtoRabbit.Views.Components;

public partial class SubscribeAndReceiveMessageControl : ContentView
{
    public SubscribeAndReceiveMessageControl()
    {
        InitializeComponent();
    }

    public static readonly BindableProperty SubscriptionsProperty = BindableProperty.Create(
        nameof(Subscriptions),
        typeof(ObservableCollection<Services.Subscription>),
        typeof(SubscribeAndReceiveMessageControl)
        );

    public ObservableCollection<Subscription> Subscriptions
    {
        get => (ObservableCollection<Subscription>)GetValue(SubscriptionsProperty);
        set => SetValue(SubscriptionsProperty, value);
    }


    public static readonly BindableProperty CurrentSubscriptionProperty = BindableProperty.Create(
    nameof(CurrentSubscription),
    typeof(Services.Subscription),
    typeof(SubscribeAndReceiveMessageControl)
    );

    public Services.Subscription CurrentSubscription
    {
        get => (Services.Subscription)GetValue(CurrentSubscriptionProperty);
        set => SetValue(CurrentSubscriptionProperty, value);
    }

    void SubscriptionChanged(System.Object sender, Microsoft.Maui.Controls.SelectionChangedEventArgs e)
    {
        CurrentSubscription = (Services.Subscription)e.CurrentSelection.FirstOrDefault();
        SelectedSubscriptionChangedCommand?.Execute(null);
    }


    public static readonly BindableProperty OpenSubscriptionEditorCommandProperty = BindableProperty.Create(
        nameof(OpenSubscriptionEditorCommand),
        typeof(ICommand),
        typeof(SubscribeAndReceiveMessageControl)
        );

    public ICommand OpenSubscriptionEditorCommand
    {
        get => (ICommand)GetValue(OpenSubscriptionEditorCommandProperty);
        set => SetValue(OpenSubscriptionEditorCommandProperty, value);
    }

    void OpenSubscriptionEditorClicked(System.Object sender, System.EventArgs e)
    {
        OpenSubscriptionEditorCommand?.Execute(null);
    }


    public static readonly BindableProperty SelectedSubscriptionChangedCommandProperty = BindableProperty.Create(
        nameof(SelectedSubscriptionChangedCommand),
        typeof(ICommand),
        typeof(SubscribeAndReceiveMessageControl)
        );

    public ICommand SelectedSubscriptionChangedCommand
    {
        get => (ICommand)GetValue(SelectedSubscriptionChangedCommandProperty);
        set => SetValue(SelectedSubscriptionChangedCommandProperty, value);
    }


    public static readonly BindableProperty StopSubscriptionCommandProperty = BindableProperty.Create(
    nameof(StopSubscriptionCommand),
    typeof(ICommand),
    typeof(SubscribeAndReceiveMessageControl)
    );

    public ICommand StopSubscriptionCommand
    {
        get => (ICommand)GetValue(StopSubscriptionCommandProperty);
        set => SetValue(StopSubscriptionCommandProperty, value);
    }

    void RemoveSubscriptionClicked(System.Object sender, System.EventArgs e)
    {
        if (sender is MenuFlyoutItem menuFlyoutItem && menuFlyoutItem.CommandParameter is Services.Subscription sub)
        {
            StopSubscriptionCommand?.Execute(sub);
        }
    }
}
