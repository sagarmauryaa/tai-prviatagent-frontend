import { paths } from "@/paths";


const dashboardConfig = {
	layout: "vertical",
	navColor: "evident",
	navItems: [
		{
			key: "General",
			title: "General",
			items: [
				{ key: "home", title: "Home", href: paths.dashboard.overview, icon: "house" },
				{
					key: "private",
					title: "PrivAgent.md",
					icon: "file",
					href: paths.dashboard.privAgentMd
				}
			],
		},
		{
			key: "agents",
			title: "Agents",
			items: [
				, {
					key: "chat-agents",
					title: "Chat Agents",
					icon: "chats-circle",
					href: paths.dashboard.chatAgents
				},
			],
		},
		{
			key: "data",
			title: "Data (DeepIndex Technology)",
			items: [
				, {
					key: "add-data",
					title: "Add Data",
					icon: "file",
					href: paths.dashboard.addData
				}, 
				{
					key: "database",
					title: "SQL Databases",
					icon: "database",
					href: paths.dashboard.database
				}
			],
		},
	],
};

export { dashboardConfig };