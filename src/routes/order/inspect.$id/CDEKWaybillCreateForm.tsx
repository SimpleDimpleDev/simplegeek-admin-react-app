import { Add, Delete } from "@mui/icons-material";
import { Button, Divider, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { OrderCDEKWaybillCreateSchema } from "@schemas/Order";
import { handleIntChange } from "@utils/forms";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type CDEKWaybillCreateFormData = {
	orderId: string;
	packages: {
		length: string;
		width: string;
		height: string;
		weight: string;
	}[];
};

const CDEKWaybillCreateFormResolver = z.object({
	orderId: z.string(),
	packages: z
		.object({
			length: z.coerce.number().positive({ message: "Длина должна быть положительным числом" }),
			width: z.coerce.number().positive({ message: "Ширина должна быть положительным числом" }),
			height: z.coerce.number().positive({ message: "Высота должна быть положительным числом" }),
			weight: z.coerce.number().positive({ message: "Вес должен быть положительным числом" }),
		})
		.array()
		.nonempty(),
});

const getFormData = (orderId: string): CDEKWaybillCreateFormData => ({
	orderId,
	packages: [
		{
			length: "",
			width: "",
			height: "",
			weight: "",
		},
	],
});

interface CDEKWaybillCreateFormProps {
	orderId: string;
	onSubmit: (data: z.infer<typeof OrderCDEKWaybillCreateSchema>) => void;
}

export default function CDEKWaybillCreateForm({ orderId, onSubmit }: CDEKWaybillCreateFormProps) {
	const resolvedOnSubmit = (data: CDEKWaybillCreateFormData) => {
		onSubmit(OrderCDEKWaybillCreateSchema.parse(data));
	};

	const { control, handleSubmit } = useForm<CDEKWaybillCreateFormData>({
		resolver: zodResolver(CDEKWaybillCreateFormResolver),
		defaultValues: getFormData(orderId),
	});

	const {
		fields: packages,
		append: appendPackage,
		remove: removePackage,
	} = useFieldArray({
		control,
		name: "packages",
	});

	return (
		<form className="gap-2 bg-primary px-2 pt-2 pb-4 br-2 d-f fd-c" onSubmit={handleSubmit(resolvedOnSubmit)}>
			<Typography variant="h6">Создание накладной</Typography>
			<Typography variant="subtitle0">Коробки</Typography>
			<Stack direction={"column"} spacing={2} divider={<Divider />}>
				{packages.map((_, index) => (
					<div className="gap-2 d-f fd-r">
						<Controller
							name={`packages.${index}.width`}
							control={control}
							render={({ field: { onChange, value }, fieldState: { error } }) => (
								<TextField
									type="string"
									label="Ширина, сантиметров"
									variant="outlined"
									fullWidth
									value={value}
									onChange={handleIntChange(onChange)}
									error={!!error}
									helperText={error?.message}
									slotProps={{
										input: {
											endAdornment: <Typography variant="body1">см</Typography>,
										},
									}}
								/>
							)}
						/>

						<Controller
							name={`packages.${index}.height`}
							control={control}
							render={({ field: { onChange, value }, fieldState: { error } }) => (
								<TextField
									type="string"
									label="Высота, сантиметров"
									variant="outlined"
									fullWidth
									value={value}
									onChange={handleIntChange(onChange)}
									error={!!error}
									helperText={error?.message}
									slotProps={{
										input: {
											endAdornment: <Typography variant="body1">см</Typography>,
										},
									}}
								/>
							)}
						/>

						<Controller
							name={`packages.${index}.length`}
							control={control}
							render={({ field: { onChange, value }, fieldState: { error } }) => (
								<TextField
									type="string"
									label="Длина, сантиметров"
									variant="outlined"
									fullWidth
									value={value}
									onChange={handleIntChange(onChange)}
									error={!!error}
									helperText={error?.message}
									slotProps={{
										input: {
											endAdornment: <Typography variant="body1">см</Typography>,
										},
									}}
								/>
							)}
						/>

						<Controller
							name={`packages.${index}.weight`}
							control={control}
							render={({ field: { onChange, value }, fieldState: { error } }) => (
								<TextField
									type="string"
									label="Масса, грамм"
									variant="outlined"
									fullWidth
									value={value}
									onChange={handleIntChange(onChange)}
									error={!!error}
									helperText={error?.message}
									slotProps={{
										input: {
											endAdornment: <Typography variant="body1">г</Typography>,
										},
									}}
								/>
							)}
						/>
						{packages.length > 1 && (
							<Tooltip title="Удалить коробку">
								<IconButton onClick={() => removePackage(index)}>
									<Delete />
								</IconButton>
							</Tooltip>
						)}
					</div>
				))}
			</Stack>
			<Tooltip title="Добавить коробку">
				<IconButton onClick={() => appendPackage({ length: "", width: "", height: "", weight: "" })}>
					<Add />
				</IconButton>
			</Tooltip>
			<Button type="submit">Создать</Button>
		</form>
	);
}
