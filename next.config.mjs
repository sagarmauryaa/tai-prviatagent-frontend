/** @type {import('next').NextConfig} */
const config = {
    output: 'standalone',
    env: {
        REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
        BRAND_PAGE_URL: process.env.BRAND_PAGE_URL,
        BACKEND_ENDPOINT: process.env.BACKEND_ENDPOINT,
        APP_ENV: process.env.APP_ENV,
        CHATBOT_URL: process.env.CHATBOT_URL,
        SUPPORT_CHATBOT: process.env.SUPPORT_CHATBOT
    },
    eslint: { ignoreDuringBuilds: true } ,
    // compiler: {
    //     removeConsole: true
    // }
};

export default config;
