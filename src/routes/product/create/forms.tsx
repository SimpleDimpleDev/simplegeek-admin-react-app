import {
	Autocomplete,
	Box,
	Button,
	Checkbox,
	Chip,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormHelperText,
	IconButton,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	Snackbar,
	TextField,
	Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Delete, DragIndicator, Edit } from "@mui/icons-material";
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import React, { useEffect } from "react";
import { useGetCategoryListQuery, useLazyGetFilterGroupListQuery } from "@api/admin/service";

import CanvasPreview from "@components/CanvasPreview";
import { Crop } from "react-image-crop";
import Dropzone from "react-dropzone";
import { ImageEditProps } from "@appTypes/Admin";
import { ImageEditPropsSchema } from "@schemas/Admin";
import { ImageEditor } from "@components/ImageEditor";
import type { ProductCreate } from "@appTypes/Product";
import { ProductCreateSchema } from "@schemas/Product";
import { getImageUrl } from "@utils/image";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ImageEditorState = {
	file: File;
	index: number | null;
	properties: ImageEditProps | null;
};

type ProductCreateFormData = {
	title: string;
	description: string;
	categoryId: string;
	physicalProperties: {
		width: string;
		height: string;
		length: string;
		mass: string;
	} | null;
	images: {
		properties: ImageEditProps;
		file: File;
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

const ProductCreateResolver = z.object({
	title: z.string({ message: "Введите название" }).min(1, { message: "Введите название" }),
	description: z.string().nullable(),
	categoryId: z.string({ message: "Выберите категорию" }).min(1, { message: "Выберите категорию" }),
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
			file: z.instanceof(File),
			properties: ImageEditPropsSchema,
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

interface ProductCreateFormProps {
	onSubmit: (data: ProductCreate) => void;
}

export const ProductCreateForm: React.FC<ProductCreateFormProps> = ({ onSubmit }) => {
	const { data: categoryList, isLoading: categoryListIsLoading } = useGetCategoryListQuery();
	const [
		fetchFilterGroupList,
		{ data: filterGroupList, isLoading: filterGroupListIsLoading, isFetching: filterGroupListIsFetching },
	] = useLazyGetFilterGroupListQuery();

	const resolvedOnSubmit = (data: ProductCreateFormData) => {
		onSubmit(ProductCreateSchema.parse(data));
	};

	const defaultValues: ProductCreateFormData = {
		title: "",
		description: "",
		categoryId: "",
		physicalProperties: {
			width: "",
			height: "",
			length: "",
			mass: "",
		},
		images: [],
		filterGroups: [],
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<ProductCreateFormData>({
		resolver: zodResolver(ProductCreateResolver),
		defaultValues: defaultValues,
	});

	const {
		fields: imageFields,
		append: appendImage,
		move: moveImage,
		remove: removeImage,
	} = useFieldArray({ control, name: "images" });

	const {
		fields: filterGroupFields,
		append: appendFilterGroup,
		move: moveFilterGroup,
		remove: removeFilterGroup,
	} = useFieldArray({ control, name: "filterGroups" });

	const selectedCategoryId = watch("categoryId");
	const selectedFilterGroups = watch("filterGroups");
	const selectedPhysicalProperties = watch("physicalProperties");

	const [imageFilesUploadedFlow, setImageFilesUploadedFlow] = useState<File[]>([]);
	const [imageEditor, setImageEditor] = useState<ImageEditorState | null>(null);
	const [imageResolutionTooLowSnackbarOpen, setImageResolutionTooLowSnackbarOpen] = useState(false);

	useEffect(() => {
		const updateLoadedFilterGroups = async () => {
			if (selectedCategoryId !== "") {
				fetchFilterGroupList({ categoryId: selectedCategoryId });
			}
		};
		const resetFilterGroups = () => {
			setValue("filterGroups", []);
			updateLoadedFilterGroups();
		};

		resetFilterGroups();
	}, [selectedCategoryId, fetchFilterGroupList, setValue]);

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

	const handleStartImageEdit = (index: number) => {
		setImageEditor({
			index,
			file: imageFields[index].file,
			properties: imageFields[index].properties,
		});
	};

	const handleStopImageEdit = () => {
		setImageEditor(null);
		setImageFilesUploadedFlow([]);
	};

	const handleEditImage = (scale: number, crop: Crop, file: File) => {
		if (!imageEditor) return;
		if (imageEditor.index === null) {
			appendImage({
				file,
				properties: {
					scale,
					crop,
				},
			});
		} else {
			setValue(`images.${imageEditor.index}.properties.scale`, scale);
			setValue(`images.${imageEditor.index}.properties.crop`, crop);
		}
		const nextImageInFlow = imageFilesUploadedFlow.at(0);
		if (nextImageInFlow) {
			const newEditorState: ImageEditorState = {
				file: nextImageInFlow,
				index: null,
				properties: null,
			};
			setImageFilesUploadedFlow(imageFilesUploadedFlow.slice(1));
			setImageEditor(newEditorState);
		} else {
			setImageEditor(null);
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
		<>
			<Modal
				sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
				open={!!imageEditor}
				onClose={handleStopImageEdit}
			>
				{imageEditor ? (
					<ImageEditor
						file={imageEditor!.file}
						defaultScale={imageEditor!.properties?.scale || 1}
						defaultCrop={imageEditor!.properties?.crop || null}
						cropWidth={630}
						cropHeight={630}
						onConfirm={handleEditImage}
						onImageResolutionTooLow={() => {
							handleStopImageEdit();
							setImageResolutionTooLowSnackbarOpen(true);
						}}
					/>
				) : (
					<></>
				)}
			</Modal>
			<Snackbar
				open={imageResolutionTooLowSnackbarOpen}
				autoHideDuration={2500}
				onClose={() => setImageResolutionTooLowSnackbarOpen(false)}
				message="Не удается загрузить изображение. Минимальный размер - 630x630 px!"
			/>
			<form
				className="w-100 d-f fd-c gap-2"
				onSubmit={handleSubmit(resolvedOnSubmit)}
				onKeyDown={handleKeyDown}
				noValidate
			>
				{/* Base data */}
				<div className="d-f fd-c gap-1 p-3 bg-primary br-3">
					<Typography variant="h5">О товаре</Typography>
					<div className="d-f fd-c gap-2">
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
													<div className="d-f fd-r ai-c gap-1">
														<div
															className="d-f fd-c ai-c"
															style={{ width: 40, height: 40 }}
														>
															<img
																className="contain"
																src={getImageUrl(category.image, "small")}
															/>
														</div>
														{category.title}
													</div>
												</MenuItem>
											))
										)}
									</Select>
									{errors && <FormHelperText>{error?.message}</FormHelperText>}
								</FormControl>
							)}
						/>
					</div>
				</div>

				{/* Physical Properties */}
				<div className="d-f fd-c gap-1 p-3 bg-primary br-3">
					<Typography variant="h5">Физические свойства</Typography>
					<div className="d-f fd-c gap-2">
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

						{selectedPhysicalProperties === null ? (
							<Typography variant="body1" sx={{ color: "typography.secondary" }}>
								Товар невозможно опубликовать в розницу без указания физических свойств
							</Typography>
						) : (
							<div className="d-f fd-r gap-2">
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
										/>
									)}
								/>
							</div>
						)}
					</div>
				</div>

				{/* Images */}
				<div className="d-f fd-c gap-1 p-3 bg-primary br-3">
					<Typography variant="h5">Фото</Typography>

					<Dropzone
						accept={{
							"image/*": [".jpg", ".jpeg", ".png"],
						}}
						multiple={true}
						maxFiles={100}
						onDropAccepted={(files) => {
							if (files.length === 0) return;
							if (files.length > 1) {
								const restFiles = files.slice(1);
								setImageFilesUploadedFlow(restFiles);
							}
							setImageEditor({
								file: files[0],
								index: null,
								properties: null,
							});
						}}
					>
						{({ getRootProps, getInputProps }) => (
							<Box
								sx={{ border: "1px dashed" }}
								{...getRootProps()}
								className="d-f fd-c jc-sb ai-c py-5 br-2"
							>
								<input {...getInputProps()}></input>
								<div className="d-f fd-c gap-2">
									<Typography variant="subtitle0" sx={{ color: "typography.secondary" }}>
										Перетащите сюда фото для загрузки
									</Typography>
									<Button variant="contained">Выберите файлы</Button>
								</div>
							</Box>
						)}
					</Dropzone>

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
									<div
										className="d-f fd-c gap-1"
										{...provided.droppableProps}
										ref={provided.innerRef}
									>
										{imageFields.map((image, index) => (
											<Draggable
												key={`image[${index}]`}
												draggableId={`image-${index}`}
												index={index}
											>
												{(provided) => (
													<li
														key={image.id}
														ref={provided.innerRef}
														{...provided.draggableProps}
													>
														<div
															key={index}
															className="d-f fd-r gap-1 py-1 px-2 br-2 bg-secondary"
														>
															<IconButton {...provided.dragHandleProps}>
																<DragIndicator />
															</IconButton>

															<Controller
																name={`images.${index}`}
																control={control}
																render={({ field: { value: image } }) => (
																	<div className="w-100 d-f fd-r gap-1">
																		<div
																			className="bg-primary"
																			style={{ width: 96, height: 96 }}
																		>
																			<CanvasPreview
																				style={{ width: "100%" }}
																				file={image.file}
																				crop={image.properties.crop}
																				scale={image.properties.scale}
																				rotate={0}
																			/>
																		</div>
																		<div className="d-f fd-c jc-c pl-1">
																			<div className="d-f fd-c gap-05">
																				<Typography variant="body2">
																					{image.file.name}
																				</Typography>
																				<Typography
																					variant="body2"
																					sx={{
																						color: "typography.secondary",
																					}}
																				>
																					{image.file.size}
																				</Typography>
																			</div>
																		</div>
																	</div>
																)}
															/>
															<IconButton onClick={() => handleStartImageEdit(index)}>
																<Edit />
															</IconButton>
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
				{selectedCategoryId && (
					<div className="d-f fd-c gap-1 p-3 bg-primary br-3">
						<Typography variant="h5">Фильтры</Typography>
						<DragDropContext onDragEnd={handleDragAttribute}>
							<ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
								<Droppable droppableId="attributes">
									{(provided) => (
										<div
											className="d-f fd-c gap-1"
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
															<div key={index} className="w-100 d-f fd-r gap-2">
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
																							if (
																								typeof data === "string"
																							) {
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
																								filters:
																									objectTransformedData,
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
				)}
				<Button type="submit" variant="contained" color="primary">
					Submit
				</Button>
			</form>
		</>
	);
};
