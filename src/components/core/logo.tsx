"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import { useColorScheme } from "@mui/material/styles";

import { NoSsr } from "@/components/core/no-ssr";

const HEIGHT = 60;
const WIDTH = 60;

interface LogoProps {
	color: "dark" | "light",
	height: number
	width: number
	emblem?: boolean
}

export function Logo({ color = "dark", emblem, height = HEIGHT, width = WIDTH }: LogoProps) {
	let url; 
	if (emblem) {
		url = color === "light" ? "/assets/logo/light-logo.svg" : "/assets/logo/dark-logo.svg";
	} else {
		url = color === "dark" ? "/assets/logo/light-logo.svg" : "/assets/logo/dark-logo.svg";
	} 

	
	return <Box alt="logo" component="img" height={height} src={url} width={width} />;
}

export function DynamicLogo({ colorDark = "light", colorLight = "dark", height = HEIGHT, width = WIDTH, emblem = false, ...props }: { colorDark?: "light" | "dark", colorLight?: "light" | "dark", height?: number, width?: number, emblem?:boolean }) {
	const { colorScheme } = useColorScheme();
	const color = colorScheme === "dark" ? colorDark : colorLight;  
	return (
		<NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
			<Logo color={color as "light" | "dark"} height={height} width={width} emblem={emblem} {...props} />
		</NoSsr>
	);
}
