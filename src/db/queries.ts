import db from "./db";
import { InsertUser, usersTable } from "./schema";

const data: InsertUser = {
    firstName: 'John',
    middleName: 'A.',
    lastName: 'Doe',
    suffix: 'Jr.',
    position: 'Developer',
    dateOfBirth: new Date('1990-01-01').toISOString(),
    gsisNo: '123456s789',
    tinNo: '987654s321',
    contactNo: '123-456-7890',
    address: '123 Main St, City, Country',
    emergencyContactPerson: 'Jane Doe',
    emergencyContactNumber: '098-765-4321',
    signatureUrl: 'https://example.com/signature/john_doe.png',
    photoUrl: 'https://example.com/photos/john_doe.png',
}

export async function addUser() {
    try {
        await db.insert(usersTable).values(data);
        console.log("added successfully");
    } catch (error) {
        throw error
    }
}
