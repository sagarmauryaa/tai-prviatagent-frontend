"use client"; 
import Box from "@mui/material/Box";
import {  Chip, Divider, Stack, Typography, useTheme } from "@mui/material";
import { useAuth } from "@/components/auth/auth-context";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import { ShieldCheck as ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { Lock as LockIcon } from "@phosphor-icons/react/dist/ssr/Lock";
import { WifiHigh as WifiHighIcon } from "@phosphor-icons/react/dist/ssr/WifiHigh";
import { Buildings as BuildingsIcon } from "@phosphor-icons/react/dist/ssr/Buildings";

export default function Page() {
	const { user, brands, currentSubscription } = useAuth();
	const theme = useTheme();
	const isDark = theme.palette.mode === "dark";

	const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "—"; 
	const projectCount = brands?.length ?? 0;

	const infoCards = [
		{
			label: "Role",
			value: "Admin",
			icon: <UserIcon size={20} weight="duotone" />,
		},
		{
			label: "Projects",
			value: String(projectCount),
			icon: <BuildingsIcon size={20} weight="duotone" />,
		},
	];

	const statusItems = [
		{
			label: "Private AI Model",
			sublabel: "Dedicated inference endpoint",
			icon: <WifiHighIcon size={22} weight="duotone" />,
			color: "#22c55e",
		},
		{
			label: "Encryption at Rest",
			sublabel: "AES-256 data protection",
			icon: <LockIcon size={22} weight="duotone" />,
			color: "#6366f1",
		},
		{
			label: "Encryption in Transit",
			sublabel: "TLS 1.3 secured",
			icon: <ShieldCheckIcon size={22} weight="duotone" />,
			color: "#f59e0b",
		},
	];

	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			{/* Header */}
			<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
				<Box>
					<Typography
						variant="h5"
						sx={{ fontWeight: 700, lineHeight: 1.2, color: "text.primary" }}
					>
						Welcome, {fullName || ""}
					</Typography>
					<Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
						{user?.email ?? ""}
					</Typography>
				</Box>
			</Stack>

			{/* User Information Section */}
			<Box sx={{ mb: 5 }}>
				<Typography
					variant="overline"
					sx={{
						fontSize: "0.7rem",
						fontWeight: 700,
						letterSpacing: "0.12em",
						color: "text.disabled",
						mb: 2,
						display: "block",
					}}
				>
					User Information
				</Typography>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
						gap: 2,
					}}
				>
					{infoCards.map((card) => (
						<Box
							key={card.label}
							sx={{
								p: 2.5,
								borderRadius: 3,
								border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
								background: isDark
									? "rgba(255,255,255,0.03)"
									: "rgba(248,250,252,0.8)",
								backdropFilter: "blur(8px)",
							}}
						>
							<Typography
								variant="caption"
								sx={{
									color: "text.disabled",
									fontWeight: 600,
									fontSize: "0.7rem",
									letterSpacing: "0.06em",
									textTransform: "uppercase",
									display: "block",
									mb: 1,
								}}
							>
								{card.label}
							</Typography>
							<Typography
								sx={{
									fontWeight: 600,
									fontSize: "1rem",
									color: "text.primary",
									wordBreak: "break-all",
								}}
							>
								{card.value}
							</Typography>
						</Box>
					))}
				</Box>
			</Box>

			<Divider
				sx={{
					my: 4,
					borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
				}}
			/>

			{/* System Status Section */}
			<Box>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					sx={{ mb: 2 }}
				>
					<Typography
						variant="overline"
						sx={{
							fontSize: "0.7rem",
							fontWeight: 700,
							letterSpacing: "0.12em",
							color: "text.disabled",
							display: "block",
						}}
					>
						System Status
					</Typography>
					<Chip
						label="All systems operational"
						size="small"
						sx={{
							fontSize: "0.7rem",
							fontWeight: 600,
							color: "#22c55e",
							background: "rgba(34,197,94,0.1)",
							border: "1px solid rgba(34,197,94,0.2)",
							height: 22,
						}}
					/>
				</Stack>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
						gap: 2,
					}}
				>
					{statusItems.map((item) => (
						<Box
							key={item.label}
							sx={{
								p: 2.5,
								borderRadius: 3,
								border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
								background: isDark
									? "rgba(255,255,255,0.02)"
									: "rgba(248,250,252,0.6)",
								display: "flex",
								alignItems: "flex-start",
								gap: 2,
							}}
						>
							{/* Icon bubble */}
							<Box
								sx={{
									width: 42,
									height: 42,
									borderRadius: 2,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									flexShrink: 0,
									background: `${item.color}18`,
									border: `1px solid ${item.color}30`,
									color: item.color,
								}}
							>
								{item.icon}
							</Box>

							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Stack
									direction="row"
									alignItems="center"
									justifyContent="space-between"
									spacing={1}
								>
									<Typography
										sx={{
											fontWeight: 600,
											fontSize: "0.85rem",
											color: "text.primary",
										}}
									>
										{item.label}
									</Typography>
									{/* Status dot */}
									<Box
										sx={{
											width: 8,
											height: 8,
											borderRadius: "50%",
											background: "#22c55e",
											boxShadow: "0 0 0 3px rgba(34,197,94,0.2)",
											flexShrink: 0,
										}}
									/>
								</Stack>
								<Typography
									variant="caption"
									sx={{ color: "text.disabled", fontSize: "0.72rem" }}
								>
									{item.sublabel}
								</Typography>
							</Box>
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	);
}