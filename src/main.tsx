import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import Category from "@routes/category/_route.tsx";
import Faq from "@routes/faq/_route.tsx";
import Filter from "@routes/filter/_route.tsx";
import Index from "@routes/_index/index.tsx";
import OrderInspect from "@routes/order/inspect.$id/_route.tsx";
import OrderTable from "@routes/order/table/_route.tsx";
import ProductCreate from "@routes/product/create/_route.tsx";
import ProductInspect from "@routes/product/inspect.$id/_route.tsx";
import ProductTable from "@routes/product/table/_route.tsx";
import PublicationCreate from "@routes/publication/create/_route.tsx";
import PublicationInspect from "@routes/publication/inspect.$id/_route.tsx";
import PublicationTable from "@routes/publication/table/_route.tsx";
import { Provider as ReduxProvider } from "react-redux";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./state/store";
import theme from "./theme.ts";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				index: true,
				element: <Index />,
			},
			{
				path: "category",
				element: <Category />,
			},
			{
				path: "faq",
				element: <Faq />,
			},
			{
				path: "filter",
				element: <Filter />,
			},
			{
				path: "order",
				children: [
					{
						path: "inspect/:id",
						element: <OrderInspect />,
					},
					{
						path: "table",
						element: <OrderTable />,
					},
				],
			},
			{
				path: "product",
				children: [
					{
						path: "create",
						element: <ProductCreate />,
					},
					{
						path: "table",
						element: <ProductTable />,
					},
					{
						path: "inspect/:id",
						element: <ProductInspect />,
					},
				],
			},
			{
				path: "publication",
				children: [
					{
						path: "create",
						element: <PublicationCreate />,
					},
					{
						path: "table",
						element: <PublicationTable />,
					},
					{
						path: "inspect/:id",
						element: <PublicationInspect />,
					},
				],
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ReduxProvider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<RouterProvider router={router} />
			</ThemeProvider>
		</ReduxProvider>
	</StrictMode>
);
