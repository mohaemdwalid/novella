const eventRegistry = {};

function subscribe(eventName, callback) {
  eventRegistry[eventName] = eventRegistry[eventName] || [];
  eventRegistry[eventName].push(callback);

  return () => {
    eventRegistry[eventName] = eventRegistry[eventName].filter(
      (listener) => listener !== callback
    );
  };
}

function publish(eventName, data) {
  eventRegistry[eventName]?.forEach((listener) => listener(data));
}
