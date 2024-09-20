import { Button, Slider, Typography } from "@mui/material";
import ReactCrop, { Crop } from "react-image-crop";
import { useEffect, useRef, useState } from "react";

import CanvasPreview from "./CanvasPreview";
import { Search } from "@mui/icons-material";

const MOVE_DISTANCE = 0.1;

function getDefaultCrop(mediaWidth: number, mediaHeight: number, cropWidth: number, cropHeight: number): Crop {
	const cropPercentageHeight = (cropHeight / mediaHeight) * 100;
	const cropPercentageWidth = (cropWidth / mediaWidth) * 100;
	return {
		unit: "%",
		x: 0,
		y: 0,
		width: cropPercentageWidth,
		height: cropPercentageHeight,
	};
}

interface ImageEditorProps {
	file: File;
	defaultScale: number | null;
	defaultCrop: Crop | null;
	cropWidth: number;
	cropHeight: number;
	onImageResolutionTooLow: () => void;
	onConfirm: (scale: number, crop: Crop, file: File) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
	file,
	defaultScale,
	defaultCrop,
	cropWidth,
	cropHeight,
	onConfirm,
	onImageResolutionTooLow,
}) => {
	const imgRef = useRef<HTMLImageElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const imageSrc = selectedImage ? URL.createObjectURL(selectedImage) : null;
	const [crop, setCrop] = useState<Crop>();
	const [scale, setScale] = useState<number>(1);

	useEffect(() => {
		const setup = (file: File) => {
			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				if (!e.target) return;
				const img = new Image();
				img.onload = () => {
					if (img.width < cropWidth || img.height < cropHeight) {
						onImageResolutionTooLow();
						return;
					} else {
						setSelectedImage(file);
						if (defaultCrop) {
							setCrop(defaultCrop);
						} else {
							setCrop(getDefaultCrop(img.width, img.height, cropWidth, cropHeight));
						}
						if (defaultScale) {
							setScale(defaultScale);
						} else {
							setScale(1);
						}
					}
				};
				img.src = e.target.result as string;
			};
			reader.readAsDataURL(file);
		};
		if (file) setup(file);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file]);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.focus();
		}
	}, []);

	const handleScale = (e: React.WheelEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (!scale) return;
		if (e.deltaY > 0) {
			setScale(scale * 1.001);
		} else {
			setScale(scale / 1.001);
		}
	};

	const handleMove = (direction: "UP" | "RIGHT" | "DOWN" | "LEFT") => {
		setCrop((crop) => {
			if (!crop) return;

			return {
				...crop,
				x:
					direction === "LEFT"
						? crop.x - MOVE_DISTANCE
						: direction === "RIGHT"
						? crop.x + MOVE_DISTANCE
						: crop.x,
				y: direction === "UP" ? crop.y - MOVE_DISTANCE : direction === "DOWN" ? crop.y + MOVE_DISTANCE : crop.y,
			};
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		console.log(e);
		e.preventDefault();
		if (e.key === "Escape") {
			setSelectedImage(null);
		} else if (e.key === "ArrowUp") {
			handleMove("UP");
		} else if (e.key === "ArrowRight") {
			handleMove("RIGHT");
		} else if (e.key === "ArrowDown") {
			handleMove("DOWN");
		} else if (e.key === "ArrowLeft") {
			handleMove("LEFT");
		}
	};

	return (
		<div
			ref={containerRef}
			tabIndex={0}
			className="d-f fd-c gap-1 ai-c bg-primary w-mc h-mc py-2 px-4 br-3"
			onKeyDown={handleKeyDown}
			onWheel={handleScale}
		>
			<Typography variant="h6">Редактируйте изображение</Typography>
			<div className="w-100 d-f fd-c js-sb gap-1">
				<div>
					<Typography variant="body1" sx={{ color: "typography.secondary" }}>
						Используйте колёсико мыши для более точного изменения масштаба.
						Используйте стрелки для перемещения области
					</Typography>
				</div>

				<div className="d-f fd-r ai-c gap-1">
					<Search />
					<Slider
						value={scale}
						onChange={(_event: Event, newValue: number | number[]) => {
							setScale(newValue as number);
						}}
						min={0}
						max={10}
						step={0.001}
					/>
				</div>
			</div>
			<div className="d-f fd-r gap-1">
				{!!imageSrc && (
					<ReactCrop
						style={{ height: 768, width: 768 }}
						locked
						crop={crop}
						onChange={(_pixelCrop, percentageCrop) => {
							setCrop(percentageCrop);
						}}
						aspect={1}
					>
						<img
							height={768}
							ref={imgRef}
							alt="Crop me"
							src={imageSrc}
							style={{ transform: `scale(${scale})` }}
						/>
					</ReactCrop>
				)}
				{!!selectedImage && !!crop && (
					<CanvasPreview
						style={{ width: "768px", border: "1px solid black" }}
						file={selectedImage}
						crop={crop}
						scale={scale}
					></CanvasPreview>
				)}
			</div>
			<Button
				variant="contained"
				onClick={() => {
					console.log({ scale, crop, file });
					onConfirm(scale!, crop!, file);
				}}
			>
				Сохранить
			</Button>
		</div>
	);
};

export { ImageEditor };
