import * as React from "react";
import "@/styles/global.scss";
import { appConfig } from "@/config/app";
import { getSettings as getPersistedSettings } from "@/lib/settings";
import { EmotionCacheProvider } from "@/components/core/emotion-cache";
import { LocalizationProvider } from "@/components/core/localization-provider";
import { ThemeProvider } from "@/components/core/theme-provider";
import { Toaster } from "@/components/core/toaster";
import InitColorSchemeScript from "@mui/system/InitColorSchemeScript";
import { SettingsProvider } from "@/components/core/settings/settings-context";
import { AuthProvider } from "@/components/auth/auth-context";
import B2B from "@/utils/b2b"; 
import { REACT_APP_BASE_URL } from "@/utils/config";
export const metadata = { title: appConfig.name };

export const viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: appConfig.themeColor,
};


export default async function Layout({ children }: { children: React.ReactNode }) {
	const settings = await getPersistedSettings();
	const direction = settings.direction ?? appConfig.direction;
	const language = settings.language ?? appConfig.language;



	return (
		<html dir={direction} lang={language} suppressHydrationWarning>
			<head> 
				<meta name="description" content="Tellofy's AI Agent - Voice-powered AI assistant that reads the webpages, answers questions, and connects to your data in seconds." />
				<meta name="keywords" content="" /> 
 
				<meta property="og:title" content="Tellofy AI" />
				<meta property="og:type" content="article" />
				<meta property="og:image" content={REACT_APP_BASE_URL + '/assets/common/share.jpg'} />
				<meta property="og:url" content="" />
				<meta property="og:description" content="Tellofy's AI Agent - Voice-powered AI assistant that reads the webpages, answers questions, and connects to your data in seconds." />
 
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="Tellofy AI" />
				<meta name="twitter:description" content="Tellofy's AI Agent - Voice-powered AI assistant that reads the webpages, answers questions, and connects to your data in seconds." />
				<meta name="twitter:image" content={REACT_APP_BASE_URL + '/assets/common/share.jpg'} />
			</head>
			<body>
				<InitColorSchemeScript attribute="class" />
				<AuthProvider>
					<LocalizationProvider>
						<SettingsProvider settings={settings}>
							<EmotionCacheProvider options={{ key: "mui" }}>
								<ThemeProvider>
									{children}
									<Toaster position="bottom-right" />
								</ThemeProvider>
							</EmotionCacheProvider>
						</SettingsProvider>
					</LocalizationProvider>
				</AuthProvider>
				<B2B />
			</body>
		</html>
	);
}
