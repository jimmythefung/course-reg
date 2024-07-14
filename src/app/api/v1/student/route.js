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

export async function DELETE(request) {
    const searchParams = request.nextUrl.searchParams;
    const netid = searchParams.get("netid");
    console.log("Delete class request: " + netid);

    const deleteCourse = await prisma.student.delete({
        where: {
            netid: netid,
        },
    });

    return Response.json(deleteCourse);
}
