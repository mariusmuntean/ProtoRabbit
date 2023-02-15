using System.Collections.ObjectModel;
using System.Windows.Input;

namespace ProtoRabbit.Components;

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



    public static readonly BindableProperty CurrentSubscriptionMessagesProperty = BindableProperty.Create(
    nameof(CurrentSubscriptionMessages),
    typeof(ObservableCollection<string>),
    typeof(SubscriptionsManager)
    );

    public ObservableCollection<string> CurrentSubscriptionMessages
    {
        get => (ObservableCollection<string>)GetValue(CurrentSubscriptionMessagesProperty);
        set => SetValue(CurrentSubscriptionMessagesProperty, value);
    }

}
