"use client";

import * as React from "react";
import { TRAIL_SUB_ID } from "@/utils/config";
import { Replay } from "@mui/icons-material";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { List as ListIcon } from "@phosphor-icons/react/dist/ssr/List";  
import { usePopover } from "@/hooks/use-popover";
import { useAuth } from "@/components/auth/auth-context";

import BrandsPopover from "../brands-popover";   
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
	const { currentSubscription } = useAuth();
	const trialClass = currentSubscription?.subsId === TRAIL_SUB_ID ? "trial-plan" : "";
	return (
		<MainNavWrapper
			className={`header-main-wrapper ${trialClass}`}
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
						spacing={2}
						sx={{ alignItems: "center", flex: "1 1 auto" }}
						className="navicon-wrapper"
					>
						<IconButton
							onClick={() => {
								setOpenNav(true);
							}}
							sx={{ display: { lg: "none" } }}
							className="hamburger-icon"
						>
							<ListIcon />
						</IconButton>
						<BrandsPopover isLabel={false} />
					</Stack>

					<Stack
						direction="row"
						spacing={1.5}
						sx={{ alignItems: "center", flex: "1 1 auto", justifyContent: "flex-end" }}
					>
						<Button sx={{ height: 38, width: 38 }} onClick={() => window.location.reload()} title="Refresh">
							<Replay />{" "}
						</Button>

						{currentSubscription?.subsId === TRAIL_SUB_ID &&
							currentSubscription?.activeDate &&
							currentSubscription?.endDate && (
								<Tooltip title="Your subscription plan">
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
											backgroundColor: "primary.dark",
											padding: "4px 12px",
											borderRadius: 1,
											color: "primary.contrastText",
											fontSize: "0.875rem",
										}}
										className="trial-expiration"
									>
										{currentSubscription.name} -
										<span>
											{Math.max(
												0,
												Math.ceil(
													(new Date(currentSubscription.endDate).getTime() - new Date().getTime()) /
														(1000 * 60 * 60 * 24)
												)
											)}{" "}
											days left
										</span>
									</Box>
								</Tooltip>
							)} 
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
