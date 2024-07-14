"use server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

/////////////////
// HTTP Methods
/////////////////
export async function GET() {
    const classes = await prisma.class.findMany();
    console.log(classes);
    return Response.json(classes);
}

export async function DELETE(request) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");

    const data = {
        param: {
            code: code,
        },
    };
    console.log(data);

    const deleteCourse = await prisma.class.delete({
        where: {
            code: code,
        },
    });

    return Response.json(deleteCourse);
}
