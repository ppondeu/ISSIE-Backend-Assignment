import { Transform } from 'class-transformer';
import { IsNumber, Max, Min, IsDefined } from 'class-validator';

export class LatLongDto {
    @IsDefined({ message: 'Latitude is required.' })
    @Transform(({ value }) => {
        if (isNaN(value) || value === '' || value === null) {
            throw new Error('Latitude must be a valid number.');
        }
        return Number(value);
    })
    @IsNumber({}, { message: 'Latitude must be a valid number.' })
    @Min(-90, { message: 'Latitude must be between -90 and 90.' })
    @Max(90, { message: 'Latitude must be between -90 and 90.' })
    latitude: number;

    @IsDefined({ message: 'Longitude is required.' })
    @Transform(({ value }) => {
        if (isNaN(value) || value === '' || value === null) {
            throw new Error('Longitude must be a valid number.');
        }
        return Number(value);
    })
    @IsNumber({}, { message: 'Longitude must be a valid number.' })
    @Min(-180, { message: 'Longitude must be between -180 and 180.' })
    @Max(180, { message: 'Longitude must be between -180 and 180.' })
    longitude: number;
}
