import CryptoJS from "crypto-js";

const secretKey = "mySecretKey123";

export const decryptId = (encryptedId: string) => {
    const bytes = CryptoJS.AES.decrypt(
        decodeURIComponent(encryptedId),
        secretKey
    );
    const originalId = bytes.toString(CryptoJS.enc.Utf8);
    return originalId;
};
