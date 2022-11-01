import { Resolver, Query, Mutation, Args, Info } from '@nestjs/graphql';
import { EmployeeWhereUniqueInput } from '../../prisma/@generated/employee/employee-where-unique.input';
import { EmployeeCreateInput } from '../../prisma/@generated/employee/employee-create.input';
import { Employee } from '../../prisma/@generated/employee/employee.model';
import { EmployeeService } from './employee.service';
import { UpdateOneEmployeeArgs } from '../../prisma/@generated/employee/update-one-employee.args';
import { DepartmentService } from '../department/department.service';
import { GraphQLResolveInfo } from 'graphql';

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly departmentService: DepartmentService
  ) {}


  @Mutation(() => Employee)
  createEmployee(
    @Args('createEmployeeInput') createEmployeeInput: EmployeeCreateInput
  ) {
    return this.employeeService.create(createEmployeeInput);
  }

  @Query(() => [Employee], { name: 'employees' })
  findAll() {
    return this.employeeService.findAll();
  }

  @Query(() => Employee, { name: 'employee' })
  findOne(
    @Info() info: GraphQLResolveInfo,
    @Args('employeeWhereUniqueInput') employeeWhereUniqueInput: EmployeeWhereUniqueInput
  ) {
    console.log(info.fieldNodes[0].selectionSet.selections);
    return this.employeeService.findOne(employeeWhereUniqueInput);
  }

  @Mutation(() => Employee)
  updateEmployee(
    @Args() updateOneEmployeeArgs: UpdateOneEmployeeArgs
  ) {
    return this.employeeService.update(updateOneEmployeeArgs);
  }

  @Mutation(() => Employee)
  removeEmployee(
    @Args('employeeWhereUniqueInput') employeeWhereUniqueInput: EmployeeWhereUniqueInput
  ) {
    return this.employeeService.remove(employeeWhereUniqueInput);
  }

  // @ResolveField(() => Department)
  // async department(@Parent() employee: Employee) {
  //   return this.departmentService.getDepartmentOfEmployee(employee);
  // }
}
