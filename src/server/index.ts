import { applicantRouter } from './controllers/ApplicantController';
import { tricycleRouter } from './controllers/TricycleController';
import { router } from './trpc';

export const appRouter = router({
    ...applicantRouter,
    ...tricycleRouter
});

export type AppRouter = typeof appRouter;
