"use client";

import * as React from "react"; 
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box"; 
import Stack from "@mui/material/Stack"; 
import { usePopover } from "@/hooks/use-popover";
import { useAuth } from "@/components/auth/auth-context";
 
import { MobileNav } from "../mobile-nav"; 
import { UserPopover } from "../user-popover";
import { MainNavWrapper } from "./main-nav.style";

interface MainNavProps {
	items: {
		key: string;
		title: string;
		items: {
			key: string;
			title: string;
			href: string;
			icon:
				| "translate"
				| "link"
				| "address-book"
				| "align-left"
				| "calendar-check"
				| "chart-pie"
				| "chats-circle"
				| "users";
		}[];
	}[];
}
export function MainNav({ items = [] }: MainNavProps) {
	const [openNav, setOpenNav] = React.useState(false);  
	return (
		<MainNavWrapper
			className={`header-main-wrapper`}
			sx={{
				"--MainNav-background": "var(--mui-palette-background-default)",
				"--MainNav-divider": "var(--mui-palette-divider)",
				bgcolor: "var(--MainNav-background)",
				left: 0,
				position: "sticky",
				pt: { lg: "var(--Layout-gap)" },
				top: 0,
				width: "100%",
				zIndex: "var(--MainNav-zIndex)",
			}}
		>
			<Box component="header">
				<Box
					sx={{
						borderBottom: "1px solid var(--MainNav-divider)",
						display: "flex",
						flex: "1 1 auto",
						minHeight: "var(--MainNav-height)",
						px: { xs: 2, lg: 3 },
						py: 1,
					}}
					className="header-container"
				> 

					<Stack
						direction="row"
						spacing={1.5}
						sx={{ alignItems: "center", flex: "1 1 auto", justifyContent: "flex-end" }}
					> 
						<UserButton />
					</Stack>
				</Box>
			</Box>
			<MobileNav
				items={items}
				onClose={() => {
					setOpenNav(false);
				}}
				open={openNav}
			/>
		</MainNavWrapper>
	);
}

function UserButton() {
	const popover = usePopover();
	const { user } = useAuth();

	return (
		<React.Fragment>
			<Box
				component="button"
				onClick={popover.handleOpen}
				ref={popover.anchorRef}
				sx={{ border: "none", background: "transparent", cursor: "pointer", p: 0 }}
			>
				<Badge
					anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
					color="success"
					sx={{
						"& .MuiBadge-dot": {
							border: "2px solid var(--MainNav-background)",
							borderRadius: "50%",
							bottom: "6px",
							height: "12px",
							right: "6px",
							width: "12px",
						},
					}}
					variant="dot"
				>
					<Avatar sx={{ bgcolor: "primary.main" }}>
						{user?.firstName?.[0]}
						{user?.lastName?.[0]}
					</Avatar>
				</Badge>
			</Box>
			<UserPopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
		</React.Fragment>
	);
}
