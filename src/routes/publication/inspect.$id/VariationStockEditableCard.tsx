import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Divider,
	IconButton,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { Check, Close, Delete, Edit, ExpandMore, Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";

import ActionDialog from "@components/ActionDialog";
import { CatalogItemGet } from "@appTypes/CatalogItem";
import { CatalogItemUpdateSchema } from "@schemas/CatalogItem";
import { getImageUrl } from "@utils/image";
import { handleIntChange } from "@utils/forms";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const textFieldProps = {
	onFocus: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
		event.stopPropagation();
		event.target.select();
	},
	sx: {
		width: "80%",
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
	onActivate: ({ variationId }: { variationId: string }) => void;
	onDeactivate: ({ variationId }: { variationId: string }) => void;
}

const VariationStockEditableCard: React.FC<VariationStockEditableCardProps> = ({
	variation,
	onUpdate,
	onDelete,
	onActivate,
	onDeactivate,
}) => {
	const navigate = useNavigate();

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

	const handleActivateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		onActivate({ variationId: variation.id });
	};

	const handleDeactivateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		onDeactivate({ variationId: variation.id });
	};

	const handleToggleExpand = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		if (isEditing) return;
		setIsExpanded(!isExpanded);
	};

	const handleProductInspectClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		navigate(`/product/inspect/${variation.product.id}`);
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
							<div className="gap-1 pr-2 w-100 ai-c d-f fd-r jc-fs">
								<Tooltip title="Перейти к товару">
									<IconButton sx={{ margin: 0, width: "100%" }} onClick={handleProductInspectClick}>
										<img
											src={getImageUrl(variation.product.images.at(0)?.url || "", "small")}
											style={{ width: 60, height: 60, objectFit: "cover" }}
										/>

										<Typography variant="subtitle0">{variation.product.title}</Typography>
									</IconButton>
								</Tooltip>
							</div>
							<div className="gap-1 pl-2 d-f fd-c" style={{ width: "50%" }}>
								<Typography variant="body2" sx={{ color: "typography.secondary" }}>
									Доступна в каталоге
								</Typography>
								<Typography variant="subtitle0">
									{variation.isActive ? <Check /> : <Close />}
								</Typography>
							</div>
							<div className="gap-1 pl-2 ai-fs d-f fd-c" style={{ width: "50%" }}>
								<Typography variant="body2" sx={{ color: "typography.secondary" }}>
									Цена
								</Typography>
								<Controller
									name="price"
									control={control}
									render={({ field: { value, onChange}, fieldState: { error } }) => (
										<TextField
											{...textFieldProps}
											value={value}
											onChange={handleIntChange(onChange)}
											variant={"standard"}
											disabled={!isEditing}
											error={!!error}
											helperText={error?.message}
											slotProps={{
												input: {
													endAdornment: <Typography variant="subtitle0">₽</Typography>,
												},
											}}
										/>
									)}
								/>
							</div>
							<div className="gap-1 pl-2 d-f fd-c" style={{ width: "50%" }}>
								<Typography variant="body2" sx={{ color: "typography.secondary" }}>
									Количество
								</Typography>
								<Controller
									name="quantity"
									control={control}
									render={({ field: { value, onChange}, fieldState: { error } }) => (
										<TextField
											{...textFieldProps}
											value={value}
											onChange={handleIntChange(onChange)}
											variant={"standard"}
											disabled={!isEditing}
											error={!!error}
											helperText={error?.message}
										/>
									)}
								/>
							</div>
							<div className="gap-1 pl-2 d-f fd-c" style={{ width: "50%" }}>
								<Typography variant="body2" sx={{ color: "typography.secondary" }}>
									Заказанное количество
								</Typography>
								<Typography variant="subtitle0">{variation.orderedQuantity}</Typography>
							</div>
							<div className="gap-1 pl-2 d-f fd-r jc-c">
								{!isEditing ? (
									<>
										<Tooltip title="Редактировать">
											<IconButton
												onFocus={(event) => event.stopPropagation()}
												onClick={handleStartEditing}
											>
												<Edit />
											</IconButton>
										</Tooltip>
										<Tooltip title="Удалить">
											<IconButton
												sx={{ color: "error.main" }}
												onFocus={(event) => event.stopPropagation()}
												onClick={handleDeleteClick}
											>
												<Delete />
											</IconButton>
										</Tooltip>
									</>
								) : (
									<>
										<Tooltip title="Отменить">
											<IconButton
												sx={{ color: "error.main" }}
												onFocus={(event) => event.stopPropagation()}
												onClick={handleStopEditing}
											>
												<Close />
											</IconButton>
										</Tooltip>
										<Tooltip title="Сохранить">
											<IconButton
												sx={{ color: "success.main" }}
												onFocus={(event) => event.stopPropagation()}
												disabled={!isDirty}
												type="submit"
											>
												<Check />
											</IconButton>
										</Tooltip>
									</>
								)}
								{variation.isActive ? (
									<Tooltip title="Скрыть в каталоге">
										<IconButton
											onFocus={(event) => event.stopPropagation()}
											onClick={handleDeactivateClick}
											disabled={isEditing}
											sx={{ color: "error.main" }}
										>
											<VisibilityOff />
										</IconButton>
									</Tooltip>
								) : (
									<Tooltip title="Показать в каталоге">
										<IconButton
											onFocus={(event) => event.stopPropagation()}
											onClick={handleActivateClick}
											disabled={isEditing}
											sx={{ color: "success.main" }}
										>
											<Visibility />
										</IconButton>
									</Tooltip>
								)}
								<Tooltip title={isExpanded ? "Свернуть" : "Развернуть"}>
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
								</Tooltip>
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
