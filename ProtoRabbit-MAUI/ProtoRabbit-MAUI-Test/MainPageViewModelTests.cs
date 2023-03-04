using FluentAssertions;
using Moq;
using ProtoRabbit.Services;
using ProtoRabbit.ViewModels;
using RabbitMQ.Client;

namespace ProtoRabbit_MAUI_Test;

public class MainPageViewModelTests
{
    private Mock<IConnectionViewModel> _connectionViewModelMock;
    private Mock<ISendMessageViewModel> _sendMessageViewModelMock;
    private Mock<ISubscribeAndReceiveMessageViewModel> _subscribeAndReceiveMessageViewModelMock;

    private MainPageViewModel _mainPageViewModel;

    [SetUp]
    public void Setup()
    {
        _connectionViewModelMock = new Mock<IConnectionViewModel>();
        _sendMessageViewModelMock = new Mock<ISendMessageViewModel>();
        _subscribeAndReceiveMessageViewModelMock = new Mock<ISubscribeAndReceiveMessageViewModel>();

        _mainPageViewModel = new MainPageViewModel(_connectionViewModelMock.Object, _sendMessageViewModelMock.Object, _subscribeAndReceiveMessageViewModelMock.Object);
    }

    [Test]
    public void ApplyQueryAttributes_ClearsTheQueryAttributes_WithValidSubscription()
    {
        // When new query attributes are applied with a new subscription
        var query = new Dictionary<string, object>
        {
            ["Subscription"] = CreateDummySubscription(),
            ["Type"] = GetType()
        };
        _mainPageViewModel.ApplyQueryAttributes(query);

        // Then the query dictionary is cleared.
        query.Should().BeEmpty();
    }


    [Test]
    public void ApplyQueryAttributes_DoesntClearTheQueryAttributes_WithoutSubscription()
    {
        // When new query attributes are applied without a new subscription
        var noSubscription = new object();
        var aType = GetType();
        var query = new Dictionary<string, object>
        {
            ["Subscription"] = noSubscription,
            ["Type"] = aType
        };
        _mainPageViewModel.ApplyQueryAttributes(query);

        // Then the query dictionary is not cleared.
        query.Should().ContainKey("Subscription");
        query["Subscription"].Should().Be(noSubscription);

        query.Should().ContainKey("Type");
        query["Type"].Should().Be(aType);
    }

    private static Subscription CreateDummySubscription()
    {
        return new Subscription(new Mock<IConnection>().Object, "dummy_exchange", "dummy_routing_key", "dummy_queue_name", "dummy_sub_name");
    }
}