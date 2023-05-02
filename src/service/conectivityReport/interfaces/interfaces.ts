import { type ConnectionQuality, type Months } from "@prisma/client";

export interface CreateConnectivityReport {
    month: Months
    noInternetDays: number
    connectionQuality: ConnectionQuality
    averageSpeed: number
    schoolId: string
    schoolAdminId: string
}