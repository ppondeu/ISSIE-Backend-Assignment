import { z } from 'zod';

export class CreateRiderLocationDto {
    latitude: number;
    longitude: number;
}

export class UpdateRiderLocationDto {
    latitude?: number;
    longitude?: number;
}

export const CreateRiderLocationSchema = z.object({
    latitude: z
        .number()
        .min(-90, { message: 'Latitude must be between -90 and 90' })
        .max(90, { message: 'Latitude must be between -90 and 90' })
        .refine((val) => !isNaN(val), { message: 'Latitude must be a number' }),

    longitude: z
        .number()
        .min(-180, { message: 'Longitude must be between -180 and 180' })
        .max(180, { message: 'Longitude must be between -180 and 180' })
        .refine((val) => !isNaN(val), { message: 'Longitude must be a number' }),
});

export const UpdateRiderLocationSchema = z.object({
    latitude: z
        .number()
        .min(-90, { message: 'Latitude must be between -90 and 90' })
        .max(90, { message: 'Latitude must be between -90 and 90' })
        .optional(),

    longitude: z
        .number()
        .min(-180, { message: 'Longitude must be between -180 and 180' })
        .max(180, { message: 'Longitude must be between -180 and 180' })
        .optional()
});
