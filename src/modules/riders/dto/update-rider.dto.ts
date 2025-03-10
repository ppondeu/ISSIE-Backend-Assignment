import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";

export class UpdateRiderDto {
    @Length(1, 32, { message: 'First name length must be between 1 - 32 character' })
    @IsString({ message: 'First name must be a string' })
    @IsOptional()
    firstName: string;

    @Length(1, 32, { message: 'Last name length must be between 1 - 32 character' })
    @IsString({ message: 'Last name must be a string' })
    @IsOptional()
    lastName: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @IsString({ message: 'Email must be a string' })
    @IsOptional()
    email: string;

    @IsString({ message: 'License Plate must be a string' })
    @IsOptional()
    licensePlate: string;

    @IsPhoneNumber('TH', { message: "Phone Number is invalid" })
    @IsString({ message: "Phone Number must be a string" })
    @IsOptional()
    phoneNumber: string;
}
