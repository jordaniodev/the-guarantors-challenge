import { normalizeAddress } from '../address.normalizer';

describe('address.normalizer', () => {
    it('should normalize abbreviations', () => {
        const result = normalizeAddress('1600 Penn Ave');

        expect(result.normalized).toBe('1600 penn avenue');
        expect(result.changed).toBe(true);
    });

    it('should not mark as changed when no normalization happens', () => {
        const result = normalizeAddress('1600 pennsylvania avenue');

        expect(result.changed).toBe(false);
    });
});
