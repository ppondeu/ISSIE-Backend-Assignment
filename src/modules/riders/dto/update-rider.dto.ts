import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

export class UpdateRiderDto {
    @ApiPropertyOptional({ example: 'Mike', description: 'First name of the rider' })
    @Length(1, 32, { message: 'First name length must be between 1 - 32 character' })
    @IsString({ message: 'First name must be a string' })
    @IsOptional()
    firstName?: string;

    @ApiPropertyOptional({ example: 'Smith', description: 'Last name of the rider' })
    @Length(1, 32, { message: 'Last name length must be between 1 - 32 character' })
    @IsString({ message: 'Last name must be a string' })
    @IsOptional()
    lastName?: string;

    @ApiPropertyOptional({ example: 'mike.smith@gmail.com', description: 'Email of the rider' })
    @IsEmail({}, { message: 'Invalid email format' })
    @IsString({ message: 'Email must be a string' })
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ example: '1กข 1234 กรุงเทพมหานคร', description: 'License Plate of the rider' })
    @IsString({ message: 'License Plate must be a string' })
    @IsOptional()
    licensePlate?: string;

    @ApiPropertyOptional({ example: '0812345678', description: 'Phone Number of the rider' })
    @IsPhoneNumber('TH', { message: "Phone Number is invalid" })
    @IsString({ message: "Phone Number must be a string" })
    @IsOptional()
    phoneNumber?: string;
}
