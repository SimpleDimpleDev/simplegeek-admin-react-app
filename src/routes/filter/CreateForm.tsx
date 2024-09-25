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
import { FilterGroupCreateSchema } from "@schemas/FilterGroup";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface FilterGroupCreateFormData {
	title: string;
	categoryId: string;
	filters: { value: string }[];
}

const FilterGroupCreateResolver = z.object({
	title: z.string().min(1, { message: "Укажите название" }),
	categoryId: z.string({ message: "Выберите категорию" }).min(1, { message: "Выберите категорию" }),
	filters: z
		.object({ value: z.string({ message: "Укажите значение" }).min(1, { message: "Укажите значение" }) })
		.array(),
});

interface FilterGroupCreateFormProps {
	onSubmit: (data: z.infer<typeof FilterGroupCreateSchema>) => void;
	categoryList: { items: CategoryGet[] } | undefined;
	categoryListIsLoading: boolean;
}

const FilterGroupCreateForm: React.FC<FilterGroupCreateFormProps> = ({
	onSubmit,
	categoryList,
	categoryListIsLoading,
}) => {
	const { control, handleSubmit } = useForm<FilterGroupCreateFormData>({
		resolver: zodResolver(FilterGroupCreateResolver),
		defaultValues: {
			title: "",
			categoryId: "",
			filters: [{ value: "" }],
		},
	});

	const filtersFields = useFieldArray({
		control,
		name: "filters",
	});

	return (
		<form className="h-100 d-f fd-c jc-sb px-2 pt-2 pb-4" onSubmit={handleSubmit(onSubmit)}>
			<Stack direction={"column"} spacing={2} divider={<Divider />}>
				<div className="d-f fd-c gap-2 bg-primary">
					<Typography variant="subtitle0">Группа</Typography>
					<Controller
						name="title"
						control={control}
						defaultValue={""}
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

					<Controller
						name="categoryId"
						control={control}
						defaultValue={""}
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
				</div>
				<div className="d-f fd-c gap-2 bg-primary">
					<Typography variant="subtitle0">Фильтры</Typography>
					<Stack spacing={1} divider={<Divider />}>
						{filtersFields.fields.map((field, index) => (
							<Controller
								key={field.id}
								name={`filters.${index}.value`}
								control={control}
								defaultValue={""}
								render={({ field, fieldState }) => (
									<div className="w-100 d-f fd-r ai-c jc-sb">
										<TextField
											{...field}
											label="Значение"
											error={!!fieldState.error}
											helperText={fieldState.error?.message}
											fullWidth
										/>
										<IconButton onClick={() => filtersFields.remove(index)}>
											<Delete />
										</IconButton>
									</div>
								)}
							/>
						))}
					</Stack>
					<IconButton onClick={() => filtersFields.append({ value: "" })}>
						<Add />
					</IconButton>
				</div>
			</Stack>
			<Button type="submit" variant="contained">
				Создать
			</Button>
		</form>
	);
};

export { FilterGroupCreateForm };
