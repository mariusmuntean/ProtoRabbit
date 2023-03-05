using CommunityToolkit.Maui;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Maui.Controls.Hosting;
using Microsoft.Maui.Hosting;
using ProtoRabbit.Services;
using ProtoRabbit.ViewModels;
using ProtoRabbit.Views;
using ProtoRabbit.Views.Pages;
using RabbitMQ.Client;

namespace ProtoRabbit;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            // Initialize the .NET MAUI Community Toolkit by adding the below line of code
            .UseMauiCommunityToolkit()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                fonts.AddFont("CascadiaMono.ttf", "CascadiaMono");
            });

#if DEBUG
        builder.Logging.AddDebug();
#endif

        builder.Services.AddSingleton<ConnectionFactory>(); // RabbitMQ connection factory
        builder.Services.AddSingleton<CachingConnectionFactory>(); // ProtoRabbit-MAUI connection factory
        builder.Services.AddSingleton<ConnectionManager>(); // ProtoRabbit-MAUI connection manager
        builder.Services.AddSingleton<IRabbitClient, RabbitClient>();
        builder.Services.AddSingleton<AsyncMessagePublisher>();

        // Component VMs
        builder.Services.AddScoped<IConnectionViewModel, ConnectionViewModel>();
        builder.Services.AddScoped<ISendMessageViewModel, SendMessageViewModel>();
        builder.Services.AddScoped<ISubscribeAndReceiveMessageViewModel, SubscribeAndReceiveMessageViewModel>();

        // Pages and their VMs
        builder.Services.AddSingleton<MainPage>();
        builder.Services.AddSingleton<MainPageViewModel>();

        builder.Services.AddSingleton<NewSubscriptionPage>();
        builder.Services.AddSingleton<NewSubscriptionViewModel>();

        return builder.Build();
    }
}