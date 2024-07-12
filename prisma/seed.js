import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    // Class
    const c1 = await prisma.class.upsert({
        where: {
            code: "01:640:491",
        },
        update: {},
        create: {
            code: "01:640:491",
            name: "Mathematics Problem Solving Seminar",
            subject: "Math",
            term: "Fall 2024",
        },
    });

    // Student
    const s1 = await prisma.student.upsert({
        where: {
            studentid: "jf1128",
        },
        update: {},
        create: {
            studentid: "jf1128",
            name: "Jimmy",
            major: "Physics",
            graduation: "2024-05-25T12:01:30.543Z",
            enrollments: {
                create: [
                    {
                        class: {
                            connect: {
                                code: "01:640:491",
                            },
                        },
                    },
                ],
            },
        },
    });

    console.log({ s1, c1 });
}

// execute the main function
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
