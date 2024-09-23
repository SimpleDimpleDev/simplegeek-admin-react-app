import { CategoryChangeImageRequestSchema, CategoryCreateRequestSchema, ProductAddImageRequestSchema, ProductCreateRequestSchema } from "./schemas";

import { z } from "zod";

export const categoryCreateFormDataMapper = (data: z.infer<typeof CategoryCreateRequestSchema>) => {
	const formData = new FormData();
	formData.append("title", data.title);
	formData.append("link", data.link);
	formData.append("icon", data.icon.file);
	formData.append("banner", data.banner.file);
	formData.append("iconProperties", JSON.stringify(data.icon.properties));
	formData.append("bannerProperties", JSON.stringify(data.banner.properties));
	return formData;
};

export const categoryChangeImageFormDataMapper = (data: z.infer<typeof CategoryChangeImageRequestSchema>) => {
	const formData = new FormData();
	formData.append("id", data.id);
	formData.append("imageType", data.imageType);
	formData.append("image", data.image.file);
	formData.append("imageProperties", JSON.stringify(data.image.properties));
	return formData;
}

export const productCreateFormDataMapper = (data: z.infer<typeof ProductCreateRequestSchema>) => {
	const formData = new FormData();
	formData.append("title", data.title);
	formData.append("description", data.description || "");
	formData.append("categoryId", data.categoryId);
	formData.append("physicalProperties", JSON.stringify(data.physicalProperties));
	formData.append("filterGroups", JSON.stringify(data.filterGroups || JSON.stringify([])));
	formData.append("imageProperties", JSON.stringify(data.images.map((image) => image.properties)));
	data.images.forEach((image) => {
		formData.append("images", image.file, image.file.name);
	});
	return formData;
};

export const productAddImageFormDataMapper = (data: z.infer<typeof ProductAddImageRequestSchema>) => {
	const formData = new FormData();
	formData.append("id", data.id);
	formData.append("imageProperties", JSON.stringify(data.image.properties));
	formData.append("image", data.image.file);
	return formData;
};
