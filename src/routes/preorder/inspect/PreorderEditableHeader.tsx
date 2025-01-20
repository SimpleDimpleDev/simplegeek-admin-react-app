import { Check, Close, Edit } from "@mui/icons-material";
import {
	Checkbox,
	Divider,
	FormControlLabel,
	IconButton,
	Paper,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { PreorderGet } from "@appTypes/Preorder";
import { PreorderUpdateSchema } from "@schemas/Preorder";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const textFieldProps = {
	onFocus: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
		event.stopPropagation();
		event.target.select();
	},
	sx: {
		width: "50%",
		"& .MuiInputBase-input": {
			fontSize: "1.2rem",
			color: "typography.primary",
		},
		"& .MuiInputBase-input.Mui-disabled": {
			WebkitTextFillColor: "#000000",
		},
	},
};

type PreorderUpdateFormData = {
	id: string;
	title: string;
	isActive: boolean;
	expectedArrival: string | null;
};

const PreorderUpdateResolver = z.object({
	id: z.string().min(1),
	title: z.string().min(1, { message: "Укажите название" }),
	isActive: z.boolean(),
	expectedArrival: z.string().nullable(),
});

type PreorderEditableHeaderProps = {
	preorder: PreorderGet;
	onUpdate: (data: z.infer<typeof PreorderUpdateSchema>) => void;
	updateSuccess: boolean;
};

const PreorderEditableHeader = ({ preorder, onUpdate, updateSuccess }: PreorderEditableHeaderProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const {
		control,
		handleSubmit,
		reset,
		formState: { isDirty },
	} = useForm<PreorderUpdateFormData>({
		resolver: zodResolver(PreorderUpdateResolver),
		defaultValues: {
			id: preorder.id,
			title: preorder.title,
			isActive: preorder.isActive,
			expectedArrival: preorder.expectedArrival,
		},
	});

	useEffect(() => {
		if (updateSuccess) {
			reset({
				id: preorder.id,
				title: preorder.title,
				expectedArrival: preorder.expectedArrival,
			});
		}
	}, [preorder, reset, updateSuccess]);

	const resolvedOnSubmit = (data: PreorderUpdateFormData) => {
		onUpdate(PreorderUpdateSchema.parse(data));
	};

	const handleStartEditing = () => {
		setIsEditing(true);
	};

	const handleStopEditing = () => {
		reset();
		setIsEditing(false);
	};

	return (
		<form onSubmit={handleSubmit(resolvedOnSubmit)}>
			<Paper sx={{ padding: 2 }}>
				<Stack
					sx={{ width: "100%" }}
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					divider={<Divider orientation="vertical" flexItem />}
				>
					<div className="gap-1 pl-2 w-100 ai-fs d-f fd-c">
						<Typography variant="body2" sx={{ color: "typography.secondary" }}>
							Название
						</Typography>
						<Controller
							name="title"
							control={control}
							render={({ field: { value, onChange }, fieldState: { error } }) => (
								<TextField
									{...textFieldProps}
                                    type="text"
                                    value={value}
                                    onChange={onChange}
									variant={"standard"}
									disabled={!isEditing}
									error={!!error}
									helperText={error?.message}
								/>
							)}
						/>
					</div>
					<div className="gap-1 pl-2 w-100 ai-fs d-f fd-c">
						<Typography variant="body2" sx={{ color: "typography.secondary" }}>
							Товары доступны для покупки
						</Typography>
						<Controller
                            disabled={!isEditing}
							name="isActive"
							control={control}
							render={({ field: { value, onChange } }) => (
								<Checkbox
									checked={value}
									onChange={(_, value) => {
										onChange(value);
									}}
									inputProps={{ "aria-label": "controlled" }}
								/>
							)}
						/>
					</div>
					<div className="gap-1 pl-2 w-100 ai-fs d-f fd-c">
						<Typography variant="body2" sx={{ color: "typography.secondary" }}>
							Примерная дата доставки
						</Typography>
						<Controller
							name="expectedArrival"
							control={control}
							render={({ field: { value, onChange }, fieldState: { error } }) => (
								<div className="gap-05 d-f fd-c">
									<TextField
										{...textFieldProps}
										type="text"
                                        variant={"standard"}
										disabled={value === null || !isEditing}
										value={value ?? "-"}
										onChange={onChange}
										error={!!error}
										helperText={error?.message}
									/>
									<FormControlLabel
										control={
											<Checkbox
                                                disabled={!isEditing}
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
					</div>
					<div className="gap-1 pl-2 d-f fd-r jc-c">
						{!isEditing ? (
							<>
								<Tooltip title="Редактировать">
									<IconButton onClick={handleStartEditing}>
										<Edit />
									</IconButton>
								</Tooltip>
							</>
						) : (
							<>
								<Tooltip title="Отменить">
									<IconButton sx={{ color: "error.main" }} onClick={handleStopEditing}>
										<Close />
									</IconButton>
								</Tooltip>
								<Tooltip title="Сохранить">
									<IconButton sx={{ color: "success.main" }} disabled={!isDirty} type="submit">
										<Check />
									</IconButton>
								</Tooltip>
							</>
						)}
					</div>
				</Stack>
			</Paper>
		</form>
	);
};

export { PreorderEditableHeader };
