import {
    parseAddress,
} from '../address.parser';

import { ADDRESS_REGEX } from '../address.constant';
import { US_STATES } from '../../data/us-states';

describe('address.parser', () => {
    describe('parseAddress', () => {
        it('should parse a complete address', () => {
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

        it('should parse address without zip', () => {
            const result = parseAddress(
                '1600 Pennsylvania Avenue, Washington DC'
            );

            expect(result.zip).toBeUndefined();
            expect(result.state?.shortName).toBe('DC');
        });

        it('should return empty state when no state is found', () => {
            const result = parseAddress(
                '1600 Pennsylvania Avenue, Washington'
            );

            expect(result.state).toEqual({
                shortName: '',
                longName: '',
            });
        });

        it('should handle missing number', () => {
            const result = parseAddress(
                'Pennsylvania Avenue, Washington DC 20500'
            );

            expect(result.number).toBeNaN();
            expect(result.street).toBe('Pennsylvania Avenue');
        });

        it('should handle input without city', () => {
            const result = parseAddress(
                '1600 Pennsylvania Avenue DC 20500'
            );

            expect(result.city).toBeUndefined();
        });
    });

    describe('ZIP regex', () => {
        it('should match valid zip codes', () => {
            expect('20500'.match(ADDRESS_REGEX.ZIP)?.[0]).toBe('20500');
            expect('20500-1234'.match(ADDRESS_REGEX.ZIP)?.[0]).toBe('20500-1234');
        });

        it('should not match invalid zip codes', () => {
            expect('20A00'.match(ADDRESS_REGEX.ZIP)).toBeNull();
            expect('2050'.match(ADDRESS_REGEX.ZIP)).toBeNull();
        });
    });

    describe('State extraction behavior', () => {
        it('should match all known states short codes', () => {
            Object.keys(US_STATES).forEach((state) => {
                const result = parseAddress(
                    `123 Main Street, Some City ${state} 12345`
                );

                expect(result.state?.shortName).toBe(state);
                expect(result.state?.longName).toBe(US_STATES[state]);
            });
        });

        it('should not falsely match substrings', () => {
            const result = parseAddress(
                '123 Floor Street, Orlando FL 32801'
            );

            expect(result.state?.shortName).toBe('FL');
        });
    });

    describe('Street and number extraction', () => {
        it('should extract number and street correctly', () => {
            const result = parseAddress(
                '742 Evergreen Terrace, Springfield IL 62704'
            );

            expect(result.number).toBe(742);
            expect(result.street).toBe('Evergreen Terrace');
        });

        it('should return NaN number when no number exists', () => {
            const result = parseAddress(
                'Evergreen Terrace, Springfield IL 62704'
            );

            expect(result.number).toBeNaN();
        });
    });
});
