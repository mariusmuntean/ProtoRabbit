using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RabbitMQ.Client;

namespace ProtoRabbit.ViewModels;

public partial class MainPageViewModel:ObservableObject
{
    [ObservableProperty]
    private string rabbitMqUrl = "amqp://localhost:5672";

    [ObservableProperty]
    private string rabbitMqUsername = "guest";

    [ObservableProperty]
    private string rabbitMqPassword= "guest";

    [RelayCommand]
    public async Task Connect()
    {
        var connectionFactory = new ConnectionFactory();
        var connection = connectionFactory.CreateConnection();
        var channel = connection.CreateModel();

        var msg = System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(new { Message = "Hi" });

        channel.BasicPublish("proto.data", "c", null, msg);
    }
}