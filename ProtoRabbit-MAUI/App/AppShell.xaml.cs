using Microsoft.Maui.Controls;
using ProtoRabbit.Views;
using ProtoRabbit.Views.Pages;

namespace ProtoRabbit;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();

        Routing.RegisterRoute(nameof(MainPage), typeof(MainPage));
        Routing.RegisterRoute(nameof(NewSubscriptionPage), typeof(NewSubscriptionPage));
    }
}