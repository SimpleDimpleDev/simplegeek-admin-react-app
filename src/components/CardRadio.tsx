import { Box, FormControlLabel, Radio, Typography } from "@mui/material";

interface CardRadioProps {
	isChecked: boolean;
	disabled? : boolean
	onChange: (event: React.SyntheticEvent) => void;
	mainText: string;
	subText: string;
	imgUrl: string;
}

const CardRadio = ({ isChecked, disabled, onChange, mainText, subText, imgUrl }: CardRadioProps) => {
	return (
		<Box
			display={"flex"}
			flexDirection={"row"}
			justifyContent={"space-between"}
			padding={"8px 16px 8px 8px"}
			sx={{
				backgroundColor: isChecked ? "surface.secondary" : "surface.primary",
				transition: "background-color 0.05s ease-in-out",
				borderRadius: "16px",
			}}
		>
			<FormControlLabel
				disabled={disabled}
				control={<Radio color="warning" />}
				label={
					<>
						<Typography variant={"body1"}>{mainText}</Typography>
						<Typography color={"typography.secondary"} variant={"body2"}>
							{subText}
						</Typography>
					</>
				}
				checked={isChecked}
				onChange={onChange}
			/>
			<Box height={"42px"} width={"42px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
				<img src={imgUrl} alt="" />
			</Box>
		</Box>
	);
};

export { CardRadio };
