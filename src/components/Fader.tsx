import React, { useEffect, useState } from "react";

interface FaderProps {
	deps: React.DependencyList; // Optional array of dependencies
	timeout?: number; // Optional timeout in milliseconds before fading out
	children: React.ReactNode; // Children to render after fade out
}

const Fader: React.FC<FaderProps> = ({ deps = [], timeout = 500, children }) => {
	const [isFading, setIsFading] = useState(false);

	useEffect(() => {
		// Start fading in when the component mounts or deps change
		setIsFading(true);
		// Set a timeout to fade out after the specified duration
		const fadeOutTimeout = setTimeout(() => {
			setIsFading(false);
		}, timeout);
		// Cleanup function to clear the timeout
		return () => {
			clearTimeout(fadeOutTimeout);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, timeout]); // Re-run effect when deps change

	return isFading ? (
		<div
			className="bg-secondary w-100 h-100"
			style={{
				transition: `opacity ${timeout}ms ease-in-out`,
				opacity: isFading ? 1 : 0,
			}}
		/>
	) : (
		children
	);
};

export default Fader;
