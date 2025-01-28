import React, { useEffect, useState } from "react";

interface FaderProps {
	deps?: React.DependencyList;
	timeout?: number;
	children: React.ReactNode;
}

const Fader: React.FC<FaderProps> = ({ deps = [], timeout = 200, children }) => {
	const [renderChildren, setRenderChildren] = useState(false);
	const [isFading, setIsFading] = useState(true);

	useEffect(() => {
		setRenderChildren(false);
		setIsFading(true);

		const renderChildrenTimeout = setTimeout(() => {
			setRenderChildren(true);
		}, 10);

		const fadeOutTimeout = setTimeout(() => {
			setIsFading(false);
		}, timeout);

		return () => {
			clearTimeout(renderChildrenTimeout);
			clearTimeout(fadeOutTimeout);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...deps, timeout]);

	return (
		<div style={{ width: "100%", height: "100%", position: "relative" }}>
			{isFading && (
				<div
					className="bg-secondary"
					style={{
						zIndex: 100,
						position: "absolute",
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						transition: `opacity ${timeout}ms ease-in-out`,
						opacity: isFading ? 1 : 0,
					}}
				/>
			)}
			{renderChildren && <div style={{ width: "100%", height: "100%", zIndex: 80 }}>{children}</div>}
		</div>
	);
};

export default Fader;
