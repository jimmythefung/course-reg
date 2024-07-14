import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const list_of_classes = [
    {
        code: "01:198:105",
        name: "Great Insights in Computer Science",
        subject: "Computer Science",
        term: "Fall 2024",
    },
    {
        code: "01:198:107",
        name: "Computing for Math and the Sciences",
        subject: "Computer Science",
        term: "Fall 2024",
    },
    {
        code: "01:198:110",
        name: "Principles of Computer Science",
        subject: "Computer Science",
        term: "Fall 2024",
    },
    {
        code: "01:198:111",
        name: "Intro Computer Sci",
        subject: "Computer Science",
        term: "Fall 2024",
    },
    {
        code: "01:198:112",
        name: "Data Structures",
        subject: "Computer Science",
        term: "Fall 2024",
    },
    {
        code: "01:640:491",
        name: "Mathematics Problem Solving Seminar",
        subject: "Math",
        term: "Fall 2024",
    },
];

const list_of_students = [
    {
        netid: "aa2024",
        name: "Alice",
        major: "Accounting",
        graduation: "2024-05-20T00:00:00.000Z",
    },
    {
        netid: "bb2025",
        name: "Bob",
        major: "Biology",
        graduation: "2024-05-20T00:00:00.000Z",
    },
    {
        netid: "jj2026",
        name: "Jane",
        major: "Journalism",
        graduation: "2024-05-20T00:00:00.000Z",
    },
];

async function main() {
    // Class
    const collection_classes = await prisma.$transaction(
        list_of_classes.map((c) =>
            prisma.class.upsert({
                where: { code: c.code },
                update: {},
                create: {
                    code: c.code,
                    name: c.name,
                    subject: c.subject,
                    term: c.term,
                },
            })
        )
    );

    // Students
    const collection_student = await prisma.$transaction(
        list_of_students.map((s) =>
            prisma.student.upsert({
                where: { netid: s.netid },
                update: {},
                create: {
                    netid: s.netid,
                    name: s.name,
                    major: s.major,
                    graduation: s.graduation,
                },
            })
        )
    );

    // A student with Relation to enrollment
    const s1 = await prisma.student.upsert({
        where: {
            netid: "jf1128",
        },
        update: {},
        create: {
            netid: "jf1128",
            name: "Jimmy",
            major: "Physics",
            graduation: "2024-05-20T00:00:00.000Z",
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

    console.log({ s1 });
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
