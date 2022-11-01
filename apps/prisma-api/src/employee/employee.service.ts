import { Injectable } from '@nestjs/common';
import { Employee, Prisma } from '@prisma/client';
import { PrismaService } from '../app/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.EmployeeCreateInput) {
    return this.prisma.employee.create({ data });
  }

  async findAll(): Promise<Employee[]> {
    return this.prisma.employee.findMany();
  }

  async findOne(where: Prisma.EmployeeWhereUniqueInput): Promise<Employee> {
    return this.prisma.employee.findUnique({
      where,
      include: {
        department: true,
      },
    });
  }

  async update(employeeUpdateArgs: Prisma.EmployeeUpdateArgs) {
    const { where, data } = employeeUpdateArgs;

    return this.prisma.employee.update({
      where,
      data,
    });
  }

  async remove(where: Prisma.EmployeeWhereUniqueInput): Promise<Employee> {
    return this.prisma.employee.delete({ where });
  }
}
