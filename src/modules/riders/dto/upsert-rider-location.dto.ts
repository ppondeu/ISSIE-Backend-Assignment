import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class UpsertRiderLocationDto {
    @Min(-90, { message: 'Latitude must be between -90 and 90' })
    @Max(90, { message: 'Latitude must be between -90 and 90' })
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @Min(-180, { message: 'Longitude must be between -180 and 180' })
    @Max(180, { message: 'Longitude must be between -180 and 180' })
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}