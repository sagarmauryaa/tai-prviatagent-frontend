module.exports = {
	apps: [
		{
			name: "chatbot-dashboard",
			script: "npm",
			args: "run start", 
			env: {
				PORT: 5175,//PORT
				NODE_ENV: "production"
			}
		}
	]
};
