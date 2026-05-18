import { paths } from "@/paths";


const dashboardConfig = {
	layout: "vertical",
	navColor: "evident",
	navItems: [
		{
			key: "dashboards",
			title: "Dashboards",
			items: [
				{ key: "overview", title: "Overview", href: paths.dashboard.overview, icon: "house" },
				{
					key: "projects",
					title: "Projects",
					icon: "cube",
					href: paths.dashboard.projects
				}
				, {
					key: "add-data",
					title: "Add Data",
					icon: "file",
					href: paths.dashboard.addData
				},
				{
					key: "widgets",
					title: "Chatbot Integration",
					icon: "file-dashed",
					href: paths.dashboard.chatbot
				},
				{
					key: "try-demo",
					title: "Try it now",
					icon: "cube",
					href: paths.dashboard.demoChatbot
				},
				{ key: "setting", title: "Settings", href: paths.dashboard.setting, icon: "gear" },
			],
		},
	],
};

export { dashboardConfig };