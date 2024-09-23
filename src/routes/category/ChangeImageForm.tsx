import { Box, CircularProgress, IconButton, Modal, Snackbar, Typography } from "@mui/material";
import { Delete, Edit, FileUpload } from "@mui/icons-material";

import CanvasPreview from "@components/CanvasPreview";
import { CategoryChangeImageSchema } from "@schemas/Category";
import { CategoryGet } from "@appTypes/Category";
import { Crop } from "react-image-crop";
import Dropzone from "react-dropzone";
import { ImageEditProps } from "@appTypes/Admin";
import { ImageEditPropsSchema } from "@schemas/Admin";
import { ImageEditor } from "@components/ImageEditor";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ImageEditorState = {
	file: File;
	properties: ImageEditProps | null;
};

type CategoryChangeImageFormData = {
	id: string;
	imageType: "ICON" | "BANNER";
	image: {
		file: File;
		properties: ImageEditProps;
	} | null;
};

const CategoryChangeImageResolver = z.object({
	id: z.string(),
	imageType: z.enum(["ICON", "BANNER"]),
	image: z.object(
		{
			file: z.instanceof(File),
			properties: ImageEditPropsSchema,
		},
		{ message: "Выберите изображение" }
	),
});

interface CategoryChangeImageFormProps {
	category: CategoryGet;
	imageType: "ICON" | "BANNER";
	onSubmit: (data: z.infer<typeof CategoryChangeImageSchema>) => void;
}

export const CategoryChangeImageForm: React.FC<CategoryChangeImageFormProps> = ({ category, imageType, onSubmit }) => {
	const resolvedOnSubmit = (data: CategoryChangeImageFormData) => {
		onSubmit(CategoryChangeImageSchema.parse(data));
	};

	const { getValues, setValue, watch, handleSubmit } = useForm<CategoryChangeImageFormData>({
		resolver: zodResolver(CategoryChangeImageResolver),
		defaultValues: {
			id: category.id,
			imageType: imageType,
			image: null,
		},
	});
	const [imageEditor, setImageEditor] = useState<ImageEditorState | null>(null);
	const [imageResolutionTooLowSnackbarOpen, setImageResolutionTooLowSnackbarOpen] = useState<boolean>(false);

	const handleStartImageEdit = () => {
		const image = getValues().image;
		if (!image) return;
		setImageEditor({ file: image.file, properties: image.properties });
	};

	const handleStopImageEdit = () => {
		setImageEditor(null);
	};

	const handleEditImage = (scale: number, crop: Crop, file: File) => {
		console.log({ scale, crop, file });
		if (!imageEditor) return;
		setValue(`image.properties.scale`, scale);
		setValue(`image.properties.crop`, crop);
		setValue(`image.file`, file);
		setImageEditor(null);
	};

	const image = watch("image");

	return (
		<>
			<Snackbar
				open={!!imageResolutionTooLowSnackbarOpen}
				autoHideDuration={3000}
				onClose={() => setImageResolutionTooLowSnackbarOpen(false)}
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
						cropWidth={imageType === "ICON" ? 360 : 696}
						cropHeight={imageType === "ICON" ? 360 : 300}
						onConfirm={handleEditImage}
						onImageResolutionTooLow={() => {
							handleStopImageEdit();
							setImageResolutionTooLowSnackbarOpen(true);
						}}
					/>
				) : (
					<CircularProgress />
				)}
			</Modal>

			<form className="h-100 d-f fd-c jc-sb px-2 pt-2 pb-4" onSubmit={handleSubmit(resolvedOnSubmit)}>
				<div className="d-f fd-c gap-1 bg-primary">
					<Typography variant="subtitle0">
						{imageType === "ICON" ? "Иконка категории" : "Баннер категории"}
					</Typography>
					<Typography variant="body1" sx={{ color: "typography.secondary" }}>
						{imageType === "ICON" ? "Для отображения в меню" : "Для отображения на главной"}
					</Typography>

					<div className="w-100 d-f fd-r gap-1 py-1 px-2 br-2 bg-secondary">
						<div className="w-100 d-f fd-r gap-1">
							<div className="br-2" style={{ width: 96, height: 96 }}>
								{image ? (
									<CanvasPreview
										style={{ width: "96px" }}
										file={image.file}
										crop={image.properties.crop}
										scale={image.properties.scale}
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
								{!image && (
									<>
										<Typography variant="body2">Выберите изображение</Typography>
										<Typography variant="body2" sx={{ color: "typography.secondary" }}>
											Минимальный размер {imageType === "ICON" ? "360x360px" : "696x300px"}
										</Typography>
									</>
								)}
							</div>
						</div>

						<IconButton onClick={() => handleStartImageEdit()}>
							<Edit />
						</IconButton>
						<IconButton onClick={() => setValue(`image`, null)}>
							<Delete />
						</IconButton>
					</div>
				</div>
			</form>
		</>
	);
};
