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
					icon: "file-md",
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
				{
					key: "files",
					title: "Files",
					icon: "file",
					href: paths.dashboard.files
				},
				{
					key: "database",
					title: "SQL Databases",
					icon: "database",
					href: paths.dashboard.database
				}
			],
		},
		{
			key: "other",
			title: "Others",
			items: [
				, {
					key: "projects",
					title: "Projects",
					icon: "folder",
					href: paths.dashboard.projects
				},
				{
					key: "users",
					title: "Users",
					icon: "users",
					href: paths.dashboard.users
				}
			],
		},
	],
};

export { dashboardConfig };