import {
	Box,
	Button,
	CircularProgress,
	Divider,
	IconButton,
	Modal,
	Snackbar,
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
	image: "small" | "big";
	properties: ImageEditProps | null;
};

export type CategoryCreateFormData = {
	title: string;
	link: string;
	smallImage: {
		file: File;
		properties: ImageEditProps;
	} | null;
	bigImage: {
		file: File;
		properties: ImageEditProps;
	} | null;
};

const CategoryCreateResolver = z.object({
	title: z.string().min(1, { message: "Укажите название" }),
	link: z.string().min(1, { message: "Укажите ссылку" }),
	smallImage: z.object({
		file: z.instanceof(File, { message: "Выберите изображение" }),
		properties: ImageEditPropsSchema,
	}),
	bigImage: z.object({
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
	const [imageResolutionTooLowSnackbarOpen, setImageResolutionTooLowSnackbarOpen] = useState<"small" | "big" | null>(
		null
	);

	const smallImage = watch("smallImage");
	const bigImage = watch("bigImage");

	const handleStartImageEdit = (imageType: "small" | "big") => {
		let image;
		switch (imageType) {
			case "small": {
				image = getValues().smallImage;
				break;
			}
			case "big": {
				image = getValues().bigImage;
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
		if (imageEditor.image === "small") {
			setValue(`smallImage.properties.scale`, scale);
			setValue(`smallImage.properties.crop`, crop);
			setValue(`smallImage.file`, file);
		} else {
			setValue(`bigImage.properties.scale`, scale);
			setValue(`bigImage.properties.crop`, crop);
			setValue(`bigImage.file`, file);
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
						cropWidth={imageEditor.image === "small" ? 360 : 696}
						cropHeight={imageEditor.image === "small" ? 360 : 300}
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
				<div className="d-f fd-c gap-1">
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

					<Divider />
					<div className="d-f fd-c gap-1 bg-primary">
						<Typography variant="subtitle0">Маленькое изображение</Typography>
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							Для отображения в меню
						</Typography>

						<div className="w-100 d-f fd-r gap-1 py-1 px-2 br-2 bg-secondary">
							<div className="w-100 d-f fd-r gap-1">
								<div className="br-2" style={{ width: 96, height: 96 }}>
									{smallImage ? (
										<CanvasPreview
											style={{ width: "96px" }}
											file={smallImage.file}
											crop={smallImage.properties.crop}
											scale={smallImage.properties.scale}
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
														image: "small",
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
									{!smallImage && (
										<>
											<Typography variant="body2">Выберите изображение</Typography>
											<Typography variant="body2" sx={{ color: "typography.secondary" }}>
												Минимальный размер 360x360px
											</Typography>
										</>
									)}
								</div>
							</div>

							<IconButton onClick={() => handleStartImageEdit("small")}>
								<Edit />
							</IconButton>
							<IconButton onClick={() => setValue(`smallImage`, null)}>
								<Delete />
							</IconButton>
						</div>
					</div>

					<Divider />
					<div className="d-f fd-c gap-1 bg-primary">
						<Typography variant="subtitle0">Большое изображение</Typography>
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							Для отображения на главной
						</Typography>
						<div className="w-100 d-f fd-r gap-2">
							<div className="w-100 d-f fd-r gap-1 py-1 px-2 br-2 bg-secondary">
								<div className="w-100 d-f fd-r gap-1">
									<div className="br-2 d-f fd-r ai-c" style={{ height: 96 }}>
										{bigImage ? (
											<CanvasPreview
												style={{ height: "96px" }}
												file={bigImage.file}
												crop={bigImage.properties.crop}
												scale={bigImage.properties.scale}
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
															image: "big",
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
										{!bigImage && (
											<>
												<Typography variant="body2">Выберите изображение</Typography>
												<Typography variant="body2" sx={{ color: "typography.secondary" }}>
													Минимальный размер 696x300px
												</Typography>
											</>
										)}
									</div>
								</div>

								<IconButton onClick={() => handleStartImageEdit("big")}>
									<Edit />
								</IconButton>
								<IconButton onClick={() => setValue(`bigImage`, null)}>
									<Delete />
								</IconButton>
							</div>
						</div>
					</div>
				</div>

				<Button type="submit" variant="contained">
					Создать
				</Button>
			</form>
		</>
	);
};
