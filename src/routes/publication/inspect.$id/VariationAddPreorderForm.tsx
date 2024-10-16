import {
	Autocomplete,
	Button,
	Checkbox,
	Divider,
	FormControlLabel,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useCallback, useEffect, useMemo } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AllInclusive } from "@mui/icons-material";
import { CatalogItemPublishSchema } from "@schemas/CatalogItem";
import { DiscountResolver } from "../utils";
import { ProductGet } from "@appTypes/Product";
import dayjs from "dayjs";
import { getImageUrl } from "@utils/image";
import { handleIntChange } from "@utils/forms";
import { useGetProductListQuery } from "@api/admin/product";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type VariationAddPreorderFormData = {
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
	isCredit: boolean;
	creditDeposit: string | null;
	creditPayments: {
		sum: string;
		deadline: Date | null;
	}[];
};

const VariationAddPreorderResolver = z.object({
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
	creditDeposit: z.coerce
		.number({ message: "Укажите сумму депозита" })
		.positive({ message: "Сумма должна быть положительным числом" }),
	creditPayments: z
		.object({
			sum: z.coerce
				.number({ message: "Укажите сумму кредитного платежа" })
				.positive({ message: "Сумма должна быть положительным числом" }),
			deadline: z.date({ message: "Укажите срок действия кредитного платежа" }),
		})
		.array(),
});

interface VariationAddPreorderFormProps {
	onSubmit: (data: z.infer<typeof CatalogItemPublishSchema>) => void;
	onClose: () => void;
	categoryId: string;
	selectedProducts: ProductGet[];
	maxRating: number;
}

const VariationAddPreorderForm: React.FC<VariationAddPreorderFormProps> = ({
	onSubmit,
	onClose,
	categoryId,
	selectedProducts,
	maxRating,
}) => {
	const { data: productList, isLoading: productListIsLoading } = useGetProductListQuery();

	const availableProducts = useMemo(() => {
		if (!categoryId) return [];
		return productList?.items.filter((product) => product.category.id === categoryId);
	}, [categoryId, productList]);

	const {
		control,
		setValue,
		watch,
		handleSubmit,
		formState: { isDirty },
	} = useForm<VariationAddPreorderFormData>({
		resolver: zodResolver(VariationAddPreorderResolver),
		defaultValues: {
			product: null,
			rating: "",
			price: "",
			quantity: "",
			unlimitedQuantity: false,
			discount: null,
			quantityRestriction: null,
			isCredit: false,
			creditDeposit: null,
			creditPayments: [],
		},
	});

	const formattedOnSubmit = useCallback(
		(data: VariationAddPreorderFormData) => {
			const formattedData = {
				...data,
				productId: data.product?.id,
				creditInfo:
					data.isCredit && data.creditDeposit !== null
						? {
								deposit: data.creditDeposit,
								payments: data.creditPayments.map((payment) => {
									const localDate = payment.deadline;
									return {
										...payment,
										deadline:
											localDate &&
											`${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(
												2,
												"0"
											)}-${String(localDate.getDate()).padStart(2, "0")}`,
									};
								}),
						  }
						: null,
			};
			onSubmit(CatalogItemPublishSchema.parse(formattedData));
		},
		[onSubmit]
	);

	const {
		fields: creditPaymentsFields,
		append: appendCreditPayment,
		remove: removeCreditPayment,
	} = useFieldArray({
		name: `creditPayments`,
		control,
	});

	const isCredit = watch(`isCredit`);
	const creditDeposit = watch(`creditDeposit`);
	const creditPayments = watch(`creditPayments`);

	const quantityIsUnlimited = watch(`unlimitedQuantity`);

	useEffect(() => {
		if (isCredit) {
			const creditTotal =
				(creditDeposit ? Number(creditDeposit) : 0) +
				creditPayments.map((payment) => Number(payment.sum)).reduce((sum, current) => sum + current, 0);

			setValue(`price`, creditTotal.toString());
		}
	}, [setValue, isCredit, creditDeposit, creditPayments]);

	return (
		<form onSubmit={handleSubmit(formattedOnSubmit)} className="gap-2 py-2 w-100 d-f fd-c">
			<div className="gap-1 w-100 d-f fd-c">
				<div className="ai-c d-f fd-r js-sb">
					<Typography variant="h6">{"Добавить вариацию"}</Typography>
				</div>
				<div className="gap-1 w-100 d-f fd-c">
					<Stack direction={"row"} spacing={2} divider={<Divider orientation="vertical" flexItem />}>
						<Controller
							name={`product`}
							control={control}
							render={({ field: { onChange, value }, fieldState: { error } }) => (
								<Autocomplete
									fullWidth
									value={value}
									onChange={(_, data) => onChange(data)}
									options={availableProducts ?? []}
									loading={productListIsLoading}
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
								name={`rating`}
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
								name={`quantity`}
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
													setValue(`unlimitedQuantity`, true);
													setValue(`quantity`, null);
												} else {
													setValue(`unlimitedQuantity`, false);
													setValue(`quantity`, "");
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
							name={`price`}
							control={control}
							render={({ field: { value, onChange }, fieldState: { error } }) => (
								<TextField
									fullWidth
									label="Цена"
									type="text"
									required
									disabled={isCredit}
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
							name={`quantityRestriction`}
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
						<FormControlLabel
							label="Товар в рассрочку"
							control={
								<Checkbox
									checked={isCredit}
									onChange={(_, checked) => {
										if (checked) {
											setValue(`isCredit`, true);
											setValue(`creditDeposit`, "");
											setValue(`creditPayments`, [
												{
													sum: "",
													deadline: null,
												},
											]);
										} else {
											setValue(`isCredit`, false);
											setValue(`creditDeposit`, null);
											setValue(`creditPayments`, []);
										}
									}}
								/>
							}
						/>
						{isCredit && (
							<>
								<Typography>Рассрочка</Typography>
								<div className="gap-1 d-f fd-c">
									<div className="gap-1 d-f fd-r">
										<Controller
											name={`creditDeposit`}
											control={control}
											render={({ field: { value, onChange }, fieldState: { error } }) => (
												<TextField
													label="Депозит"
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
									</div>
									{creditPaymentsFields.map((field, paymentIndex) => (
										<div className="gap-1 d-f fd-r" key={field.id}>
											<Controller
												key={field.id}
												name={`creditPayments.${paymentIndex}.sum`}
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
												name={`creditPayments.${paymentIndex}.deadline`}
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
											{creditPaymentsFields.length > 1 && (
												<Button
													sx={{ color: "error.main" }}
													style={{ width: "fit-content" }}
													onClick={() => removeCreditPayment(paymentIndex)}
												>
													Удалить платеж
												</Button>
											)}
										</div>
									))}
									<Button
										sx={{ color: "success.main" }}
										style={{ width: "fit-content" }}
										onClick={() => appendCreditPayment({ sum: "", deadline: null })}
									>
										{"Добавить платеж"}
									</Button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			<div className="gap-2 d-f fd-r">
				<Button variant="contained" type="submit" disabled={!isDirty}>
					{"Добавить"}
				</Button>
				<Button variant="contained" onClick={onClose} color="error">
					{"Отмена"}
				</Button>
			</div>
		</form>
	);
};

export { VariationAddPreorderForm };
