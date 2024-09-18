import { CatalogItem } from "./CatalogItem";
import { PreorderShop } from "./Preorder";

export type CatalogItemCart = CatalogItem & {
	quantity: number;
};

export type FormedCartSection = {
	title: string;
	unavailable: boolean;
	preorder: PreorderShop | null;
	creditAvailable: boolean;
	items: CatalogItemCart[];
};

export type FormedCart = {
	sections: FormedCartSection[];
};
