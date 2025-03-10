import { IsNotEmpty, Matches } from "class-validator";

export class RiderIdParamsDto {
    @Matches(/^\d+$/, { message: 'id must be an integer' })
    @IsNotEmpty({ message: "ID is required" })
    riderId: string;
}
