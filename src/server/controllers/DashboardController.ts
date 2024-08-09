import { getBackUpData, getDashboardData, getRecentActions, getRecentApplicants, importBackUpData } from "@/services/dashboardService";
import { publicProcedure } from "../trpc";
import { InsertBackUpSchema } from "@/types/schema";

export const dashboardRouter = {
    getDashboardData: publicProcedure
        .query(async () => {
            return getDashboardData();
        }),
    getRecentApplicants: publicProcedure.query(async () => {
        return getRecentApplicants();
    }),
    getRecentActions: publicProcedure.query(async () => {
        return getRecentActions();
    }),
    getBackUpData: publicProcedure.query(async () => {
        return getBackUpData();
    }),
    importBackUpData: publicProcedure.input(InsertBackUpSchema).mutation(async ({input}) => {
        return importBackUpData({...input})
    })
}