
## PART 1: Configuration

1. Install newest version of NX cli on the command prompt
   - `npm install -g nx`
2. Create a Nest Nx workspace on the command prompt
   - `npx create-nx-workspace demos --package-manager=yarn`
   - Choose your style => Select integrated using the arrow keys.
   - What to create in the new workspace => Select Nest
   - Application name => prisma-api
   - When asked to enable distributed caching to make your CI faster => Select No
3. Open folder you just created (demos) in VS Code
4. Install Prisma in the folder you created.
   - `yarn add prisma prisma-nestjs-graphql -D`
   - `yarn add @prisma/client @nestjs/graphql class-transformer @nestjs/apollo graphql apollo-server-express`
5. Configure Prisma
   - `npx prisma init`
   - Move the prisma folder and `.env` into the apps/prisma-api folder
   - Change the provider in the prisma schema to sqlite
   - Change the datasource in the `.env` to `DATABASE_URL="file:./dev.db"`
6. Copy and paste the following at the end of the `prisma.schema` file,

   ```
    model Employee {
      id           String     @id @default(uuid())
      name         String
      ssn          Int     @unique
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
     - It is a Prisma attribute that generates a unique string id for each record.
   - What is `@unique`?
     - It is a Prisma attribute that makes the field unique.
   - What is `@relation`?
     - It is a Prisma attribute that creates a relationship between two models.
   - What is `Employee[]`?
     - It is a Prisma attribute that creates a one to many relationship between the Employee and Department models.
8. Execute this command on the terminal: `npx env-cmd -f apps/prisma-api/.env npx prisma migrate dev --schema=apps\prisma-api\prisma\schema.prisma --name demo`. The explanation for this command is as follows:
   - `npx env-cmd -f apps/prisma-api/.env` ensures that we communicate to prisma where our environment file is
   - `npx prisma migrate dev` migrates the database to the current schema
   - `--schema=apps\prisma-api\prisma\schema.prisma` tells prisma where the schema is
9. Configure GraphQL/Prisma/ generator
   - Add `**@generated**` and `**migrations**` on seperate lines in the `.gitignore` file
   - Add the below block into the schema.prisma
   ```
     generator nestgraphql {
       provider = "prisma-nestjs-graphql"
       output = "./@generated"
     }
   ```
10. Set up Nestjs to handle graphql

    - Add the following to the `apps/prisma-api/src/app/app.module.ts` file inside the **imports array**

    ```
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        autoSchemaFile: true,
      }),
    ```

    - Import any missing packages, note that the `import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';` will not autoimport, you will have to manually import it.
    - Execute `nx generate @nrwl/nest:resource department --project=prisma-api --language=ts --type=graphql-code-first --no-interactive` on the terminal or feel free to use the nx console if you feel more comfortable.
    - Now delete the entities and dto folders in `apps\prisma-api\src\department`
      - We will be using the prisma generated files instead
    - Execute this command on the terminal `npx env-cmd -f apps/prisma-api/.env npx prisma migrate dev --schema=apps\prisma-api\prisma\schema.prisma --name demo`
    - Remove the entity and dto imports from the `department.service.ts` and `department.resolver.ts` file
    - In `department.resolver.ts` delete all the methods except for findAll(), and createDepartment()

      - Replace the findOne() method with the following

      ```
          @Query(() => Department, { name: 'department' })
            findOne(
              @Args('departmentWhereUniqueInput') departmentWhereUniqueInput: DepartmentWhereUniqueInput
            ) {
              return this.departmentService.findOne(departmentWhereUniqueInput);
            }
          }
      ```

      - Change `@Query(() => [Department], { name: 'department' })` above the findAll in the resolver file to instead have `{ name: 'departments' }`.

      - Change the missing type in the createDepartment() method to DepartmentCreateWithoutEmployeesInput and import it

    - In `department.service.ts` replece the class methods with the following

      ```
        constructor(private prisma: PrismaService) {}

        async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
          return this.prisma.department.create({ data });
        }

        async findAll(): Promise<Department[]> {
          return this.prisma.department.findMany();
        }

        async findOne(where: Prisma.DepartmentWhereUniqueInput): Promise<Department> {
          return this.prisma.department.findUnique({ where });
        }
      ```

      - Import any missing types

11. Configure Service File

    - Execute the following command on the terminal:
    - `yarn nx generate @nrwl/nest:service prisma --project=prisma-api --directory=app --flat --unitTestRunner=none --no-interactive`
    - Replace the contents of the prisma.service.ts file with the following:

    ```
        import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
        import { PrismaClient } from '@prisma/client';

        @Injectable()
        export class PrismaService extends PrismaClient implements OnModuleInit {
          async onModuleInit() {
            await this.$connect();
          }

        async enableShutdownHooks(app: INestApplication) {
          this.$on('beforeExit', async () => {
            await app.close();
          });
        }
      }
    ```

12. Updating Providers and Imports
    - `app.module.ts`
      - Import the DepartmentModule to the imports array
      - Add the PrismaService to the providers array
    - `department.module.ts`
      - Add the PrismaService to the providers array
13. To run the application execute `yarn nx serve prisma-api` on the terminal
14. To test the application, open up the graphql playground at `http://localhost:3333/graphql` and try a query.

## PART 2: EMPLOYEES

15. Add the employee resource
    - `nx generate @nrwl/nest:resource employee --project=prisma-api --language=ts --type=graphql-code-first --no-interactive`
    - Delete the entities and dto folders in `apps\prisma-api\src\employee`
    - Replace the missing imports with the correct paths in the @generated folder
      - THe Employee model is as follows: `import { Employee } from '../../prisma/@generated/employee/employee.model';`
      - Replace the type `CreateEmployeeInput` w/ `EmployeeCreateInput`
      - Replace the type `UpdateEmployeeInput` w/ `EmployeeUpdateInput`
      - Change the `employee` above the findMany in `@Query(() => [Employee], { name: 'employee' })` IE `{ name: 'employees' }`
      - Replace the `findOne()` method with the following
        ```
          @Query(() => Employee, { name: 'employee' })
          findOne(
            @Args('employeeWhereUniqueInput') employeeWhereUniqueInput: EmployeeWhereUniqueInput
          ) {
            return this.employeeService.findOne(employeeWhereUniqueInput);
          }
        ```
      - Replace the `updateEmployee()` method with the following
        ```
          @Mutation(() => Employee)
          updateEmployee(
            @Args() updateOneEmployeeArgs: UpdateOneEmployeeArgs
          ) {
            return this.employeeService.update(updateOneEmployeeArgs);
          }
        ```
      - Replace the `removeEmployee()` method with the following
        ```
          @Mutation(() => Employee)
          removeEmployee(
            @Args('employeeWhereUniqueInput') employeeWhereUniqueInput: EmployeeWhereUniqueInput
          ) {
            return this.employeeService.remove(employeeWhereUniqueInput);
          }
        ```
16. Add prisma to the constructor of the employee service
    - `constructor(private prisma: PrismaService) {}`
    - Add the PrismaService to the providers array in the employee module
17. Update the methods in the `employee.service.ts` file to the following
    - Replace the `create()` method with the following
      ```
        async create(data: Prisma.EmployeeCreateInput): Promise<Employee> {
          return this.prisma.employee.create({ data });
        }
      ```
    - Replace the `findAll()` method with the following
      ```
        async findAll(): Promise<Employee[]> {
          return this.prisma.employee.findMany();
        }
      ```
    - Replace the `findOne()` method with the following
      ```
        async findOne(where: Prisma.EmployeeWhereUniqueInput): Promise<Employee> {
          return this.prisma.employee.findUnique({ where });
        }
      ```
    - Replace the `update()` method with the following
      ```
        async update(employeeUpdateArgs: Prisma.EmployeeUpdateArgs) {
          const { where, data } = employeeUpdateArgs;

          return this.prisma.employee.update({
            where,
            data,
          });
        }
      ```
    - Replace the `remove()` method with the following
      ```
        async remove(where: Prisma.EmployeeWhereUniqueInput): Promise<Employee> {
          return this.prisma.employee.delete({ where });
        }
      ```
18. Add the employee module to the imports array in the app module. Run a query from the graphql playground to test the application.

## PART 3: ADVANCED STUFF

19. We want to be able to run the following command on the GQL playground
  ```
    query Employee($employeeWhereUniqueInput: EmployeeWhereUniqueInput!) {
      employee(employeeWhereUniqueInput: $employeeWhereUniqueInput) {
        name
        department {
          name
          id
        }
        ssn
      }
    }
  ```
  - How do we get this to work? Two Ways. **COMMIT YOUR WORK NOW** so you can easily reset when we swap methods.
  - Option 1: `@ResolveField` Method
    - Add the following to the end of the class in the employee resolver
    ```
      @ResolveField(() => Department)
      async department(@Parent() employee: Employee) {
        return this.departmentService.getDepartmentOfEmployee(employee);
      }
    ```
    - Add any missing imports.
    - Add the department service to the constructor of the employee resolver, also add the department service to the providers array in the employee module.
    - Query should now work. However this causes an N+1 Issue when we batch multiple queries. What happens if we run this command?
    ```
      query Employees {
        employees {
          name
          department {
            name
            id
          }
          ssn
        }
      }
    ```
  - Pros: Don't need to add it to each resolver, method, etc.
  - Cons: N+1 Issue, might expose types that you don't want to expose.
  - Option 2: `Includes` Method
    - In the emplo

