// Poor man's PubSub - but should suffice :D

const eventSubscriptions = new Map<string, VoidFunction[]>()

export const subscribe = (eventName: string, handler: VoidFunction) => {
  if (eventSubscriptions.has(eventName) === false) {
    eventSubscriptions.set(eventName, [handler])
  } else {
    eventSubscriptions.get(eventName)?.push(handler)
  }
}

export const unsubscribe = (eventName: string, handler: VoidFunction) => {
  if (eventSubscriptions.has(eventName) === false) {
    return
  }
  const eventHandlers = eventSubscriptions.get(eventName)
  const handlerIdx = eventHandlers!.indexOf(handler)
  if (handlerIdx === -1) {
    return
  }
  eventHandlers?.splice(handlerIdx, 1)
}

export const fireEvent = (eventName: string) => {
  if (eventSubscriptions.has(eventName) === false) {
    return
  }

  eventSubscriptions.get(eventName)?.forEach((h) => {
    try {
      h()
    } catch (error) {
      console.log(`Invoking handler '${h}' has failed`)
    }
  })
}
