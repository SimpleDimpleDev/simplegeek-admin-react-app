import { Controller, useForm } from "react-hook-form";
import { Grid2, TextField } from "@mui/material";
import { forwardRef, useImperativeHandle } from "react";

import { Recipient } from "@appTypes/Delivery";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const RecipientFormResolver = z.object({
	phone: z.string().min(10, "Номер телефона должен быть не менее 10 символов"),
	fullName: z.string().min(2, "ФИО должно быть не менее 2 символов"),
});

type RecipientFormData = z.infer<typeof RecipientFormResolver>;

interface RecipientFormProps {
	onSubmit: (data: Recipient) => void;
}

// Using forwardRef to pass the ref from parent to child component
const RecipientForm = forwardRef(({ onSubmit }: RecipientFormProps, ref) => {
	const { control, handleSubmit } = useForm<RecipientFormData>({
		resolver: zodResolver(RecipientFormResolver),
	});

	// Expose the submit function to the parent component
	useImperativeHandle(ref, () => ({
		submit: handleSubmit((data) => {
			onSubmit(data);
		}),
	}));

	return (
		<form>
			<Grid2 container spacing={2}>
				<Grid2 size={{ xs: 12, sm: 12, md: 6 }}>
					<Controller
						name="phone"
						control={control}
						defaultValue=""
						render={({ field, fieldState: { error } }) => (
							<TextField
								{...field}
								label="Номер телефона"
								variant="outlined"
								fullWidth
								margin="normal"
								error={!!error}
								helperText={error?.message}
							/>
						)}
					/>
				</Grid2>
				<Grid2 size={{ xs: 12, sm: 12, md: 6 }}>
					<Controller
						name="fullName"
						control={control}
						defaultValue=""
						render={({ field, fieldState: { error } }) => (
							<TextField
								{...field}
								label="ФИО"
								variant="outlined"
								fullWidth
								margin="normal"
								error={!!error}
								helperText={error?.message}
							/>
						)}
					/>
				</Grid2>
			</Grid2>
		</form>
	);
});

export default RecipientForm;
