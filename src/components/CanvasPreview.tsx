import React, { useEffect, useRef, useState } from "react";

export interface Crop {
	x: number;
	y: number;
	width: number;
	height: number;
	unit: "px" | "%";
}

export interface PixelCrop extends Crop {
	unit: "px";
}

export interface PercentCrop extends Crop {
	unit: "%";
}

interface CanvasPreviewProps {
	file: File;
	crop: PixelCrop | PercentCrop;
	scale?: number;
	rotate?: number;
	style?: React.CSSProperties;
}

const TO_RADIANS = Math.PI / 180;

const CanvasPreview: React.FC<CanvasPreviewProps> = ({ file, crop, scale = 1, rotate = 0, style }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [image, setImage] = useState<HTMLImageElement>();

	useEffect(() => {
		// Create an Image object
		const img = new Image();
		img.onload = () => {
			// Set the loaded image to state when ready
			setImage(img);
		};
		// Set the src of the img to the file
		img.src = URL.createObjectURL(file);

		return () => {
			// Revoke the object URL to clean up memory
			URL.revokeObjectURL(img.src);
		};
	}, [file]);

	useEffect(() => {
		if (!image) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			throw new Error("No 2d context");
		}

		let cropX, cropY, cropWidth, cropHeight;
		if (crop.unit === "%") {
			cropX = (crop.x / 100) * image.naturalWidth;
			cropY = (crop.y / 100) * image.naturalHeight;
			cropWidth = (crop.width / 100) * image.naturalWidth;
			cropHeight = (crop.height / 100) * image.naturalHeight;
		} else {
			cropX = crop.x;
			cropY = crop.y;
			cropWidth = crop.width;
			cropHeight = crop.height;
		}

		const pixelRatio = window.devicePixelRatio;

		canvas.width = Math.floor(cropWidth * pixelRatio);
		canvas.height = Math.floor(cropHeight * pixelRatio);

		ctx.scale(pixelRatio, pixelRatio);
		ctx.imageSmoothingQuality = "high";

		const rotateRads = rotate * TO_RADIANS;
		const centerX = cropX + cropWidth / 2;
		const centerY = cropY + cropHeight / 2;

		const scaledWidth = image.naturalWidth * scale;
		const scaledHeight = image.naturalHeight * scale;
		const offsetX = (scaledWidth - image.naturalWidth) / 2;
		const offsetY = (scaledHeight - image.naturalHeight) / 2;

		ctx.save();

		ctx.translate(centerX, centerY);
		ctx.rotate(rotateRads);
		ctx.translate(-centerX, -centerY);

		// Draw the image with scaling and centering adjustments
		ctx.drawImage(
			image,
			0,
			0,
			image.naturalWidth,
			image.naturalHeight,
			-cropX - offsetX,
			-cropY - offsetY,
			scaledWidth,
			scaledHeight
		);

		ctx.restore();
	}, [image, crop, scale, rotate]);

	return <canvas style={style} ref={canvasRef} />;
};

export default CanvasPreview;
