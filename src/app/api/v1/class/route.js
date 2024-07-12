"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/////////////////
// HTTP Methods
/////////////////
export async function GET() {
    const classes = await prisma.class.findMany();
    console.log(classes);
    return Response.json(classes);
}
