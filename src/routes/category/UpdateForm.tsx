import { Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { CategoryGet } from "@appTypes/Category";
import { CategoryUpdateSchema } from "@schemas/Category";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type CategoryUpdateFormData = {
	id: string;
	title: string;
	link: string;
};

const CategoryUpdateResolver = z.object({
	id: z.string().min(1),
	title: z.string().min(1, { message: "Укажите название" }),
	link: z.string().min(1, { message: "Укажите ссылку" }),
});

interface CategoryUpdateFormProps {
	category: CategoryGet;
	onSubmit: (data: z.infer<typeof CategoryUpdateSchema>) => void;
}

export const CategoryUpdateForm: React.FC<CategoryUpdateFormProps> = ({ onSubmit, category }) => {
	const resolvedOnSubmit = (data: CategoryUpdateFormData) => {
		onSubmit(CategoryUpdateSchema.parse(data));
	};
	const {
		control,
		handleSubmit,
		formState: { isDirty },
	} = useForm<CategoryUpdateFormData>({
		resolver: zodResolver(CategoryUpdateResolver),
		defaultValues: {
			id: category.id,
			title: category.title,
			link: category.link,
		},
	});
	return (
		<form className="h-100 d-f fd-c jc-sb px-2 pt-2 pb-4" onSubmit={handleSubmit(resolvedOnSubmit)}>
			<div className="d-f fd-c gap-1">
				<Controller
					name="id"
					control={control}
					render={({ field: { value } }) => <input type="hidden" value={value} />}
				/>

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

				<Controller
					name="link"
					control={control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label="Ссылка"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
						/>
					)}
				/>
			</div>
			<Button disabled={!isDirty} type="submit" variant="contained">
				Сохранить
			</Button>
		</form>
	);
};
