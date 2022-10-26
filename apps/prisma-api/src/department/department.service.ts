import { Injectable } from '@nestjs/common';
import { PrismaService } from '../app/prisma.service';
import { Department, Prisma } from '@prisma/client';

@Injectable()
export class DepartmentService {
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
}
