import {
	Box,
	Button,
	CircularProgress,
	Divider,
	IconButton,
	Modal,
	Snackbar,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Delete, Edit, FileUpload } from "@mui/icons-material";

import CanvasPreview from "@components/CanvasPreview";
import { CategoryCreateSchema } from "@schemas/Category";
import { Crop } from "react-image-crop";
import Dropzone from "react-dropzone";
import { ImageEditProps } from "@appTypes/Admin";
import { ImageEditPropsSchema } from "@schemas/Admin";
import { ImageEditor } from "@components/ImageEditor";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ImageEditorState = {
	file: File;
	image: "icon" | "banner";
	properties: ImageEditProps | null;
};

export type CategoryCreateFormData = {
	title: string;
	link: string;
	icon: {
		file: File;
		properties: ImageEditProps;
	} | null;
	banner: {
		file: File;
		properties: ImageEditProps;
	} | null;
};

const CategoryCreateResolver = z.object({
	title: z.string().min(1, { message: "Укажите название" }),
	link: z.string().min(1, { message: "Укажите ссылку" }),
	icon: z.object({
		file: z.instanceof(File, { message: "Выберите изображение" }),
		properties: ImageEditPropsSchema,
	}),
	banner: z.object({
		file: z.instanceof(File, { message: "Выберите изображение" }),
		properties: ImageEditPropsSchema,
	}),
});

interface CategoryCreateFormProps {
	onSubmit: (data: z.infer<typeof CategoryCreateSchema>) => void;
}

export const CategoryCreateForm: React.FC<CategoryCreateFormProps> = ({ onSubmit }) => {
	const resolvedOnSubmit = (data: CategoryCreateFormData) => {
		onSubmit(data as z.infer<typeof CategoryCreateResolver>);
	};

	const { control, getValues, setValue, watch, handleSubmit } = useForm<CategoryCreateFormData>({
		resolver: zodResolver(CategoryCreateResolver),
	});
	const [imageEditor, setImageEditor] = useState<ImageEditorState | null>(null);
	const [imageResolutionTooLowSnackbarOpen, setImageResolutionTooLowSnackbarOpen] = useState<
		"icon" | "banner" | null
	>(null);

	const icon = watch("icon");
	const banner = watch("banner");

	const handleStartImageEdit = (imageType: "icon" | "banner") => {
		let image;
		switch (imageType) {
			case "icon": {
				image = getValues().icon;
				break;
			}
			case "banner": {
				image = getValues().banner;
				break;
			}
		}
		if (!image) return;
		setImageEditor({ file: image.file, image: imageType, properties: image.properties });
	};

	const handleStopImageEdit = () => {
		setImageEditor(null);
	};

	const handleEditImage = (scale: number, crop: Crop, file: File) => {
		console.log({ scale, crop, file });
		if (!imageEditor) return;
		if (imageEditor.image === "icon") {
			setValue(`icon.properties.scale`, scale);
			setValue(`icon.properties.crop`, crop);
			setValue(`icon.file`, file);
		} else {
			setValue(`banner.properties.scale`, scale);
			setValue(`banner.properties.crop`, crop);
			setValue(`banner.file`, file);
		}
		setImageEditor(null);
	};

	return (
		<>
			<Snackbar
				open={!!imageResolutionTooLowSnackbarOpen}
				autoHideDuration={3000}
				onClose={() => setImageResolutionTooLowSnackbarOpen(null)}
				message="Разрешение изображения слишком маленькое"
			/>
			<Modal
				sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
				open={!!imageEditor}
				onClose={handleStopImageEdit}
			>
				{imageEditor ? (
					<ImageEditor
						file={imageEditor.file}
						defaultScale={imageEditor.properties?.scale || 1}
						defaultCrop={imageEditor.properties?.crop || null}
						cropWidth={imageEditor.image === "icon" ? 360 : 696}
						cropHeight={imageEditor.image === "icon" ? 360 : 300}
						onConfirm={handleEditImage}
						onImageResolutionTooLow={() => {
							handleStopImageEdit();
							setImageResolutionTooLowSnackbarOpen(imageEditor.image);
						}}
					/>
				) : (
					<CircularProgress />
				)}
			</Modal>

			<form className="h-100 d-f fd-c jc-sb px-2 pt-2 pb-4" onSubmit={handleSubmit(resolvedOnSubmit)}>
				<Stack direction={"column"} spacing={2} divider={<Divider />}>
					<div className="d-f fd-c gap-2 bg-primary">
						<Typography variant="subtitle0">Категория</Typography>
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
							name="link"
							control={control}
							defaultValue={""}
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

					<div className="d-f fd-c gap-1 bg-primary">
						<Typography variant="subtitle0">Маленькое изображение</Typography>
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							Для отображения в меню
						</Typography>

						<div className="w-100 d-f fd-r gap-1 py-1 px-2 br-2 bg-secondary">
							<div className="w-100 d-f fd-r gap-1">
								<div className="br-2" style={{ width: 96, height: 96 }}>
									{icon ? (
										<CanvasPreview
											style={{ width: "96px" }}
											file={icon.file}
											crop={icon.properties.crop}
											scale={icon.properties.scale}
											rotate={0}
										/>
									) : (
										<Dropzone
											accept={{
												"image/*": [".jpg", ".jpeg", ".png"],
											}}
											multiple={false}
											maxFiles={1}
											onDropAccepted={(files) => {
												for (const file of files) {
													setImageEditor({
														file,
														image: "icon",
														properties: null,
													});
												}
											}}
										>
											{({ getRootProps, getInputProps }) => (
												<Box
													sx={{ width: 96, height: 96, border: "1px dashed" }}
													{...getRootProps()}
													className="d-f fd-c jc-c ai-c br-2"
												>
													<input {...getInputProps()}></input>
													<FileUpload />
												</Box>
											)}
										</Dropzone>
									)}
								</div>
								<div className="d-f fd-c jc-c pl-1">
									{!icon && (
										<>
											<Typography variant="body2">Выберите изображение</Typography>
											<Typography variant="body2" sx={{ color: "typography.secondary" }}>
												Минимальный размер 360x360px
											</Typography>
										</>
									)}
								</div>
							</div>

							<IconButton onClick={() => handleStartImageEdit("icon")}>
								<Edit />
							</IconButton>
							<IconButton onClick={() => setValue(`icon`, null)}>
								<Delete />
							</IconButton>
						</div>
					</div>

					<div className="d-f fd-c gap-1 bg-primary">
						<Typography variant="subtitle0">Большое изображение</Typography>
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							Для отображения на главной
						</Typography>
						<div className="w-100 d-f fd-r gap-2">
							<div className="w-100 d-f fd-r gap-1 py-1 px-2 br-2 bg-secondary">
								<div className="w-100 d-f fd-r gap-1">
									<div className="br-2 d-f fd-r ai-c" style={{ height: 96 }}>
										{banner ? (
											<CanvasPreview
												style={{ height: "96px" }}
												file={banner.file}
												crop={banner.properties.crop}
												scale={banner.properties.scale}
												rotate={0}
											/>
										) : (
											<Dropzone
												accept={{
													"image/*": [".jpg", ".jpeg", ".png"],
												}}
												multiple={false}
												maxFiles={1}
												onDropAccepted={(files) => {
													for (const file of files) {
														setImageEditor({
															file,
															image: "banner",
															properties: null,
														});
													}
												}}
											>
												{({ getRootProps, getInputProps }) => (
													<Box
														sx={{ width: 96, height: 96, border: "1px dashed" }}
														{...getRootProps()}
														className="d-f fd-c jc-c ai-c br-2"
													>
														<input {...getInputProps()}></input>
														<FileUpload />
													</Box>
												)}
											</Dropzone>
										)}
									</div>
									<div className="d-f fd-c jc-c pl-1">
										{!banner && (
											<>
												<Typography variant="body2">Выберите изображение</Typography>
												<Typography variant="body2" sx={{ color: "typography.secondary" }}>
													Минимальный размер 696x300px
												</Typography>
											</>
										)}
									</div>
								</div>

								<IconButton onClick={() => handleStartImageEdit("banner")}>
									<Edit />
								</IconButton>
								<IconButton onClick={() => setValue(`banner`, null)}>
									<Delete />
								</IconButton>
							</div>
						</div>
					</div>
				</Stack>

				<Button type="submit" variant="contained">
					Создать
				</Button>
			</form>
		</>
	);
};
