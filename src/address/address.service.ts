import { BadRequestException, Injectable } from '@nestjs/common';
import { normalizeAddress } from './domain/address.normalizer';
import { parseAddress } from './domain/address.parser';
import { validateParsedAddress } from './domain/address.validator';
import { AddressValidationResult } from './domain/address.types';

@Injectable()
export class AddressService {
    validate(rawAddress: string): AddressValidationResult {
        const { normalized, changed } = normalizeAddress(rawAddress);
        const parsed = parseAddress(normalized);
        const { isValid, reasons } = validateParsedAddress(parsed);

        if (!isValid) {
            return {
                status: 'unverifiable',
                reasons,
            };
        }

        return {
            status: changed ? 'corrected' : 'valid',
            address: parsed,
        };
    }
}
