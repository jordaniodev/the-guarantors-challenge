export type AddressStatus = 'valid' | 'corrected' | 'unverifiable';

export interface ParsedAddress {
  street?: string;
  number?: number;
  city?: string;
  state?: ParsedAddressState;
  zip?: string;
}

export interface ParsedAddressState {
  longName: string;
  shortName: string;
}

export interface AddressValidationResult {
  status: AddressStatus;
  address?: ParsedAddress;
  reasons?: string[];
}
