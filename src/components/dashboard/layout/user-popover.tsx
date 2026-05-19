"use client"; 
import RouterLink from "next/link"; 
import Box from "@mui/material/Box"; 
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover"; 
import Typography from "@mui/material/Typography";
import { List, ListItemIcon } from "@mui/material";
import { LockKey as LockKeyIcon } from "@phosphor-icons/react/dist/ssr/LockKey";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { SignOut as SignOutIcon } from "@phosphor-icons/react/dist/ssr/SignOut";
import { ShieldStar as ShieldStarIcon } from "@phosphor-icons/react/dist/ssr/ShieldStar";
import ThemeSwitch from "../../dashboard/layout/ThemeSwitch";
import { useAuth } from "@/components/auth/auth-context";
import { paths } from "@/paths";

export function UserPopover({
	anchorEl,
	onClose,
	open,
}: {
	anchorEl: HTMLElement | null;
	onClose: () => void;
	open: boolean;
}) {
	const { user, signOut } = useAuth(); 
	const displayName = user?.fullName || user?.username || "—"; 

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
				<Typography fontWeight={600}>{displayName}</Typography>
				<Typography color="text.secondary" variant="body2">
					@{user?.username}
				</Typography>
			</Box><Divider />
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

			{/* Sign Out */}
			<Box sx={{ p: 1 }}>
				<MenuItem
					onClick={() => { onClose(); signOut(); }}
					sx={{
						borderRadius: 1.5,
						gap: 1.5,
						py: 1,
						color: "error.main",
						"&:hover": { bgcolor: "error.lighter", color: "error.dark" },
					}}
				>
					<ListItemIcon sx={{ minWidth: "auto", color: "inherit" }}>
						<SignOutIcon size={18} />
					</ListItemIcon>
					<Typography variant="body2" fontWeight={600} color="inherit">Sign out</Typography>
				</MenuItem>
			</Box>
		</Popover>
	);
}
