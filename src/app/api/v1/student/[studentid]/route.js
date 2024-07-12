"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/////////////////
// HTTP Methods
/////////////////
export async function GET(req, { params }) {
    const studentid = params.studentid;
    // Get all Students
    const student = await prisma.student.findUnique({
        where: {
            studentid: studentid,
        },
    });
    return Response.json(student);
}
