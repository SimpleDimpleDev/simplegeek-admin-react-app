import { Button, Checkbox, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { OrderEventCreateSchema } from "@schemas/OrderEvent";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type EventCreateFormData = {
	orderId: string;
	visibility: "PUBLIC" | "PRIVATE";
	message: string;
};

const EventCreateFormResolver = z.object({
	orderId: z.string(),
	visibility: z.enum(["PUBLIC", "PRIVATE"]),
	message: z.string().min(1, { message: "Укажите сообщение" }),
});

interface EventCreateFormProps {
	orderId: string;
	onSubmit: (data: z.infer<typeof OrderEventCreateSchema>) => void;
}

const EventCreateForm: React.FC<EventCreateFormProps> = ({ orderId, onSubmit }) => {
	const { control, handleSubmit } = useForm<EventCreateFormData>({
		resolver: zodResolver(EventCreateFormResolver),
		defaultValues: {
			orderId,
		},
	});

	return (
		<form className="px-2 pt-2 pb-4 h-100 d-f fd-c jc-sb" onSubmit={handleSubmit(onSubmit)}>
			<div className="gap-1 d-f fd-c">
				<Controller
					name="visibility"
					control={control}
					defaultValue={"PRIVATE"}
					render={({ field: { value, onChange } }) => (
						<div className="gap-1 d-f fd-r">
							<Typography variant="subtitle0">Показывать покупателю</Typography>
							<Checkbox
								value={value === "PUBLIC"}
								onChange={(_, checked) => {
									onChange(checked ? "PUBLIC" : "PRIVATE");
								}}
							/>
						</div>
					)}
				/>

				<Controller
					name="message"
					control={control}
					defaultValue={""}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label="Сообщение"
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
				Создать
			</Button>
		</form>
	);
};

export { EventCreateForm };
