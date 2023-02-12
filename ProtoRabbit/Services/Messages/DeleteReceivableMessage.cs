namespace ProtoRabbit.Services.Messages;

public class DeleteReceivableMessage : ReceivableMessageBase
{
    public override string PreferredExchangeName => "proto.data";
    public override string PreferredRoutingKey => "delete";
    public override Type MessageType => typeof(Delete);
}