export const paths = {
	home: "/",
	auth: {
		signIn: "/auth/sign-in",
		resetPassword: "/auth/forgot-password",
		profile: "/auth/profile",
	},
	dashboard: {
		overview: "/dashboard",
		privAgentMd: '/dashboard/priv-agent-md',
		database: '/dashboard/database',
		projects: '/dashboard/projects',
		projectDetail: (id: string) => `/dashboard/projects/${id}`,
		users: '/dashboard/users',
		userDetail: (id: string) => `/dashboard/users/${id}`,
		chatAgents: '/dashboard/chat-agents',

		// OLD ROUTES - REMOVE AFTER VERIFICATION
		aiAgent: '/dashboard/prompts',
		addInfo: '/dashboard/add-info',
		addData: '/dashboard/info-data',
		infoDataEditPreview: (id: string) => `/dashboard/info-data?editId=${id}`,
		infoTextMetaDataPreview: (id: string) => `/dashboard/info-data?infoTextMetaDataID=${id}`,
		infoFileMetaDataPreview: (id: string) => `/dashboard/info-data?infoFileMetaDataID=${id}`,
		addWebPages: '/dashboard/add-web-pages',
		chatbot: '/dashboard/chatbot-integration',
		demoChatbot: '/dashboard/chatbot-demo',
		widgets: {
			badges: '/dashboard/widgets/badges',
		},
		account: {
			profile: "/dashboard/account/profile",
			security: "/dashboard/account/security",
			subscription: "/dashboard/account/my-plan",
			magento: '/dashboard/account/magento-key',
		},
		settings: {
			account: "/dashboard/settings/account",
			billing: "/dashboard/settings/billing",
			integrations: "/dashboard/settings/integrations",
			notifications: "/dashboard/settings/notifications",
			security: "/dashboard/settings/security",
			team: "/dashboard/settings/team",
		},
		aiData: '/dashboard/ai-data',
		setting: '/dashboard/settings',
	}
};
