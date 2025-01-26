import {
	Autocomplete,
	Button,
	Checkbox,
	CircularProgress,
	Divider,
	FormControl,
	FormControlLabel,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Switch,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { Control, Controller, FieldErrors, UseFormWatch, useFieldArray, useForm } from "react-hook-form";
import { Delete, DragIndicator, Shortcut } from "@mui/icons-material";
import { DiscountResolver, SlugResolver } from "../../utils";
import {
	DragDropContext,
	Draggable,
	DraggableProvidedDragHandleProps,
	DropResult,
	Droppable,
} from "react-beautiful-dnd";
import { useCallback, useEffect, useMemo } from "react";

import { CategoryGet } from "@appTypes/Category";
import { ProductGet } from "@appTypes/Product";
import { PublicationCreate } from "@appTypes/Publication";
import { PublicationCreateSchema } from "@schemas/Publication";
import { generateLink } from "@utils/lexical";
import { getImageUrl } from "@utils/image";
import { handleIntChange } from "@utils/forms";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface getDefaultFormValuesArgs {
	products: ProductGet[];
	productIds?: string[];
}

const getDefaultFormValues = ({ products, productIds }: getDefaultFormValuesArgs) => {
	const defaultValues: PublicationCreateStockFormData = {
		link: null,
		categoryId: null,
		shippingCostIncluded: null,
		items: [],
		isActive: true,
	};

	if (productIds) {
		let categoryId;
		const productsToAdd: ProductGet[] = [];

		for (const productId of productIds) {
			const product = products.find((product) => product.id === productId);
			if (product) {
				const productCategoryId = product.category.id;
				if (categoryId) {
					if (categoryId !== productCategoryId) {
						break;
					}
				} else {
					categoryId = productCategoryId;
				}
				productsToAdd.push(product);
			}
		}
		if (productsToAdd.at(0)?.title) {
			defaultValues.link = generateLink(productsToAdd[0].title);
		}
		defaultValues.categoryId = categoryId || null;
		defaultValues.items = productsToAdd.map((product) => ({
			product,
			rating: "0",
			price: "",
			discount: null,
			quantity: "",
			quantityRestriction: null,
		}));
	}
	if (defaultValues.items.length === 0) {
		defaultValues.items.push({
			product: null,
			rating: "0",
			price: "",
			discount: null,
			quantity: "",
			quantityRestriction: null,
		});
	}
	return defaultValues;
};

type CatalogItemPublishStockFormData = {
	product: ProductGet | null;
	rating: string;
	price: string;
	quantity: string;
	discount: {
		type: "FIXED" | "PERCENTAGE";
		value: string;
	} | null;
	quantityRestriction: string | null;
};

const CatalogItemPublishStockResolver = z.object({
	product: z.object({ id: z.string({ message: "Выберите продукт" }) }, { message: "Выберите продукт" }),
	rating: z.coerce
		.number({ message: "Укажите рейтинг" })
		.nonnegative({ message: "Рейтинг не может быть отрицательным числом" }),
	price: z.coerce.number({ message: "Укажите цену" }).positive({ message: "Цена должна быть положительным числом" }),
	quantity: z.coerce
		.number({ message: "Укажите количество" })
		.nonnegative({ message: "Количество не может быть отрицательным числом" }),
	discount: DiscountResolver.nullable(),
	quantityRestriction: z.coerce
		.number()
		.positive({ message: "Ограничение должно быть положительным числом" })
		.nullable(),
});

type PublicationCreateStockFormData = {
	link: string | null;
	categoryId: string | null;
	shippingCostIncluded: null;
	items: CatalogItemPublishStockFormData[];
	isActive: boolean;
};

const PublicationCreateStockResolver = z.object({
	link: SlugResolver,
	categoryId: z.string({ message: "Выберите категорию" }).min(1, { message: "Выберите категорию" }),
	shippingCostIncluded: z.null(),
	items: CatalogItemPublishStockResolver.array().nonempty({
		message: "У публикации должен быть хотя бы один товар",
	}),
	isActive: z.boolean(),
});

interface ItemFormProps {
	index: number;
	watch: UseFormWatch<PublicationCreateStockFormData>;
	control: Control<PublicationCreateStockFormData>;
	errors: FieldErrors<PublicationCreateStockFormData>;
	dragHandleProps: DraggableProvidedDragHandleProps | undefined | null;
	isSingle: boolean;
	onRemove: (index: number) => void;
	availableProducts: ProductGet[];
	productsLoading: boolean;
	selectedProducts: ProductGet[];
	maxRating: number;
}

const ItemForm: React.FC<ItemFormProps> = ({
	index,
	watch,
	control,
	errors,
	dragHandleProps,
	isSingle,
	onRemove,
	availableProducts,
	productsLoading,
	selectedProducts,
	maxRating,
}) => {
	const discountValueError = errors.items?.[index]?.discount?.value?.message;

	const discount = watch(`items.${index}.discount`);
	const priceString = watch(`items.${index}.price`);

	const priceAfterDiscount = useMemo(() => {
		if (!discount) return null;
		const discountValueString = discount.value;
		const price = parseInt(priceString) ?? 0;
		const discountValue = parseInt(discountValueString) ?? 0;
		if (isNaN(discountValue) || isNaN(price)) return null;
		if (discount.type === "FIXED") {
			return price - discountValue;
		}
		return Math.ceil(price - price * (discountValue / 100));
	}, [discount, priceString]);

	return (
		<div key={index} className="gap-2 py-2 w-100 d-f fd-r">
			<IconButton {...dragHandleProps}>
				<DragIndicator />
			</IconButton>

			<div className="gap-1 w-100 d-f fd-c">
				<div className="ai-c d-f fd-r js-sb">
					<Typography variant="h6">{!isSingle ? `Вариация ${index + 1}` : "Товар"}</Typography>
					<IconButton disabled={isSingle} onClick={() => onRemove(index)}>
						<Delete />
					</IconButton>
				</div>
				<Stack direction={"row"} spacing={2} divider={<Divider orientation="vertical" flexItem />}>
					<Controller
						name={`items.${index}.product`}
						control={control}
						render={({ field: { onChange, value }, fieldState: { error } }) => (
							<Autocomplete
								fullWidth
								value={value}
								onChange={(_, data) => onChange(data)}
								options={availableProducts}
								loading={productsLoading}
								getOptionDisabled={(option) => selectedProducts.includes(option)}
								isOptionEqualToValue={(a, b) => a.id === b.id}
								getOptionLabel={(option) => option.title}
								renderOption={(props, option) => (
									<li className="gap-1 d-f fd-r" {...props}>
										<div
											style={{
												height: 40,
												width: 40,
												borderRadius: 6,
												overflow: "hidden",
											}}
										>
											<img
												src={getImageUrl(option.images.at(0)?.url ?? "", "small")}
												className="contain"
											/>
										</div>
										{option.title}
									</li>
								)}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Продукт"
										required
										error={!!error}
										helperText={error?.message}
									/>
								)}
							/>
						)}
					/>

					<div className="gap-05 w-100 d-f fd-c">
						<Controller
							name={`items.${index}.rating`}
							control={control}
							render={({ field: { value, onChange }, fieldState: { error } }) => (
								<TextField
									fullWidth
									label="рейтинг"
									type="text"
									required
									value={value}
									onChange={handleIntChange(onChange)}
									variant="outlined"
									error={!!error}
									helperText={error?.message}
								/>
							)}
						/>
						<Typography variant="caption" sx={{ color: "typography.secondary" }}>
							<em>Текущий максимальный рейтинг: {maxRating}</em>
						</Typography>
					</div>

					<Controller
						name={`items.${index}.quantity`}
						control={control}
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<TextField
								fullWidth
								label="Количество"
								type="text"
								required
								value={value}
								onChange={handleIntChange(onChange)}
								variant="outlined"
								error={!!error}
								helperText={error?.message}
								slotProps={{
									input: {
										endAdornment: <InputAdornment position="end">шт</InputAdornment>,
									},
								}}
							/>
						)}
					/>

					<Controller
						name={`items.${index}.price`}
						control={control}
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<TextField
								fullWidth
								label="Цена"
								type="text"
								required
								value={isNaN(parseInt(value)) ? "" : value}
								onChange={handleIntChange(onChange)}
								variant="outlined"
								error={!!error}
								helperText={error?.message}
								slotProps={{
									input: {
										endAdornment: <InputAdornment position="end">₽</InputAdornment>,
									},
								}}
							/>
						)}
					/>

					<Controller
						name={`items.${index}.discount`}
						control={control}
						render={({ field: { value: discount, onChange: onDiscountChange }, fieldState: { error } }) => (
							<div className="gap-05 w-100 d-f fd-c">
								<TextField
									fullWidth
									label="Скидка"
									type="text"
									disabled={discount === null}
									value={discount ? discount.value : "-"}
									onChange={handleIntChange((value) => onDiscountChange({ ...discount, value }))}
									variant="outlined"
									error={!!error}
									helperText={discountValueError || error?.message}
									slotProps={{
										input: {
											endAdornment: discount && (
												<InputAdornment position="end">
													{discount.type === "PERCENTAGE" ? "%" : "₽"}
												</InputAdornment>
											),
										},
									}}
								/>
								<div className="ai-c d-f fd-r jc-sb">
									<Checkbox
										checked={discount !== null}
										onChange={(_, checked) => {
											if (checked) {
												onDiscountChange({ type: "FIXED", value: "" });
											} else {
												onDiscountChange(null);
											}
										}}
									/>
									<div className="gap-05 ai-c d-f fd-r">
										<Typography variant="body2">₽</Typography>
										<Switch
											disabled={discount === null}
											checked={discount?.type === "PERCENTAGE"}
											onChange={(_, checked) =>
												onDiscountChange({ type: checked ? "PERCENTAGE" : "FIXED", value: "" })
											}
										/>
										<Typography variant="body2">%</Typography>
									</div>
									{discount && <Typography variant="body2">Итог: {priceAfterDiscount}₽</Typography>}
								</div>
							</div>
						)}
					/>
					<Controller
						name={`items.${index}.quantityRestriction`}
						control={control}
						render={({
							field: { value: quantityRestriction, onChange: onQuantityRestrictionChange },
							fieldState: { error },
						}) => (
							<div className="gap-05 w-100 d-f fd-c">
								<TextField
									fullWidth
									label="Ограничение на аккаунт"
									type="text"
									disabled={quantityRestriction === null}
									value={quantityRestriction ?? "-"}
									onChange={handleIntChange(onQuantityRestrictionChange)}
									variant="outlined"
									error={!!error}
									helperText={error?.message}
									slotProps={{
										input: {
											endAdornment: "шт.",
										},
									}}
								/>
								<div className="ai-c d-f fd-r jc-sb">
									<Checkbox
										checked={quantityRestriction !== null}
										onChange={(_, checked) => {
											if (checked) {
												onQuantityRestrictionChange("");
											} else {
												onQuantityRestrictionChange(null);
											}
										}}
									/>
								</div>
							</div>
						)}
					/>
				</Stack>
			</div>
		</div>
	);
};

type PublicationCreateStockFormProps = {
	productList?: { items: ProductGet[] } | undefined;
	productListIsLoading: boolean;
	categoryList?: { items: CategoryGet[] } | undefined;
	categoryListIsLoading: boolean;
	onSubmit: (data: PublicationCreate) => void;
	productIds?: string[];
	maxRating?: number;
};

export const PublicationCreateStockForm: React.FC<PublicationCreateStockFormProps> = ({
	productList,
	productListIsLoading,
	categoryList,
	categoryListIsLoading,
	onSubmit,
	productIds,
	maxRating,
}) => {
	const formattedOnSubmit = useCallback(
		(data: PublicationCreateStockFormData) => {
			const formattedData = {
				...data,
				preorderId: null,
				items: data.items.map((itemVariation) => ({
					...itemVariation,
					productId: itemVariation.product?.id,
					creditInfo: null,
				})),
			};
			onSubmit(PublicationCreateSchema.parse(formattedData));
		},
		[onSubmit]
	);

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<PublicationCreateStockFormData>({
		resolver: zodResolver(PublicationCreateStockResolver),
		defaultValues: getDefaultFormValues({ products: productList?.items || [], productIds }),
	});

	const {
		fields: variations,
		append: appendVariation,
		move: moveVariation,
		remove: removeVariation,
	} = useFieldArray({ control, name: "items" });

	const publishActive = watch("isActive");

	const currentCategoryId = watch("categoryId");
	const availableProducts = useMemo(() => {
		if (!currentCategoryId) return [];
		return productList?.items.filter((product) => product.category.id === currentCategoryId);
	}, [currentCategoryId, productList]);

	const selectedProducts = watch("items")
		.map((itemVariation) => itemVariation.product)
		.filter((item) => item !== null);

	useEffect(() => {
		for (let i = 0; i < variations.length; i++) {
			const item = watch(`items.${i}`);
			if (item.product && item.product.category.id !== currentCategoryId) {
				setValue(`items.${i}.product`, null);
			}
		}
	}, [currentCategoryId, setValue, variations, watch]);

	const handleDragItemVariation = ({ source, destination }: DropResult) => {
		if (destination) {
			moveVariation(source.index, destination.index);
		}
	};

	return (
		<form className="gap-2 w-100 d-f fd-c" onSubmit={handleSubmit(formattedOnSubmit)} noValidate>
			<div className="gap-1 bg-primary p-3 br-3 d-f fd-c">
				<div className="gap-2 d-f fd-r">
					<Controller
						name="link"
						control={control}
						render={({ field: { value, onChange: onLinkChange }, fieldState: { error } }) => (
							<div className="gap-1 w-100 d-f fd-r">
								<TextField
									value={value}
									onChange={(e) => onLinkChange(e.target.value)}
									label="Ссылка"
									required
									variant="outlined"
									fullWidth
									error={!!error}
									helperText={error?.message}
								/>
								<Tooltip title="Сгенерировать ссылку на основании названия продукта">
									<IconButton
										onClick={() => {
											const product = watch("items").at(0)?.product;
											if (product) {
												onLinkChange(generateLink(product.title));
											}
										}}
									>
										<Shortcut />
									</IconButton>
								</Tooltip>
							</div>
						)}
					/>

					<Controller
						name="categoryId"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<FormControl fullWidth required>
								<InputLabel id="category-label">Категория</InputLabel>
								<Select
									labelId="category-label"
									label="Категория"
									variant="outlined"
									fullWidth
									{...field}
									error={!!error}
								>
									{!categoryList || categoryListIsLoading ? (
										<CircularProgress />
									) : (
										categoryList?.items.map((category) => (
											<MenuItem key={category.id} value={category.id}>
												{category.title}
											</MenuItem>
										))
									)}
								</Select>
								<FormHelperText error={!!error}>{error?.message}</FormHelperText>
							</FormControl>
						)}
					/>
				</div>
			</div>
			<div className="gap-1 bg-primary p-3 br-3 d-f fd-c">
				<DragDropContext onDragEnd={handleDragItemVariation}>
					<ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
						<Droppable droppableId="variations">
							{(provided) => (
								<Stack divider={<Divider />} {...provided.droppableProps} ref={provided.innerRef}>
									{variations.map((item, index) => (
										<Draggable
											key={`itemVariation[${index}]`}
											draggableId={`itemVariation-${index}`}
											index={index}
										>
											{(provided) => (
												<li key={item.id} ref={provided.innerRef} {...provided.draggableProps}>
													<ItemForm
														index={index}
														control={control}
														watch={watch}
														errors={errors}
														dragHandleProps={provided.dragHandleProps}
														isSingle={variations.length === 1}
														onRemove={removeVariation}
														availableProducts={availableProducts || []}
														productsLoading={productListIsLoading}
														selectedProducts={selectedProducts}
														maxRating={maxRating ?? 0}
													/>
												</li>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</Stack>
							)}
						</Droppable>
					</ul>
				</DragDropContext>
				<Button
					sx={{ color: "warning.main" }}
					style={{ width: "fit-content" }}
					onClick={() =>
						appendVariation({
							product: null,
							rating: "0",
							price: "",
							discount: null,
							quantity: "",
							quantityRestriction: null,
						})
					}
				>
					Добавить вариацию
				</Button>
			</div>
			<div className="gap-1 bg-primary p-3 br-3 d-f fd-r">
				<Button type="submit" variant="contained">
					{publishActive ? "Опубликовать" : "Создать"}
				</Button>
				<Controller
					name="isActive"
					control={control}
					render={({ field: { value: isActive, onChange: onActiveChange } }) => (
						<FormControlLabel
							value={!isActive}
							onChange={(_, checked) => {
								if (checked) {
									onActiveChange(false);
								} else {
									onActiveChange(true);
								}
							}}
							control={<Checkbox />}
							label="Создать без публикации"
						/>
					)}
				/>
			</div>
		</form>
	);
};
