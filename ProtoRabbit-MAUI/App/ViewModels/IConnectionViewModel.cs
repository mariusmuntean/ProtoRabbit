using System.ComponentModel;
using PropertyChangingEventHandler = System.ComponentModel.PropertyChangingEventHandler;

namespace ProtoRabbit.ViewModels;

public interface IConnectionViewModel
{
    /// <summary>Gets an <see cref="global::CommunityToolkit.Mvvm.Input.IRelayCommand"/> instance wrapping <see cref="ConnectionViewModel.Connect"/>.</summary>
    global::CommunityToolkit.Mvvm.Input.IRelayCommand ConnectCommand { get; }

    /// <inheritdoc cref="ConnectionViewModel._host"/>
    string Host { get; set; }

    /// <inheritdoc cref="ConnectionViewModel._port"/>
    int Port { get; set; }

    /// <inheritdoc cref="ConnectionViewModel._username"/>
    string Username { get; set; }

    /// <inheritdoc cref="ConnectionViewModel._password"/>
    string Password { get; set; }

    /// <inheritdoc cref="ConnectionViewModel._connected"/>
    bool Connected { get; set; }

    /// <inheritdoc cref="ConnectionViewModel._isChangingConnectionStatus"/>
    bool IsChangingConnectionStatus { get; set; }

    /// <summary>Gets an <see cref="global::CommunityToolkit.Mvvm.Input.IRelayCommand"/> instance wrapping <see cref="ConnectionViewModel.Disconnect"/>.</summary>
    global::CommunityToolkit.Mvvm.Input.IRelayCommand DisconnectCommand { get; }

    void Connect();
    bool CanConnect();
    void Disconnect();
    event PropertyChangedEventHandler PropertyChanged;
    event PropertyChangingEventHandler PropertyChanging;
}