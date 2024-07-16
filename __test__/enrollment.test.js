/**
 * @jest-environment node
 */
import { GET, POST, PUT, DELETE } from "@/app/api/v1/enrollment/route";

it("should return data with non-zero enrollment", async () => {
    const response = await GET();
    const enrollment_list = await response.json();

    expect(response.status).toBe(200);
    expect(enrollment_list.length).toBeGreaterThan(0);
});

it("should create a new enrollment", async () => {
    const enrollment = {
        student_id: 3,
        class_id: 3,
    };

    const request = {
        json: async () => enrollment,
    };

    const response = await POST(request);
    const newEnrollment = await response.json();

    expect(response.status).toBe(200);
    expect(newEnrollment.student_id).toBe(enrollment.student_id);
    expect(newEnrollment.class_id).toBe(enrollment.class_id);
    expect(newEnrollment.grade).toBe("TBD");
});

it("should update an existing enrollment", async () => {
    const enrollment = {
        student_id: 3,
        class_id: 3,
        grade: "B+",
    };

    const request = {
        json: async () => enrollment,
        nextUrl: {
            searchParams: new URLSearchParams({
                student_id: enrollment.student_id,
                class_id: enrollment.class_id,
            }),
        },
    };

    const response = await PUT(request);
    const updatedEnrollment = await response.json();

    expect(response.status).toBe(200);
    expect(updatedEnrollment.student_id).toBe(enrollment.student_id);
    expect(updatedEnrollment.class_id).toBe(enrollment.class_id);
    expect(updatedEnrollment.grade).toBe(enrollment.grade);
});

it("should delete an existing enrollment", async () => {
    const enrollment = {
        student_id: 3,
        class_id: 3,
    };

    const request = {
        nextUrl: {
            searchParams: new URLSearchParams({
                student_id: enrollment.student_id,
                class_id: enrollment.class_id,
            }),
        },
    };

    const response = await DELETE(request);
    const deleteEnrollment = await response.json();

    expect(response.status).toBe(200);
    expect(deleteEnrollment.student_id).toBe(enrollment.student_id);
    expect(deleteEnrollment.class_id).toBe(enrollment.class_id);
});
