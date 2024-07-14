// import { PrismaClient } from "@prisma/client";

let { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

const netid = "jf1128";
const newCourseCode = "01:198:105";

const registration = await prisma.student.upsert({
    where: { netid: netid },
    update: {},
    data: {
        enrollments: {
            create: [
                {
                    class: {
                        connect: {
                            code: newCourseCode,
                        },
                    },
                },
            ],
        },
    },
});

// const student = await prisma.student.findUnique({
//     where: {
//         studentid: netid,
//     },
// });
