import {
	Apps,
	Business,
	CancelPresentation,
	Category,
	EditNoteRounded,
	ExpandLess,
	ExpandMore,
	Info,
	Logout,
	NewReleases,
	People,
	Reorder,
	ShoppingBag,
	ShoppingCart,
	SpaceDashboard,
	Tune,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import {
	Box,
	Button,
	Collapse,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";

import { NavLink } from "react-router-dom";
import logo from "@assets/MainLogoBig.webp";
import { useState } from "react";

interface NavButtonProps {
	to: string;
	end?: boolean;
	icon?: React.ReactNode;
	text: string;
}

const NavButton = ({ to, end = false, icon, text }: NavButtonProps) => {
	return (
		<NavLink to={to} end={end} style={{ textDecoration: "none" }}>
			{({ isActive }) => (
				<ListItemButton
					sx={{
						height: 48,
						backgroundColor: isActive ? "surface.secondary" : "surface.primary",
						color: "icon.secondary",
						borderRadius: "12px",
					}}
				>
					{icon && <ListItemIcon sx={{ minWidth: "40px" }}>{icon}</ListItemIcon>}

					<ListItemText primary={text} />
				</ListItemButton>
			)}
		</NavLink>
	);
};

type NavListProps = React.PropsWithChildren & {
	title: string;
	icon: React.ReactNode;
};

const NavList = ({ title, icon, children }: NavListProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	return (
		<>
			<ListItemButton
				sx={{
					height: 48,
					color: "icon.secondary",
					borderRadius: "12px",
				}}
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<ListItemIcon sx={{ minWidth: "40px" }}>{icon}</ListItemIcon>
				<ListItemText primary={title} />
				{isExpanded ? <ExpandLess /> : <ExpandMore />}
			</ListItemButton>
			<Collapse in={isExpanded} timeout="auto" unmountOnExit>
				<List component="div" disablePadding sx={{ pl: 4 }}>
					{children}
				</List>
			</Collapse>
		</>
	);
};

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
						<List>
							<NavButton to="" icon={<SpaceDashboard />} text={"Главная"} />
							<NavButton to="/category" icon={<Category />} text={"Категории"} />
							<NavButton to="/filter" icon={<Tune />} text={"Фильтры"} />
							<NavList title={"Товары"} icon={<ShoppingCart />}>
								<NavButton
									to="/product/table/UNPUBLISHED"
									icon={<VisibilityOff />}
									text={"Неопубликованные"}
								/>
								<NavButton
									to="/product/table/PUBLISHED"
									icon={<Visibility />}
									text={"Опубликованные"}
								/>
								<NavButton to="/product/table" end icon={<Reorder />} text={"Все"} />
								<NavButton to="/product/template" icon={<EditNoteRounded />} text={"Шаблоны"} />
							</NavList>
							<NavButton to="/publication/table" icon={<Apps />} text={"Каталог"} />
							<NavButton to="/user/table" icon={<People />} text={"Пользователи"} />
							<NavList icon={<ShoppingBag />} title={"Заказы"}>
								<NavButton
									to="/order/table/ACTION_REQUIRED"
									icon={<NewReleases />}
									text={"Требуются действия"}
								/>
								<NavButton
									to="/order/table/READY_FOR_SELF_PICKUP"
									icon={<Business />}
									text={"Самовывоз"}
								/>
								<NavButton
									to="/order/table/CANCELLED"
									icon={<CancelPresentation />}
									text={"Отменённые"}
								/>
								<NavButton to="/order/table" end icon={<Reorder />} text={"Все"} />
							</NavList>
							{/* TODO: Preorder feature */}
							{/* <NavButton to="/preorder/table" icon={<FlightTakeoff />} text={"Предзаказы"} /> */}
							<NavButton to="/faq" icon={<Info />} text={"FAQ"} />
						</List>
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
