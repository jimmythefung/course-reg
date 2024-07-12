"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/////////////////
// HTTP Methods
/////////////////
export async function GET(req, { params }) {
    const classid = params.classid;
    // Get all Students
    const student = await prisma.class.findUnique({
        where: {
            classid: classid,
        },
    });
    return Response.json(student);
}
