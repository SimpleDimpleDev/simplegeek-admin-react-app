import { CircularProgress } from "@mui/material";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
	isLoading: boolean;
};

const LoadingSpinner: React.FC<Props> = ({ isLoading, children }) => {
	return (
		<>
			{isLoading ? (
				<div className="w-100 h-100v d-f ai-c jc-c">
					<CircularProgress />
				</div>
			) : (
				children
			)}
		</>
	);
};

export { LoadingSpinner };
