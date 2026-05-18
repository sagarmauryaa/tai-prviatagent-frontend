

// ======= Chat Storage Functions =======

const EXPIRY_MINUTES = 30; // auto-clear after 30 minutes

export function getStorageKey(base: string) {
    const pathname = window.location.pathname;
    const search = window.location.search;
    return base + '_' + btoa(pathname + search);
}
export function saveLocalChat(chatId: string, chatArray: any[]) {
    const key = getStorageKey('chatbot_history');

    try {
        const raw = localStorage.getItem(key);
        const store = raw ? JSON.parse(raw) : {};

        store[chatId] = {
            messages: chatArray
        };

        localStorage.setItem(key, JSON.stringify(store));
        setExpiry();
    } catch (e) {
        clearChatStorage();
    }
}


export function getLocalChat(chatId: string) {
    const key = getStorageKey('chatbot_history');

    const expiry = parseInt(
        localStorage.getItem(getStorageKey('chatbot_expiry')) || '0',
        10
    );

    if (expiry && Date.now() > expiry) {
        clearChatStorage();
        return [];
    }

    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];

        const store = JSON.parse(raw);

        if (!store[chatId]) return [];

        return Array.isArray(store[chatId].messages)
            ? store[chatId].messages
            : [];
    } catch (e) {
        return [];
    }
}

export function removeLocalChat(chatId: string) {
    const key = getStorageKey('chatbot_history');

    try {
        const raw = localStorage.getItem(key);
        if (!raw) return;

        const store = JSON.parse(raw);
        delete store[chatId];

        localStorage.setItem(key, JSON.stringify(store));
    } catch (e) {
        clearChatStorage();
    }
}

export function getAllLocalChats() {
    const key = getStorageKey('chatbot_history');

    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}


export function setExpiry() {
    var key = getStorageKey('chatbot_expiry');
    var expiryTime = Date.now() + EXPIRY_MINUTES * 60 * 1000;
    localStorage.setItem(key, expiryTime.toString());
}

export function clearChatStorage() {
    localStorage.removeItem(getStorageKey('chatbot_history'));
    localStorage.removeItem(getStorageKey('chatbot_expiry'));
}

// Auto-expiry check every minute
// setInterval(function () {
//     var expiry = parseInt((localStorage.getItem(getStorageKey('chatbot_expiry')) || '0'), 10);
//     if (expiry && Date.now() > expiry) {
//         clearChatStorage();
//     }
// }, 60 * 1000);
