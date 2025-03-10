import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { Rider, RiderLocation } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpsertRiderLocationDto, CreateRiderDto, UpdateRiderDto } from './dto';

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
    return this.prismaService.rider.findMany({});
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

  async upsertLocation(riderId: number, upsertRiderLocationDto: UpsertRiderLocationDto): Promise<RiderLocation> {
    await this.findOne(riderId);
    try {
      const result = await this.prismaService.riderLocation.upsert({
        where: { riderId },
        update: upsertRiderLocationDto,
        create: {
          ...upsertRiderLocationDto,
          riderId,
        },
        include: { rider: true },
      });
      return result;
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new BadRequestException(`Email#${riderId} already exists.`);
        } else if (err.code === "P2025") {
          throw new NotFoundException(`Rider with ID#${riderId} not found.`);
        }
      }
    }
  }

  async getLocation(riderId: number) {
    try {
      const result = await this.prismaService.riderLocation.findUniqueOrThrow({
        where: { riderId },
        include: { rider: true },
      });

      return result;
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new NotFoundException(`Rider with ID#${riderId} not found.`);
        }
      }
    }
  }

}
