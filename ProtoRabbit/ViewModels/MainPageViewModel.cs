using CommunityToolkit.Mvvm.ComponentModel;

namespace ProtoRabbit.ViewModels;

public partial class MainPageViewModel:ObservableObject
{
    [ObservableProperty]
    private string rabbitMqUrl = "amqp://localhost:5672";

    [ObservableProperty]
    private string rabbitMqUsername = "guest";

    [ObservableProperty]
    private string rabbitMqPassword= "guest";
}