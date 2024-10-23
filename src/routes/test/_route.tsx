import {
	Apps,
	Category,
	ChevronLeft,
	Info,
	Logout,
	People,
	ShoppingBag,
	ShoppingCart,
	SpaceDashboard,
	Tune,
} from "@mui/icons-material";
import { Box, Button, ListItem, Typography } from "@mui/material";

import { DeliveryForm } from "@components/DeliveryForm";
import { Link } from "react-router-dom";
import NavButton from "@components/NavButton";
import logo from "@assets/MainLogoBig.webp";

// import { CatalogItemGet } from "@appTypes/CatalogItem";



// import { PublicationGet } from "@appTypes/Publication";


// const variation: CatalogItemGet = {
// 	id: "1",
// 	price: 1000,
// 	quantity: 10,
// 	orderedQuantity: 4,
// 	discount: null,
// 	isActive: true,
// 	creditInfo: null,
// 	variationIndex: null,
// 	createdAt: new Date(),
// 	updatedAt: new Date(),
// 	product: {
// 		id: "1",
// 		title: "Тестовая вариация Тестовая вариация Тестовая вариация Тестовая вариация",
// 		description: "Тестовая вари",
// 		isPublished: true,
// 		physicalProperties: {
// 			width: 1,
// 			height: 1,
// 			length: 1,
// 			mass: 1,
// 		},
// 		images: [
// 			{
// 				id: "1",
// 				url: "https://i.ibb.co/0Cp7Y3T/IMG-20221109-125317-1.jpg",
// 				index: 0,
// 				createdAt: new Date(),
// 				updatedAt: new Date(),
// 			},
// 		],
// 		category: {
// 			id: "1",
// 			title: "Тестовая категория",
// 			link: "test",
// 			isActive: true,
// 			icon: {
// 				id: "1",
// 				url: "https://i.ibb.co/0Cp7Y3T/IMG-20221109-125317-1.jpg",
// 				index: 0,
// 				createdAt: new Date(),
// 				updatedAt: new Date(),
// 			},
// 			banner: {
// 				id: "1",
// 				url: "https://i.ibb.co/0Cp7Y3T/IMG-20221109-125317-1.jpg",
// 				index: 0,
// 				createdAt: new Date(),
// 				updatedAt: new Date(),
// 			},
// 			createdAt: new Date(),
// 			updatedAt: new Date(),
// 		},
// 		filterGroups: [],
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 	},
// };

// const publication: PublicationGet = {
// 	id: "1",
// 	link: "test",
// 	createdAt: new Date(),
// 	updatedAt: new Date(),
// 	preorder: null,
// 	shippingCostIncluded: null,
// 	items: [variation],
// };

export default function TestRoute() {
	return (
		<div className="w-100">
			<div className="h-100v d-f fd-c fs-0 jc-sb ps-f" style={{ width: "calc(280 / 1920 * 100%)" }}>
				<Box
					height={72}
					paddingLeft={5}
					display={"flex"}
					flexShrink={0}
					flexDirection={"row"}
					alignItems={"center"}
				>
					<Link to="/" style={{ textDecoration: "none" }}>
						<img src={logo} alt="logo" width={112} />
					</Link>
				</Box>

				<Box
					width={"100%"}
					height={"100%"}
					display={"flex"}
					flexDirection={"column"}
					justifyContent={"space-between"}
					paddingBottom={4}
				>
					<Box width={"100%"} display={"flex"} flexDirection={"column"} gap={1} padding={"8px 16px"}>
						<NavButton to="" icon={<SpaceDashboard />} text={"Главная"} />
						<NavButton to="/category" icon={<Category />} text={"Категории"} />
						<NavButton to="/filter" icon={<Tune />} text={"Фильтры"} />
						<NavButton to="/product/table" icon={<ShoppingCart />} text={"Товары"} />
						<NavButton to="/publication/table" icon={<Apps />} text={"Каталог"} />
						<NavButton to="/user/table" icon={<People />} text={"Пользователи"} />
						<NavButton to="/order/table" icon={<ShoppingBag />} text={"Заказы"} />
						<NavButton to="/faq" icon={<Info />} text={"FAQ"} />
					</Box>
					<Box padding={"0 16px"}>
						<Link to="/" style={{ textDecoration: "none" }}>
							<ListItem
								sx={{
									height: 48,
									color: "icon.secondary",
									borderRadius: "12px",
									gap: 1,
								}}
							>
								<Logout />
								<Typography color={"typography.primary"} variant="subtitle1">
									Выход
								</Typography>
							</ListItem>
						</Link>
					</Box>
				</Box>
			</div>
			<div className="bg-secondary" style={{ marginLeft: "calc(280 / 1920 * 100%)" }}>
				<div className="gap-2 px-3 py-4 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
					<Button onClick={() => {}} sx={{ color: "warning.main", width: "fit-content" }}>
						<ChevronLeft />
						Назад
					</Button>
					<div className="p-2">
						<Typography variant="h5">Публикация</Typography>
					</div>
					<DeliveryForm delivery={undefined} onChange={(data) => {console.log(data)}} packages={[]} />
				</div>
			</div>
		</div>
	);
}
