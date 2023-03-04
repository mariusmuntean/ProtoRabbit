using System.ComponentModel;
using PropertyChangingEventHandler = System.ComponentModel.PropertyChangingEventHandler;

namespace ProtoRabbit.ViewModels;

public interface ISendMessageViewModel
{
    /// <summary>Gets an <see cref="global::CommunityToolkit.Mvvm.Input.IRelayCommand"/> instance wrapping <see cref="SendMessageViewModel.SendableMessageIndexChanged"/>.</summary>
    global::CommunityToolkit.Mvvm.Input.IRelayCommand SendableMessageIndexChangedCommand { get; }

    /// <inheritdoc cref="SendMessageViewModel._sendableMessages"/>
    global::System.Collections.Generic.List<global::ProtoRabbit.Services.Messages.SendableMessageBase> SendableMessages { get; set; }

    /// <inheritdoc cref="SendMessageViewModel._sendableMessage"/>
    global::ProtoRabbit.Services.Messages.SendableMessageBase SendableMessage { get; set; }

    /// <inheritdoc cref="SendMessageViewModel._sendableMessageIndex"/>
    int SendableMessageIndex { get; set; }

    /// <inheritdoc cref="SendMessageViewModel._exchange"/>
    string Exchange { get; set; }

    /// <inheritdoc cref="SendMessageViewModel._routingKey"/>
    string RoutingKey { get; set; }

    /// <inheritdoc cref="SendMessageViewModel._jsonMessage"/>
    string JsonMessage { get; set; }

    /// <inheritdoc cref="SendMessageViewModel._protoFile"/>
    string ProtoFile { get; set; }

    /// <summary>Gets an <see cref="global::CommunityToolkit.Mvvm.Input.IRelayCommand"/> instance wrapping <see cref="SendMessageViewModel.PrettifyMessage"/>.</summary>
    global::CommunityToolkit.Mvvm.Input.IRelayCommand PrettifyMessageCommand { get; }

    /// <summary>Gets an <see cref="global::CommunityToolkit.Mvvm.Input.IAsyncRelayCommand"/> instance wrapping <see cref="SendMessageViewModel.Send"/>.</summary>
    global::CommunityToolkit.Mvvm.Input.IAsyncRelayCommand SendCommand { get; }

    Task Send();
    bool CanSend();
    void PrettifyMessage();
    void SendableMessageIndexChanged();
    event PropertyChangedEventHandler PropertyChanged;
    event PropertyChangingEventHandler PropertyChanging;
}