import barangayLists from "@/config/data/barangayLists";
import db from "./db";
import { barangayTable, userTable } from "./schema";
import { asc } from "drizzle-orm";


export const insertBarangayInitialData = async () => {
    try {
        const insertPromises = barangayLists.map(name =>
            db.insert(barangayTable).values({ name })
        );
        await Promise.all(insertPromises);

        await db.insert(userTable).values({
            uid: "ORgnReOFRVU67w4bqDEeMve068w1",
            username: "Admin",
            role: "admin",
            email: "devillarudolphangelo@gmail.com",
            password: "123456@H",
            barangay: "all"
        })

        console.log("success");

    } catch (error) {
        throw error;
    }
}

export const fetchBarangayData = async () => {
    try {
        const result = await db.select().from(barangayTable).orderBy(asc(barangayTable.name));
        console.table(result)
    } catch (error) {
        throw error
    }
}