import { Test, TestingModule } from "@nestjs/testing";
import { RidersService } from "./riders.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRiderDto, CreateRiderLocationSchema, LatLongDto, UpdateRiderDto, UpdateRiderLocationSchema } from "./dto";
import { Rider, RiderLocation } from "@prisma/client";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { extractZodErrorMessage, haversine } from "src/common";

jest.mock("src/common", () => ({
    haversine: jest.fn(),
    extractZodErrorMessage: jest.fn(),
}));

describe("RidersService", () => {
    let ridersService: RidersService;
    let prismaService: PrismaService;

    const mockRiderPrisma = {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    const mockRiderLocationPrisma = {
        findUniqueOrThrow: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
    };

    const mockPrismaService = {
        rider: mockRiderPrisma,
        riderLocation: mockRiderLocationPrisma,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RidersService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        ridersService = module.get<RidersService>(RidersService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });


    it("should be defined", () => {
        expect(ridersService).toBeDefined();
    });

    describe("create rider", () => {
        const createRiderDto: CreateRiderDto = {
            firstName: "สมชาย",
            lastName: "ใจดี",
            email: "somchai.jaidee@gmail.com",
            phoneNumber: "0812345678",
            licensePlate: "1กข 1234 กรุงเทพมหานคร",
        };

        it("should create a rider successfully", async () => {
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

            mockRiderPrisma.create.mockResolvedValue(rider);

            const result = await ridersService.create(createRiderDto);

            expect(result).toEqual(rider);
            expect(mockRiderPrisma.create).toHaveBeenCalledTimes(1);
            expect(mockRiderPrisma.create).toHaveBeenCalledWith({
                data: createRiderDto,
            });
        });

        it("should throw a BadRequestException if email already exists (P2002 error)", async () => {
            const prismaError = new PrismaClientKnownRequestError("Unique constraint failed", {
                code: "P2002",
                clientVersion: "6.4.1",
            });

            mockRiderPrisma.create.mockRejectedValue(prismaError);
            const promise = ridersService.create(createRiderDto);

            await expect(promise).rejects.toThrow(
                new BadRequestException(`Email#${createRiderDto.email} already exists.`)
            );

            expect(mockRiderPrisma.create).toHaveBeenCalledTimes(1);
            expect(mockRiderPrisma.create).toHaveBeenCalledWith({
                data: createRiderDto,
            });
        });

    });

    describe("get all riders", () => {
        it("should return all riders", async () => {
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

            mockRiderPrisma.findMany.mockResolvedValue(mockRiders);
            const result = await ridersService.findAll();
            expect(result).toEqual(mockRiders);
            expect(mockRiderPrisma.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe("get one rider", () => {
        it("should return a rider", async () => {
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

            mockRiderPrisma.findUnique.mockResolvedValue(rider);
            const result = await ridersService.findOne(1);
            expect(result).toEqual(rider);
            expect(mockRiderPrisma.findUnique).toHaveBeenCalledTimes(1);
            expect(mockRiderPrisma.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it("should throw a NotFoundException if rider not found", async () => {
            mockRiderPrisma.findUnique.mockResolvedValue(null);
            const promise = ridersService.findOne(1);
            await expect(promise).rejects.toThrow(
                new NotFoundException(`Rider with ID#1 not found.`)
            );
            expect(mockRiderPrisma.findUnique).toHaveBeenCalledTimes(1);
            expect(mockRiderPrisma.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });
    });

    describe("update rider", () => {
        const updateRiderDto: UpdateRiderDto = {
            firstName: "สมหมาย",
            email: "sommai.jaidee@gmail.com",
        };

        it("should update a rider successfully", async () => {
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

            mockRiderPrisma.update.mockResolvedValue(rider);

            const result = await ridersService.update(1, updateRiderDto);

            expect(result).toEqual(rider);
            expect(mockRiderPrisma.update).toHaveBeenCalledTimes(1);
            expect(mockRiderPrisma.update).toHaveBeenCalledWith({
                data: updateRiderDto,
                where: { id: 1 },
            });
        });

        it("should throw a BadRequestException if email already exists (P2002 error)", async () => {
            const prismaError = new PrismaClientKnownRequestError("Unique constraint failed", {
                code: "P2002",
                clientVersion: "6.4.1",
            });

            mockRiderPrisma.update.mockRejectedValue(prismaError);
            const promise = ridersService.update(1, updateRiderDto);

            await expect(promise).rejects.toThrow(
                new BadRequestException(`Email#${updateRiderDto.email} already exists.`)
            );

            expect(mockRiderPrisma.update).toHaveBeenCalledTimes(1);
            expect(mockRiderPrisma.update).toHaveBeenCalledWith({
                data: updateRiderDto,
                where: { id: 1 },
            });
        });

        it("should throw a NotFoundException if rider not found (P2025 error)", async () => {
            const prismaError = new PrismaClientKnownRequestError("Record to update not found.", {
                code: "P2025",
                clientVersion: "6.4.1",
            });

            mockRiderPrisma.update.mockRejectedValue(prismaError);
            const promise = ridersService.update(1, updateRiderDto);

            await expect(promise).rejects.toThrow(
                new NotFoundException(`Rider with ID#1 not found.`)
            );

            expect(mockRiderPrisma.update).toHaveBeenCalledTimes(1);
            expect(mockRiderPrisma.update).toHaveBeenCalledWith({
                data: updateRiderDto,
                where: { id: 1 },
            });
        });
    });


    describe("delete rider", () => {
        it("should delete a rider successfully", async () => {
            mockRiderPrisma.delete.mockResolvedValue(undefined);
            await ridersService.remove(1);
            expect(mockRiderPrisma.delete).toHaveBeenCalledTimes(1);
            expect(mockRiderPrisma.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it("should throw a NotFoundException if rider not found (P2025 error)", async () => {
            const prismaError = new PrismaClientKnownRequestError("Record to delete not found.", {
                code: "P2025",
                clientVersion: "6.4.1",
            });

            mockRiderPrisma.delete.mockRejectedValue(prismaError);
            const promise = ridersService.remove(1);

            await expect(promise).rejects.toThrow(
                new NotFoundException(`Rider with ID#1 not found.`)
            );

            expect(mockRiderPrisma.delete).toHaveBeenCalledTimes(1);
            expect(mockRiderPrisma.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });
    });

    describe("get rider location", () => {
        it("should return rider location successfully", async () => {
            const mockLocation: RiderLocation = {
                id: 2,
                riderId: 4,
                latitude: -20.1823,
                longitude: 150.775565,
                createdAt: new Date("2025-03-10T06:47:27.785Z"),
                updatedAt: new Date("2025-03-10T08:35:09.037Z"),
            };

            mockRiderLocationPrisma.findUniqueOrThrow.mockResolvedValue(mockLocation);
            const result = await ridersService.getLocation(4);
            expect(result).toEqual(mockLocation);
            expect(mockRiderLocationPrisma.findUniqueOrThrow).toHaveBeenCalledTimes(1);
            expect(mockRiderLocationPrisma.findUniqueOrThrow).toHaveBeenCalledWith({
                where: { riderId: 4 },
                include: { rider: true },
            });
        });

        it("should throw a NotFoundException if rider location not found", async () => {
            const prismaError = new PrismaClientKnownRequestError("Record not found", {
                code: "P2025",
                clientVersion: "6.4.1",
            });

            mockRiderLocationPrisma.findUniqueOrThrow.mockRejectedValue(prismaError);

            await expect(ridersService.getLocation(4)).rejects.toThrow(new NotFoundException(`Rider with ID#4 not found.`));

            expect(mockRiderLocationPrisma.findUniqueOrThrow).toHaveBeenCalledTimes(1);
            expect(mockRiderLocationPrisma.findUniqueOrThrow).toHaveBeenCalledWith({
                where: { riderId: 4 },
                include: { rider: true },
            });
        });
    });

    describe("upsert rider location", () => {
        it("should update rider location if it exists", async () => {
            const riderId = 4;
            const upsertRiderLocationDto: LatLongDto = {
                latitude: -20.1723,
                longitude: 150.765565,
            };

            const riderLocation: RiderLocation = {
                id: 2,
                riderId: 4,
                latitude: -20.1823,
                longitude: 150.775565,
                createdAt: new Date("2025-03-10T06:47:27.785Z"),
                updatedAt: new Date("2025-03-10T08:35:09.037Z"),
            };
            const updatedAt = new Date();

            const updatedRiderLocation: RiderLocation = {
                id: 2,
                riderId: 4,
                latitude: -20.1723,
                longitude: 150.765565,
                createdAt: new Date("2025-03-10T06:47:27.785Z"),
                updatedAt: updatedAt,
            };

            jest.spyOn(ridersService, "findOne").mockResolvedValue({ id: riderId } as Rider);

            mockRiderLocationPrisma.findUnique.mockResolvedValue(riderLocation);

            UpdateRiderLocationSchema.safeParse = jest.fn().mockReturnValue({
                success: true,
                data: upsertRiderLocationDto,
            });

            mockRiderLocationPrisma.update.mockResolvedValue({
                ...riderLocation,
                ...upsertRiderLocationDto,
                updatedAt: updatedAt,
            });

            const result = await ridersService.upsertLocation(riderId, upsertRiderLocationDto);

            expect(result).toEqual(updatedRiderLocation);

            expect(UpdateRiderLocationSchema.safeParse).toHaveBeenCalledTimes(1);
            expect(UpdateRiderLocationSchema.safeParse).toHaveBeenCalledWith(upsertRiderLocationDto);
            expect(mockRiderLocationPrisma.update).toHaveBeenCalledTimes(1);
            expect(mockRiderLocationPrisma.update).toHaveBeenCalledWith({
                data: upsertRiderLocationDto,
                where: { riderId },
            });

            expect(mockRiderLocationPrisma.create).not.toHaveBeenCalled();
        });

        it("should throw BadRequestException in update if validation fails", async () => {
            const riderId = 4;
            const riderLocation: RiderLocation = {
                id: 2,
                riderId: 4,
                latitude: -20.1823,
                longitude: 150.775565,
                createdAt: new Date("2025-03-10T06:47:27.785Z"),
                updatedAt: new Date("2025-03-10T08:35:09.037Z"),
            };
            jest.spyOn(ridersService, "findOne").mockResolvedValue({ id: riderId } as Rider);

            mockRiderLocationPrisma.findUnique.mockResolvedValue(riderLocation);

            const upsertRiderLocationDto: any = { latitude: "invalid", longitude: 20.1 };

            const mockZodError = new ZodError([
                {
                    path: ["latitude"],
                    message: "Expected number, received string",
                    code: "invalid_type",
                    expected: "number",
                    received: "string",
                }
            ]);

            UpdateRiderLocationSchema.safeParse = jest.fn().mockReturnValue({
                success: false,
                error: mockZodError,
            });

            (extractZodErrorMessage as jest.Mock).mockReturnValue(["latitude: Expected number, received string"]);

            const promise = ridersService.upsertLocation(riderId, upsertRiderLocationDto);

            await expect(promise).rejects.toThrow(new BadRequestException(["latitude: Expected number, received string"]));


            expect(UpdateRiderLocationSchema.safeParse).toHaveBeenCalledTimes(1);
            expect(UpdateRiderLocationSchema.safeParse).toHaveBeenCalledWith(upsertRiderLocationDto);
            expect(mockRiderLocationPrisma.update).not.toHaveBeenCalled();
            expect(mockRiderLocationPrisma.create).not.toHaveBeenCalled();
        });

        it("should create rider location if it does not exist", async () => {
            const riderId = 4;
            const upsertRiderLocationDto: LatLongDto = {
                latitude: -20.1723,
                longitude: 150.765565,
            };

            const createdAt = new Date();

            const newRiderLocation: RiderLocation = {
                id: 2,
                riderId: 4,
                latitude: -20.1723,
                longitude: 150.765565,
                createdAt: createdAt,
                updatedAt: createdAt,
            };

            jest.spyOn(ridersService, "findOne").mockResolvedValue({ id: riderId } as Rider);

            mockRiderLocationPrisma.findUnique.mockResolvedValue(null);

            CreateRiderLocationSchema.safeParse = jest.fn().mockReturnValue({
                success: true,
                data: upsertRiderLocationDto,
            });

            mockRiderLocationPrisma.create.mockResolvedValue(newRiderLocation);

            const result = await ridersService.upsertLocation(riderId, upsertRiderLocationDto);

            expect(result).toEqual(newRiderLocation);

            expect(CreateRiderLocationSchema.safeParse).toHaveBeenCalledTimes(1);
            expect(CreateRiderLocationSchema.safeParse).toHaveBeenCalledWith(upsertRiderLocationDto);
            expect(mockRiderLocationPrisma.create).toHaveBeenCalledTimes(1);
            expect(mockRiderLocationPrisma.create).toHaveBeenCalledWith({
                data: {
                    ...upsertRiderLocationDto,
                    riderId,
                },
            });

            expect(mockRiderLocationPrisma.update).not.toHaveBeenCalled();
        });

        it("should throw BadRequestException in create if validation fails", async () => {
            const riderId = 4;
            const riderLocation: RiderLocation = {
                id: 2,
                riderId: 4,
                latitude: -20.1823,
                longitude: 150.775565,
                createdAt: new Date("2025-03-10T06:47:27.785Z"),
                updatedAt: new Date("2025-03-10T08:35:09.037Z"),
            };
            jest.spyOn(ridersService, "findOne").mockResolvedValue({ id: riderId } as Rider);

            mockRiderLocationPrisma.findUnique.mockResolvedValue(null);

            const upsertRiderLocationDto: any = { latitude: "invalid", longitude: 20.1 };

            const mockZodError = new ZodError([
                {
                    path: ["latitude"],
                    message: "Expected number, received string",
                    code: "invalid_type",
                    expected: "number",
                    received: "string",
                }
            ]);

            CreateRiderLocationSchema.safeParse = jest.fn().mockReturnValue({
                success: false,
                error: mockZodError,
            });

            (extractZodErrorMessage as jest.Mock).mockReturnValue(["latitude: Expected number, received string"]);

            const promise = ridersService.upsertLocation(riderId, upsertRiderLocationDto);
            await expect(promise).rejects.toThrow(new BadRequestException(["latitude: Expected number, received string"]));

            expect(CreateRiderLocationSchema.safeParse).toHaveBeenCalledTimes(1);
            expect(CreateRiderLocationSchema.safeParse).toHaveBeenCalledWith(upsertRiderLocationDto);
            expect(mockRiderLocationPrisma.update).not.toHaveBeenCalled();
            expect(mockRiderLocationPrisma.create).not.toHaveBeenCalled();
        });
    });

    describe("find riders within area", () => {
        it("should return riders within specified radius", async () => {
            const latitude = -20.1823;
            const longitude = 150.775565;
            const radius = 5;

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

            mockRiderLocationPrisma.findMany.mockResolvedValue(mockRiderLocations);
            (haversine as jest.Mock)
                .mockReturnValueOnce(2)
                .mockReturnValueOnce(5)
                .mockReturnValueOnce(15);

            const result = await ridersService.findRidersWithinRadius(latitude, longitude, radius);

            expect(result).toEqual([
                mockRiderLocations[0],
                mockRiderLocations[1],
            ]);

            expect(mockRiderLocationPrisma.findMany).toHaveBeenCalledTimes(1);
            expect(mockRiderLocationPrisma.findMany).toHaveBeenCalledWith({
                include: { rider: true },
            });

            expect(haversine).toHaveBeenCalledTimes(3);
            expect(haversine).toHaveBeenCalledWith(latitude, longitude, mockRiderLocations[0].latitude, mockRiderLocations[0].longitude);
            expect(haversine).toHaveBeenCalledWith(latitude, longitude, mockRiderLocations[1].latitude, mockRiderLocations[1].longitude);
            expect(haversine).toHaveBeenCalledWith(latitude, longitude, mockRiderLocations[2].latitude, mockRiderLocations[2].longitude);
        });
    });
});
