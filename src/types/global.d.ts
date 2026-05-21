interface BrandPrompt {
    _id: string;
    promptText: string;
    selected: boolean;
    brandId: string;
    createdTime: number;
    updatedTime: number;
}

interface Project {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}


interface User {
    _id: string;
    fullName: string;
    username: string;
    role: string;
    isAdmin: boolean;
    projects: string[];
    canCrudFiles: boolean;
    hasPrivateDocAccess: boolean;
    createdAt: string;
    updatedAt: string;
}