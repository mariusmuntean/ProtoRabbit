using System.Text.Json;

namespace ProtoRabbit.Services.Messages;

public class CreateSendableMessage : SendableMessageBase
{
    public override string PreferredExchangeName => "proto.data";
    public override string PreferredRoutingKey => "create";
    public override Type MessageType => typeof(Create);

    public override string SampleJsonMessage
    {
        get => JsonSerializer.Serialize(new Create { Prop1 = "A", Prop2 = "XYZ", Prop3 = 42 }, new JsonSerializerOptions { WriteIndented = true });
    }
}