import {
	Autocomplete,
	Button,
	Chip,
	CircularProgress,
	FormControl,
	FormHelperText,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Delete, DragIndicator } from "@mui/icons-material";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { ProductTemplateCreateSchema, ProductTemplateDataResolver } from "@schemas/ProductTemplate";

import { ProductTemplateCreate } from "@appTypes/ProductTemplate";
import { getImageUrl } from "@utils/image";
import { handleIntChange } from "@utils/forms";
import { useEffect } from "react";
import { useGetCategoryListQuery } from "@api/admin/category";
import { useLazyGetFilterGroupListQuery } from "@api/admin/filterGroup";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// TODO: preorder feature
// Checkbox,
// FormControlLabel,

type ProductTemplateCreateFormData = {
	title: string;
	data: {
		title: string | null;
		description: string | null;
		categoryId: string | null;
		physicalProperties: {
			width: string;
			height: string;
			length: string;
			weight: string;
		} | null;
		filterGroups: {
			id: string;
			title: string;
			filters: {
				id: string;
				value: string;
			}[];
		}[];
	};
};

const ProductTemplateCreateResolver = z.object({
	title: z.string().min(1, { message: "Укажите название" }),
	data: ProductTemplateDataResolver,
});

interface ProductTemplateCreateFormProps {
	onSubmit: (data: ProductTemplateCreate) => void;
}

export const ProductTemplateCreateForm: React.FC<ProductTemplateCreateFormProps> = ({ onSubmit }) => {
	const [
		fetchFilterGroupList,
		{ data: filterGroupList, isLoading: filterGroupListIsLoading, isFetching: filterGroupListIsFetching },
	] = useLazyGetFilterGroupListQuery();
	const { data: categoryList, isLoading: categoryListIsLoading } = useGetCategoryListQuery(void 0, {
		refetchOnMountOrArgChange: true,
	});
	const resolvedOnSubmit = (data: ProductTemplateCreateFormData) => {
		onSubmit(ProductTemplateCreateSchema.parse(data));
	};

	const defaultValues: ProductTemplateCreateFormData = {
		title: "",
		data: {
			title: null,
			description: null,
			categoryId: null,
			physicalProperties: null,
			filterGroups: [],
		},
	};

	const { control, handleSubmit, setValue, watch } = useForm<ProductTemplateCreateFormData>({
		resolver: zodResolver(ProductTemplateCreateResolver),
		defaultValues: defaultValues,
	});

	const {
		fields: filterGroupFields,
		append: appendFilterGroup,
		move: moveFilterGroup,
		remove: removeFilterGroup,
	} = useFieldArray({ control, name: "data.filterGroups" });

	const selectedCategoryId = watch("data.categoryId");
	const selectedFilterGroups = watch("data.filterGroups");
	const selectedPhysicalProperties = watch("data.physicalProperties");

	useEffect(() => {
		const updateLoadedFilterGroups = async () => {
			if (selectedCategoryId !== null) {
				fetchFilterGroupList({ categoryId: selectedCategoryId });
			}
		};
		const resetFilterGroups = () => {
			setValue("data.filterGroups", []);
			updateLoadedFilterGroups();
		};

		resetFilterGroups();
	}, [selectedCategoryId, fetchFilterGroupList, setValue]);

	const handleDragAttribute = ({ source, destination }: DropResult) => {
		if (destination) {
			moveFilterGroup(source.index, destination.index);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === "Enter") {
			const target = event.target as HTMLElement;
			// Allow default behavior for textarea
			if (target.tagName === "TEXTAREA") {
				return; // Do nothing, allow new line
			}
			event.preventDefault(); // Prevent the default form submission for other inputs
			event.stopPropagation(); // Stop the event from bubbling up
		}
	};

	return (
		<>
			<form
				className="gap-2 px-2 pt-2 pb-4 h-100 d-f fd-c of-h"
				onSubmit={handleSubmit(resolvedOnSubmit)}
				onKeyDown={handleKeyDown}
				noValidate
			>
				<div className="gap-1 d-f fd-c">
					<Typography variant="subtitle0">Шаблон</Typography>
					<Controller
						name="title"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<TextField
								{...field}
								label="Название"
								variant="outlined"
								error={!!error}
								helperText={error?.message}
							/>
						)}
					/>
				</div>

				{/* Base data */}
				<div className="gap-1 d-f fd-c">
					<Typography variant="subtitle0">О товаре</Typography>
					<div className="gap-2 d-f fd-c">
						<Controller
							name="data.title"
							control={control}
							render={({ field, fieldState: { error } }) => (
								<TextField
									{...field}
									label="Название"
									variant="outlined"
									error={!!error}
									helperText={error?.message}
								/>
							)}
						/>

						<Controller
							name="data.description"
							control={control}
							render={({ field, fieldState: { error } }) => (
								<TextField
									{...field}
									label="Описание"
									variant="outlined"
									multiline
									rows={4}
									error={!!error}
									helperText={error?.message}
								/>
							)}
						/>

						<Controller
							name="data.categoryId"
							control={control}
							render={({ field, fieldState: { error } }) => (
								<FormControl fullWidth>
									<InputLabel id="category-label">Категория</InputLabel>
									<Select
										labelId="category-label"
										label="Категория"
										fullWidth
										{...field}
										variant="outlined"
										error={!!error}
									>
										{!categoryList || categoryListIsLoading ? (
											<CircularProgress />
										) : (
											categoryList.items.map((category) => (
												<MenuItem key={category.id} value={category.id}>
													<div className="gap-1 ai-c d-f fd-r">
														<div
															className="ai-c d-f fd-c"
															style={{ width: 40, height: 40 }}
														>
															<img
																className="contain"
																src={getImageUrl(category.icon.url, "small")}
															/>
														</div>
														{category.title}
													</div>
												</MenuItem>
											))
										)}
									</Select>
									{error && <FormHelperText>{error?.message}</FormHelperText>}
								</FormControl>
							)}
						/>
					</div>
				</div>

				{/* Physical Properties */}
				<div className="gap-1 d-f fd-c">
					<Typography variant="subtitle0">Физические свойства</Typography>
					<div className="gap-2 d-f fd-c">
						{selectedPhysicalProperties === null ? (
							<Typography variant="body1" sx={{ color: "typography.secondary" }}>
								Товар невозможно опубликовать в розницу без указания физических свойств
							</Typography>
						) : (
							<div className="gap-2 d-f fd-r">
								<Controller
									name="data.physicalProperties.width"
									control={control}
									render={({ field: { onChange, value }, fieldState: { error } }) => (
										<TextField
											type="string"
											label="Ширина, сантиметров"
											variant="outlined"
											fullWidth
											value={value}
											onChange={handleIntChange(onChange)}
											error={!!error}
											helperText={error?.message}
											slotProps={{
												input: {
													endAdornment: <Typography variant="body1">см</Typography>,
												},
											}}
										/>
									)}
								/>

								<Controller
									name="data.physicalProperties.height"
									control={control}
									render={({ field: { onChange, value }, fieldState: { error } }) => (
										<TextField
											type="string"
											label="Высота, сантиметров"
											variant="outlined"
											fullWidth
											value={value}
											onChange={handleIntChange(onChange)}
											error={!!error}
											helperText={error?.message}
											slotProps={{
												input: {
													endAdornment: <Typography variant="body1">см</Typography>,
												},
											}}
										/>
									)}
								/>

								<Controller
									name="data.physicalProperties.length"
									control={control}
									render={({ field: { onChange, value }, fieldState: { error } }) => (
										<TextField
											type="string"
											label="Длина, сантиметров"
											variant="outlined"
											fullWidth
											value={value}
											onChange={handleIntChange(onChange)}
											error={!!error}
											helperText={error?.message}
											slotProps={{
												input: {
													endAdornment: <Typography variant="body1">см</Typography>,
												},
											}}
										/>
									)}
								/>

								<Controller
									name="data.physicalProperties.weight"
									control={control}
									render={({ field: { onChange, value }, fieldState: { error } }) => (
										<TextField
											type="string"
											label="Масса, грамм"
											variant="outlined"
											fullWidth
											value={value}
											onChange={handleIntChange(onChange)}
											error={!!error}
											helperText={error?.message}
											slotProps={{
												input: {
													endAdornment: <Typography variant="body1">г</Typography>,
												},
											}}
										/>
									)}
								/>
							</div>
						)}
					</div>
				</div>

				{/* Attributes */}
				{selectedCategoryId && (
					<div className="gap-1 d-f fd-c">
						<Typography variant="subtitle0">Фильтры</Typography>
						<DragDropContext onDragEnd={handleDragAttribute}>
							<ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
								<Droppable droppableId="attributes">
									{(provided) => (
										<div
											className="gap-1 d-f fd-c"
											{...provided.droppableProps}
											ref={provided.innerRef}
										>
											{filterGroupFields.map((attributeField, index) => (
												<Draggable
													key={`attribute[${index}]`}
													draggableId={`attribute-${index}`}
													index={index}
												>
													{(provided) => (
														<li
															key={attributeField.id}
															ref={provided.innerRef}
															{...provided.draggableProps}
														>
															<div key={index} className="gap-2 w-100 d-f fd-r">
																<IconButton {...provided.dragHandleProps}>
																	<DragIndicator />
																</IconButton>

																<Controller
																	name={`data.filterGroups.${index}`}
																	control={control}
																	render={({
																		field: { onChange, value: filterGroupField },
																		fieldState: { error },
																	}) => (
																		<>
																			<Autocomplete
																				fullWidth
																				value={filterGroupField}
																				onChange={(_e, data) => {
																					onChange(
																						!data
																							? null
																							: {
																									id: data.id,
																									title: data.title,
																									filters: [],
																							  }
																					);
																				}}
																				disableListWrap
																				loading={
																					filterGroupListIsLoading ||
																					filterGroupListIsFetching
																				}
																				options={filterGroupList?.items || []}
																				getOptionDisabled={(option) =>
																					option.id === filterGroupField.id ||
																					selectedFilterGroups.some(
																						(group) =>
																							group.id === option.id
																					)
																				}
																				getOptionLabel={(option) =>
																					option.title
																				}
																				renderInput={(params) => (
																					<TextField
																						{...params}
																						label="Название"
																						error={!!error}
																						helperText={error?.message}
																					/>
																				)}
																			/>
																			<Autocomplete
																				fullWidth
																				multiple
																				loading={
																					filterGroupListIsLoading ||
																					filterGroupListIsFetching
																				}
																				options={
																					filterGroupList?.items.find(
																						(group) =>
																							group.id ===
																							filterGroupField.id
																					)?.filters || []
																				}
																				getOptionDisabled={(option) =>
																					filterGroupField.filters.some(
																						(filter) =>
																							filter.id === option.id
																					)
																				}
																				autoSelect
																				value={filterGroupField.filters}
																				getOptionLabel={(option) =>
																					option.value
																				}
																				onChange={(_, data) => {
																					onChange({
																						...filterGroupField,
																						filters: data,
																					});
																				}}
																				renderTags={(tags, getTagProps) =>
																					tags.map((option, index) => (
																						<Chip
																							variant="outlined"
																							label={option.value}
																							{...getTagProps({ index })}
																							key={index}
																						/>
																					))
																				}
																				renderInput={(params) => (
																					<TextField
																						{...params}
																						label="Значения"
																						variant="outlined"
																						error={!!error}
																						helperText={error?.message}
																					/>
																				)}
																			/>
																		</>
																	)}
																/>

																<IconButton onClick={() => removeFilterGroup(index)}>
																	<Delete />
																</IconButton>
															</div>
														</li>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</ul>
						</DragDropContext>
						<Button
							sx={{ color: "warning.main" }}
							style={{ width: "fit-content" }}
							onClick={() => appendFilterGroup({ id: "", title: "", filters: [] })}
						>
							Добавить фильтр
						</Button>
					</div>
				)}
				<Button type="submit" variant="contained" color="primary">
					Создать
				</Button>
			</form>
		</>
	);
};
