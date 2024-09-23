import { Box, Button, CircularProgress, IconButton, Modal, Snackbar, Typography } from "@mui/material";
import { Delete, Edit, FileUpload } from "@mui/icons-material";

import CanvasPreview from "@components/CanvasPreview";
import { Crop } from "react-image-crop";
import Dropzone from "react-dropzone";
import { ImageEditProps } from "@appTypes/Admin";
import { ImageEditPropsSchema } from "@schemas/Admin";
import { ImageEditor } from "@components/ImageEditor";
import { ProductAddImageSchema } from "@schemas/Product";
import { ProductGet } from "@appTypes/Product";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ImageEditorState = {
	file: File;
	properties: ImageEditProps | null;
};

type ProductAddImageFormData = {
	productId: string;
	imageType: "ICON" | "BANNER";
	image: {
		file: File;
		properties: ImageEditProps;
	} | null;
};

const ProductAddImageResolver = z.object({
	productId: z.string(),
	image: z.object(
		{
			file: z.instanceof(File),
			properties: ImageEditPropsSchema,
		},
		{ message: "Выберите изображение" }
	),
});

interface ProductAddImageFormProps {
	product: ProductGet;
	onSubmit: (data: z.infer<typeof ProductAddImageSchema>) => void;
}

export const ProductAddImageForm: React.FC<ProductAddImageFormProps> = ({ product, onSubmit }) => {
	const resolvedOnSubmit = (data: ProductAddImageFormData) => {
		onSubmit(ProductAddImageSchema.parse(data));
	};

	const {
		register,
		getValues,
		setValue,
		watch,
		handleSubmit,
		formState: { isDirty },
	} = useForm<ProductAddImageFormData>({
		resolver: zodResolver(ProductAddImageResolver),
		defaultValues: {
			productId: product.id,
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
						cropWidth={630}
						cropHeight={630}
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

			<form
				className="w-100 d-f fd-c p-3 bg-primary br-3 gap-2 px-2 pt-2 pb-4"
				onSubmit={handleSubmit(resolvedOnSubmit)}
			>
				<input type="hidden" {...register("productId")} />
				<div className="d-f fd-c gap-1 bg-primary">
					<Typography variant="subtitle0"></Typography>

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
											Минимальный размер 630x630 px
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
				<Button disabled={!isDirty} variant="contained" type="submit" fullWidth>
					Добавить изображение
				</Button>
			</form>
		</>
	);
};
