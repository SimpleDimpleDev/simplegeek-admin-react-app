import "react-image-crop/dist/ReactCrop.css";

import {
	Autocomplete,
	Box,
	Button,
	Chip,
	CircularProgress,
	FormControl,
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
import React, { useCallback, useEffect, useRef } from "react";

import CanvasPreview from "@components/CanvasPreview";
import { CategoryGet } from "@appTypes/Category";
import { Crop } from "react-image-crop";
import Dropzone from "react-dropzone";
import { FilterGroupGet } from "@appTypes/Filters";
import { ImageEditProps } from "@appTypes/Admin";
import { ImageEditPropsSchema } from "@schemas/Admin";
import { ImageEditor } from "@components/ImageEditor";
import type { ProductCreate } from "@appTypes/Product";
import { ProductCreateSchema } from "@schemas/Product";
import { ProductTemplateGet } from "@appTypes/ProductTemplate";
import { getImageUrl } from "@utils/image";
import { handleIntChange } from "@utils/forms";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// TODO: preorder feature
// Checkbox,
// FormControlLabel,

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
		weight: string;
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
			weight: z.coerce
				.number({ message: "Укажите массу" })
				.positive({ message: "Масса должна быть положительным числом" }),
		})
		.nullable(),
	images: z
		.object({
			file: z.instanceof(File),
			properties: ImageEditPropsSchema,
		})
		.array()
		.nonempty({ message: "Добавьте хотя бы одну картинку" }),
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
	templateList?: { items: ProductTemplateGet[] } | undefined;
	templateListIsLoading?: boolean;
	categoryList?: { items: CategoryGet[] } | undefined;
	categoryListIsLoading?: boolean;
	fetchFilterGroupList: (data: { categoryId: string }) => void;
	filterGroupList?: { items: FilterGroupGet[] } | undefined;
	filterGroupListIsLoading?: boolean;
	filterGroupListIsFetching?: boolean;
}

export const ProductCreateForm: React.FC<ProductCreateFormProps> = ({
	onSubmit,
	templateList,
	templateListIsLoading,
	categoryList,
	categoryListIsLoading,
	fetchFilterGroupList,
	filterGroupList,
	filterGroupListIsLoading,
	filterGroupListIsFetching,
}) => {
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
			weight: "",
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

	const [selectedTemplate, setSelectedTemplate] = useState<ProductTemplateGet | null>(null);

	const [imageFilesUploadedFlow, setImageFilesUploadedFlow] = useState<File[]>([]);
	const [imageEditor, setImageEditor] = useState<ImageEditorState | null>(null);
	const [imageResolutionTooLowSnackbarOpen, setImageResolutionTooLowSnackbarOpen] = useState(false);

	const usingTemplate = useRef(false);

	useEffect(() => {
		const updateLoadedFilterGroups = async () => {
			if (selectedCategoryId !== "") {
				fetchFilterGroupList({ categoryId: selectedCategoryId });
			}
		};
		const resetFilterGroups = () => {
			if (usingTemplate.current) {
				usingTemplate.current = false;
			} else {
				setValue("filterGroups", []);
			}
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

	const handleUseTemplate = useCallback(() => {
		if (!selectedTemplate) return;
		usingTemplate.current = true;
		if (selectedTemplate.data.categoryId) setValue("categoryId", selectedTemplate.data.categoryId);
		if (selectedTemplate.data.title) setValue("title", selectedTemplate.data.title);
		if (selectedTemplate.data.description) setValue("description", selectedTemplate.data.description);
		if (selectedTemplate.data.physicalProperties)
			setValue("physicalProperties", {
				width: selectedTemplate.data.physicalProperties.width.toString(),
				height: selectedTemplate.data.physicalProperties.height.toString(),
				length: selectedTemplate.data.physicalProperties.length.toString(),
				weight: selectedTemplate.data.physicalProperties.weight.toString(),
			});
		if (selectedTemplate.data.filterGroups.length) setValue("filterGroups", selectedTemplate.data.filterGroups);
		setSelectedTemplate(null);
	}, [selectedTemplate, setValue]);

	return (
		<>
			<div className="gap-2 bg-primary pr-1 ai-c br-2 d-f fd-r ps-a" style={{ right: "24px", minWidth: 400 }}>
				<Select
					autoFocus
					fullWidth
					value={selectedTemplate?.id}
					onChange={(event) => {
						setSelectedTemplate(
							templateList?.items.find((template) => template.id === event.target.value) || null
						);
					}}
					variant="outlined"
				>
					{!templateList || templateListIsLoading ? (
						<CircularProgress />
					) : (
						templateList.items.map((template) => (
							<MenuItem key={template.id} value={template.id}>
								<div className="gap-1 ai-c d-f fd-r">{template.title}</div>
							</MenuItem>
						))
					)}
				</Select>
				<Button variant="contained" disabled={!selectedTemplate} onClick={handleUseTemplate}>
					Применить
				</Button>
			</div>

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
				className="gap-2 w-100 d-f fd-c"
				onSubmit={handleSubmit(resolvedOnSubmit)}
				onKeyDown={handleKeyDown}
				noValidate
			>
				{/* Base data */}
				<div className="gap-1 bg-primary p-3 br-3 d-f fd-c">
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
									{errors && <FormHelperText>{error?.message}</FormHelperText>}
								</FormControl>
							)}
						/>
					</div>
				</div>

				{/* Physical Properties */}
				<div className="gap-1 bg-primary p-3 br-3 d-f fd-c">
					<Typography variant="h5">Физические свойства</Typography>
					<div className="gap-2 d-f fd-c">
						{/* TODO: Preorder feature */}
						{/* <Controller
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
														weight: "",
													});
												}
											}}
											inputProps={{ "aria-label": "controlled" }}
										/>
									}
									label="Неизвестны"
								/>
							)}
						/> */}

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
												},
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
												},
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
												},
											}}
										/>
									)}
								/>

								<Controller
									name="physicalProperties.weight"
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

				{/* Images */}
				<div className="gap-1 bg-primary p-3 br-3 d-f fd-c">
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
								className="py-5 ai-c br-2 d-f fd-c jc-sb"
							>
								<input {...getInputProps()}></input>
								<div className="gap-2 d-f fd-c">
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
						{errors.images && (
							<Typography sx={{ color: "typography.error" }} variant="body2">
								{errors.images.message}
							</Typography>
						)}
					</div>

					<DragDropContext onDragEnd={handleDragImage}>
						<ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
							<Droppable droppableId="images">
								{(provided) => (
									<div
										className="gap-1 d-f fd-c"
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
																			<CanvasPreview
																				style={{ width: "100%" }}
																				file={image.file}
																				crop={image.properties.crop}
																				scale={image.properties.scale}
																				rotate={0}
																			/>
																		</div>
																		<div className="pl-1 d-f fd-c jc-c">
																			<div className="gap-05 d-f fd-c">
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
					<div className="gap-1 bg-primary p-3 br-3 d-f fd-c">
						<Typography variant="h5">Фильтры</Typography>
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
																												id:
																													filterGroupField.filters.find(
																														(
																															groupFilter
																														) =>
																															groupFilter.value ===
																															filter
																													)
																														?.id ||
																													null,
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
					Создать
				</Button>
			</form>
		</>
	);
};
