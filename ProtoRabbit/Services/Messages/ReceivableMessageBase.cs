using ProtoBuf;
using ProtoBuf.Meta;

namespace ProtoRabbit.Services.Messages;

public abstract class ReceivableMessageBase
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

    public string TargetQueueName => $"{PreferredExchangeName}.{PreferredRoutingKey}";
}