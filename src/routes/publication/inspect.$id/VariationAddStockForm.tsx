import {
	Autocomplete,
	Button,
	Checkbox,
	Divider,
	FormControlLabel,
	InputAdornment,
	Stack,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useMemo } from "react";

import { CatalogItemPublishSchema } from "@schemas/CatalogItem";
import { DiscountResolver } from "../utils";
import { ProductGet } from "@appTypes/Product";
import { getImageUrl } from "@utils/image";
import { handleIntChange } from "@utils/forms";
import { useGetProductListQuery } from "@api/admin/product";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type VariationAddStockFormData = {
	product: ProductGet | null;
	rating: string;
	price: string;
	quantity: string;
	discount: {
		type: "FIXED" | "PERCENTAGE";
		value: string;
	} | null;
	quantityRestriction: string | null;
	isActive: boolean;
};

const VariationAddStockResolver = z.object({
	product: z.object({ id: z.string({ message: "Выберите продукт" }) }, { message: "Выберите продукт" }),
	rating: z.coerce
		.number({ message: "Укажите рейтинг" })
		.nonnegative({ message: "Рейтинг не может быть отрицательным числом" }),
	price: z.coerce.number({ message: "Укажите цену" }).positive({ message: "Цена должна быть положительным числом" }),
	quantity: z.coerce
		.number({ message: "Укажите количество" })
		.positive({ message: "Количество должно быть положительным числом" }),
	discount: DiscountResolver.nullable(),
	quantityRestriction: z.coerce
		.number()
		.positive({ message: "Количество должно быть положительным числом" })
		.nullable(),
	isActive: z.boolean({ message: "Укажите активность" }),
});

interface VariationAddStockFormProps {
	onSubmit: (data: z.infer<typeof CatalogItemPublishSchema>, isActive: boolean) => void;
	onClose: () => void;
	categoryId: string;
	selectedProducts: ProductGet[];
	maxRating: number;
}

const VariationAddStockForm: React.FC<VariationAddStockFormProps> = ({
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
		watch,
		handleSubmit,
		formState: { isDirty, errors },
	} = useForm<VariationAddStockFormData>({
		resolver: zodResolver(VariationAddStockResolver),
		defaultValues: {
			product: null,
			rating: "",
			price: "",
			quantity: "",
			discount: null,
			quantityRestriction: null,
			isActive: true,
		},
	});

	const formattedOnSubmit = useCallback(
		(data: VariationAddStockFormData) => {
			const formattedData = {
				...data,
				productId: data.product?.id,
				creditInfo: null,
			};
			onSubmit(CatalogItemPublishSchema.parse(formattedData), data.isActive);
		},
		[onSubmit]
	);

	const discountValueError = errors.discount?.value?.message;

	const discount = watch(`discount`);
	const priceString = watch(`price`);

	const addActive = watch(`isActive`);

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
		<form onSubmit={handleSubmit(formattedOnSubmit)} className="gap-2 py-2 w-100 d-f fd-c">
			<div className="gap-1 w-100 d-f fd-c">
				<div className="ai-c d-f fd-r js-sb">
					<Typography variant="h6">{"Добавить вариацию"}</Typography>
				</div>
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

					<Controller
						name={`quantity`}
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
						name={`price`}
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
						name={`discount`}
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
			</div>
			<div className="gap-2 d-f fd-r">
				<Button variant="contained" onClick={onClose} color="error">
					{"Отмена"}
				</Button>
				<Button variant="contained" type="submit" disabled={!isDirty}>
					{addActive ? "Добавить" : "Создать"}
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
							label="Создать скрытой"
						/>
					)}
				/>
			</div>
		</form>
	);
};

export { VariationAddStockForm };
