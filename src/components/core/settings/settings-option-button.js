"use client";

import * as React from "react";
import { useRouter } from "next/navigation"; 
import { useColorScheme } from "@mui/material/styles"; 

import { appConfig } from "@/config/app"; 
import { setSettings as setPersistedSettings } from "@/lib/settings"; 

import { SettingsDrawer } from "./settings-drawer";
import { ListItemIcon, MenuItem } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useSettings } from "./settings-context";
import { dashboardConfig } from "@/config/dashboard";

export function SettingsButtonOption() {
	const { settings } = useSettings();
	const { mode, setMode } = useColorScheme();
	const router = useRouter();

	const [openDrawer, setOpenDrawer] = React.useState(false);

	const handleUpdate = async (values) => {
		const { theme, ...other } = values;

		if (theme) {
			setMode(theme);
		}

		const updatedSettings = { ...settings, ...other };

		await setPersistedSettings(updatedSettings);

		// Refresh the router to apply the new settings.
		router.refresh();
	};

	const handleReset = async () => {
		setMode(null);

		await setPersistedSettings({});

		// Refresh the router to apply the new settings.
		router.refresh();
	};

	return (
		<React.Fragment>
			<MenuItem onClick={() => {
				setOpenDrawer(true);
			}}>
				<ListItemIcon>
					<Settings />
				</ListItemIcon>
				Settings
			</MenuItem> 
			<SettingsDrawer
				onClose={() => {
					setOpenDrawer(false);
				}}
				onReset={handleReset}
				onUpdate={handleUpdate}
				open={openDrawer}
				values={{
					direction: settings.direction ?? appConfig.direction,
					theme: mode,
					primaryColor: settings.primaryColor ?? appConfig.primaryColor,
					dashboardLayout: settings.dashboardLayout ?? dashboardConfig.layout,
					dashboardNavColor: settings.dashboardNavColor ?? dashboardConfig.navColor,
				}}
			/>
		</React.Fragment>
	);
}
