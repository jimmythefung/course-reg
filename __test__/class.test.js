/**
 * @jest-environment node
 */
import { GET, POST, PUT, DELETE } from "@/app/api/v1/class/route";

it("should return data with non-zero classes", async () => {
    const response = await GET();
    const course_list = await response.json();

    expect(response.status).toBe(200);
    expect(course_list.length).toBeGreaterThan(0);
});

it("should create a new course", async () => {
    const course = {
        code: "01:640:356",
        name: "Theory of Numbers",
        subject: "Math",
        term: "Fall 2024",
    };

    const request = {
        json: async () => course,
    };

    const response = await POST(request);
    const newCourse = await response.json();

    expect(response.status).toBe(200);
    expect(newCourse.code).toBe(course.code);
    expect(newCourse.name).toBe(course.name);
    expect(newCourse.subject).toBe(course.subject);
    expect(newCourse.term).toBe(course.term);
});

it("should update an existing course", async () => {
    const course = {
        code: "01:640:356",
        name: "Theory of Numbers",
        subject: "Math",
        term: "Spring 2025",
    };

    const request = {
        json: async () => course,
        nextUrl: {
            searchParams: new URLSearchParams({ code: course.code }),
        },
    };

    const response = await PUT(request);
    const updatedCourse = await response.json();

    expect(response.status).toBe(200);
    expect(updatedCourse.code).toBe(course.code);
    expect(updatedCourse.name).toBe(course.name);
    expect(updatedCourse.subject).toBe(course.subject);
    expect(updatedCourse.term).toBe(course.term);
});

it("should delete an existing course", async () => {
    const course = {
        code: "01:640:356",
        name: "Theory of Numbers",
        subject: "Math",
        term: "Spring 2025",
    };

    const request = {
        nextUrl: {
            searchParams: new URLSearchParams({ code: course.code }),
        },
    };

    const response = await DELETE(request);
    const deleteCourse = await response.json();

    expect(response.status).toBe(200);
    expect(deleteCourse.code).toBe(course.code);
});
