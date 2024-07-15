let { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

export async function deleteStudent(id) {
    return await prisma.student.delete({
        where: {
            id: id,
        },
    });
}

export async function deleteClass(id) {
    return await prisma.class.delete({
        where: {
            id: id,
        },
    });
}

export async function deleteEnrollment(student_id, class_id) {
    return await prisma.enrollment.delete({
        where: {
            student_id_class_id: {
                student_id: student_id,
                class_id: class_id,
            },
        },
    });
}
