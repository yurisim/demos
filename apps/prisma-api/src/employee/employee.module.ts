import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { PrismaService } from '../app/prisma.service';
import { DepartmentService } from '../department/department.service';

@Module({
  providers: [EmployeeResolver, EmployeeService, PrismaService, DepartmentService],
})
export class EmployeeModule {}
