"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/////////////////
// HTTP Methods
/////////////////
export async function GET() {
    const students = await prisma.student.findMany();
    console.log("Get request: all students");
    return Response.json(students);
}

export async function POST(req) {
    const json_data = await req.json();
    console.log("Create student request: " + json_data.netid);

    // Create new student
    const newStudent = await prisma.student.upsert({
        where: { netid: json_data.netid },
        update: {},
        create: {
            name: json_data.name,
            netid: json_data.netid,
            major: json_data.major,
            graduation: json_data.graduation,
        },
    });
    return Response.json(newStudent);
}

export async function PUT(request) {
    const json_data = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const netid = searchParams.get("netid");
    const student_id = searchParams.get("student_id");
    console.log("Update student request: " + student_id);

    // Update by netid
    if (netid != null) {
        console.log("Update student by netid request: " + netid);
        const updateStudent = await prisma.student.update({
            where: {
                netid: netid,
            },
            data: { ...json_data },
        });
        return Response.json(updateStudent);
    }

    // Update by student_id
    const updateStudent = await prisma.student.update({
        where: {
            id: Number(student_id),
        },
        data: { ...json_data },
    });

    return Response.json(updateStudent);
}

export async function DELETE(request) {
    const searchParams = request.nextUrl.searchParams;
    const student_id = searchParams.get("student_id");
    const netid = searchParams.get("netid");
    console.log("Delete student request: " + student_id);

    // Delete by netid
    if (netid != null) {
        console.log("Delete student by netid request: " + netid);
        const deleteStudent = await prisma.student.delete({
            where: {
                netid: netid,
            },
        });
        return Response.json(deleteStudent);
    }

    // Delete by student_id
    const deleteStudent = await prisma.student.delete({
        where: {
            id: Number(student_id),
        },
    });

    return Response.json(deleteStudent);
}
