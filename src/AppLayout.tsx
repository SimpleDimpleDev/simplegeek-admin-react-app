import {
	Apps,
	Category,
	FlightTakeoff,
	Info,
	Logout,
	People,
	ShoppingBag,
	ShoppingCart,
	SpaceDashboard,
	Tune,
} from "@mui/icons-material";
import { Box, Button, ListItem, Typography } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

import NavButton from "@components/NavButton";
import logo from "@assets/MainLogoBig.png";

export default function AppLayout() {
	return (
		<div className="bg-secondary w-100">
			<div className="bg-primary h-100v d-f fd-c fs-0 jc-sb ps-f" style={{ width: "calc(280 / 1920 * 100%)" }}>
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
						<NavButton to="/preorder/table" icon={<FlightTakeoff />} text={"Предзаказы"} />
						<NavButton to="/faq" icon={<Info />} text={"FAQ"} />
					</Box>
					<Box padding={"0 16px"}>
						<Button
							onClick={() => (window.location.href = "https://simplegeek.ru/")}
							style={{ textDecoration: "none" }}
						>
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
									В магазин
								</Typography>
							</ListItem>
						</Button>
					</Box>
				</Box>
			</div>
			<div style={{ marginLeft: "calc(280 / 1920 * 100%)" }}>
				<Outlet />
			</div>
		</div>
	);
}
