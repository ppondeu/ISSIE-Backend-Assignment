import { Test, TestingModule } from '@nestjs/testing';
import { RidersController } from './riders.controller';
import { RidersService } from './riders.service';
import { CreateRiderDto, UpdateRiderDto } from './dto';
import { Rider, RiderLocation } from '@prisma/client';
import { HttpStatus } from '@nestjs/common';
import { APIResponse } from 'src/common';

describe('RidersController', () => {
    let ridersController: RidersController;
    let ridersService: RidersService;

    const mockRidersService = {
        findRidersWithinRadius: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        upsertLocation: jest.fn(),
        getLocation: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RidersController],
            providers: [
                {
                    provide: RidersService,
                    useValue: mockRidersService,
                },
            ],
        }).compile();

        ridersController = module.get<RidersController>(RidersController);
        ridersService = module.get<RidersService>(RidersService);
    });

    it('should be defined', () => {
        expect(ridersController).toBeDefined();
    });

    describe('create', () => {
        const createRiderDto: CreateRiderDto = {
            firstName: "สมชาย",
            lastName: "ใจดี",
            email: "somchai.jaidee@gmail.com",
            phoneNumber: "0812345678",
            licensePlate: "1กข 1234 กรุงเทพมหานคร",
        };

        const rider: Rider = {
            id: 1,
            firstName: "สมชาย",
            lastName: "ใจดี",
            email: "somchai.jaidee@gmail.com",
            phoneNumber: "0812345678",
            licensePlate: "1กข 1234 กรุงเทพมหานคร",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should create a new rider', async () => {
            const mockResponse: APIResponse<Rider> = {
                statusCode: HttpStatus.CREATED,
                message: ['Create rider successfully.'],
                data: rider,
            };
            mockRidersService.create.mockResolvedValue(rider);
            const result = await ridersController.create(createRiderDto);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('findAll', () => {
        const mockRiders: Rider[] = [
            {
                id: 1,
                firstName: "สมชาย",
                lastName: "สุขใจ",
                email: "somchai.sukjai@example.com",
                licensePlate: "1กข 1234 กรุงเทพมหานคร",
                phoneNumber: "081-234-5678",
                createdAt: new Date("2023-10-26T17:00:00+07:00"),
                updatedAt: new Date("2023-10-26T17:30:00+07:00"),
            },
            {
                id: 2,
                firstName: "สุดา",
                lastName: "ใจดี",
                email: "suda.jaidee@example.com",
                licensePlate: "2คฆ 5678 เชียงใหม่",
                phoneNumber: "089-876-5432",
                createdAt: new Date("2023-11-15T21:15:00+07:00"),
                updatedAt: new Date("2023-11-16T16:00:00+07:00"),
            },
            {
                id: 3,
                firstName: "ชัยวัฒน์",
                lastName: "มีชัย",
                email: "chaiwat.meechai@example.com",
                licensePlate: "3งจ 9012 ภูเก็ต",
                phoneNumber: "095-123-4567",
                createdAt: new Date("2023-12-06T01:45:00+07:00"),
                updatedAt: new Date("2023-12-06T02:00:00+07:00"),
            },
        ];

        const mockRidersResponse: APIResponse<Rider[]> = {
            statusCode: HttpStatus.OK,
            message: ['Fetch all rider successfully.'],
            data: mockRiders,
        };

        it('should return all riders', async () => {
            mockRidersService.findAll.mockResolvedValue(mockRiders);
            const result = await ridersController.findAll();
            expect(result).toEqual(mockRidersResponse);
        });
    });

    describe('findOne', () => {
        const rider: Rider = {
            id: 1,
            firstName: "สมชาย",
            lastName: "สุขใจ",
            email: "somchai.sukjai@example.com",
            licensePlate: "1กข 1234 กรุงเทพมหานคร",
            phoneNumber: "081-234-5678",
            createdAt: new Date("2023-10-26T17:00:00+07:00"),
            updatedAt: new Date("2023-10-26T17:30:00+07:00"),
        };

        const mockRiderResponse: APIResponse<Rider> = {
            statusCode: HttpStatus.OK,
            message: ['Fetch rider ID#1 successfully.'],
            data: rider,
        };

        it('should return a rider', async () => {
            mockRidersService.findOne.mockResolvedValue(rider);
            const result = await ridersController.findOne({ id: '1' });
            expect(result).toEqual(mockRiderResponse);
        });
    });

    describe('update', () => {
        const updateRiderDto: UpdateRiderDto = {
            firstName: "สมหมาย",
            email: "sommai.jaidee@gmail.com",
        };

        const rider: Rider = {
            id: 1,
            firstName: "สมหมาย",
            lastName: "ใจดี",
            email: "sommai.jaidee@gmail.com",
            phoneNumber: "0812345678",
            licensePlate: "1กข 1234 กรุงเทพมหานคร",
            createdAt: new Date("2023-10-26T17:00:00+07:00"),
            updatedAt: new Date(),
        };
        it('should update a rider', async () => {
            const mockRiderResponse: APIResponse<Rider> = {
                statusCode: HttpStatus.OK,
                message: ['Update rider ID#1 successfully.'],
                data: rider,
            };
            mockRidersService.update.mockResolvedValue(rider);
            const result = await ridersController.update({ id: '1' }, updateRiderDto);
            expect(result).toEqual(mockRiderResponse);
        });
    });

    describe('remove', () => {
        it('should remove a rider', async () => {
            mockRidersService.remove.mockResolvedValue(undefined);
            const mockResponse: APIResponse<undefined> = {
                statusCode: HttpStatus.OK,
                message: ['Delete rider ID#1 successfully.'],
                data: undefined,
            };
            const result = await ridersController.remove({ id: '1' });
            expect(result).toEqual(mockResponse);
        });
    });

    describe('search rider within radius area', () => {
        it('should return all riders within 5 Km', async () => {
            const mockRiderLocations: RiderLocation[] = [
                {
                    id: 1,
                    riderId: 3,
                    latitude: -20.1833,
                    longitude: 150.776565,
                    createdAt: new Date("2025-03-10T06:47:27.785Z"),
                    updatedAt: new Date("2025-03-10T08:35:09.037Z"),
                },
                {
                    id: 2,
                    riderId: 4,
                    latitude: -20.1823,
                    longitude: 150.775565,
                    createdAt: new Date("2025-03-10T06:47:27.785Z"),
                    updatedAt: new Date("2025-03-10T08:35:09.037Z"),
                },
                {
                    id: 3,
                    riderId: 5,
                    latitude: -20.1900,
                    longitude: 150.780000,
                    createdAt: new Date("2025-03-10T06:47:27.785Z"),
                    updatedAt: new Date("2025-03-10T08:35:09.037Z"),
                },
            ];

            const mockRiderLocationsResponse: APIResponse<RiderLocation[]> = {
                statusCode: HttpStatus.OK,
                message: ['Fetch rider within 5 Km. successfully.'],
                data: mockRiderLocations,
            };
            mockRidersService.findRidersWithinRadius.mockResolvedValue(mockRiderLocations);
            const result = await ridersController.searchRiders({ latitude: -20.1833, longitude: 150.776565 });
            expect(result).toEqual(mockRiderLocationsResponse);
        });
    });

    describe('upsert rider location', () => {
        it('should upsert rider location', async () => {
            const riderLocation: RiderLocation = {
                id: 1,
                riderId: 3,
                latitude: -20.1833,
                longitude: 150.776565,
                createdAt: new Date("2025-03-10T06:47:27.785Z"),
                updatedAt: new Date("2025-03-10T08:35:09.037Z"),
            };

            const mockRiderLocationResponse: APIResponse<RiderLocation> = {
                statusCode: HttpStatus.OK,
                message: ['Upsert rider location successfully.'],
                data: riderLocation,
            };
            mockRidersService.upsertLocation.mockResolvedValue(riderLocation);
            const result = await ridersController.upsertLocation({ riderId: '3'}, { latitude: -20.1833, longitude: 150.776565 });
            expect(result).toEqual(mockRiderLocationResponse);
        });
    });

    describe('get rider location by rider ID', () => {
        it('should return rider location', async () => {
            const riderLocation: RiderLocation = {
                id: 1,
                riderId: 3,
                latitude: -20.1833,
                longitude: 150.776565,
                createdAt: new Date("2025-03-10T06:47:27.785Z"),
                updatedAt: new Date("2025-03-10T08:35:09.037Z"),
            };

            const mockRiderLocationResponse: APIResponse<RiderLocation> = {
                statusCode: HttpStatus.OK,
                message: ['Fetch rider location successfully.'],
                data: riderLocation,
            };
            mockRidersService.getLocation.mockResolvedValue(riderLocation);
            const result = await ridersController.getLocation({ riderId: '3' });
            expect(result).toEqual(mockRiderLocationResponse);
        });
    });
});