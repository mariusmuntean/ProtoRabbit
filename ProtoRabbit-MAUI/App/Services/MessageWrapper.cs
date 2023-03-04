using System;

namespace ProtoRabbit.Services;

public class MessageWrapper
{
    public MessageWrapper(DateTime dateTime, string exchange, string routingKey, string queue, object message)
    {
        DateTime = dateTime;
        Exchange = exchange;
        RoutingKey = routingKey;
        Queue = queue;
        Message = message;
    }

    public DateTime DateTime { get; }
    public string Exchange { get; }
    public string RoutingKey { get; }
    public string Queue { get; }
    public object Message { get; }
}