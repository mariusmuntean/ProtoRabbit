using Microsoft.Maui.Controls;

namespace ProtoRabbit;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
        
        Routing.RegisterRoute(nameof(MainPage), typeof(MainPage));
    }
}