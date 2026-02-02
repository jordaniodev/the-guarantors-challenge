import { ParsedAddress, ParsedAddressState } from './address.types';

import { US_STATES } from '../data/us-states';
import { ADDRESS_REGEX } from './address.constant';

type InvalidRules = Partial<
    Record<keyof ParsedAddress, (value: string | undefined | number | ParsedAddressState) => boolean>
>;

export function validateParsedAddress(
    address: ParsedAddress
): { isValid: boolean; reasons: string[] } {
    const reasons: string[] = [];

    reasons.push(...validateMissingFields(address));
    reasons.push(...validateInvalidFields(address));

    return {
        isValid: reasons.length === 0,
        reasons,
    };
}


function validateMissingFields(address: ParsedAddress): string[] {
    const reasons: string[] = [];

    for (const [field, value] of Object.entries(address)) {
        if (!value) {
            reasons.push(`Missing ${field}`);
        }
    }

    return reasons;
}

function validateInvalidFields(address: ParsedAddress): string[] {
    const reasons: string[] = [];
    
    const invalidRules: InvalidRules = {
        state: (v:ParsedAddressState) => Boolean(v && US_STATES[v.shortName]),
        zip: (v) => Boolean(v && ADDRESS_REGEX.ZIP.test(String(v))),
    };

    for (const [field, validate] of Object.entries(invalidRules)) {
        const value = address[field as keyof ParsedAddress];
        if (value && !validate!(value)) {
            reasons.push(`Invalid ${field}`);
        }
    }

    return reasons;
}
