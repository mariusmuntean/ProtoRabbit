using ProtoBuf;
using ProtoBuf.Meta;

namespace ProtoRabbit.Messages;

// ToDo: maybe a dynamic version as well?
public abstract class SendableMessageBase
{
    public abstract string PreferredExchangeName { get; }
    public abstract string PreferredRoutingKey { get; }

    /// <summary>
    /// The message type, containing protobuf annotations.
    /// </summary>
    public abstract Type MessageType { get; }

    public string ProtoSchema
    {
        get => Serializer.GetProto(new SchemaGenerationOptions {Types = {MessageType}});
    }

    public virtual string Name
    {
        get => MessageType.Name;
    }

    public virtual string SampleJsonMessage { get; set; }
}