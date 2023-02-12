namespace ProtoRabbit.Services.Messages;

public class CreateReceivableMessage : ReceivableMessageBase
{
    public override string PreferredExchangeName => "proto.data";
    public override string PreferredRoutingKey => "create";
    public override Type MessageType => typeof(ProtoRabbit.Messages.Create);
}