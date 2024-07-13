"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/////////////////
// HTTP Methods
/////////////////
export async function GET() {
    const enrollments = await prisma.enrollment.findMany();
    console.log(enrollments);
    return Response.json(enrollments);
}
