export const BRAND_PAGE_URL = process.env.BRAND_PAGE_URL || 'https://tellofy.com';
export const V4_APIS = process.env.V4_APIS || 'https://prod-v4-survey-api.tellofy.com';
export const CHATBOT_URL = process.env.CHATBOT_URL || 'https://chatwidget.tellofy.com';
export const APP_ENV = process.env.APP_ENV;
export const TRAIL_SUB_ID = `${APP_ENV}` === 'staging' ? '6809afaeb2980e040109cfb5' : '68206e856a019eba75f225b4';
// export const TRAIL_SUB_ID = `${APP_ENV}` === 'staging' ? '680cf7ef06f26fa8e672facf' : '68206e856a019eba75f225b4';
export const FREE_TRAIL_SUB_ID = `${APP_ENV}` === 'staging' ? '680c98079a4b753f6d399c19' : '68206e176a019eba75f225b3';
export const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || 'https://app.tellofy.ai';
export const SUPPORT_CHATBOT = process.env.SUPPORT_CHATBOT || '';