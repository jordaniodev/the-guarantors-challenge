import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ValidateAddressDto {

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    address: string;
}
