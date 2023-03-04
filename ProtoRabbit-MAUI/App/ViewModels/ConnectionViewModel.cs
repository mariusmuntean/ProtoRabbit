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
        _rabbitClient.AddOnConnectionShutdownAction(ConnectionShutDown);
    }

    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(ConnectCommand))] private string _host = "localhost";

    [ObservableProperty] private int _port = 5672;

    [ObservableProperty] private string _username = "guest";

    [ObservableProperty] private string _password = "guest";

    [ObservableProperty] private bool _connected = false;
    [ObservableProperty] private bool _isChangingConnectionStatus = false;

    [RelayCommand(CanExecute = nameof(CanConnect))]
    public void Connect()
    {
        try
        {
            IsChangingConnectionStatus = true;
            _rabbitClient.Connect(Host, Username, Password, Port);
            Connected = true;
            Debug.WriteLine("Connected");
        }
        finally
        {
            IsChangingConnectionStatus = false;
        }
    }

    public bool CanConnect() => !string.IsNullOrWhiteSpace(Host) && !IsChangingConnectionStatus;

    [RelayCommand]
    public void Disconnect()
    {
        try
        {
            IsChangingConnectionStatus = true;
            _rabbitClient.CloseConnection();
        }
        finally
        {
            IsChangingConnectionStatus = false;
        }
    }

    private void ConnectionShutDown()
    {
        Connected = false;
        Console.WriteLine("Disconnected");
    }
}