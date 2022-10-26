Steps:

1. Install newest version of NX cli on the command prompt
   - `npm install -g nx`
2. Create Nest NX workspace on the command prompt
   - `npx create-nx-workspace demos --package-manager=yarn`
   - Choose your style => Select integrated
   - What to create in the new workspace => Select Nest
   - Application name => prisma-api
   - When asked to enable distributed caching to make your CI faster => Select No
3. Open folder you just created (demos) in Vs Code
4. Install Prisma
   - `yarn add prisma --dev`
   - `yarn add @prisma/client`
5. Configure Prisma
   - `npx prisma init`
   - Move the prisma folder and .env into the apps/prisma-api folder
   - Change the provider in the prisma schema to sqlite
   - Change the datasource in the .env to `DATABASE_URL="file:./dev.db"`
6. Copy and paste the following at the end of the `prisma.schema` file,

   ```
    model Employee {
      id           String     @id @default(uuid())
      name         String?
      ssn          String     @unique
      department   Department @relation(fields: [departmentId], references: [id])
      departmentId String
    }

    model Department {
      id        String     @id @default(uuid())
      name      String
      employees Employee[]
    }
   ```

7. What are these commands?
   - What is `@default(uuid())`?
     - It is a Prisma attribute that generates a unique id for each record
   - What is `@unique`?
     - It is a Prisma attribute that makes the field unique.
   - What is `@relation`?
     - It is a Prisma attribute that creates a relationship between two models.
   - What is `Employee[]`?
     - It is a Prisma attribute that creates a one to many relationship between the Employee and Department models.
8. Execute the command on the terminal `npx env-cmd -f apps/prisma-api/.env npx prisma migrate dev --schema=apps\prisma-api\prisma\schema.prisma --name demo`
    - `npx env-cmd -f apps/prisma-api/.env` ensures that we communicate to prisma where our environment file is
    - `npx prisma migrate dev` migrates the database to the current schema
    - `--schema=apps\prisma-api\prisma\schema.prisma` tells prisma where the schema is
9. Configure GraphQL/Prisma/ generator
    - Execute `yarn add @nestjs/graphql class-transformer @nestjs/apollo graphql apollo-server-express` on the terminal
    - Execute `yarn add prisma-nestjs-graphql -D` on the terminal
    - Add `**@generated**` to the .gitignore file

    ```
      generator nestgraphql {
        provider = "prisma-nestjs-graphql"
        output = "./@generated"
      }
    ```

10. Set up Nestjs to handle graphql
    - Add the following to the `apps/prisma-api/src/app/app.module.ts` **file inside the imports array**

    ```
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        playground: true,
      }),

    ```
    - Import any missing packages
11.

Do you hear me?