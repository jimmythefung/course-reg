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

export async function POST(req) {
    const json_data = await req.json();
    console.log(json_data);

    // Extract netid, class_id
    const netid = json_data.netid;
    const courseCode = json_data.code;

    // Enroll
    const registration = await prisma.student.update({
        where: { netid: netid },
        data: {
            enrollments: {
                create: [
                    {
                        class: {
                            connect: {
                                code: courseCode,
                            },
                        },
                    },
                ],
            },
        },
    });
    return Response.json({ json_data });
}
