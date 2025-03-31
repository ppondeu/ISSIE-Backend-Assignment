import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";

export class CreateRiderDto {
    @ApiProperty({ example: 'Mike', description: 'First name of the rider' })
    @Length(1, 32, { message: 'First name length must be between 1 - 32 character' })
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required' })
    firstName: string;

    @ApiProperty({ example: 'Smith', description: 'Last name of the rider' })
    @Length(1, 32, { message: 'Last name length must be between 1 - 32 character' })
    @IsString({ message: 'Last name must be a string' })
    @IsNotEmpty({ message: 'Last name is required' })
    lastName: string;

    @ApiProperty({ example: 'mike.smith@gmail.com', description: 'Email of the rider' })
    @IsEmail({}, { message: 'Invalid email format' })
    @IsString({ message: 'Email must be a string' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({ example: '1กข 1234 กรุงเทพมหานคร', description: 'License Plate of the rider' })
    @IsString({ message: 'License Plate must be a string' })
    @IsNotEmpty({ message: 'License Plate is required' })
    licensePlate: string;

    @ApiProperty({ example: '0812345678', description: 'Phone Number of the rider' })
    @IsPhoneNumber('TH', { message: "Phone Number is invalid" })
    @IsString({ message: "Phone Number must be a string" })
    @IsNotEmpty({ message: "Phone Number is required" })
    phoneNumber: string;
}
