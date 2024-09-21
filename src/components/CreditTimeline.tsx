import { Box, Button, LinearProgress, Typography } from "@mui/material";

import { CreditInfo } from "@appTypes/Payment";
import { DateFormatter } from "@utils/format";

interface Marker {
	mainText: string;
	subText: string;
	button?: {
		text: string;
		onClick: () => void;
	};
	helperText?: string;
}

interface TimelineProps {
	markers: Marker[];
	width: string;
	height?: string;
	filledIndex?: number;
	lineColor?: string;
	mainTextDefaultColor?: string;
	subTextDefaultColor?: string;
}

const Timeline: React.FC<TimelineProps> = ({
	markers,
	width,
	height,
	filledIndex,
	lineColor,
	mainTextDefaultColor,
	subTextDefaultColor,
}) => {
	// Number of markers to determine spacing
	const markerCount = markers.length;

	return (
		<Box position="relative" width={width} height={height || "72px"}>
			{/* Linear progress as the line */}
			<LinearProgress
				variant="determinate"
				value={filledIndex !== undefined ? (filledIndex / (markerCount - 1)) * 100 : 0}
				sx={{
					bgcolor: lineColor || "surface.primary",
					"& .MuiLinearProgress-barColorPrimary": {
						backgroundColor: "icon.brandSecondary",
					},
					height: "8px",
					width: "100%",
				}}
			/>

			{markers.map((marker, index) => {
				// Calculate left position based on index
				const position = (index / (markerCount - 1)) * 100;
				const mainTextColor =
					filledIndex && index < filledIndex
						? "typography.disabled"
						: mainTextDefaultColor || "typography.primary";
				const subTextColor =
					filledIndex && index < filledIndex
						? "typography.disabled"
						: subTextDefaultColor || "typography.secondary";

				return (
					<Box
						key={index}
						position="absolute"
						left={`${position}%`}
						top={0}
						display={"flex"}
						flexDirection={"column"}
						gap={1}
						alignItems={"center"}
						sx={{
							transform: "translateX(-50%)",
						}}
					>
						{/* Dot for the marker */}
						<Box
							sx={{
								width: "8px",
								height: "8px",
								borderRadius: "50%",
								backgroundColor: "icon.brandSecondary",
							}}
						/>
						{/* Marker content*/}
						<Box
							display={"flex"}
							flexDirection={"column"}
							alignItems={"start"}
							height={94}
							justifyContent={"space-between"}
							sx={{
								transform: "translateX(50%)",
							}}
						>
							<Box display={"flex"} flexDirection={"column"} textAlign={"start"} gap={"2px"}>
								{/* Main and subtexts */}
								<Typography variant="body1" color={mainTextColor}>
									{marker.mainText}
								</Typography>
								<Typography variant="body2" color={subTextColor}>
									{marker.subText}
								</Typography>
							</Box>
							{/* Action button */}
							{marker.button && (
								<Button variant="contained" color="primary" onClick={marker.button.onClick}>
									{marker.button.text}
								</Button>
							)}
							{/* Helper text */}
							{marker.helperText && (
								<Typography variant="body2" color="typography.success">
									{marker.helperText}
								</Typography>
							)}
						</Box>
					</Box>
				);
			})}
		</Box>
	);
};

interface ItemCreditInfoProps {
	payments: CreditInfo["payments"];
	width: string;
	lineColor?: string;
}

interface OrderItemCreditProps extends ItemCreditInfoProps {
	lastPayedIndex: number;
	onPayButtonClick: (index: number) => void;
}

export const ItemCreditInfo: React.FC<ItemCreditInfoProps> = ({ width, payments, lineColor }) => {
	return (
		<Timeline
			lineColor={lineColor}
			width={width}
			markers={payments.map((part) => {
				return {
					mainText: `${part.sum} ₽`,
					subText: DateFormatter.DDMMYYYY(part.deadline),
				};
			})}
		/>
	);
};

export const OrderItemCredit: React.FC<OrderItemCreditProps> = ({
	width,
	lineColor,
	payments,
	lastPayedIndex,
	onPayButtonClick,
}) => {
	return (
		<Timeline
			lineColor={lineColor}
			width={width}
			filledIndex={lastPayedIndex}
			markers={payments.map((part, index) => {
				return {
					mainText: `${part.sum} ₽`,
					subText: DateFormatter.DDMMYYYY(part.deadline),
					button:
						index === lastPayedIndex
							? {
									text: "Оплатить",
									onClick: () => onPayButtonClick(index),
							  }
							: undefined,
					helperText: index < lastPayedIndex ? "Оплачено" : undefined,
				};
			})}
		/>
	);
};
