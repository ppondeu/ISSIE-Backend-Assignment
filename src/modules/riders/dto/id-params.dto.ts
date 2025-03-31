import { IsNotEmpty, Matches } from "class-validator";

export class IdParamsDto {
    @Matches(/^\d+$/, { message: 'id must be an integer' })
    @IsNotEmpty({ message: "ID is required" })
    id: string;
}
