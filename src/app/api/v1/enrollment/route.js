"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/////////////////
// HTTP Methods
/////////////////
export async function GET() {
    const enrollments = await prisma.enrollment.findMany({
        include: {
            student: true,
            class: true,
        },
    });
    console.log("Get request: all enrollments.");
    return Response.json(enrollments);
}

export async function POST(req) {
    const json_data = await req.json();
    const student_id = Number(json_data.student_id);
    const class_id = Number(json_data.class_id);
    const grade = json_data.grade;
    console.log(
        "Create enrollment request: student_id=" +
            student_id +
            ", class_id=" +
            class_id +
            ", grade=" +
            grade
    );

    // Enroll
    const enroll = await prisma.enrollment.upsert({
        where: {
            student_id_class_id: {
                student_id: student_id,
                class_id: class_id,
            },
        },
        update: {
            grade: grade,
        },
        create: {
            grade: grade,
            student: {
                connect: {
                    id: student_id,
                },
            },
            class: {
                connect: {
                    id: class_id,
                },
            },
        },
    });
    return Response.json(enroll);
}

export async function PUT(request) {
    const json_data = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const student_id = Number(searchParams.get("student_id"));
    const class_id = Number(searchParams.get("class_id"));
    console.log(
        "Update enrollment (grade) request: student_id=" +
            student_id +
            ", class_id=" +
            class_id
    );

    const updateEnrollment = await prisma.enrollment.update({
        where: {
            student_id_class_id: {
                student_id: student_id,
                class_id: class_id,
            },
        },
        data: { ...json_data },
    });

    return Response.json(updateEnrollment);
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
