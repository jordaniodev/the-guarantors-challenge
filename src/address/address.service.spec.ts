import { BadRequestException } from '@nestjs/common';
import { AddressService } from './address.service';

describe('AddressService', () => {
  let service: AddressService;

  beforeEach(() => {
    service = new AddressService();
  });

  it('should return status valid when address is complete and unchanged', () => {
    const result = service.validate(
      '1600 Pennsylvania Avenue, Washington DC 20500'
    );

    expect(result.status).toBe('valid');
    expect(result.address).toEqual({
      number: 1600,
      street: 'pennsylvania avenue',
      city: 'washington',
      state: {
        shortName: 'DC',
        longName: 'District of Columbia',
      },
      zip: '20500',
    });
    expect(result.reasons).toBeUndefined();
  });

  it('should return status corrected when normalization happens', () => {
    const result = service.validate(
      '1600 Penn Ave, Washington DC 20500'
    );

    expect(result.status).toBe('corrected');
    expect(result.address).toBeDefined();
    expect(result.reasons).toBeUndefined();
  });

  it('should return unverifiable when required fields are missing', () => {
    const result = service.validate(
      'Washington DC'
    );

    expect(result.status).toBe('unverifiable');
    expect(result.address).toBeUndefined();
    expect(result.reasons).toContain('Missing number');
    expect(result.reasons).toContain('Missing zip');
    expect(result.reasons).toContain('Missing city')
  });

  it('should return unverifiable when state is invalid', () => {
    const result = service.validate(
      '123 Main Street, Austin ZZ 78701'
    );

    expect(result.status).toBe('unverifiable');
    expect(result.reasons).toContain('Invalid state');
  });

  it('should return unverifiable when zip is invalid', () => {
    const result = service.validate(
      '123 Main Street, Austin TX 78A01'
    );

    expect(result.status).toBe('unverifiable');
    expect(result.reasons).toContain('Missing zip');
  });

  it('should handle completely invalid input gracefully', () => {
     const result = service.validate('asdf qwer zxcv');

    expect(result.status).toBe('unverifiable');
    expect(result.reasons).toContain('Missing number');
    expect(result.reasons).toContain('Missing city');
    expect(result.reasons).toContain('Invalid state');
    expect(result.reasons).toContain('Missing zip');
  });

});
