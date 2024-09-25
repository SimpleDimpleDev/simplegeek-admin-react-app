export type ProductIdsToPublish = {
	productIds: string[] | undefined
}

export const publicationCreateAction = async({ request }: { request: Request}): Promise<ProductIdsToPublish> => {
	const formData = await request.formData();
	const productIds = formData.get("productIds");
	return { productIds: productIds ? JSON.parse(productIds.toString()) : undefined};
}
