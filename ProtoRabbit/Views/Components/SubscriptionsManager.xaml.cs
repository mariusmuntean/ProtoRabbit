using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using Microsoft.Maui.Controls;

namespace ProtoRabbit.Views.Components;

public partial class SubscriptionsManager : ContentView
{
    public SubscriptionsManager()
    {
        InitializeComponent();
    }

    public static readonly BindableProperty SubscriptionsProperty = BindableProperty.Create(
        nameof(Subscriptions),
        typeof(ObservableCollection<Services.Subscription>),
        typeof(SubscriptionsManager)
        );

    public ObservableCollection<SubscriptionsManager> Subscriptions
    {
        get => (ObservableCollection<SubscriptionsManager>)GetValue(SubscriptionsProperty);
        set => SetValue(SubscriptionsProperty, value);
    }


    public static readonly BindableProperty CurrentSubscriptionProperty = BindableProperty.Create(
    nameof(CurrentSubscription),
    typeof(Services.Subscription),
    typeof(SubscriptionsManager)
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
        typeof(SubscriptionsManager)
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
        typeof(SubscriptionsManager)
        );

    public ICommand SelectedSubscriptionChangedCommand
    {
        get => (ICommand)GetValue(SelectedSubscriptionChangedCommandProperty);
        set => SetValue(SelectedSubscriptionChangedCommandProperty, value);
    }


    public static readonly BindableProperty StopSubscriptionCommandProperty = BindableProperty.Create(
    nameof(StopSubscriptionCommand),
    typeof(ICommand),
    typeof(SubscriptionsManager)
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
