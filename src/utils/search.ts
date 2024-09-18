import { CatalogItem } from "@appTypes/CatalogItem";

export const isCatalogItemMatchQuery = (item: CatalogItem, searchText: string) => {
	const filterValuesString = item.product.filterGroups.flatMap((g) => g.filters.map((f) => f.value)).join(" ");
	const searchString = `${item.product.title} ${item.product.category.title} ${filterValuesString}`;
	return searchString.toLowerCase().includes(searchText.toLowerCase());
};
