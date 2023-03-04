using System.Windows.Input;
using Microsoft.Maui.Controls;
using ProtoRabbit.Services.Messages;

namespace ProtoRabbit.Views.Components;

public partial class SendMessageControl : ContentView
{
    public SendMessageControl()
    {
        InitializeComponent();
    }

    public static readonly BindableProperty SendableMessagesProperty = BindableProperty.Create(
        nameof(SendableMessages),
        typeof(List<SendableMessageBase>),
        typeof(SendMessageControl)
    );

    public List<SendableMessageBase> SendableMessages
    {
        get => (List<SendableMessageBase>)GetValue(SendableMessagesProperty);
        set => SetValue(SendableMessagesProperty, value);
    }

    public static readonly BindableProperty NameProperty = BindableProperty.Create(
        nameof(Name),
        typeof(string),
        typeof(SendMessageControl)
    );

    public string Name
    {
        get => (string)GetValue(NameProperty);
        set => SetValue(NameProperty, value);
    }

    public static readonly BindableProperty SendableMessageIndexProperty = BindableProperty.Create(
        nameof(SendableMessageIndex),
        typeof(int),
        typeof(SendMessageControl)
    );

    public int SendableMessageIndex
    {
        get => (int)GetValue(SendableMessageIndexProperty);
        set => SetValue(SendableMessageIndexProperty, value);
    }

    public static readonly BindableProperty SendableMessageIndexChangedCommandProperty = BindableProperty.Create(
        nameof(SendableMessageIndexChangedCommand),
        typeof(ICommand),
        typeof(SendMessageControl)
    );

    public ICommand SendableMessageIndexChangedCommand
    {
        get => (ICommand)GetValue(SendableMessageIndexChangedCommandProperty);
        set => SetValue(SendableMessageIndexChangedCommandProperty, value);
    }

    public static readonly BindableProperty ExchangeProperty = BindableProperty.Create(
        nameof(Exchange),
        typeof(string),
        typeof(SendMessageControl)
    );

    public string Exchange
    {
        get => (string)GetValue(ExchangeProperty);
        set => SetValue(ExchangeProperty, value);
    }

    public static readonly BindableProperty RoutingKeyProperty = BindableProperty.Create(
        nameof(RoutingKey),
        typeof(string),
        typeof(SendMessageControl)
    );

    public string RoutingKey
    {
        get => (string)GetValue(RoutingKeyProperty);
        set => SetValue(RoutingKeyProperty, value);
    }

    public static readonly BindableProperty JsonMessageProperty = BindableProperty.Create(
        nameof(JsonMessage),
        typeof(string),
        typeof(SendMessageControl)
    );

    public string JsonMessage
    {
        get => (string)GetValue(JsonMessageProperty);
        set => SetValue(JsonMessageProperty, value);
    }

    public static readonly BindableProperty PrettifyMessageCommandProperty = BindableProperty.Create(
        nameof(PrettifyMessageCommand),
        typeof(ICommand),
        typeof(SendMessageControl)
    );

    public ICommand PrettifyMessageCommand
    {
        get => (ICommand)GetValue(PrettifyMessageCommandProperty);
        set => SetValue(PrettifyMessageCommandProperty, value);
    }

    public static readonly BindableProperty ProtoFileProperty = BindableProperty.Create(
        nameof(ProtoFile),
        typeof(string),
        typeof(SendMessageControl)
    );

    public string ProtoFile
    {
        get => (string)GetValue(ProtoFileProperty);
        set => SetValue(ProtoFileProperty, value);
    }

    public static readonly BindableProperty SendCommandProperty = BindableProperty.Create(
        nameof(SendCommand),
        typeof(ICommand),
        typeof(SendMessageControl)
    );

    public ICommand SendCommand
    {
        get => (ICommand)GetValue(SendCommandProperty);
        set => SetValue(SendCommandProperty, value);
    }
}