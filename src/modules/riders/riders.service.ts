import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { Rider, RiderLocation } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateRiderDto, CreateRiderLocationDto, CreateRiderLocationSchema, UpdateRiderDto, UpdateRiderLocationDto, UpdateRiderLocationSchema } from './dto';
import { haversine, extractZodErrorMessage } from 'src/common';

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

  async upsertLocation(riderId: number, upsertRiderLocationDto: any): Promise<RiderLocation> {
    await this.findOne(riderId);

    const existingLocation = await this.prismaService.riderLocation.findUnique({
      where: { riderId },
    });

    if (existingLocation) {
      const validated = UpdateRiderLocationSchema.safeParse(upsertRiderLocationDto);
      if (!validated.success) {
        throw new BadRequestException(extractZodErrorMessage(validated.error));
      }

      const updateRiderLocationDto: UpdateRiderLocationDto = {
        latitude: validated.data.latitude,
        longitude: validated.data.longitude
      }

      const result = await this.prismaService.riderLocation.update({
        data: updateRiderLocationDto,
        where: { riderId }
      })

      return result;
    } else {
      const validated = CreateRiderLocationSchema.safeParse(upsertRiderLocationDto);
      if (!validated.success) {
        throw new BadRequestException(extractZodErrorMessage(validated.error));
      }

      const createRiderLocationDto: CreateRiderLocationDto = {
        latitude: validated.data.latitude,
        longitude: validated.data.longitude
      }

      const result = await this.prismaService.riderLocation.create({
        data: {
          ...createRiderLocationDto,
          riderId,
        },
      })
      return result;
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

  async findRidersWithinRadius(latitude: number, longitude: number, radius = 5): Promise<RiderLocation[]> {
    const riders = await this.prismaService.riderLocation.findMany({ include: { rider: true } });

    return riders.filter(rider => {
      const distance = haversine(latitude, longitude, rider.latitude, rider.longitude);
      console.log("dist", distance);
      console.log("red", radius);
      return distance <= radius;
    });
  }

}
