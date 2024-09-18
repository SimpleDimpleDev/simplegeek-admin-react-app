import { Middleware } from "@reduxjs/toolkit";

/**
 * Logs all actions and next state to the console.
 * Useful for debugging.
 */
const loggingMiddleware: Middleware = (store) => (next) => (action) => {
	const result = next(action);
	console.log("%cDispatching:", "color: green; padding-top: 2px", action);
	console.log("%cPrev state:", "color: orange; padding-top: 2px", store.getState());
	console.log("%cNext state:", "color: blue; padding-top: 2px", store.getState());
	return result;
};

const crashReporterMiddleware: Middleware = () => (next) => (action) => {
	try {
		return next(action);
	} catch (err) {
		console.error("Caught an exception!", err);
		throw err;
	}
};

export { loggingMiddleware, crashReporterMiddleware };
