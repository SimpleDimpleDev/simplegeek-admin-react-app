import { PropsWithChildren, Suspense, useEffect, useState } from "react";

import { DefaultFallback } from "./DefaultFallback";

/**
 * A wrapper of React's built-in Suspense component that
 * immediately returns null instead of the fallback component when the
 * component is first rendered, allowing the previous route to remain visible
 * until the new component is ready to render.
 *
 * @param children The children elements to render.
 */
const LazySuspense: React.FC<PropsWithChildren> = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), 1000);
		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return null; // Return null to keep the previous route visible
	}

	return <Suspense fallback={<DefaultFallback />}>{children}</Suspense>;
};

export default LazySuspense;
