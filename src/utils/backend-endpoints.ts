
import axiosInstance from "./api";
import Cookies from 'js-cookie';
import { generateDateRange } from "./generateDateRange";
import { BACKEND_ENDPOINT } from "./config";
import { AxiosProgressEvent } from "axios";


export const LoginDashboard = (data: { username: string, pass: string }) => {
    const response = axiosInstance.post(`auth/login`, data);
    return response
}

export const checkSession = () => {
    return axiosInstance.get(`auth/session`);
};

export const updateMyProfile = (data: { fullName: string }) => {
    return axiosInstance.put(`auth/basic-details`, data);
};

export const changeMyPassword = (data: { old: string, new: string }) => {
    return axiosInstance.put(`auth/update-password`, data);
};


// USER CRUD 
export const getUsers = (page: number = 1, limit: number = 10, search: string = '') => {
    return axiosInstance.get(`users?page=${page}&limit=${limit}&search=${search}`);
};
export const createUser = (data: { username: string, pass: string, role: string, fullName?: string, projects?: string[], canCrudFiles?: boolean, hasPrivateDocAccess?: boolean }) => {
    return axiosInstance.post(`users`, data);
};

export const getUser = async (userId: string) => {
    const response = await axiosInstance.get(`users/${userId}`);
    console.log('response', response.data);

    return response;
};

export const updateUser = (userId: string, data: { fullName?: string, username?: string, pass?: string, role?: string, projects?: string[], canCrudFiles?: boolean, hasPrivateDocAccess?: boolean }) => {
    return axiosInstance.put(`users/${userId}`, data);
};

export const deleteUser = (userId: string) => {
    return axiosInstance.delete(`users/${userId}`);
};

// PROJECT CRUD 
export const getProjects = (page: number = 1, limit: number = 10, search: string = '') => {
    return axiosInstance.get(`projects?page=${page}&limit=${limit}&search=${search}`);
};
export const createProject = (data: { name: string, description?: string }) => {
    return axiosInstance.post(`projects`, data);
};

export const getProject = async (projectId: string) => {
    const response = await axiosInstance.get(`projects/${projectId}`);
    console.log('response', response.data);

    return response;
};

export const updateProject = (projectId: string, data: { name?: string, description?: string }) => {
    return axiosInstance.put(`projects/${projectId}`, data);
};

export const deleteProject = (projectId: string) => {
    return axiosInstance.delete(`projects/${projectId}`);
};

export const updateMagentoConfig = (data: { domains?: string; apiKey?: string }) => {
    const authToken = Cookies.get("access_token");
    return axiosInstance.put("magento-config", data, {
        headers: { "x-chatbot-key": authToken }
    });
};

export const getMagentoConfig = () => {
    const authToken = Cookies.get("access_token");
    return axiosInstance.get("magento-config", {
        headers: { "x-chatbot-key": authToken }
    });
}


export const resetPassword = (data: { userId: string; newPassword: string; confirmPassword: string; }) => {
    const response = axiosInstance.put(`reset-password`, data);
    return response
}

// Instance (project) - user assignment helpers
export const addUserToInstance = (instanceId: string, userId: string) => {
    return axiosInstance.post(`instance/${instanceId}/users`, { userId });
};

export const removeUserFromInstance = (instanceId: string, userId: string) => {
    return axiosInstance.delete(`instance/${instanceId}/users/${userId}`);
};

export const setPassword = (data: { userId: string; password: string; confirmPassword: string; }) => {
    const response = axiosInstance.post(`set-password`, data);
    return response
}

export const authenticateToken = (token: string) => {
    const response = axiosInstance.post(`authenticate`, {}, {
        headers: { "x-chatbot-key": token }
    });
    return response
}

export const getBrandsInstance = (token: string) => {
    const response = axiosInstance.get(`brands`, {
        headers: { "x-chatbot-key": token }
    });
    return response
}

export const deletInfoData = (data: { brandId: string, infoId: string }) => {
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.delete(`info-data`, {
        data,
        headers: { "x-chatbot-key": authToken }
    });
    return response
}

export const updateWebPageData = (brandId: string, infoId: string, webpageUrl?: string) => {
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.put(`info-data/${brandId}`, { infoId, webpageUrl }, {
        headers: { "x-chatbot-key": authToken }
    });
    return response
}

export const updateInfoDataById = (brandId: string, infoId: string, text?: string) => {
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.put(`info-data/${brandId}`, { text, infoId }, {
        headers: { "x-chatbot-key": authToken }
    });
    return response
}

export const getDashboardOverView = (filters: { type: string; start_date?: string; end_date?: string; brand: string }) => {
    const authToken = Cookies.get("access_token");


    const { start, end } = generateDateRange(filters.type, filters?.start_date ?? '', filters?.end_date ?? '') as { start: number; end: number };

    const data = {
        start_date: start,
        end_date: end,
        brand: filters.brand
    };

    const response = axiosInstance.post(`overview`, data, {
        headers: { "x-chatbot-key": authToken }
    });

    return response;
}
export const getUnansweredQuestion = (filters: { type: string; start_date?: string; end_date?: string; brand: string }, page = 1, limit = 10, searchVal = '') => {
    const authToken = Cookies.get("access_token");
    const { start, end } = generateDateRange(filters.type, filters?.start_date ?? '', filters?.end_date ?? '') as { start: number; end: number };

    const data = {
        start_date: start,
        end_date: end,
        brand: filters.brand,
        page,
        limit,
        search: searchVal
    };

    const response = axiosInstance.post(`unanswered-questions`, data, {
        headers: { "x-chatbot-key": authToken }
    });

    return response;
}
export const getContacRequest = (filters: { type: string; start_date?: string; end_date?: string; brand: string }, page = 1, limit = 10) => {
    const authToken = Cookies.get("access_token");
    const { start, end } = generateDateRange(filters.type, filters?.start_date ?? '', filters?.end_date ?? '') as { start: number; end: number };

    const data = {
        start_date: start,
        end_date: end,
        brand: filters.brand,
        page,
        limit
    };

    const response = axiosInstance.post(`contact-request`, data, {
        headers: { "x-chatbot-key": authToken }
    });

    return response;
}

export const getInfoDataById = (brandId: string, infoId: string) => {
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.get(`info-data/${brandId}?infoId=${infoId}`, {
        headers: { "x-chatbot-key": authToken }
    });
    return response
}
export const getInfoData = (brandId: string, page: number = 1, limit: number = 10, search: string = '') => {
    const authToken = Cookies.get("access_token");

    const response = axiosInstance.get(`info-data/${brandId}?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`, {
        headers: { "x-chatbot-key": authToken }
    });
    return response
}
export const addInfoDataWebPage = (data: { userId: string, brandId: string, url: string }) => {
    const response = axiosInstance.post(`info-data-by-urls/webpage`, data);
    return response
}
export const generateInfoDataText = (data: { text: string }) => {
    const response = axiosInstance.post(`info-data/ai-generate/text`, data);
    return response
}

export const addInfoDataText = (data: { userId: string, brandId: string, text: string, isAIGenerated: boolean }) => {
    const response = axiosInstance.post(`info-data/text`, data);
    return response
}
export const addInfoDataPDFURL = (data: { userId: string, brandId: string, url: string }) => {
    const response = axiosInstance.post(`info-data/pdf-url`, data);
    return response
}
export const addInfoDataPDF = (data: { userId: string, brandId: string, pdf: File, signal?: AbortSignal; onUploadProgress?: (progressEvent: AxiosProgressEvent) => void; }) => {
    const formData = new FormData();
    formData.append('userId', data.userId);
    formData.append('brandId', data.brandId);
    formData.append('file', data.pdf);
    const response = axiosInstance.post(`info-data/pdf`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        signal: data.signal,
        onUploadProgress: data.onUploadProgress,
    });
    return response
}
export const transcribeAudioToSpeech = async (audio: Blob) => {
    const formData = new FormData();
    formData.append('audio', audio);

    const response = await fetch(`${BACKEND_ENDPOINT}/temp-media-upload/audio-to-text`, {
        method: 'POST',
        body: formData,
    });
    return response.json()
}

export const getCSVFile = (brandId: string) => {
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.get(`uploaded-csv/${brandId}`, {
        headers: { "x-chatbot-key": authToken }
    });
    return response
}
export const removedCSVFile = (brandId: string) => {
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.get(`remove-csv/${brandId}`, {
        headers: { "x-chatbot-key": authToken }
    });
    return response
}
export const addUploadCSVFile = (data: { userId: string, brandId: string, file: File, signal?: AbortSignal; }) => {
    const formData = new FormData();
    formData.append('userId', data.userId);
    formData.append('brandId', data.brandId);
    formData.append('file', data.file);
    formData.append('type', 'csv');

    return axiosInstance.post(`upload-csv`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        signal: data.signal,
    });
}

export const getFileMetaData = (infoId: string, brandId: string, type: string, page: number = 1, limit: number = 10, search: string = '') => {
    const response = axiosInstance.get(`meta-data/${infoId}?brandId=${brandId}&type=${type}&page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`);
    return response
}
export const deleteFileMetaData = (metaId: string) => {
    const response = axiosInstance.delete(`meta-data/${metaId}`);
    return response
}
export const updateFileMetaData = (metaId: string, data: { brandId: string, type: string, name: string, file?: File, description: string }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('brandId', data.brandId);
    data.file && formData.append('file', data.file);
    formData.append('type', data.type);

    const response = axiosInstance.put(`meta-data/${metaId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });
    return response
}
interface AddFileMetaDataConfig {
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}


export const addFilesMetaData = (infoId: string, data: { brandId: string, name: string, files: File[], description: string }, config?: AddFileMetaDataConfig) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('brandId', data.brandId);
    data.files.forEach((file, index) => {
        formData.append("files", file);
    });

    const response = axiosInstance.post(`multiple/meta-data/${infoId}`, formData, {
        ...config,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });
    return response
}
export const addFileMetaData = (infoId: string, data: { brandId: string, type: string, name: string, file: File, description: string }, config?: AddFileMetaDataConfig) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('brandId', data.brandId);
    formData.append('file', data.file);
    formData.append('type', data.type);

    const response = axiosInstance.post(`meta-data/${infoId}`, formData, { ...config });
    return response
}

export const getTextMetaData = (infoId: string, brandId: string, type: string, page: number = 1, limit: number = 10, search: string = '') => {
    const response = axiosInstance.get(`meta-data/${infoId}?brandId=${brandId}&type=${type}&page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`);
    return response
}
export const deleteTextMetaData = (metaId: string) => {
    const response = axiosInstance.delete(`meta-data/${metaId}`);
    return response
}
export const updateTextMetaData = (metaId: string, data: { brandId: string, name: string, value: string, description: string, type: string }) => {
    const response = axiosInstance.put(`meta-data/${metaId}`, data);
    return response
}
export const generateMetaData = (infoId: string, data: { name: string, value: string, description: string }) => {
    const response = axiosInstance.post(`meta-data/ai-generate/${infoId}`, data);
    return response
}


export const addTextMetaData = (infoId: string, data: { brandId: string, name: string, value: string, description: string, type: string, isAIGenerated: boolean }) => {
    const response = axiosInstance.post(`meta-data/${infoId}`, data);
    return response
}

export const getBrandPropmts = (brandId: string) => {
    const response = axiosInstance.get(`prompts/${brandId}`);
    return response
}
export const updateBrandPropmts = (brandId: string, updatedPrompts: BrandPrompt[]) => {
    const response = axiosInstance.put(`prompts/${brandId}`, { updatedPrompts });
    return response
}


export const getBrandReview = (brandId: string, brandApiKey: string) => {
    const response = axiosInstance.post(`reviews`, { brandId, brandApiKey });
    return response
}

export const getDashboardSettings = (brandId: string) => {
    const response = axiosInstance.get(`settings/${brandId}`);
    return response
}

export const updateDashboardSettings = async (data: { brandId: string; theme?: string; message?: string }) => {
    const response = axiosInstance.put(`settings/${data.brandId}`, { message: data.message ?? '', theme: data.theme ?? '' });
    return response
}

export const getInstance = (page: number = 1, limit: number = 10, search: string = '') => {
    const authToken = Cookies.get("access_token");

    const response = axiosInstance.get(`instances?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`, {
        headers: { "x-chatbot-key": authToken }
    });
    return response
}


export const getSubscriptionPlan = async (incluedsubsID: string) => {
    const response = axiosInstance.get(`subscriptions/${incluedsubsID}`);
    return response
}
export const updagradeSubscriptionPlan = async (data: { userId: string, subsId: string }) => {
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.put(`upgrade-subscriptions`, data, {
        headers: { "x-chatbot-key": authToken }
    });
    return response;
}
export const activeFreeSubscriptionPlan = async (data: { userId: string, subsId: string }) => {
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.put(`active-free-subscriptions`, data, {
        headers: { "x-chatbot-key": authToken }
    });
    return response;
}

export const getPaymentLinkEndpoint = async (quoteId: string) => {
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.get(`get-quotes/${quoteId}`, {
        headers: { "x-chatbot-key": authToken }
    });
    return response;
}
export const deletQuote = async (quoteId: string) => {
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.delete(`delete-quotes/${quoteId}`, {
        headers: { "x-chatbot-key": authToken }
    });
    return response;
}
export const verifyPaymentStatus = async (subsId: string, quoteId: string) => {
    const authToken = Cookies.get("access_token");

    const response = axiosInstance.put(`verify-plan-status/${quoteId}`, {
        subsId
    }, {
        headers: { "x-chatbot-key": authToken }
    });
    return response;
}


export const getBusinessCategories = async () => {
    const response = axiosInstance.get(`business-categories`);
    return response

}
export const getAreaData = async (countryCode?: string) => {
    if (!countryCode) {
        const response = axiosInstance.get(`country`);
        return response
    }
    const response = axiosInstance.get(`country/${countryCode}`);
    return response

}
export const mailCode = async (data: { email: string; code?: string; }) => {
    const response = axiosInstance.post(`mail-code`, data);
    return response
}


// export const addBrandInstance = (data: { name: string, phone: string, websiteUrl: string, businessCategory?: { id: string, name: string }, countryCode: string, addressLine1: string, state: string, city: string, zipcode: string, brand_logo?: File }) => {
export const addBrandInstance = (data: { name: string, brand_logo?: File }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    // formData.append('phone', data.phone);
    // formData.append('websiteUrl', data.websiteUrl);
    // formData.append('businessCategory', JSON.stringify(data.businessCategory));
    // formData.append('countryCode', data.countryCode);
    // formData.append('addressLine1', data.addressLine1);
    // formData.append('state', data.state);
    // formData.append('city', data.city);
    // formData.append('zipcode', data.zipcode);
    if (data.brand_logo) {
        formData.append('brand_logo', data.brand_logo);
    }
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.post(`instance/`, formData, {
        headers: { "x-chatbot-key": authToken, 'Content-Type': 'multipart/form-data' }
    });
    return response
}
// export const updateBrandInstance = (brandId: string, data: { name: string, phone: string, websiteUrl: string, businessCategory: { id: string, name: string }, countryCode: string, addressLine1: string, state: string, city: string, zipcode: string, brand_logo?: File }) => {
export const updateBrandInstance = (brandId: string, data: { name: string, brand_logo?: File }) => {
    const authToken = Cookies.get("access_token");
    const formData = new FormData();
    formData.append('name', data.name);
    // formData.append('phone', data.phone);
    // formData.append('websiteUrl', data.websiteUrl);
    // formData.append('businessCategory', JSON.stringify(data.businessCategory));
    // formData.append('countryCode', data.countryCode);
    // formData.append('addressLine1', data.addressLine1);
    // formData.append('state', data.state);
    // formData.append('city', data.city);
    // formData.append('zipcode', data.zipcode);
    if (data.brand_logo) {
        formData.append('brand_logo', data.brand_logo);
    }
    const response = axiosInstance.put(`instance/${brandId}`, formData, {
        headers: { "x-chatbot-key": authToken, 'Content-Type': 'multipart/form-data' }
    });
    return response
}
export const deleteBrandInstance = (brandId: string) => {
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.delete(`instance/${brandId}`, {
        headers: { "x-chatbot-key": authToken }

    });
    return response
}
export const authenticatePassToken = (token: string) => {
    const response = axiosInstance.get(`check-pass-token/${token}`);
    return response
}
export const changePassword = (token: string, data: { password: string; confirmPassword: string; }) => {
    const response = axiosInstance.put(`change-password`, { ...data, token }, {
        headers: { "x-chatbot-key": token }
    });
    return response
}
export const forgotPassword = (email: string) => {
    const response = axiosInstance.post(`send-password-link`, {
        email
    });
    return response
}
export const authenticateDashboardToken = (token: string) => {
    const response = axiosInstance.get(`check-token/${token}`);
    return response
}

export const verifySubscription = () => {
    const authToken = Cookies.get("access_token");
    const response = axiosInstance.get(`verify-subscription`, {
        headers: { "x-chatbot-key": authToken }
    });
    return response
}
