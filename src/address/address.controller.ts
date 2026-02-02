import { Body, Controller, Post, HttpCode, BadRequestException } from '@nestjs/common';
import { AddressService } from './address.service';
import { ValidateAddressDto } from './dto/address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post('validate')
  @HttpCode(200)
  validate(@Body() dto: ValidateAddressDto) {
    const result = this.addressService.validate(dto.address);

    if (result.status === 'unverifiable') {
      throw new BadRequestException({
        message: 'Address is unverifiable',
        reasons: result.reasons,
      });
    }

    return result;
  }
}