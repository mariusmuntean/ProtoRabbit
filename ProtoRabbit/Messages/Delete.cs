using ProtoBuf;

namespace ProtoRabbit.Messages;

[ProtoContract]
public class Delete:IFoo
{
    [ProtoMember(1)] public string Id { get; set; }
}

public interface IFoo
{
    
}