using System.Diagnostics;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProtoRabbit.Services;

namespace ProtoRabbit.ViewModels;

public partial class ConnectionViewModel : ObservableObject
{
    private readonly RabbitClient _rabbitClient;

    public ConnectionViewModel(RabbitClient rabbitClient)
    {
        _rabbitClient = rabbitClient;
    }

    [ObservableProperty] private string _host = "localhost";

    [ObservableProperty] private string _username = "guest";

    [ObservableProperty] private string _password = "guest";

    [ObservableProperty] private int _port = 5672;

    [ObservableProperty] private bool _connected = false;

    [RelayCommand]
    public void Connect()
    {
        _rabbitClient.RemoveOnConnectionShutdownAction(ConnectionShutDown);
        _rabbitClient.AddOnConnectionShutdownAction(ConnectionShutDown);
        _rabbitClient.Connect(Host, Username, Password, Port);
        Connected = true;
        Debug.WriteLine("Connected");
    }

    [RelayCommand]
    public void Disconnect()
    {
        _rabbitClient.CloseConnection();
    }

    private void ConnectionShutDown()
    {
        Connected = false;
        Console.WriteLine("Disconnected");
    }
}