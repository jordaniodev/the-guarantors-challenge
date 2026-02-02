import { ParsedAddress, ParsedAddressState } from './address.types';

import { US_STATES } from '../data/us-states';
import { ADDRESS_REGEX } from './address.constant';

export function parseAddress(input: string): ParsedAddress {
    return {
        zip: extractZip(input),
        state: extractState(input),
        ...extractStreetAndCity(input),
    };
}


export function extractZip(input: string): string | undefined {
    return input.match(ADDRESS_REGEX.ZIP)?.[0];
}

export function extractState(input: string): ParsedAddressState {
    const upper = input.toUpperCase();

    const state = Object.keys(US_STATES).find((state) =>
        ADDRESS_REGEX.STATE_CODE(state).test(upper)
    );

    return {
        longName: state ? US_STATES[state] : '',
        shortName: state || '',
    };
}

export function extractStreetAndCity(
  input: string
): Pick<ParsedAddress, 'street' | 'number' | 'city'> {
  const parts = input.split(',').map((p) => p.trim());

  const streetPart = parts[0] ?? '';
  const locationPart = parts[1] ?? '';

  const number = Number(
    streetPart.match(ADDRESS_REGEX.STREET_NUMBER)?.[0]
  );

  const street = streetPart
    .replace(ADDRESS_REGEX.STREET_NUMBER, '')
    .trim();

  let city = locationPart;

  city = city.replace(ADDRESS_REGEX.ZIP, '').trim();

  Object.keys(US_STATES).forEach((state) => {
    city = city.replace(
      ADDRESS_REGEX.STATE_CODE(state),
      ''
    ).trim();
  });

  return {
    number,
    street,
    city: city || undefined,
  };
}
