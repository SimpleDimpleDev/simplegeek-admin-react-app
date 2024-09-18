import { ListItem, Typography } from "@mui/material";

import { NavLink } from "react-router-dom";

interface NavButtonProps {
    to: string;
    icon: React.ReactNode;
    text: string;
};

const NavButton = ({ to, icon, text }: NavButtonProps) => {
    return (
        <NavLink to={to} style={{ textDecoration: "none" }}>
            {({ isActive }) => (
                <ListItem
                    sx={{
                        height: 48,
                        backgroundColor: isActive ? "surface.secondary" : "surface.primary",
                        color: "icon.secondary",
                        borderRadius: "12px",
                        gap: 1,
                    }}>
                    {icon}
                    <Typography color={"typography.primary"} variant="subtitle1">
                        {text}
                    </Typography>
                </ListItem>
            )}
        </NavLink>
    );
};

export default NavButton;