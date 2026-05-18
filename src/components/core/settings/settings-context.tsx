"use client";

import * as React from "react";

type SettingsContextType = {
	settings: Record<string, unknown>;
	setSettings: (value: Record<string, unknown>) => void;
};

export const SettingsContext = React.createContext<SettingsContextType>({
	settings: {},
	setSettings: (value: Record<string, unknown>) => {
		// noop
	},
});

export function SettingsProvider({ 
	children, 
	settings: initialSettings 
}: { 
	children: React.ReactNode; 
	settings: Record<string, unknown>; 
}) {
	const [settings, setSettings] = React.useState(initialSettings);

	React.useEffect(() => {
		setSettings(initialSettings);
	}, [initialSettings]);

	return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>;
}

export const SettingsConsumer = SettingsContext.Consumer;

export function useSettings() {
	const context = React.useContext(SettingsContext);

	if (!context) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}

	return context;
}
