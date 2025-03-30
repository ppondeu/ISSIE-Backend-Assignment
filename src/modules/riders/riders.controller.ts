import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { RidersService } from './riders.service';
import { CreateRiderDto, UpdateRiderDto, IdParamsDto, RiderIdParamsDto, LatLongDto } from './dto';
import { APIResponse } from 'src/common';
import { Rider, RiderLocation } from '@prisma/client';

@Controller('riders')
export class RidersController {
  constructor(private readonly ridersService: RidersService) { }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchRiders(@Query() { latitude, longitude }: LatLongDto): Promise<APIResponse<RiderLocation[]>> {
    const result = await this.ridersService.findRidersWithinRadius(latitude, longitude);
    return {
      statusCode: HttpStatus.OK,
      message: ["Fetch rider within 5 Km. successfully."],
      data: result,
    } satisfies APIResponse<RiderLocation[]>
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRiderDto: CreateRiderDto): Promise<APIResponse<Rider>> {
    const result = await this.ridersService.create(createRiderDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: ["Create rider successfully."],
      data: result,
    } satisfies APIResponse<Rider>
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<APIResponse<Rider[]>> {
    const result = await this.ridersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: ["Fetch all rider successfully."],
      data: result,
    } satisfies APIResponse<Rider[]>
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param() { id }: IdParamsDto) {
    const result = await this.ridersService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: [`Fetch rider ID#${id} successfully.`],
      data: result,
    } satisfies APIResponse<Rider>
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param() { id }: IdParamsDto, @Body() updateRiderDto: UpdateRiderDto) {
    const result = await this.ridersService.update(+id, updateRiderDto);
    return {
      statusCode: HttpStatus.OK,
      message: [`Update rider ID#${id} successfully.`],
      data: result,
    } satisfies APIResponse<Rider>
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param() { id }: IdParamsDto) {
    await this.ridersService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: [`Delete rider ID#${id} successfully.`],
    } satisfies APIResponse<Rider>
  }

  @Post(':riderId/locations')
  @HttpCode(HttpStatus.OK)
  async upsertLocation(@Param() { riderId }: RiderIdParamsDto, @Body() upsertRiderLocationDto: any): Promise<APIResponse<RiderLocation>> {
    const result = await this.ridersService.upsertLocation(+riderId, upsertRiderLocationDto);
    return {
      statusCode: HttpStatus.OK,
      message: ["Upsert rider location successfully."],
      data: result,
    } satisfies APIResponse<RiderLocation>
  }

  @Get(':riderId/locations')
  @HttpCode(HttpStatus.OK)
  async getLocation(@Param() { riderId }: RiderIdParamsDto): Promise<APIResponse<RiderLocation>> {
    const result = await this.ridersService.getLocation(+riderId);
    return {
      statusCode: HttpStatus.OK,
      message: ["Fetch rider location successfully."],
      data: result,
    } satisfies APIResponse<RiderLocation>
  }

}
