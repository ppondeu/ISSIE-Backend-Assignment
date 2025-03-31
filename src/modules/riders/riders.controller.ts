import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { RidersService } from './riders.service';
import { CreateRiderDto, UpdateRiderDto, IdParamsDto, RiderIdParamsDto, LatLongDto } from './dto';
import { APIResponse } from 'src/common';
import { Rider, RiderLocation } from '@prisma/client';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Riders Controller')
@Controller('riders')
export class RidersController {
  constructor(private readonly ridersService: RidersService) { }

  @ApiOperation({ summary: 'Fetch rider within 5 Km.' })
  @ApiQuery({
    name: 'longitude',
    description: 'Longitude of the user location',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'latitude',
    description: 'Latitude of the user location',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fetch rider within 5 Km. successfully.',
    schema: {
      example: {
        statusCode: 200,
        message: ["Fetch rider within 5 Km. successfully."],
        data: [
          {
            "id": 1,
            "riderId": 2,
            "latitude": -20.1923,
            "longitude": 150.775565,
            "createdAt": "2025-03-10T06:40:04.956Z",
            "updatedAt": "2025-03-10T12:26:35.067Z",
            "rider": {
              "id": 2,
              "firstName": "Rico",
              "lastName": "Orelly",
              "email": "rico.orelly@gmail.com",
              "licensePlate": "บบ 1234 สงขลา",
              "phoneNumber": "0972345678",
              "createdAt": "2025-03-10T04:10:25.160Z",
              "updatedAt": "2025-03-10T04:10:25.160Z"
            }
          },
        ]
      }
    }
  })
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

  @ApiOperation({ summary: 'Create rider' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create rider successfully.',
    schema: {
      example: {
        statusCode: 201,
        message: ["Create rider successfully."],
        data: {
          "id": 1,
          "firstName": "Mike",
          "lastName": "Smith",
          "email": "mike.smith@gmail.com",
          "licensePlate": "1กข 1234 กรุงเทพมหานคร",
          "phoneNumber": "0812345678",
          "createdAt": "2025-03-31T15:10:24.543Z",
          "updatedAt": "2025-03-31T15:10:24.543Z",
        },
      },
    },
  })
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

  @ApiOperation({ summary: 'Fetch all riders' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fetch all rider successfully.',
    schema: {
      example: {
        "statusCode": 200,
        "message": [
          "Fetch all rider successfully."
        ],
        "data": [
          {
            "id": 2,
            "firstName": "Rico",
            "lastName": "Orelly",
            "email": "rico.orelly@gmail.com",
            "licensePlate": "บบ 1234 สงขลา",
            "phoneNumber": "0972345678",
            "createdAt": "2025-03-10T04:10:25.160Z",
            "updatedAt": "2025-03-10T04:10:25.160Z"
          },
          {
            "id": 4,
            "firstName": "Mark",
            "lastName": "Christ",
            "email": "mark.christ@gmail.com",
            "licensePlate": "1กข 5789 กรุงเทพมหานคร",
            "phoneNumber": "0912345678",
            "createdAt": "2025-03-10T05:08:20.733Z",
            "updatedAt": "2025-03-15T07:31:35.929Z"
          },
        ]
      }
    }
  })
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

  @ApiOperation({ summary: 'Fetch rider by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fetch rider by ID successfully.',
    schema: {
      example: {
        "statusCode": 200,
        "message": [
          "Fetch rider ID#2 successfully."
        ],
        "data": {
          "id": 2,
          "firstName": "Rico",
          "lastName": "Orelly",
          "email": "rico.orelly@gmail.com",
          "licensePlate": "บบ 1234 สงขลา",
          "phoneNumber": "0972345678",
          "createdAt": "2025-03-10T04:10:25.160Z",
          "updatedAt": "2025-03-10T04:10:25.160Z"
        }
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Rider ID',
    example: 2,
    required: true,
    type: Number,
  })
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

  @ApiOperation({ summary: 'Update rider by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update rider by ID successfully.',
    schema: {
      example: {
        "statusCode": 200,
        "message": [
          "Update rider ID#2 successfully."
        ],
        "data": {
          "id": 2,
          "firstName": "Rico",
          "lastName": "Orelly",
          "email": "rico.orelly@gmail.com",
          "licensePlate": "1กข 1234 กรุงเทพมหานคร",
          "phoneNumber": "0812345678",
          "createdAt": "2025-03-10T04:10:25.160Z",
          "updatedAt": "2025-03-31T14:54:31.582Z"
        }
      }
    }
  })
  @ApiParam({
    name: 'id',
    description: 'Rider ID',
    example: 2,
    required: true,
    type: Number,
  })
  @ApiBody({
    description: 'Update Rider',
    required: true,
    type: UpdateRiderDto,
    examples: {
      example1: {
        value: {
          licensePlate: '1กข 1234 กรุงเทพมหานคร',
          phoneNumber: '0812345678',
        },
      },
    },
  })
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

  @ApiOperation({ summary: 'Delete rider by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete rider by ID successfully.',
    schema: {
      example: {
        statusCode: 200,
        message: [`Delete rider ID#2 successfully.`],
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'Rider ID',
    example: 2,
    required: true,
    type: Number,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param() { id }: IdParamsDto) {
    await this.ridersService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: [`Delete rider ID#${id} successfully.`],
    } satisfies APIResponse<Rider>
  }

  @ApiOperation({ summary: 'Create or update rider location' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Create or update rider location successfully.',
    schema: {
      example: {
        "statusCode": 200,
        "message": [
          "Upsert rider location successfully."
        ],
        "data": {
          "id": 1,
          "riderId": 2,
          "latitude": -20.1923,
          "longitude": 150.775565,
          "createdAt": "2025-03-10T06:40:04.956Z",
          "updatedAt": "2025-03-31T15:19:41.469Z"
        }
      }
    }
  })
  @ApiParam({
    name: 'riderId',
    description: 'Rider ID',
    example: 2,
    required: true,
    type: Number,
  })
  @ApiBody({
    description: 'Rider Location',
    required: true,
    type: LatLongDto,
    examples: {
      example1: {
        value: {
          latitude: -20.1923,
          longitude: 150.775565,
        },
      },
    },
  })
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

  @ApiOperation({ summary: 'Fetch rider location by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fetch rider location by ID successfully.',
    schema: {
      examples: {
        example1: {
          "statusCode": 200,
          "message": [
            "Fetch rider location successfully."
          ],
          "data": {
            "id": 1,
            "riderId": 2,
            "latitude": -20.1923,
            "longitude": 150.775565,
            "createdAt": "2025-03-10T06:40:04.956Z",
            "updatedAt": "2025-03-10T12:26:35.067Z",
            "rider": {
              "id": 2,
              "firstName": "Rico",
              "lastName": "Orelly",
              "email": "rico.orelly@gmail.com",
              "licensePlate": "1กข 1234 กรุงเทพมหานคร",
              "phoneNumber": "0812345678",
              "createdAt": "2025-03-10T04:10:25.160Z",
              "updatedAt": "2025-03-31T14:54:31.582Z"
            }
          }
        },
      },
    },
  })
  @ApiParam({
    name: 'riderId',
    description: 'Rider ID',
    example: 2,
    required: true,
    type: Number,
  })
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
