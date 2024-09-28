import {
	Autocomplete,
	Button,
	Checkbox,
	Chip,
	FormControlLabel,
	IconButton,
	TextField,
	Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Delete, DragIndicator } from "@mui/icons-material";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { ProductGet, ProductUpdate } from "@appTypes/Product";
import React, { useEffect, useMemo } from "react";

import { FilterGroupGet } from "@appTypes/Filters";
import { ProductUpdateSchema } from "@schemas/Product";
import { getImageUrl } from "@utils/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ProductUpdateFormData = {
	id: string;
	title: string;
	description: string | null;
	categoryId: string;
	physicalProperties: {
		width: string;
		height: string;
		length: string;
		mass: string;
	} | null;
	images: {
		id: string;
		index: number;
		url: string;
	}[];
	filterGroups: {
		id: string | null;
		title: string;
		filters: {
			id: string | null;
			value: string;
		}[];
	}[];
};

const ProductUpdateResolver = z.object({
	id: z.string(),
	title: z.string({ message: "Введите название" }).min(1, { message: "Введите название" }),
	description: z.string().nullable(),
	categoryId: z.string(),
	physicalProperties: z
		.object({
			width: z.coerce
				.number({ message: "Укажите ширину" })
				.positive({ message: "Ширина должна быть положительным числом" }),
			height: z.coerce
				.number({ message: "Укажите высоту" })
				.positive({ message: "Высота должна быть положительным числом" }),
			length: z.coerce
				.number({ message: "Укажите длину" })
				.positive({ message: "Длина должна быть положительным числом" }),
			mass: z.coerce
				.number({ message: "Укажите массу" })
				.positive({ message: "Масса должна быть положительным числом" }),
		})
		.nullable(),
	images: z
		.object({
			id: z.string(),
			index: z.number(),
			url: z.string(),
		})
		.array(),
	filterGroups: z
		.object({
			id: z.string().nullable(),
			title: z.string({ message: "Введите название фильтра" }).min(1, { message: "Введите название фильтра" }),
			filters: z
				.object({
					id: z.string().nullable(),
					value: z.string({ message: "Введите значение" }).min(1, { message: "Введите значение" }),
				})
				.array()
				.nonempty({
					message: "У фильтра должно быть хотя бы одно значение",
				}),
		})
		.array(),
});

interface ProductUpdateFormProps {
	product: ProductGet;
	filterGroupList: { items: FilterGroupGet[] } | undefined;
	filterGroupListIsLoading: boolean;
	onSubmit: (data: ProductUpdate) => void;
}

export const ProductUpdateForm: React.FC<ProductUpdateFormProps> = ({ product, onSubmit, filterGroupList, filterGroupListIsLoading }) => {
	const resolvedOnSubmit = (data: ProductUpdateFormData) => {
		onSubmit(ProductUpdateSchema.parse(data));
	};

	const physicalPropertiesDefined = useMemo(() => !!product.physicalProperties, [product.physicalProperties]);

	const defaultValues: ProductUpdateFormData = {
		id: product.id,
		title: product.title,
		description: product.description,
		categoryId: product.category.id,
		physicalProperties: product.physicalProperties
			? {
					width: product.physicalProperties.width.toString(),
					height: product.physicalProperties.height.toString(),
					length: product.physicalProperties.length.toString(),
					mass: product.physicalProperties.mass.toString(),
			  }
			: null,
		images: product.images.map((image) => ({
			id: image.id,
			index: image.index,
			url: image.url,
		})),
		filterGroups: product.filterGroups.map((filterGroup) => ({
			id: filterGroup.id,
			title: filterGroup.title,
			filters: filterGroup.filters.map((filter) => ({
				id: filter.id,
				value: filter.value,
			})),
		})),
	};

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors, isDirty },
		watch,
	} = useForm<ProductUpdateFormData>({
		resolver: zodResolver(ProductUpdateResolver),
		defaultValues,
	});

	const {
		fields: imageFields,
		move: moveImage,
		remove: removeImage,
	} = useFieldArray({
		control,
		name: "images",
	});

	const {
		fields: filterGroupFields,
		append: appendFilterGroup,
		move: moveFilterGroup,
		remove: removeFilterGroup,
	} = useFieldArray({ control, name: "filterGroups" });

	useEffect(() => {
		setValue("images", product.images.map((image) => ({ id: image.id, index: image.index, url: image.url })));
	}, [product, setValue]);

	const selectedFilterGroups = watch("filterGroups");
	const selectedPhysicalProperties = watch("physicalProperties");

	const handleDragAttribute = ({ source, destination }: DropResult) => {
		if (destination) {
			moveFilterGroup(source.index, destination.index);
		}
	};

	const handleDragImage = ({ source, destination }: DropResult) => {
		if (destination) {
			moveImage(source.index, destination.index);
		}
	};

	const handleIntChange =
		(onChange: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			if (!onChange) return;
			const { value } = e.target;
			// Allow empty input
			if (value === "") {
				onChange("");
				return;
			}
			// Validate the input value
			const intRegex = /^-?\d*$/;
			if (intRegex.test(value)) {
				onChange(value);
			}
		};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
		}
	};

	return (
		<form
			className="gap-2 w-100 d-f fd-c"
			onSubmit={handleSubmit(resolvedOnSubmit)}
			onKeyDown={handleKeyDown}
			noValidate
		>
			<Controller
				name="id"
				control={control}
				render={({ field }) => <input type="hidden" value={field.value} />}
			/>
			{/* Base data */}
			<div className="gap-2 bg-primary p-3 br-3 d-f fd-c">
				<Typography variant="h5">О товаре</Typography>
				<div className="gap-2 d-f fd-c">
					<Controller
						name="title"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Название"
								variant="outlined"
								error={!!errors.title}
								helperText={errors.title?.message}
							/>
						)}
					/>

					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Описание"
								variant="outlined"
								multiline
								rows={4}
								error={!!errors.description}
								helperText={errors.description?.message}
							/>
						)}
					/>

					<Controller
						name="categoryId"
						control={control}
						render={({ field }) => <input type="hidden" value={field.value} onChange={() => null} />}
					/>
				</div>
			</div>

			{/* Physical Properties */}
			<div className="gap-2 bg-primary p-3 br-3 d-f fd-c">
				<Typography variant="h5">Физические свойства</Typography>
				<div className="gap-2 d-f fd-c">
					{!physicalPropertiesDefined && (
						<Controller
							name="physicalProperties"
							control={control}
							render={({ field }) => (
								<FormControlLabel
									control={
										<Checkbox
											checked={field.value === null}
											onChange={(_, value) => {
												if (value) {
													field.onChange(null);
												} else {
													field.onChange({
														width: "",
														height: "",
														length: "",
														mass: "",
													});
												}
											}}
											inputProps={{ "aria-label": "controlled" }}
										/>
									}
									label="Неизвестны"
								/>
							)}
						/>
					)}

					{selectedPhysicalProperties === null ? (
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							Товар невозможно опубликовать в розницу без указания физических свойств
						</Typography>
					) : (
						<div className="gap-2 d-f fd-r">
							<Controller
								name="physicalProperties.width"
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
											}
										}}
									/>
								)}
							/>

							<Controller
								name="physicalProperties.height"
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
											}
										}}
									/>
								)}
							/>

							<Controller
								name="physicalProperties.length"
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
											}
										}}
									/>
								)}
							/>

							<Controller
								name="physicalProperties.mass"
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
											}
										}}
									/>
								)}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Images */}
			<div className="gap-1 bg-primary p-3 br-3 d-f fd-c">
				<Typography variant="h5">Фото</Typography>

				<div className="pt-1">
					<Typography variant="h6">Порядок отображения фотографий товара</Typography>
					<Typography variant="body1" sx={{ color: "typography.secondary" }}>
						Первая фотография является главной и будет отображаться на карточке товара
					</Typography>
					<Typography variant="body2" sx={{ color: "typography.secondary" }}>
						Для смены перетащите файл на нужное место
					</Typography>
				</div>

				<DragDropContext onDragEnd={handleDragImage}>
					<ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
						<Droppable droppableId="images">
							{(provided) => (
								<div className="gap-1 d-f fd-c" {...provided.droppableProps} ref={provided.innerRef}>
									{imageFields.map((image, index) => (
										<Draggable key={`image[${index}]`} draggableId={`image-${index}`} index={index}>
											{(provided) => (
												<li key={image.id} ref={provided.innerRef} {...provided.draggableProps}>
													<div
														key={index}
														className="gap-1 bg-secondary px-2 py-1 br-2 d-f fd-r"
													>
														<IconButton {...provided.dragHandleProps}>
															<DragIndicator />
														</IconButton>

														<Controller
															name={`images.${index}`}
															control={control}
															render={({ field: { value: image } }) => (
																<div className="gap-1 w-100 d-f fd-r">
																	<div
																		className="bg-primary"
																		style={{ width: 96, height: 96 }}
																	>
																		<img
																			src={getImageUrl(image.url, "small")}
																			style={{
																				width: "100%",
																				height: "100%",
																				objectFit: "cover",
																			}}
																		/>
																	</div>
																</div>
															)}
														/>
														<IconButton onClick={() => removeImage(index)}>
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
			</div>

			{/* Attributes */}

			<div className="gap-1 bg-primary p-3 br-3 d-f fd-c">
				<Typography variant="h5">Фильтры</Typography>
				<DragDropContext onDragEnd={handleDragAttribute}>
					<ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
						<Droppable droppableId="attributes">
							{(provided) => (
								<div className="gap-1 d-f fd-c" {...provided.droppableProps} ref={provided.innerRef}>
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
															name={`filterGroups.${index}`}
															control={control}
															render={({
																field: { onChange, value: filterGroupField },
																fieldState: { error },
															}) => (
																<>
																	<Autocomplete
																		fullWidth
																		freeSolo
																		value={filterGroupField.title || ""}
																		autoSelect
																		onChange={(_e, data, reason) => {
																			switch (reason) {
																				case "selectOption": {
																					if (
																						data &&
																						typeof data !== "string"
																					) {
																						onChange({
																							id: data.id,
																							title: data.title,
																							filters: [],
																						});
																					}
																					break;
																				}
																				case "createOption": {
																					onChange({
																						id: null,
																						title: data,
																						filters: [],
																					});
																					break;
																				}
																				case "clear": {
																					onChange({
																						id: null,
																						title: "",
																						filters: [],
																					});
																					break;
																				}
																				case "blur": {
																					if (!data) return;
																					if (typeof data === "string") {
																						console.log(
																							"string input",
																							data
																						);
																						onChange({
																							id: null,
																							title: data,
																							filters: [],
																						});
																					} else {
																						if (
																							data.id !==
																							filterGroupField.id
																						) {
																							onChange({
																								id: data.id,
																								title: data.title,
																								filters: [],
																							});
																						}
																					}

																					console.log(
																						typeof filterGroupField
																					);
																					break;
																				}
																			}
																		}}
																		disableListWrap
																		loading={filterGroupListIsLoading}
																		options={filterGroupList?.items || []}
																		getOptionDisabled={(option) =>
																			option.id === filterGroupField.id ||
																			selectedFilterGroups.some(
																				(group) => group.id === option.id
																			)
																		}
																		getOptionLabel={(option) => {
																			if (typeof option === "string") {
																				return option;
																			} else {
																				return option.title;
																			}
																		}}
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
																		loading={filterGroupListIsLoading}
																		options={
																			filterGroupList?.items.find(
																				(group) =>
																					group.id === filterGroupField.id
																			)?.filters || []
																		}
																		getOptionDisabled={(option) =>
																			filterGroupField.filters.some(
																				(filter) => filter.id === option.id
																			)
																		}
																		freeSolo
																		autoSelect
																		value={filterGroupField.filters}
																		getOptionLabel={(option) => {
																			if (typeof option === "string") {
																				return option;
																			} else {
																				return option.value;
																			}
																		}}
																		onChange={(_, data, reason) => {
																			switch (reason) {
																				case "createOption":
																				case "blur": {
																					const objectTransformedData =
																						data.map((filter) => {
																							return typeof filter ===
																								"string"
																								? {
																										id: null,
																										value: filter,
																								  }
																								: filter;
																						});
																					onChange({
																						...filterGroupField,
																						filters: objectTransformedData,
																					});
																					break;
																				}
																				default: {
																					onChange({
																						...filterGroupField,
																						filters: data,
																					});
																					break;
																				}
																			}
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
					onClick={() => appendFilterGroup({ id: null, title: "", filters: [] })}
				>
					Добавить фильтр
				</Button>
			</div>

			<Button disabled={!isDirty} type="submit" variant="contained" color="primary">
				Submit
			</Button>
		</form>
	);
};
