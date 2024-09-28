import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Divider,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { Check, Close, Delete, Edit, ExpandMore } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";

import ActionDialog from "@components/ActionDialog";
import { CatalogItemGet } from "@appTypes/CatalogItem";
import { CatalogItemUpdateSchema } from "@schemas/CatalogItem";
import { getImageUrl } from "@utils/image";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const textFieldProps = {
	onFocus: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
		event.stopPropagation();
		event.target.select();
	},
	sx: {
		width: "50%",
		"& .MuiInputBase-input": {
			fontSize: "1.2rem",
			color: "typography.primary",
		},
		"& .MuiInputBase-input.Mui-disabled": {
			WebkitTextFillColor: "#000000",
		},
	},
};

type VariationStockUpdateFormData = {
	id: string;
	price: number;
	quantity: number;
};

const VariationStockUpdateResolver = z.object({
	id: z.string({ message: "Выберите вариацию" }),
	price: z.coerce.number({ message: "Укажите цену" }).positive({ message: "Цена должна быть положительным числом" }),
	quantity: z.coerce
		.number({ message: "Укажите количество" })
		.positive({ message: "Количество должно быть положительным числом" }),
});

interface VariationStockEditableCardProps {
	variation: CatalogItemGet;
	onUpdate: (data: z.infer<typeof CatalogItemUpdateSchema>) => void;
	onDelete: ({ variationId }: { variationId: string }) => void;
}

const VariationStockEditableCard: React.FC<VariationStockEditableCardProps> = ({ variation, onUpdate, onDelete }) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { isDirty },
	} = useForm<VariationStockUpdateFormData>({
		resolver: zodResolver(VariationStockUpdateResolver),
		defaultValues: {
			id: variation.id,
			price: variation.price,
			quantity: variation.quantity || 0,
		},
	});

	const [isEditing, setIsEditing] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [deletionDialogOpened, setDeletionDialogOpened] = useState(false);

	const resolvedOnSubmit = (data: VariationStockUpdateFormData) => {
		onUpdate(CatalogItemUpdateSchema.parse(data));
	};

	const handleStartEditing = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		setIsExpanded(true);
		setIsEditing(true);
	};

	const handleStopEditing = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		reset();
		setIsExpanded(false);
		setIsEditing(false);
	};

	const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		setDeletionDialogOpened(true);
	};

	const handleDelete = () => {
		onDelete({ variationId: variation.id });
	};

	const handleToggleExpand = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		if (isEditing) return;
		setIsExpanded(!isExpanded);
	};

	return (
		<>
			<ActionDialog
				title="Удалить вариацию публикации?"
				helperText="После удаления отменить действие будет невозможно"
				opened={deletionDialogOpened}
				onClose={() => setDeletionDialogOpened(false)}
				confirmButton={{
					text: "Удалить",
					onClick: handleDelete,
				}}
				declineButton={{
					text: "Отмена",
				}}
			/>

			<form onSubmit={handleSubmit(resolvedOnSubmit)}>
				<Accordion
					sx={{
						width: "100%",
						borderTop: "none",
						"&:before": {
							display: "none",
						},
					}}
					disableGutters
					expanded={isExpanded}
					onChange={() => {}}
				>
					<AccordionSummary
						onFocus={(event) => event.stopPropagation()}
						onBlur={(event) => event.stopPropagation()}
						role="presentation"
						tabIndex={-1}
						sx={{ cursor: "default!important" }}
					>
						<Stack
							sx={{ width: "100%" }}
							direction="row"
							alignItems="center"
							justifyContent="space-between"
							divider={<Divider orientation="vertical" />}
						>
							<div className="gap-1 w-100 ai-c d-f fd-r jc-fs">
								<img
									src={getImageUrl(variation.product.images.at(0)?.url || "", "small")}
									style={{ width: 60, height: 60, objectFit: "cover" }}
								/>
								<Typography variant="subtitle0">{variation.product.title}</Typography>
							</div>
							<div className="gap-1 pl-2 w-100 ai-fs d-f fd-c">
								<Typography variant="body2" sx={{ color: "typography.secondary" }}>
									Цена
								</Typography>
								<Controller
									name="price"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...textFieldProps}
											{...field}
											variant={"standard"}
											disabled={!isEditing}
											error={!!error}
											helperText={error?.message}
											slotProps={{
												input: {
													type: "number",
													endAdornment: <Typography variant="subtitle0">₽</Typography>,
												},
											}}
										/>
									)}
								/>
							</div>
							<div className="gap-1 pl-2 w-100 d-f fd-c">
								<Typography variant="body2" sx={{ color: "typography.secondary" }}>
									Количество
								</Typography>
								<Controller
									name="quantity"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<TextField
											{...textFieldProps}
											{...field}
											variant={"standard"}
											disabled={!isEditing}
											error={!!error}
											helperText={error?.message}
											slotProps={{
												input: {
													type: "number",
												},
											}}
										/>
									)}
								/>
							</div>
							<div className="gap-1 pl-2 w-100 d-f fd-c">
								<Typography variant="body2" sx={{ color: "typography.secondary" }}>
									Заказанное количество
								</Typography>
								<Typography variant="subtitle0">{variation.orderedQuantity}</Typography>
							</div>
							<div className="gap-1 pl-2 d-f fd-r jc-c">
								{!isEditing ? (
									<>
										<IconButton
											onFocus={(event) => event.stopPropagation()}
											onClick={handleStartEditing}
										>
											<Edit />
										</IconButton>
										<IconButton
											sx={{ color: "error.main" }}
											onFocus={(event) => event.stopPropagation()}
											onClick={handleDeleteClick}
										>
											<Delete />
										</IconButton>
									</>
								) : (
									<>
										<IconButton
											sx={{ color: "error.main" }}
											onFocus={(event) => event.stopPropagation()}
											onClick={handleStopEditing}
										>
											<Close />
										</IconButton>
										<IconButton
											sx={{ color: "success.main" }}
											onFocus={(event) => event.stopPropagation()}
											disabled={!isDirty}
											type="submit"
										>
											<Check />
										</IconButton>
									</>
								)}
								<IconButton
									onFocus={(event) => event.stopPropagation()}
									onClick={handleToggleExpand}
									disabled={isEditing}
								>
									<ExpandMore
										sx={{
											transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
											transition: "transform 0.2s ease-in-out",
										}}
									/>
								</IconButton>
							</div>
						</Stack>
					</AccordionSummary>
					<AccordionDetails>
						<Typography variant="body2">{variation.product.description}</Typography>
					</AccordionDetails>
				</Accordion>
			</form>
		</>
	);
};

export { VariationStockEditableCard };
