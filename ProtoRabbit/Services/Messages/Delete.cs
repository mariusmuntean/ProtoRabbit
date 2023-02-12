using ProtoBuf;

namespace ProtoRabbit.Services.Messages;

[ProtoContract]
public class Delete
{
    [ProtoMember(1)] public string Id { get; set; }
}