import { applicantRouter } from './controllers/ApplicantController';
import { dashboardRouter } from './controllers/DashboardController';
import { tricycleRouter } from './controllers/TricycleController';
import { router } from './trpc';

export const appRouter = router({
    ...dashboardRouter,
    ...applicantRouter,
    ...tricycleRouter
});

export type AppRouter = typeof appRouter;
