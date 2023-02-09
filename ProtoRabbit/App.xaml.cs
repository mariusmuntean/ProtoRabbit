using Microsoft.Maui.Controls;

namespace ProtoRabbit;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();

        MainPage = new AppShell();
    }
}