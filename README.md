# course-reg

Rutgers full stack demo

# Helpful Commands

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