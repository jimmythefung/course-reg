"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/////////////////
// HTTP Methods
/////////////////
export async function GET() {
    const enrollments = await prisma.enrollment.findMany();
    console.log("Get request: all enrollments.");
    return Response.json(enrollments);
}

export async function POST(req) {
    const json_data = await req.json();
    // Extract netid, class_id
    const netid = json_data.netid;
    const courseCode = json_data.code;
    console.log(
        "Create enrollment request: net_id=" + netid + ", code=" + courseCode
    );

    // Enroll
    const enroll = await prisma.student.update({
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
    return Response.json(enroll);
}

export async function DELETE(request) {
    const searchParams = request.nextUrl.searchParams;
    const student_id = Number(searchParams.get("student_id"));
    const class_id = Number(searchParams.get("class_id"));
    console.log(
        "Unenrollment request: student_id=" +
            student_id +
            ", class_id=" +
            class_id
    );

    const unenroll = await prisma.enrollment.delete({
        where: {
            student_id_class_id: {
                student_id: student_id,
                class_id: class_id,
            },
        },
    });

    return Response.json(unenroll);
}
