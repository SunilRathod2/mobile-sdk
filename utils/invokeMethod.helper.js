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

export const TriggerInvokeMethodsEvent = ( data) => {
	try {
		console.log(JSON.stringify({ data }));
		if (JSBridge) {
			JSBridge.getKeyPair(
				JSON.stringify({  ...data })
			);
		}
		if (JSEventMessage) {
			JSEventMessage.postMessage(
				JSON.stringify({  ...data  })
			);
		}
	} catch (err) {}
};
