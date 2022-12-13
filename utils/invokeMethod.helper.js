// For Android
const JSBridge = typeof window !== "undefined" ? window.JSBridge : undefined;
// For IOS
const JSEventMessage =
	typeof window !== "undefined"
		? window?.webkit?.messageHandlers?.jsEventMessage
		: undefined;

export const InvokeMethodEventNames = {
	walletData: "walletData",
};

export const TriggerInvokeMethodsEvent = (eventName, data) => {
	try {
		console.log(JSON.stringify({ eventName, data }));
		if (JSBridge) {
			JSBridge.invokeMehtod(
				JSON.stringify({ event_name: eventName, event_params: { ...data } })
			);
		}
		if (JSEventMessage) {
			JSEventMessage.postMessage(
				JSON.stringify({ event_name: eventName, event_params: { ...data } })
			);
		}
	} catch (err) {}
};
