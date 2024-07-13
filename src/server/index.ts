import db from '@/db/db';
import { publicProcedure, router } from './trpc';
import { barangayTable, userTable } from '@/db/schema';
import { asc } from 'drizzle-orm';
import barangayLists from '@/config/data/barangayLists';

export const appRouter = router({
    getAllBarangay: publicProcedure
        .query(async () => {
            return await db.select().from(barangayTable).orderBy(asc(barangayTable.name));
        }),
    initializePortal: publicProcedure.query(async () => {
        const insertPromises = barangayLists.map(name =>
            db.insert(barangayTable).values({ name })
        );
        await Promise.all(insertPromises);

        await db.insert(userTable).values({
            uid: "ORgnReOFRVU67w4bqDEeMve068w1",
            username: "Admin",
            role: "admin",
            email: "devillarudolphangelo@gmail.com",
            password: "---",
            barangay: "all"
        }) 
    }),


});


export type AppRouter = typeof appRouter;