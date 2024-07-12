"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/////////////////
// HTTP Methods
/////////////////
export async function GET() {
    // Get all Students
    const students = await prisma.student.findMany();
    console.log(students);
    return Response.json(students);
}
