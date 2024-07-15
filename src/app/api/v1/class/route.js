"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/////////////////
// HTTP Methods
/////////////////
export async function GET() {
    const classes = await prisma.class.findMany();
    console.log("Get request: all classes");
    return Response.json(classes);
}

export async function POST(req) {
    const json_data = await req.json();
    console.log("Create class request: " + json_data.code);

    // Create new class
    const newClass = await prisma.class.upsert({
        where: { code: json_data.code },
        update: {},
        create: {
            code: json_data.code,
            name: json_data.name,
            subject: json_data.subject,
            capacity: json_data.capacity,
            term: json_data.term,
        },
    });
    return Response.json(newClass);
}

export async function PUT(request) {
    const json_data = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const class_id = searchParams.get("class_id");
    console.log("Update class request: " + class_id);

    const updateClass = await prisma.class.update({
        where: {
            id: Number(class_id),
        },
        data: { ...json_data },
    });

    return Response.json(updateClass);
}

export async function DELETE(request) {
    const searchParams = request.nextUrl.searchParams;
    const class_id = searchParams.get("class_id");
    const code = searchParams.get("code");

    // Delete by course code
    if (code != null) {
        console.log("Delete class request: " + code);
        const deleteCourse = await prisma.class.delete({
            where: {
                code: code,
            },
        });
        return Response.json(deleteCourse);
    }

    // Delete by class_id
    console.log("Delete class_id request: " + class_id);
    const deleteCourse = await prisma.class.delete({
        where: {
            id: Number(class_id),
        },
    });

    return Response.json(deleteCourse);
}
