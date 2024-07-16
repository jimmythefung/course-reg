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
        name: "Alice",
        netid: "aa1001",
        major: "Astronomy",
        graduation: "2024-05-20T00:00:00.000Z",
    },
    {
        name: "Bob",
        netid: "bb1002",
        major: "Biology",
        graduation: "2024-05-20T00:00:00.000Z",
    },
    {
        name: "Cindy",
        netid: "cc1003",
        major: "Chemistry",
        graduation: "2024-05-20T00:00:00.000Z",
    },
    {
        name: "Dave",
        netid: "dd1004",
        major: "Drama",
        graduation: "2024-05-20T00:00:00.000Z",
    },
    {
        name: "Jane",
        netid: "jj1005",
        major: "Japanese",
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

    // Enroll Alice in all courses
    const alice_enrollments = await prisma.$transaction(
        collection_classes.map((c) =>
            prisma.enrollment.upsert({
                where: {
                    student_id_class_id: {
                        student_id: collection_student[0].id,
                        class_id: c.id,
                    },
                },
                update: {},
                create: {
                    grade: "TBD",
                    student: {
                        connect: {
                            id: collection_student[0].id,
                        },
                    },
                    class: {
                        connect: {
                            id: c.id,
                        },
                    },
                },
            })
        )
    );

    // Enroll all students in one course
    const enrollments = await prisma.$transaction(
        collection_student.map((s) =>
            prisma.enrollment.upsert({
                where: {
                    student_id_class_id: {
                        student_id: s.id,
                        class_id: collection_classes[0].id,
                    },
                },
                update: {},
                create: {
                    grade: "TBD",
                    student: {
                        connect: {
                            id: s.id,
                        },
                    },
                    class: {
                        connect: {
                            id: collection_classes[0].id,
                        },
                    },
                },
            })
        )
    );
    console.log("Seeding completed.");
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
