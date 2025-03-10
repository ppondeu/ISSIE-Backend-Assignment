import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";

export class CreateRiderDto {
    @Length(1, 32, { message: 'First name length must be between 1 - 32 character' })
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required' })
    firstName: string;

    @Length(1, 32, { message: 'Last name length must be between 1 - 32 character' })
    @IsString({ message: 'Last name must be a string' })
    @IsNotEmpty({ message: 'Last name is required' })
    lastName: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @IsString({ message: 'Email must be a string' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString({ message: 'License Plate must be a string' })
    @IsNotEmpty({ message: 'License Plate is required' })
    licensePlate: string;

    @IsPhoneNumber('TH', { message: "Phone Number is invalid" })
    @IsString({ message: "Phone Number must be a string" })
    @IsNotEmpty({ message: "Phone Number is required" })
    phoneNumber: string;
}
