import { Box } from "@mui/material";

const StatusBadge = ({ children, color }: { children: React.ReactNode; color: string }) => (
	<Box
		height={24}
		borderRadius={"12px"}
		px={1}
		sx={{
			bgcolor: color,
			display: "flex",
			alignItems: "center",
			color: "white",
			fontSize: "12px",
			lineHeight: "20px",
			letterSpacing: "0.4px",
		}}
	>
		{children}
	</Box>
);

export { StatusBadge };
