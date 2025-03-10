import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRiderDto } from './dto/create-rider.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';
import { PrismaService } from 'src/modules/prisma';
import { Rider } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class RidersService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }
  async create(createRiderDto: CreateRiderDto): Promise<Rider> {
    try {
      const result = await this.prismaService.rider.create({ data: createRiderDto });
      return result;
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        console.error(`[PrismaError]: ${err.message}`);
        if (err.code === "P2002") {
          throw new BadRequestException(`Email#${createRiderDto.email} already exists.`);
        }
      }
    }
  }

  async findAll(): Promise<Rider[]> {
    const riders = await this.prismaService.rider.findMany({});
    console.log("reders", riders);
    return riders;
  }

  async findOne(id: number): Promise<Rider> {
    try {
      const result = await this.prismaService.rider.findUniqueOrThrow({ where: { id } })
      return result;
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new NotFoundException(`Rider with ID#${id} not found.`);
        }
      }
    }
  }

  async update(id: number, updateRiderDto: UpdateRiderDto): Promise<Rider> {
    try {
      const result = await this.prismaService.rider.update({
        data: updateRiderDto,
        where: { id },
      });
      return result;
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new BadRequestException(`Email#${updateRiderDto.email} already exists.`);
        } else if (err.code === "P2025") {
          throw new NotFoundException(`Rider with ID#${id} not found.`);
        }
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prismaService.rider.delete({ where: { id } });
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new NotFoundException(`Rider with ID#${id} not found.`);
        }
      }
    }
  }
}
