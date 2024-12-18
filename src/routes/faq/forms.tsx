import { Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FAQItemCreateSchema, FAQItemUpdateSchema } from "@schemas/FAQ";

import { FAQItemGet } from "@appTypes/FAQ";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type FaqItemCreateFormData = z.infer<typeof FAQItemCreateSchema>;
export type FaqItemUpdateFormData = z.infer<typeof FAQItemUpdateSchema>;

export const FAQItemCreateForm = ({ onSubmit }: { onSubmit: (data: FaqItemCreateFormData) => void }) => {
	const { control, handleSubmit } = useForm<FaqItemCreateFormData>({ resolver: zodResolver(FAQItemCreateSchema) });
	return (
		<form className="px-2 pt-2 pb-4 h-100 d-f fd-c jc-sb" onSubmit={handleSubmit(onSubmit)}>
			<div className="gap-1 d-f fd-c">
				<Controller
					name="question"
					control={control}
					defaultValue={""}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label="Вопрос"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
						/>
					)}
				/>

				<Controller
					name="answer"
					control={control}
					defaultValue={""}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label="Ответ"
							multiline
							rows={4}
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
						/>
					)}
				/>
			</div>
			<Button type="submit" variant="contained">
				Сохранить
			</Button>
		</form>
	);
};

export const FAQItemUpdateForm = ({
	itemToUpdate,
	onSubmit,
}: {
	itemToUpdate: FAQItemGet;
	onSubmit: (data: FaqItemUpdateFormData) => void;
}) => {
	const {
		control,
		handleSubmit,
		formState: { isDirty },
	} = useForm<FaqItemUpdateFormData>({
		resolver: zodResolver(FAQItemUpdateSchema),
		defaultValues: {
			id: itemToUpdate.id,
		},
	});

	return (
		<form className="px-2 pt-2 pb-4 h-100 d-f fd-c jc-sb" onSubmit={handleSubmit(onSubmit)}>
			<div className="gap-1 d-f fd-c">
				<Controller
					name="question"
					control={control}
					defaultValue={itemToUpdate.question}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label="Вопрос"
							multiline
							rows={4}
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
							fullWidth
						/>
					)}
				/>

				<Controller
					name="answer"
					control={control}
					defaultValue={itemToUpdate.answer}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label="Ответ"
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
