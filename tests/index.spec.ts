import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Sample Test Suite', () => {
    it('should add two numbers correctly', () => {
        const result = 2 + 2;
        expect(result).to.equal(4);
    });

    it('should concatenate strings', () => {
        const str1 = 'Hello';
        const str2 = 'World';
        expect(`${str1} ${str2}`).to.equal('Hello World');
    });

    it('should work with arrays', () => {
        const arr = [1, 2, 3];
        expect(arr).to.have.lengthOf(3);
        expect(arr).to.include(2);
    });
});
