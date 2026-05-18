"use client";

import * as React from "react";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import ThemeSwitch from "../../dashboard/layout/ThemeSwitch";
import { List, ListItemIcon } from "@mui/material";
import { CreditCard as CreditCardIcon } from "@phosphor-icons/react/dist/ssr/CreditCard";
import { LockKey as LockKeyIcon } from "@phosphor-icons/react/dist/ssr/LockKey";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { SettingsButtonOption } from "@/components/core/settings/settings-option-button";
import Cookies from 'js-cookie'
import { redirect } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { paths } from "@/paths";
 
 

function SignOutButton() {
	const handleLogOut = () => {
		Cookies.remove('access_token');
		redirect(paths.auth.signIn)
	}

	return (
		<MenuItem onClick={handleLogOut} sx={{ justifyContent: "center" }}>
			Sign out
		</MenuItem>
	);
}

export function UserPopover({
	anchorEl,
	onClose,
	open,
}: {
	anchorEl: HTMLElement | null;
	onClose: () => void;
	open: boolean;
}) {
	const { user } = useAuth(); 
	
	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			onClose={onClose}
			open={Boolean(open)}
			slotProps={{ paper: { sx: { width: "280px" } } }}
			transformOrigin={{ horizontal: "right", vertical: "top" }}
		>
			<Box sx={{ p: 2 }}>
				<Typography>{user?.firstName} {user?.lastName}</Typography>
				<Typography color="text.secondary" variant="body2">
					{user?.email}
				</Typography>
			</Box> 	<Divider />
			<List sx={{ p: 1 }}>
				<MenuItem component={RouterLink} href={paths.dashboard.account.profile} onClick={onClose}>
					<ListItemIcon>
						<UserIcon />
					</ListItemIcon>
					Account
				</MenuItem>
				<MenuItem component={RouterLink} href={paths.dashboard.account.security} onClick={onClose}>
					<ListItemIcon>
						<LockKeyIcon />
					</ListItemIcon>
					Security
				</MenuItem> 
				<MenuItem onClick={onClose}>
					<ThemeSwitch />
				</MenuItem> 
			</List>
			<Divider />
			<Box sx={{ p: 1 }}>
				<SignOutButton />
			</Box>
		</Popover>
	);
}
