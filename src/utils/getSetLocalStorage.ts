export const setKey = (key: string, value: string) => localStorage.setItem(key, value);
 
export const getKey = (key: string) => localStorage.getItem(key);
 
export const removeKey = (key: string) => localStorage.removeItem(key);
 
export const clearStorage = () => localStorage.clear();
