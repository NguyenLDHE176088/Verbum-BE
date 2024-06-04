## Setup & Configuration

Change the database url in the `.env` file to your own database url.

```dotenv
DATABASE_URL="postgresql://username:password@localhost:5432/verbum?schema=public"
```

Run the following commands to generate the prisma client and push the schema to the database.

```bash
npx prisma generate
npx prisma db push
```
First rule went pull some NODEJS project from github 👍👍👍👍

```bash
npm i