import { CssBaseline, ThemeProvider } from "@mui/material";

import App from "./App.tsx";
import { Provider as ReduxProvider } from "react-redux";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./state/store";
import theme from "./theme.ts";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ReduxProvider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<App />
			</ThemeProvider>
		</ReduxProvider>
	</StrictMode>
);
