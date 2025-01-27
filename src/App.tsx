import "./App.css";

import { AppDispatch, RootState } from "@state/store";
import { useDispatch, useSelector } from "react-redux";

import { AppRouter } from "./router";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { fetchUser } from "@state/user/thunks";
import { useEffect } from "react";

function App() {
	const isDev = import.meta.env.MODE === "development";

	const dispatch = useDispatch<AppDispatch>();
	const user = useSelector((state: RootState) => state.user);

	useEffect(() => {
		dispatch(fetchUser());
	}, [dispatch]);

	if (user.loading) {
		return <LoadingSpinner isLoading />;
	}

	console.log("user", user);
	if ((!user.identity || !user.identity.isAdmin) && !isDev) {
		window.location.href = "https://simplegeek.ru";
	}

	return <AppRouter />;
}

export default App;
