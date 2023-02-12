using System.Text.Json;

namespace ProtoRabbit.Messages;

public class DeleteSendableMessage : SendableMessageBase
{
    public override string PreferredExchangeName => "proto.data";
    public override string PreferredRoutingKey => "delete";
    public override Type MessageType => typeof(Delete);

    public override string SampleJsonMessage
    {
        get => JsonSerializer.Serialize(new Delete {Id = "6AE46E24-E304-422F-B5FB-E7BA748BEADC"}, new JsonSerializerOptions {WriteIndented = true});
    }
}