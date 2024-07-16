# course-reg

Rutgers full stack demo

# Walkthrough

## Overview

The app runs on NodeJS server. The app is built using the NextJS, a framework for React.

The app's data flow touches on:

-   Client (make request)
-   Backend
    -   Server (serve requests)
    -   API endpoints
    -   Caches (if enabled)
-   SQL database (SQLite is used - but could be any SQL db such as Postgres / MySQL)
    -   `Prisma` is the object relational mapping (ORM) framework that the server used to interface with the SQL database.

The database has been seeded with some initial data (via `npx prisma db seed`):

-   6 students
-   6 courses
-   11 registrations

## Students Tab

Shows listing of all students.

Each student has the following fields

-   `student_id` internal to the database (autoincrement) - not shown in app
-   Name
-   School assigned id (NetID)
-   Major
-   Graduation

### Functions

1. Sorting:
    - All column sortable - by clicking on the header
2. Filtering:
    - By setting column to available values
3. Searching:
    - By typing in the search box for student name
4. View listing of courses of a given student
    - Use the dropdown to pick student by `NetID`
5. Remove student
    - by clicking the `Remove` button
6. Add student
    - by using the submission form
7. Update student
    - by editing cell in-line
    - Update Jane's major to Astronomy
    - autosaved on de-focus
    - Try filter by major to Astronomy

## Classes Tab

Shows listing of all available classes.

Each class has the following fields

-   `class_id` internal to the database (autoincrement - not show in app)
-   Name
-   School assigned course identifier (Code)
-   Subject
-   Capacity
-   Term

### Functions

Analogous / similar to students.

1. Sorting:
    - All column sortable - by clicking on the header
2. Filtering:
    - By setting column to available values
3. Searching:
    - By typing in the search box for course name
4. View listing of students enrolled in a given course
    - Use the dropdown to pick course by `course code`
5. Remove Course
    - by clicking the `Remove` button
6. Add Course
    - by using the submission form
7. Update Course
    - by editing cell in-line
    - autosaved on de-focus

## Enrollment Tab

Shows a listing of all enrollment.

Each enrollment has

-   `student_id`
-   `class_id`
-   `grade` (defaults to "TBD")

`Prisma`, the Object Relational Mapping (ORM) framework used here to interface with the database, includes the options to include the fields of the student and class objects (join operation underneath), hence the displayed table contains more than just `id`s and `grade`.

### Functions

1. Sorting:
    - All column sortable - by clicking on the header
2. Assign grade: (update Enrollment)
    - by editing cell in-line
3. Unenroll a student
    - by clicking the `Remove` button
    - Note the removal `Cascades`, the student/course reflects that
4. Enroll a student
    - by using the submission form

### Data Model around enrollment

A many-to-many relationship between `Student` and `Class`
Pictorial UML

```bash
# Many-to-Many relationship
# ----------          -------
# | Student |>|----|<| Class |
# ----------          -------
#
# Normalized to:
# - One-to-many: student to Enrollment
# - One-to-many: class to Enrollment
# - Each student is uniquely identified by its ID
# - Each class is uniquely identified by its ID
# - Each enrollment is uniquely identified by the combination of student_id and class_id
# - Each enrollment remembers useful information about the pair, such as "grade"
#
# ----------          ------------          -------
# | Student |-|----|<| Enrollment |>|----|-| Class |
# ----------          ------------          -------
```

## API

The `CRUD` operations on student, class, enrollment entities are serviced by the API endpoints

REST API:

-   student: `/api/v1/student`
-   class: `/api/v1/class`
-   enrollment: `/api/v1/enrollment`

Uses both JSON payload and `searchParam` (i.e. `?student_id=1`)

-   http `GET`: get a list of all records
-   http `POST`: create a record
-   http `UPDATE`: modify an existing record
-   http `DELETE`: remove a record

```bash
# View raw JSON at:
# http://localhost:3000/api/v1/student
# http://localhost:3000/api/v1/class
# http://localhost:3000/api/v1/enrollment
```

### Test

The `jest` framework is used for the javascript testing.
Test assests are located in the `<project_root>/__test__` directory.

-   Execute with `npm run test`
-   Should be part of CI/CD that gets run on git push

# Dev Notes

## Jest Testing

Run with:

```bash
# Jest tests are located in `./__test__`.
npm run test
```

## Prisma

-   `npx prisma db push`
-   `npx prisma studio`
-   `npx prisma db seed`

### Re-seed DB

```bash
rm prisma/dev.db; npx prisma db push; npx prisma db seed
```

### Node RPEL

Create a `sandbox.js` file that imports module like so:

```js
let { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

const classes = await prisma.class.findMany();
```

Then run

```bash
node -i
.load ./sandbox.js
```
