import { Add, Delete } from "@mui/icons-material";
import {
	Button,
	CircularProgress,
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
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { CategoryGet } from "@appTypes/Category";
import { FilterGroupGet } from "@appTypes/Filters";
import { FilterGroupUpdateSchema } from "@schemas/FilterGroup";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface FilterGroupUpdateFormData {
	id: string;
	categoryId: string | null;
	title: string;
	filters: {
		id: string | null;
		value: string;
	}[];
}

const FilterGroupUpdateResolver = z.object({
	id: z.string().min(1),
	categoryId: z.string().nullable(),
	title: z.string().min(1, { message: "Укажите название группы" }),
	filters: z
		.object({
			id: z.string().nullable(),
			value: z.string().min(1, { message: "Укажите значение фильтра" }),
		})
		.array(),
});

interface FilterGroupUpdateFormProps {
	filterGroup: FilterGroupGet;
	onSubmit: (data: z.infer<typeof FilterGroupUpdateSchema>) => void;
	categoryList: { items: CategoryGet[] } | undefined;
	categoryListIsLoading: boolean;
}

export const FilterGroupUpdateForm: React.FC<FilterGroupUpdateFormProps> = ({
	filterGroup,
	onSubmit,
	categoryList,
	categoryListIsLoading,
}) => {
	const resolvedOnSubmit = (data: FilterGroupUpdateFormData) => {
		if (data.categoryId === "FREE") {
			data.categoryId = null
		}
		onSubmit(FilterGroupUpdateSchema.parse(data));
	};

	const { control, handleSubmit } = useForm<FilterGroupUpdateFormData>({
		resolver: zodResolver(FilterGroupUpdateResolver),
		defaultValues: {
			id: filterGroup.id,
			title: filterGroup.title,
			categoryId: filterGroup.category?.id || "FREE",
			filters: filterGroup.filters,
		},
	});

	const filtersFields = useFieldArray({
		control,
		name: "filters",
	});

	const handleAddFilter = () => {
		filtersFields.append({ id: null, value: "" });
	};

	const handleRemoveFilter = (index: number) => {
		filtersFields.remove(index);
	};

	return (
		<form className="h-100 d-f fd-c jc-sb px-2 pt-2 pb-4" onSubmit={handleSubmit(resolvedOnSubmit)}>
			<Controller name="id" control={control} render={({ field }) => <input type="hidden" {...field} />} />
			<Stack direction={"column"} spacing={2} divider={<Divider />}>
				<div className="d-f fd-c gap-2 bg-primary">
					<Typography variant="subtitle0">Группа</Typography>
					<Controller
						name="title"
						control={control}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								label="Название"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
								fullWidth
							/>
						)}
					/>

					<div className="d-f fd-c gap-05">
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
										<MenuItem value="FREE">
											<em>Без привязки</em>
										</MenuItem>
										{!categoryList || categoryListIsLoading ? (
											<CircularProgress />
										) : (
											categoryList.items.map((category) => (
												<MenuItem key={category.id} value={category.id}>
													{category.title}
												</MenuItem>
											))
										)}
									</Select>
									{error && <FormHelperText>{error?.message}</FormHelperText>}
								</FormControl>
							)}
						/>
						<em>
							<Typography variant="subtitle0" sx={{ color: "typography.secondary" }}>
								Категорию нельзя изменить, если фильтры используются в товарах
							</Typography>
						</em>
					</div>
				</div>
				<div className="d-f fd-c gap-2 bg-primary">
					<Typography variant="subtitle0">Фильтры</Typography>
					<div style={{ maxHeight: "440px", paddingTop: "8px", overflowY: "auto" }}>
						<Stack spacing={1} divider={<Divider />}>
							{filtersFields.fields.map((field, index) => (
								<Controller
									key={field.id}
									name={`filters.${index}.value`}
									control={control}
									render={({ field, fieldState }) => (
										<div className="w-100 d-f fd-r ai-c jc-sb">
											<TextField
												{...field}
												label="Значение"
												error={!!fieldState.error}
												helperText={fieldState.error?.message}
												fullWidth
											/>
											<IconButton onClick={() => handleRemoveFilter(index)}>
												<Delete />
											</IconButton>
										</div>
									)}
								/>
							))}
						</Stack>
					</div>
					<IconButton onClick={handleAddFilter}>
						<Add />
					</IconButton>
				</div>
			</Stack>
			<Button type="submit" variant="contained">
				Сохранить
			</Button>
		</form>
	);
};
