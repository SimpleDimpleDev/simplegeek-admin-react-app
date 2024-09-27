export type ProductIdsToPublish = {
	productIds: string[] | undefined
}

export const publicationCreateAction = async({ request }: { request: Request}): Promise<ProductIdsToPublish> => {
	const formData = await request.formData();
	console.log("action", { formData });
	const productIds = formData.get("productIds");
	console.log("action", { productIds });
	return { productIds: productIds ? JSON.parse(productIds.toString()) : undefined};
}
