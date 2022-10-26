import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DepartmentCreateWithoutEmployeesInput } from 'apps/prisma-api/prisma/@generated/department/department-create-without-employees.input';
import { DepartmentWhereUniqueInput } from 'apps/prisma-api/prisma/@generated/department/department-where-unique.input';
import { Department } from 'apps/prisma-api/prisma/@generated/department/department.model';
import { DepartmentService } from './department.service';

@Resolver(() => Department)
export class DepartmentResolver {
  constructor(private readonly departmentService: DepartmentService) {}

  @Mutation(() => Department)
  createDepartment(
    @Args('createDepartmentInput')
    createDepartmentInput: DepartmentCreateWithoutEmployeesInput
  ) {
    return this.departmentService.create(createDepartmentInput);
  }

  @Query(() => [Department], { name: 'departments' })
  findAll() {
    return this.departmentService.findAll();
  }

  @Query(() => Department, { name: 'department' })
  findOne(
    @Args('uniqueDepartmentArgs') uniqueDepartmentArgs: DepartmentWhereUniqueInput
  ) {
    return this.departmentService.findOne(uniqueDepartmentArgs);
  }
}
