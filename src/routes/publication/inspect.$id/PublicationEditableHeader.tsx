import { Check, Close, Delete, Edit } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { Divider, IconButton, Paper, Stack, TextField, Tooltip, Typography } from "@mui/material";

import ActionDialog from "@components/ActionDialog";
import { DateFormatter } from "@utils/format";
import { PublicationGet } from "@appTypes/Publication";
import { PublicationUpdateSchema } from "@schemas/Publication";
import { SlugResolver } from "../utils";
import { useState } from "react";
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

type PublicationUpdateFormData = {
	id: string;
	link: string;
};

const PublicationUpdateResolver = z.object({
	id: z.string().min(1),
	link: SlugResolver,
});

interface PublicationStockEditableHeaderProps {
	publication: PublicationGet;
	onUpdate: (data: z.infer<typeof PublicationUpdateSchema>) => void;
	onDelete: ({ publicationId }: { publicationId: string }) => void;
}

const PublicationStockEditableHeader: React.FC<PublicationStockEditableHeaderProps> = ({
	publication,
	onUpdate,
	onDelete,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const {
		control,
		handleSubmit,
		reset,
		formState: { isDirty },
	} = useForm<PublicationUpdateFormData>({
		resolver: zodResolver(PublicationUpdateResolver),
		defaultValues: {
			id: publication.id,
			link: publication.link,
		},
	});

	const [deletionDialogOpened, setDeletionDialogOpened] = useState(false);

	const resolvedOnSubmit = (data: PublicationUpdateFormData) => {
		onUpdate(PublicationUpdateSchema.parse(data));
	};

	const handleStartEditing = () => {
		setIsEditing(true);
	};

	const handleStopEditing = () => {
		reset();
		setIsEditing(false);
	};

	const handleDelete = () => {
		onDelete({ publicationId: publication.id });
	};

	return (
		<>
			<ActionDialog
				title="Удалить публикацию?"
				helperText="После удаления отменить действие будет невозможно"
				opened={deletionDialogOpened}
				onClose={() => setDeletionDialogOpened(false)}
				confirmButton={{
					text: "Удалить",
					onClick: handleDelete,
				}}
				declineButton={{
					text: "Отмена",
				}}
			/>

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
								Ссылка
							</Typography>
							<Controller
								name="link"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<TextField
										{...textFieldProps}
										{...field}
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
								Категория
							</Typography>
							<Typography variant="subtitle0">
								{publication.items.at(0)?.product.category.title ?? ""}
							</Typography>
						</div>
						<div className="gap-1 pl-2 w-100 ai-fs d-f fd-c">
							<Typography variant="body2" sx={{ color: "typography.secondary" }}>
								Дата публикации
							</Typography>
							<Typography variant="subtitle0">{DateFormatter.DDMMYYYY(publication.createdAt)}</Typography>
						</div>
						<div className="gap-1 pl-2 d-f fd-r jc-c">
							{!isEditing ? (
								<>
									<Tooltip title="Редактировать">
										<IconButton onClick={handleStartEditing}>
											<Edit />
										</IconButton>
									</Tooltip>
									<Tooltip title="Удалить">
										<IconButton
											sx={{ color: "error.main" }}
											onClick={() => setDeletionDialogOpened(true)}
										>
											<Delete />
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
		</>
	);
};

export { PublicationStockEditableHeader };
