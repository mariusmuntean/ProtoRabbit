using Microsoft.Maui.Controls;
using ProtoRabbit.Views;

namespace ProtoRabbit;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();

        Routing.RegisterRoute(nameof(MainPage), typeof(MainPage));
        Routing.RegisterRoute(nameof(SubscriptionEditorPage), typeof(SubscriptionEditorPage));
    }
}