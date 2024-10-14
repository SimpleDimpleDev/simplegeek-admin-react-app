import "dayjs/locale/ru";

import { AllInclusive, Delete, DragIndicator } from "@mui/icons-material";
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
	TextField,
	Typography,
} from "@mui/material";
import {
	Control,
	Controller,
	FieldErrors,
	UseFormSetValue,
	UseFormWatch,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { DiscountResolver, SlugResolver } from "../utils";
import {
	DragDropContext,
	Draggable,
	DraggableProvidedDragHandleProps,
	DropResult,
	Droppable,
} from "react-beautiful-dnd";
import { useCallback, useEffect, useMemo } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CategoryGet } from "@appTypes/Category";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PreorderGet } from "@appTypes/Preorder";
import { ProductGet } from "@appTypes/Product";
import { PublicationCreate } from "@appTypes/Publication";
import { PublicationCreateSchema } from "@schemas/Publication";
import dayjs from "dayjs";
import { getImageUrl } from "@utils/image";
import { handleIntChange } from "@utils/forms";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

dayjs.extend(utc);
dayjs.extend(tz);

type ShippingCostIncluded = "FOREIGN" | "FULL" | "NOT";

type CatalogItemPublishPreorderFormData = {
	product: ProductGet | null;
	rating: string;
	price: string;
	quantity: string | null;
	unlimitedQuantity: boolean;
	discount: {
		type: "FIXED" | "PERCENTAGE";
		value: string;
	} | null;
	quantityRestriction: string | null;
	creditPayments: {
		sum: string;
		deadline: Date | null;
	}[];
};

const CatalogItemPublishPreorderResolver = z.object({
	product: z.object({ id: z.string({ message: "Выберите продукт" }) }, { message: "Выберите продукт" }),
	rating: z.coerce
		.number({ message: "Укажите рейтинг" })
		.nonnegative({ message: "Рейтинг не может быть отрицательным числом" }),
	price: z.coerce.number({ message: "Укажите цену" }).positive({ message: "Цена должна быть положительным числом" }),
	quantity: z.coerce.number().positive({ message: "Количество должно быть положительным числом" }).nullable(),
	discount: DiscountResolver.nullable(),
	quantityRestriction: z.coerce
		.number()
		.positive({ message: "Количество должно быть положительным числом" })
		.nullable(),
	creditPayments: z
		.object({
			sum: z.coerce
				.number({ message: "Укажите сумму кредитного платежа" })
				.positive({ message: "Сумма должна быть положительным числом" }),
			deadline: z.date({ message: "Укажите срок действия кредитного платежа" }),
		})
		.array(),
});

type PublicationCreatePreorderFormData = {
	link: string | null;
	preorderId: string | null;
	categoryId: string | null;
	items: CatalogItemPublishPreorderFormData[];
	shippingCostIncluded: ShippingCostIncluded | null;
	isActive: boolean;
};

const PublicationCreatePreorderResolver = z.object({
	link: SlugResolver,
	preorderId: z.string({ message: "Выберите предзаказ" }).min(1, { message: "Выберите предзаказ" }),
	categoryId: z.string({ message: "Выберите категорию" }).min(1, { message: "Выберите категорию" }),
	items: CatalogItemPublishPreorderResolver.array().nonempty({
		message: "У публикации должен быть хотя бы один товар",
	}),
	shippingCostIncluded: z.enum(["FOREIGN", "FULL", "NOT"], {
		message: "Укажите, включена ли стоимость доставки в цену товаров",
	}),
	isActive: z.boolean(),
});

interface ItemFormProps {
	index: number;
	control: Control<PublicationCreatePreorderFormData>;
	setValue: UseFormSetValue<PublicationCreatePreorderFormData>;
	watch: UseFormWatch<PublicationCreatePreorderFormData>;
	errors: FieldErrors<PublicationCreatePreorderFormData>;
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
	control,
	setValue,
	watch,
	dragHandleProps,
	isSingle,
	onRemove,
	availableProducts,
	productsLoading,
	selectedProducts,
	maxRating,
}) => {
	const {
		fields: creditPaymentsFields,
		append: appendCreditPayment,
		remove: removeCreditPayment,
	} = useFieldArray({
		name: `items.${index}.creditPayments`,
		control,
	});

	const creditPayments = watch(`items.${index}.creditPayments`);
	const creditPaymentsTotal = creditPayments.reduce((acc, { sum }) => acc + (parseInt(sum) ?? 0), 0);

	const quantityIsUnlimited = watch(`items.${index}.unlimitedQuantity`);

	useEffect(() => {
		if (creditPayments.length > 0) {
			setValue(`items.${index}.price`, creditPaymentsTotal.toString());
		}
	}, [creditPaymentsTotal, index, setValue, creditPayments.length]);

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

					<div className="gap-05 w-100 d-f fd-c">
						<Controller
							name={`items.${index}.quantity`}
							control={control}
							render={({ field: { value, onChange }, fieldState: { error } }) => (
								<TextField
									fullWidth
									disabled={quantityIsUnlimited}
									label="Количество"
									type="text"
									value={value === null ? "" : value}
									slotProps={{
										input: {
											endAdornment: quantityIsUnlimited ? (
												<AllInclusive />
											) : (
												<InputAdornment position="end">шт.</InputAdornment>
											),
										},
									}}
									onChange={handleIntChange(onChange)}
									variant="outlined"
									error={!!error}
									helperText={error?.message}
								/>
							)}
						/>
						<div className="w-100">
							<FormControlLabel
								control={
									<Checkbox
										checked={quantityIsUnlimited}
										onChange={(_, value) => {
											if (value) {
												setValue(`items.${index}.unlimitedQuantity`, true);
												setValue(`items.${index}.quantity`, null);
											} else {
												setValue(`items.${index}.unlimitedQuantity`, false);
												setValue(`items.${index}.quantity`, "");
											}
										}}
										inputProps={{ "aria-label": "controlled" }}
									/>
								}
								label="Количество не ограничено"
							/>
						</div>
					</div>

					<Controller
						name={`items.${index}.price`}
						control={control}
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<TextField
								fullWidth
								label="Цена"
								type="text"
								required
								disabled={creditPayments?.length > 0}
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

				<div className="gap-2 d-f fd-c">
					<div className="gap-2 d-f fd-c">
						{creditPaymentsFields.length > 0 && (
							<>
								<Typography>Платежи рассрочки</Typography>
								<div className="gap-1 d-f fd-c">
									{creditPaymentsFields.map((field, paymentIndex) => (
										<div className="gap-1 d-f fd-r" key={field.id}>
											<Controller
												key={field.id}
												name={`items.${index}.creditPayments.${paymentIndex}.sum`}
												control={control}
												render={({ field: { value, onChange }, fieldState: { error } }) => (
													<TextField
														label="Сумма"
														type="text"
														value={value}
														onChange={handleIntChange(onChange)}
														variant="outlined"
														error={!!error}
														helperText={error?.message}
														slotProps={{
															input: {
																endAdornment: (
																	<InputAdornment position="end">₽</InputAdornment>
																),
															},
														}}
													/>
												)}
											/>

											<Controller
												key={field.id}
												name={`items.${index}.creditPayments.${paymentIndex}.deadline`}
												control={control}
												render={({ field: { value, onChange } }) => (
													<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
														<DatePicker
															value={dayjs(value)}
															onChange={(newValue) => {
																onChange(newValue?.toDate());
															}}
														/>
													</LocalizationProvider>
												)}
											/>

											<Button
												sx={{ color: "error.main" }}
												style={{ width: "fit-content" }}
												onClick={() => removeCreditPayment(paymentIndex)}
											>
												Удалить
											</Button>
										</div>
									))}
								</div>
							</>
						)}

						<Button
							sx={{ color: "success.main" }}
							style={{ width: "fit-content" }}
							onClick={() => appendCreditPayment({ sum: "", deadline: null })}
						>
							{creditPaymentsFields.length === 0 ? "Товар в рассрочку" : "Добавить платеж"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

interface getDefaultFormValuesArgs {
	products: ProductGet[];
	productIds?: string[];
	preorders: PreorderGet[];
	preorderId?: string;
}

const getDefaultFormValues = ({ products, productIds, preorders, preorderId }: getDefaultFormValuesArgs) => {
	const defaultValues: PublicationCreatePreorderFormData = {
		link: null,
		categoryId: null,
		preorderId: null,
		shippingCostIncluded: null,
		items: [],
		isActive: true,
	};

	if (productIds) {
		let categoryId;
		const productsToAdd: ProductGet[] = [];

		for (const product of products) {
			if (productIds.includes(product.id)) {
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
		defaultValues.categoryId = categoryId || null;
		defaultValues.items = productsToAdd.map((product) => ({
			product,
			rating: "0",
			price: "",
			unlimitedQuantity: false,
			quantity: "",
			discount: null,
			quantityRestriction: null,
			creditPayments: [],
		}));
	} else {
		defaultValues.items.push({
			product: null,
			rating: "0",
			price: "",
			unlimitedQuantity: false,
			quantity: "",
			discount: null,
			quantityRestriction: null,
			creditPayments: [],
		});
	}

	if (preorderId) {
		const selectedPreorder = preorders.find((preorder) => preorder.id === preorderId);
		if (selectedPreorder) {
			defaultValues.preorderId = selectedPreorder.id;
		}
	}

	return defaultValues;
};

type PublicationCreatePreorderFormProps = {
	productList?: { items: ProductGet[] } | undefined;
	productListIsLoading: boolean;
	categoryList?: { items: CategoryGet[] } | undefined;
	categoryListIsLoading: boolean;
	preorderList?: { items: PreorderGet[] } | undefined;
	preorderListIsLoading: boolean;
	onSubmit: (data: PublicationCreate) => void;
	onDirty: () => void;
	productIds?: string[];
	preorderId?: string;
	maxRating?: number;
};

export const PublicationCreatePreorderForm: React.FC<PublicationCreatePreorderFormProps> = ({
	productList,
	productListIsLoading,
	categoryList,
	categoryListIsLoading,
	preorderList,
	preorderListIsLoading,
	onSubmit,
	onDirty,
	productIds,
	preorderId,
	maxRating,
}) => {
	const formattedOnSubmit = useCallback(
		(data: PublicationCreatePreorderFormData) => {
			const formattedData = {
				...data,
				items: data.items.map((itemVariation) => ({
					...itemVariation,
					productId: itemVariation.product?.id,
					creditInfo: {
						payments: itemVariation.creditPayments.map((payment) => {
							const localDate = payment.deadline;
							return {
								...payment,
								deadline:
									localDate &&
									`${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`,
							};
						}),
					},
				})),
			};
			onSubmit(PublicationCreateSchema.parse(formattedData));
		},
		[onSubmit]
	);

	const {
		control,
		handleSubmit,
		formState: { isDirty, errors },
		setValue,
		watch,
	} = useForm<PublicationCreatePreorderFormData>({
		resolver: zodResolver(PublicationCreatePreorderResolver),
		defaultValues: getDefaultFormValues({
			products: productList?.items || [],
			productIds,
			preorders: preorderList?.items || [],
			preorderId,
		}),
	});

	const {
		fields: variations,
		append: appendVariation,
		move: moveVariation,
		remove: removeVariation,
	} = useFieldArray({ control, name: "items" });

	useEffect(() => {
		if (isDirty) {
			onDirty();
		}
	}, [isDirty, onDirty]);

	const publishActive = watch("isActive");

	const currentCategoryId = watch("categoryId");
	const availableProducts = useMemo(() => {
		if (!currentCategoryId) return [];
		return productList?.items.filter((product) => product.category.id === currentCategoryId);
	}, [currentCategoryId, productList]);

	const currentItems = watch("items");
	const selectedProducts = useMemo(
		() => currentItems.map((itemVariation) => itemVariation.product).filter((item) => item !== null),
		[currentItems]
	);

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
						render={({ field, fieldState: { error } }) => (
							<TextField
								{...field}
								label="Ссылка"
								required
								variant="outlined"
								fullWidth
								error={!!error}
								helperText={error?.message}
							/>
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

					<Controller
						name="preorderId"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<FormControl fullWidth required>
								<InputLabel id="preorder-label">Предзаказ</InputLabel>
								<Select
									labelId="preorder-label"
									label="Предзаказ"
									variant="outlined"
									fullWidth
									{...field}
									error={!!error}
								>
									{!preorderList || preorderListIsLoading ? (
										<CircularProgress />
									) : (
										preorderList?.items.map((preorder) => (
											<MenuItem key={preorder.id} value={preorder.id}>
												{preorder.title}
											</MenuItem>
										))
									)}
								</Select>
								<FormHelperText error={!!error}>{error?.message}</FormHelperText>
							</FormControl>
						)}
					/>

					<Controller
						name={`shippingCostIncluded`}
						control={control}
						render={({ field, fieldState: { error } }) => (
							<FormControl fullWidth required>
								<InputLabel id={`delivery-cost-included-label`}>
									Стоимость доставки включена в цену
								</InputLabel>
								<Select
									labelId={`delivery-cost-included-label`}
									label="Стоимость доставки включена в цену"
									variant="outlined"
									fullWidth
									{...field}
									error={!!error}
								>
									<MenuItem key={"NOT"} value={"NOT"}>
										Нет
									</MenuItem>
									<MenuItem key={"FOREIGN"} value={"FOREIGN"}>
										До зарубежного склада
									</MenuItem>
									<MenuItem key={"FULL"} value={"FULL"}>
										Полная
									</MenuItem>
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
														setValue={setValue}
														watch={watch}
														errors={errors}
														dragHandleProps={provided.dragHandleProps}
														isSingle={variations.length === 1}
														onRemove={removeVariation}
														availableProducts={availableProducts || []}
														productsLoading={productListIsLoading}
														selectedProducts={selectedProducts}
														maxRating={maxRating || 0}
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
							unlimitedQuantity: false,
							quantity: "",
							discount: null,
							quantityRestriction: null,
							creditPayments: [],
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
