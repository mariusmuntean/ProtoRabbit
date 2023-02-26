using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProtoBuf;
using ProtoRabbit.Services;
using ProtoRabbit.Services.Messages;

namespace ProtoRabbit.ViewModels;

public partial class SendMessageViewModel : ObservableObject
{
    private readonly RabbitClient _rabbitClient;
    
    public SendMessageViewModel(RabbitClient rabbitClient)
    {
        _rabbitClient = rabbitClient;

        _sendableMessages = new List<SendableMessageBase> { new CreateSendableMessage(), new DeleteSendableMessage() }; // ToDo use reflection to load all subclasses
        _sendableMessageIndex = -1;
    }
    
    [ObservableProperty] private List<SendableMessageBase> _sendableMessages;
    [ObservableProperty] private SendableMessageBase _sendableMessage;
    [ObservableProperty] private int _sendableMessageIndex;
    
    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(SendCommand))]
    private string _exchange = null;

    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(SendCommand))]
    private string _routingKey = null;

    [ObservableProperty, NotifyCanExecuteChangedFor(nameof(SendCommand))]
    private string _jsonMessage = null;

    [ObservableProperty] private string _protoFile = null;
    
    
    [RelayCommand(CanExecute = nameof(CanSend))]
    public async Task Send()
    {
        if (_rabbitClient == null || _rabbitClient.IsClosed || SendableMessage is null)
        {
            return;
        }

        try
        {
            Debug.WriteLine($"Sending :{JsonMessage}");
            var msgObj = JsonSerializer.Deserialize(JsonMessage, SendableMessage.MessageType);

            var destStream = new MemoryStream();
            Serializer.Serialize(destStream, msgObj);
            await _rabbitClient.Send(Exchange, RoutingKey, destStream.ToArray());
        }
        catch (Exception e)
        {
            await Toast.Make($"Failed to send {JsonMessage}. {e}", ToastDuration.Long).Show();
        }
    }

    public bool CanSend() => !string.IsNullOrWhiteSpace(Exchange) && !string.IsNullOrWhiteSpace(RoutingKey) && !string.IsNullOrWhiteSpace(JsonMessage);


    [RelayCommand]
    public void PrettifyMessage()
    {
        try
        {
            JsonMessage = JsonSerializer.Serialize(JsonSerializer.Deserialize(JsonMessage, typeof(object)), typeof(object), new JsonSerializerOptions {WriteIndented = true});
        }
        catch (Exception ex)
        {
            Toast.Make($"Prettify Failed {ex}", ToastDuration.Long).Show();
        }
    }

    [RelayCommand]
    public void SendableMessageIndexChanged()
    {
        if (SendableMessageIndex == -1)
        {
            return;
        }

        SendableMessage = SendableMessages[SendableMessageIndex];

        Exchange = SendableMessage.PreferredExchangeName;
        RoutingKey = SendableMessage.PreferredRoutingKey;
        JsonMessage = SendableMessage.SampleJsonMessage;
        ProtoFile = SendableMessage.ProtoSchema;
    }
}