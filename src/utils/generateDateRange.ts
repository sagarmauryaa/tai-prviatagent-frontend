export const generateDateRange = (type: string, startDate?: string, endDate?: string) => {
    const today = new Date();
    let start: Date;
    let end: Date;

    switch (type) {
        case "month":
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = today;
            break;
        case "week":
            const firstDayOfWeek = today.getDate() - today.getDay();
            start = new Date(today.setDate(firstDayOfWeek));
            end = new Date(today.setDate(firstDayOfWeek + 6));
            break;
        case "last month":
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            end = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case "year":
            start = new Date(today.getFullYear(), 0, 1);
            end = new Date(today.getFullYear(), 11, 31);
            break;
        case "other":
            if (startDate && endDate) {
                start = new Date(startDate);
                end = new Date(endDate);
            } else {
                throw new Error("Start date and end date are required for 'other' type");
            }
            break;
        default:
            throw new Error("Invalid type");
    }

    return { start: start.getTime(), end: end.getTime() };
}

export const getTimeEngagement = (totalMs: number) => {
    const totalSeconds = Math.floor(totalMs / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60; 
    return `${hours}h ${minutes}m ${seconds}s`;
}