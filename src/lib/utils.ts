import { FilterEnum } from "@/data/types"

export const getISOStringDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
}

export const getDatesByFilter = (filter: FilterEnum): [Date, Date] | null => {
    const startDate = new Date();
    const endDate = new Date();
    if (filter === '1m') {
        startDate.setMonth(startDate.getMonth() - 1);
        return [startDate, endDate];
    } else if (filter === '6m') {
        startDate.setMonth(startDate.getMonth() - 6);
        return [startDate, endDate]
    } else if (filter === '1y') {
        startDate.setFullYear(startDate.getFullYear() - 1);
        return [startDate, endDate];
    } else {
        return null;
    }

}