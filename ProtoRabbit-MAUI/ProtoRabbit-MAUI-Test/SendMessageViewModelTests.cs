using Moq;
using Newtonsoft.Json;
using ProtoBuf;
using ProtoRabbit.Services;
using ProtoRabbit.Services.Messages;
using ProtoRabbit.ViewModels;

namespace ProtoRabbit_MAUI_Test;

[TestFixture]
public class SendMessageViewModelTests
{
    private SendMessageViewModel _viewModel;
    private Mock<IRabbitClient> _mockRabbitClient;

    [SetUp]
    public void SetUp()
    {
        _mockRabbitClient = new Mock<IRabbitClient>();
        _viewModel = new SendMessageViewModel(_mockRabbitClient.Object);
    }

    [Test]
    public void Send_NullRabbitClient_DoesNotSend()
    {
        _viewModel.SendCommand.Execute(null);
        _mockRabbitClient.Verify(x => x.Send(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<byte[]>()), Times.Never);
    }

    [Test]
    public void Send_ClosedRabbitClient_DoesNotSend()
    {
        _mockRabbitClient.Setup(x => x.IsClosed).Returns(true);
        _viewModel.SendCommand.Execute(null);
        _mockRabbitClient.Verify(x => x.Send(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<byte[]>()), Times.Never);
    }

    [Test]
    public void Send_NullSendableMessage_DoesNotSend()
    {
        _viewModel.SendCommand.Execute(null);
        _mockRabbitClient.Verify(x => x.Send(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<byte[]>()), Times.Never);
    }

    [Test]
    public void Send_ValidInputs_SendsMessage()
    {
        // Arrange
        var message = new Create {Prop1 = "1", Prop2 = "b", Prop3 = 3};
        var json = JsonConvert.SerializeObject(message);
        var expectedBytes = SerializeProtoBuf(message);
        _viewModel.Exchange = "test_exchange";
        _viewModel.RoutingKey = "test_routing_key";
        
        _viewModel.JsonMessage = json;
        _viewModel.SendableMessage = new CreateSendableMessage();

        // Act
        _viewModel.SendCommand.Execute(null);

        // Assert
        _mockRabbitClient.Verify(x => x.Send("test_exchange", "test_routing_key", expectedBytes), Times.Once);
    }

    [Test]
    public void CanSend_MissingInputs_ReturnsFalse()
    {
        _viewModel.Exchange = null;
        _viewModel.RoutingKey = null;
        _viewModel.JsonMessage = null;
        var canSend = _viewModel.SendCommand.CanExecute(null);
        Assert.That(canSend, Is.False);
    }

    [Test]
    public void CanSend_ValidInputs_ReturnsTrue()
    {
        _viewModel.Exchange = "test_exchange";
        _viewModel.RoutingKey = "test_routing_key";
        _viewModel.JsonMessage = "{}";
        var canSend = _viewModel.SendCommand.CanExecute(null);
        Assert.That(canSend, Is.True);
    }

    private static byte[] SerializeProtoBuf<T>(T obj)
    {
        using var stream = new MemoryStream();
        Serializer.Serialize(stream, obj);
        return stream.ToArray();
    }
}