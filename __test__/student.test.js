/**
 * @jest-environment node
 */
import { GET, POST, PUT, DELETE } from "@/app/api/v1/student/route";

it("should return data with non-zero students", async () => {
    const response = await GET();
    const students = await response.json();

    expect(response.status).toBe(200);
    expect(students.length).toBeGreaterThan(0);
});

it("should create a new student", async () => {
    const student = {
        name: "Kevin",
        netid: "kk9000",
        major: "Korean",
        graduation: "2024-05-20T00:00:00.000Z",
    };

    const request = {
        json: async () => student,
    };

    const response = await POST(request);
    const newStudent = await response.json();

    expect(response.status).toBe(200);
    expect(newStudent.name).toBe(student.name);
    expect(newStudent.netid).toBe(student.netid);
    expect(newStudent.major).toBe(student.major);
    expect(newStudent.graduation).toBe(student.graduation);
});

it("should update an existing student", async () => {
    const student = {
        name: "Kevin",
        netid: "kk9000",
        major: "Klingon",
        graduation: "2024-05-20T00:00:00.000Z",
    };

    const request = {
        json: async () => student,
        nextUrl: {
            searchParams: new URLSearchParams({ netid: student.netid }),
        },
    };

    const response = await PUT(request);
    const updatedStudent = await response.json();

    expect(response.status).toBe(200);
    expect(updatedStudent.name).toBe(student.name);
    expect(updatedStudent.netid).toBe(student.netid);
    expect(updatedStudent.major).toBe(student.major);
    expect(updatedStudent.graduation).toBe(student.graduation);
});

it("should delete an existing student", async () => {
    const student = {
        name: "Kevin",
        netid: "kk9000",
        major: "Klingon",
        graduation: "2024-05-20T00:00:00.000Z",
    };

    const request = {
        nextUrl: {
            searchParams: new URLSearchParams({ netid: student.netid }),
        },
    };

    const response = await DELETE(request);
    const deletedStudent = await response.json();

    expect(response.status).toBe(200);
    expect(deletedStudent.netid).toBe(student.netid);
});
