
import { getDashboardData, getRecentApplicants } from "@/services/dashboardService";
import { publicProcedure } from "../trpc";

export const dashboardRouter = {
    getDashboardData: publicProcedure
        .query(async () => {
            return getDashboardData();
        }),
    getRecentApplicants: publicProcedure.query(async () => {
        return getRecentApplicants();
    })
}