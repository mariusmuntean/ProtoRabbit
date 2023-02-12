using ProtoBuf;

namespace ProtoRabbit.Messages;

[ProtoContract]
public class Create
{
    [ProtoMember(1)] public string Prop1 { get; set; }

    [ProtoMember(2)] public string Prop2 { get; set; }

    [ProtoMember(3)] public int Prop3 { get; set; }
}