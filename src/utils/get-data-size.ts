export function getTextDataSize(text: string): number {
    const bytes = new TextEncoder().encode(text).length;
    const decimals = 2;

    if (bytes === 0) return 0;

    const k = 1024;
    const bytesToMB = bytes / (k * k); // Convert bytes to MB (1024 * 1024)

    return parseFloat(bytesToMB.toFixed(decimals));
}
