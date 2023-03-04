using System.Windows.Input;

namespace ProtoRabbit.Views.Components;

public partial class ConnectionControl : ContentView
{
    public ConnectionControl()
    {
        InitializeComponent();
    }

    public static readonly BindableProperty HostProperty = BindableProperty.Create(
        nameof(Host),
        typeof(string),
        typeof(ConnectionControl)
        );

    public string Host
    {
        get => (string)GetValue(HostProperty);
        set => SetValue(HostProperty, value);
    }

    public static readonly BindableProperty PortProperty = BindableProperty.Create(
    nameof(Port),
    typeof(string),
    typeof(ConnectionControl)
    );

    public string Port
    {
        get => (string)GetValue(PortProperty);
        set => SetValue(PortProperty, value);
    }

    public static readonly BindableProperty UsernameProperty = BindableProperty.Create(
    nameof(Username),
    typeof(string),
    typeof(ConnectionControl)
    );

    public string Username
    {
        get => (string)GetValue(UsernameProperty);
        set => SetValue(UsernameProperty, value);
    }

    public static readonly BindableProperty PasswordProperty = BindableProperty.Create(
    nameof(Password),
    typeof(string),
    typeof(ConnectionControl)
    );

    public string Password
    {
        get => (string)GetValue(PasswordProperty);
        set => SetValue(PasswordProperty, value);
    }

    public static readonly BindableProperty ConnectCommandProperty = BindableProperty.Create(
    nameof(ConnectCommand),
    typeof(ICommand),
    typeof(ConnectionControl)
    );

    public ICommand ConnectCommand
    {
        get => (ICommand)GetValue(ConnectCommandProperty);
        set => SetValue(ConnectCommandProperty, value);
    }

    public static readonly BindableProperty DisconnectCommandProperty = BindableProperty.Create(
    nameof(DisconnectCommand),
    typeof(ICommand),
    typeof(ConnectionControl)
    );

    public ICommand DisconnectCommand
    {
        get => (ICommand)GetValue(DisconnectCommandProperty);
        set => SetValue(DisconnectCommandProperty, value);
    }

    public static readonly BindableProperty ConnectedProperty = BindableProperty.Create(
    nameof(Connected),
    typeof(bool),
    typeof(ConnectionControl)
    );

    public bool Connected
    {
        get => (bool)GetValue(ConnectedProperty);
        set => SetValue(ConnectedProperty, value);
    }

    public static readonly BindableProperty IsChangingConnectionStatusProperty = BindableProperty.Create(
    nameof(IsChangingConnectionStatus),
    typeof(bool),
    typeof(ConnectionControl)
    );

    public bool IsChangingConnectionStatus
    {
        get => (bool)GetValue(IsChangingConnectionStatusProperty);
        set => SetValue(IsChangingConnectionStatusProperty, value);
    }
}
