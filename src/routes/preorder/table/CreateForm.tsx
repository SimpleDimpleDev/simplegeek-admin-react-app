import "dayjs/locale/ru";

import { Button, Checkbox, Divider, FormControlLabel, FormGroup, FormLabel, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { PreorderCreateSchema, PreorderOptionalStatusSchema } from "@schemas/Preorder";

import { PreorderOptionalStatus } from "@appTypes/Preorder";
import { preorderStatusTitles } from "src/constants";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const PREORDER_OPTIONAL_STATUS_LIST: PreorderOptionalStatus[] = [
	"WAITING_FOR_RELEASE",
	"FOREIGN_SHIPPING",
	"LOCAL_SHIPPING",
];

type PreorderCreateFormData = {
	title: string;
	expectedArrival: string | null;
	stages: PreorderOptionalStatus[];
};

const PreorderCreateResolver = z.object({
	title: z.string().min(1, { message: "Укажите название" }),
	expectedArrival: z.string().min(1, { message: "Укажите примерную дату доставки" }).nullable(),
	stages: PreorderOptionalStatusSchema.array(),
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
			expectedArrival: "",
			stages: PREORDER_OPTIONAL_STATUS_LIST,
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
					name="stages"
					control={control}
					render={({ field: { value, onChange } }) => (
						<FormGroup>
							<FormLabel>Этапы</FormLabel>
							{PREORDER_OPTIONAL_STATUS_LIST.map((stage) => (
								<FormControlLabel
									key={stage}
									control={
										<Checkbox
											checked={value.includes(stage)}
											onChange={(_, checked) =>
												onChange(
													checked ? [...value, stage] : value.filter((item) => item !== stage)
												)
											}
										/>
									}
									label={preorderStatusTitles.get(stage) ?? ""}
								/>
							))}
						</FormGroup>
					)}
				/>
				<Controller
					name="expectedArrival"
					control={control}
					render={({ field: { value, onChange }, fieldState }) => (
						<div className="gap-05 d-f fd-c">
							<TextField
								label="Примерная дата доставки"
								type="text"
								disabled={value === null}
								value={value ?? "-"}
								onChange={onChange}
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
								fullWidth
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={value === null}
										onChange={(_, value) => {
											if (value) {
												onChange(null);
											} else {
												onChange("");
											}
										}}
										inputProps={{ "aria-label": "controlled" }}
									/>
								}
								label="Неизвестно"
							/>
						</div>
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
