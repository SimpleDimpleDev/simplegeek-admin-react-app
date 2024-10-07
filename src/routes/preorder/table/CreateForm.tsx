import "dayjs/locale/ru";

import { Button, Divider, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PreorderCreateSchema } from "@schemas/Preorder";
import dayjs from "dayjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type PreorderCreateFormData = {
	title: string;
	expectedArrival: Date | null;
};

const PreorderCreateResolver = z.object({
	title: z.string().min(1, { message: "Укажите название" }),
	expectedArrival: z.date().nullable(),
});

interface PreorderCreateFormProps {
	onSubmit: (data: z.infer<typeof PreorderCreateSchema>) => void;
}

const PreorderCreateForm: React.FC<PreorderCreateFormProps> = ({ onSubmit }) => {
	const resolvedOnSubmit = (data: PreorderCreateFormData) => {
		onSubmit(PreorderCreateSchema.parse(data));
	};

	const {
		control,
		handleSubmit,
		formState: { isDirty },
	} = useForm<PreorderCreateFormData>({
		resolver: zodResolver(PreorderCreateResolver),
		defaultValues: {
			title: "",
			expectedArrival: null,
		},
	});
	return (
		<form className="px-2 pt-2 pb-4 h-100 d-f fd-c jc-sb" onSubmit={handleSubmit(resolvedOnSubmit)}>
			<Stack direction={"column"} spacing={2} divider={<Divider />}>
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
					name="expectedArrival"
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
			</Stack>
			<Button disabled={!isDirty} type="submit" variant="contained">
				Создать
			</Button>
		</form>
	);
};

export { PreorderCreateForm };
