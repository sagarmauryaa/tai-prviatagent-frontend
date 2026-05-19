"use client";
 
import RouterLink from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Bell as BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { CreditCard as CreditCardIcon } from "@phosphor-icons/react/dist/ssr/CreditCard";
import { LockKey as LockKeyIcon } from "@phosphor-icons/react/dist/ssr/LockKey";
import { PlugsConnected as PlugsConnectedIcon } from "@phosphor-icons/react/dist/ssr/PlugsConnected";
import { UserCircle as UserCircleIcon } from "@phosphor-icons/react/dist/ssr/UserCircle";
import { UsersThree as UsersThreeIcon } from "@phosphor-icons/react/dist/ssr/UsersThree"; 

import { isNavItemActive } from "@/lib/is-nav-item-active";
import { useAuth } from "@/components/auth/auth-context";
import { paths } from "@/paths";  
import { Key } from "@mui/icons-material";

// NOTE: First level elements are groups.
type NavItemsType = {
    key: string;
    title: string;
    items: {
        key: string;
        title: string;
        href: string;
        icon: IconKey;
    }[];
}[]

const navItems: NavItemsType = [
    {
        key: "personal",
        title: "",
        items: [
            { key: "account", title: "Account", href: paths.dashboard.account.profile, icon: "user-circle" },
            { key: "security", title: "Security", href: paths.dashboard.account.security, icon: "lock-key" } 
        ],
    }
];

const icons = {
    "credit-card": CreditCardIcon,
    "lock-key": LockKeyIcon,
    "plugs-connected": PlugsConnectedIcon,
    "user-circle": UserCircleIcon,
    "users-three": UsersThreeIcon,
    "key": Key,
    bell: BellIcon,
}; 
export function SideNav() {
    const pathname = usePathname();
    const { user } = useAuth(); 


    return (
        <div>
            <Stack
                spacing={3}
                sx={{
                    flex: "0 0 auto",
                    flexDirection: { md: "column" },
                    position: { md: "sticky" },
                    top: "64px",
                    width: { xs: "100%", md: "240px" },
                }}
            >
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
                        {user?.username?.slice(0, 2).toUpperCase() ?? "U"}
                    </Avatar>
                    <div>
                        <Typography variant="subtitle1">{user?.fullName || user?.username}</Typography>
                        <Typography color="text.secondary" variant="caption">
                            @{user?.username} · {user?.role}
                        </Typography>
                    </div>
                </Stack>
                <Stack component="ul" spacing={3} sx={{ listStyle: "none", m: 0, p: 0 }}>
                    {navItems.map((group) => (
                        <Stack component="li" key={group.key} spacing={2}>
                            {group.title ? (
                                <div>
                                    <Typography color="text.secondary" variant="caption">
                                        {group.title}
                                    </Typography>
                                </div>
                            ) : null}
                            <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
                                {group.items.map((item) => (
                                    <NavItem {...item} key={item.key} pathname={pathname} />
                                ))} 
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </Stack> 
        </div>
    );
}
type IconKey = keyof typeof icons;

interface NavItemTypes {
    disabled?: boolean;
    external?: boolean;
    icon?: IconKey;
    href?: string;
    pathname?: string;
    title: string;
    onClick?: () => void
}

function NavItem({ disabled, external, href, icon, pathname, title, onClick }: NavItemTypes) {
    const active = pathname ? isNavItemActive({ disabled, external, href, pathname }) : false;
    const Icon = icon ? icons[icon] : null;

    return (
        <Box component="li" sx={{ userSelect: "none" }}>
            <Box
                {...(href
                    ? {
                        component: external ? "a" : RouterLink,
                        href,
                        target: external ? "_blank" : undefined,
                        rel: external ? "noreferrer" : undefined,
                    }
                    : { role: "button", onClick })}
                sx={{
                    alignItems: "center",
                    borderRadius: 1,
                    color: "var(--mui-palette-text-secondary)",
                    cursor: "pointer",
                    display: "flex",
                    flex: "0 0 auto",
                    gap: 1,
                    p: "6px 16px",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    ...(disabled && { color: "var(--mui-palette-text-disabled)", cursor: "not-allowed" }),
                    ...(active && { bgcolor: "var(--mui-palette-action-selected)", color: "var(--mui-palette-text-primary)" }),
                    "&:hover": {
                        ...(!active &&
                            !disabled && { bgcolor: "var(--mui-palette-action-hover)", color: "var(---mui-palette-text-primary)" }),
                    },
                }}
                tabIndex={0}
            >
                {Icon ? (
                    <Box sx={{ alignItems: "center", display: "flex", justifyContent: "center", flex: "0 0 auto" }}>
                        <Icon
                            fill={active ? "var(--mui-palette-text-primary)" : "var(--mui-palette-text-secondary)"}
                            fontSize="medium"
                            weight={active ? "fill" : undefined}
                        />
                    </Box>
                ) : null}
                <Box sx={{ flex: "1 1 auto" }}>
                    <Typography
                        component="span"
                        sx={{ color: "inherit", fontSize: "0.875rem", fontWeight: 500, lineHeight: "28px" }}
                    >
                        {title}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}