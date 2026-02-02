import { extractState,  extractStreetAndCity,  extractZip, parseAddress } from "../address.parser";


describe('address.parser – unit tests', () => {

  // ---------------- ZIP ----------------

  describe('extractZip', () => {
    it('should extract zip code', () => {
      expect(extractZip('DC 20500')).toBe('20500');
    });

    it('should return undefined when zip is missing', () => {
      expect(extractZip('Washington DC')).toBeUndefined();
    });
  });

  // ---------------- STATE ----------------

  describe('extractState', () => {
    it('should extract state short and long name', () => {
      const result = extractState('Washington DC');

      expect(result).toEqual({
        shortName: 'DC',
        longName: 'District of Columbia',
      });
    });

    it('should return empty state when not found', () => {
      const result = extractState('Washington');

      expect(result).toEqual({
        shortName: '',
        longName: '',
      });
    });

    it('should not match substrings', () => {
      const result = extractState('Floor Street');

      expect(result.shortName).toBe('');
    });
  });

  // ---------------- STREET + CITY ----------------

  describe('extractStreetAndCity', () => {
    it('should extract number, street and city', () => {
      const result = extractStreetAndCity(
        '1600 Pennsylvania Avenue, Washington'
      );

      expect(result).toEqual({
        number: 1600,
        street: 'Pennsylvania Avenue',
        city: 'Washington',
      });
    });

    it('should handle missing number', () => {
      const result = extractStreetAndCity(
        'Pennsylvania Avenue, Washington'
      );

      expect(result.number).toBeNaN();
      expect(result.street).toBe('Pennsylvania Avenue');
    });

    it('should handle missing city', () => {
      const result = extractStreetAndCity(
        '1600 Pennsylvania Avenue'
      );

      expect(result.city).toBeUndefined();
    });
  });

  // ---------------- FULL PARSER ----------------

  describe('parseAddress', () => {
    it('should parse full address correctly', () => {
      const result = parseAddress(
        '1600 Pennsylvania Avenue, Washington DC 20500'
      );

      expect(result).toEqual({
        number: 1600,
        street: 'Pennsylvania Avenue',
        city: 'Washington',
        state: {
          shortName: 'DC',
          longName: 'District of Columbia',
        },
        zip: '20500',
      });
    });
  });
});
