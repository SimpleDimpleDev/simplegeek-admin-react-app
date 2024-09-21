import {
	Autocomplete,
	Button,
	Divider,
	FormControl,
	FormHelperText,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { Control, Controller, UseFormSetValue, UseFormWatch, useFieldArray, useForm } from "react-hook-form";
import { Delete, DragIndicator } from "@mui/icons-material";
import {
	DragDropContext,
	Draggable,
	DraggableProvidedDragHandleProps,
	DropResult,
	Droppable,
} from "react-beautiful-dnd";
import { useCallback, useEffect, useMemo } from "react";
import { useGetCategoryListQuery, useGetProductListQuery } from "@api/admin/service";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PreorderGet } from "@appTypes/Preorder";
import { ProductGet } from "@appTypes/Product";
import { PublicationCreate } from "@appTypes/Publication";
import dayjs from "dayjs";
import { getImageUrl } from "@utils/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ShippingCostIncluded = "FOREIGN" | "FULL" | "NOT";

type CatalogItemPublishPreorderFormData = {
	product: ProductGet | null;
	price: number | null;
	quantity: number | null;
	discount: number | null;
	creditPayments: {
		sum: number | null;
		deadline: Date | null;
	}[];
};

const CatalogItemPublishPreorderResolver = z.object({
	product: z.object({ id: z.string({ message: "Выберите продукт" }) }, { message: "Выберите продукт" }),
	price: z.number({ message: "Укажите цену" }).positive({ message: "Цена должна быть положительным числом" }),
	quantity: z.number().positive({ message: "Количество должно быть положительным числом" }).nullable(),
	discount: z.number().positive({ message: "Скидка должна быть положительным числом" }).nullable(),
	creditPayments: z
		.object({
			sum: z
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
};

const PublicationCreatePreorderResolver = z.object({
	link: z
		.string({ message: "Введите ссылку для отображения в каталоге" })
		.min(1, { message: "Введите ссылку для отображения в каталоге" }),
	preorderId: z.string({ message: "Выберите предзаказ" }).min(1, { message: "Выберите предзаказ" }),
	categoryId: z.string({ message: "Выберите категорию" }).min(1, { message: "Выберите категорию" }),
	items: CatalogItemPublishPreorderResolver.array().nonempty({
		message: "У публикации должен быть хотя бы один товар",
	}),
	shippingCostIncluded: z.enum(["FOREIGN", "FULL", "NOT"]).nullable(),
});

interface ItemFormProps {
	index: number;
	control: Control<PublicationCreatePreorderFormData>;
	setValue: UseFormSetValue<PublicationCreatePreorderFormData>;
	watch: UseFormWatch<PublicationCreatePreorderFormData>;
	dragHandleProps: DraggableProvidedDragHandleProps | undefined | null;
	isSingle: boolean;
	onRemove: (index: number) => void;
	availableProducts: ProductGet[];
	productsLoading: boolean;
	selectedProducts: ProductGet[];
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
	const creditPaymentsTotal = creditPayments.reduce((acc, { sum }) => acc + (sum ?? 0), 0);

	useEffect(() => {
		if (creditPayments.length > 0) {
			setValue(`items.${index}.price`, creditPaymentsTotal);
		}
	}, [creditPaymentsTotal, index, setValue, creditPayments.length]);

	return (
		<div key={index} className="w-100 d-f fd-r gap-2 py-2">
			<IconButton {...dragHandleProps}>
				<DragIndicator />
			</IconButton>

			<div className="w-100 d-f fd-c gap-1">
				<div className="d-f fd-r js-sb ai-c">
					<Typography variant="h6">{!isSingle ? `Вариация ${index + 1}` : "Товар"}</Typography>
					<IconButton onClick={() => onRemove(index)}>
						<Delete />
					</IconButton>
				</div>
				<div className="d-f fd-r gap-2 pb-2">
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
									<li className="d-f fd-r gap-1" {...props}>
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

					<Controller
						name={`items.${index}.quantity`}
						control={control}
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<TextField
								fullWidth
								label="Ограничение по количеству"
								type="text"
								value={value?.toString() || ""}
								onChange={(e) => {
									const newValue = e.target.value;
									if (newValue === "" || /^\d+$/.test(newValue)) {
										const parsedValue = newValue === "" ? null : parseInt(newValue, 10);
										onChange(parsedValue);
									}
								}}
								variant="outlined"
								error={!!error}
								helperText={error?.message}
							/>
						)}
					/>
				</div>
				<div className="d-f fd-r gap-2">
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
								value={value?.toString() || ""}
								onChange={(e) => {
									const newValue = e.target.value;
									if (newValue === "" || /^\d+$/.test(newValue)) {
										const parsedValue = newValue === "" ? null : parseInt(newValue, 10);
										onChange(parsedValue);
									}
								}}
								variant="outlined"
								error={!!error}
								helperText={error?.message}
							/>
						)}
					/>

					<Controller
						name={`items.${index}.discount`}
						control={control}
						render={({ field: { value, onChange }, fieldState: { error } }) => (
							<TextField
								fullWidth
								label="Скидка"
								type="text"
								disabled
								value={value}
								onChange={(e) => {
									const value = parseInt(e.target.value, 10);
									if (!isNaN(value)) {
										onChange(value);
									}
								}}
								variant="outlined"
								error={!!error}
								helperText={error?.message}
							/>
						)}
					/>
				</div>
				<div className="d-f fd-c gap-2">
					<div className="d-f fd-c gap-2">
						{creditPaymentsFields.length > 0 && (
							<>
								<Typography>Платежи рассрочки</Typography>
								<div className="d-f fd-c gap-1">
									{creditPaymentsFields.map((field, paymentIndex) => (
										<div className="d-f fd-r gap-1" key={field.id}>
											<Controller
												key={field.id}
												name={`items.${index}.creditPayments.${paymentIndex}.sum`}
												control={control}
												render={({ field: { value, onChange }, fieldState: { error } }) => (
													<TextField
														label="Сумма"
														type="text"
														value={value?.toString() || ""}
														onChange={(e) => {
															const newValue = e.target.value;
															if (newValue === "" || /^\d+$/.test(newValue)) {
																const parsedValue =
																	newValue === "" ? null : parseInt(newValue, 10);
																onChange(parsedValue);
															}
														}}
														variant="outlined"
														error={!!error}
														helperText={error?.message}
													/>
												)}
											/>

											<Controller
												key={field.id}
												name={`items.${index}.creditPayments.${paymentIndex}.deadline`}
												control={control}
												render={({ field: { value, onChange } }) => (
													<LocalizationProvider dateAdapter={AdapterDayjs}>
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
							onClick={() => appendCreditPayment({ sum: null, deadline: null })}
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
	};

	if (productIds) {
		defaultValues.items = products
			.filter((product) => productIds.includes(product.id))
			.map((product) => ({
				product,
				price: null,
				discount: null,
				quantity: null,
				creditPayments: [],
			}));
	} else {
		defaultValues.items.push({
			product: null,
			price: null,
			discount: null,
			quantity: null,
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
	onSubmit: (data: PublicationCreate) => void;
	onDirty: () => void;
	productIds?: string[];
	preorderId?: string;
};

export const PublicationCreatePreorderForm: React.FC<PublicationCreatePreorderFormProps> = ({
	onSubmit,
	onDirty,
	productIds,
	preorderId,
}) => {
	const formattedOnSubmit = useCallback(
		(data: PublicationCreatePreorderFormData) => {
			const formattedData = {
				link: data.link,
				categoryId: data.categoryId,
				preorderId: data.preorderId,
				shippingCostIncluded: data.shippingCostIncluded,
				items: data.items.map((itemVariation) => ({
					productId: itemVariation.product?.id,
					price: itemVariation.price,
					discount: itemVariation.discount,
					quantity: itemVariation.quantity,
					creditInfo: {
						payments: itemVariation.creditPayments,
					},
				})),
			};
			onSubmit(formattedData as PublicationCreate);
		},
		[onSubmit]
	);

	const { data: productList, isLoading: productListIsLoading } = useGetProductListQuery();
	const { data: categoryList, isLoading: categoryListIsLoading } = useGetCategoryListQuery();
	const { data: preorderList, isLoading: preorderListIsLoading } = {
		data: { items: [] as PreorderGet[] },
		isLoading: true,
	};

	const {
		control,
		handleSubmit,
		formState: { isDirty },
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
		fields: items,
		append: appendVariation,
		move: moveVariation,
		remove: removeVariation,
	} = useFieldArray({ control, name: "items" });

	useEffect(() => {
		if (isDirty) {
			onDirty();
		}
	}, [isDirty, onDirty]);

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

	const handleDragItemVariation = ({ source, destination }: DropResult) => {
		if (destination) {
			moveVariation(source.index, destination.index);
		}
	};

	return (
		<form className="w-100 d-f fd-c gap-2" onSubmit={handleSubmit(formattedOnSubmit)} noValidate>
			<div className="d-f fd-c gap-1 p-3 bg-primary br-3">
				<div className="d-f fd-r gap-2">
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
									<LoadingSpinner isLoading={categoryListIsLoading}>
										{categoryList?.items.map((category) => (
											<MenuItem key={category.id} value={category.id}>
												{category.title}
											</MenuItem>
										))}
									</LoadingSpinner>
								</Select>
								<FormHelperText error={!!error}>{error?.message}</FormHelperText>
							</FormControl>
						)}
					/>
				</div>
				<div className="d-f fd-r gap-2">
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
									<LoadingSpinner isLoading={preorderListIsLoading}>
										{preorderList?.items.map((preorder) => (
											<MenuItem key={preorder.id} value={preorder.id}>
												{preorder.title}
											</MenuItem>
										))}
									</LoadingSpinner>
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
			<div className="d-f fd-c gap-1 p-3 bg-primary br-3">
				<DragDropContext onDragEnd={handleDragItemVariation}>
					<ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
						<Droppable droppableId="variations">
							{(provided) => (
								<Stack divider={<Divider />} {...provided.droppableProps} ref={provided.innerRef}>
									{items.map((item, index) => (
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
														dragHandleProps={provided.dragHandleProps}
														isSingle={items.length === 1}
														onRemove={removeVariation}
														availableProducts={availableProducts || []}
														productsLoading={productListIsLoading}
														selectedProducts={selectedProducts}
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
							price: null,
							discount: null,
							quantity: null,
							creditPayments: [],
						})
					}
				>
					Добавить вариацию
				</Button>
			</div>
			<div className="d-f fd-r gap-1 p-3 bg-primary br-3">
				<Button variant="outlined">Сохранить черновик</Button>
				<Button type="submit" variant="contained">
					Опубликовать
				</Button>
			</div>
		</form>
	);
};
