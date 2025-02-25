import { calculateFactorial, sortArray, divideNumbers, findDuplicates } from './TestExample';

describe('calculateFactorial', () => {
  test('calculates factorial correctly for positive numbers', () => {
    expect(calculateFactorial(5)).toBe(120);
    expect(calculateFactorial(3)).toBe(6);
    expect(calculateFactorial(1)).toBe(1);
  });

  test('handles zero', () => {
    expect(calculateFactorial(0)).toBe(1);
  });
});

describe('sortArray', () => {
  test('sorts array in ascending order', () => {
    expect(sortArray([5, 2, 8, 1, 9])).toEqual([1, 2, 5, 8, 9]);
    expect(sortArray([3, 1, 4, 1, 5])).toEqual([1, 1, 3, 4, 5]);
  });

  test('handles empty array', () => {
    expect(sortArray([])).toEqual([]);
  });
});

describe('divideNumbers', () => {
  test('divides numbers correctly', () => {
    expect(divideNumbers(10, 2)).toBe(5);
    expect(divideNumbers(15, 3)).toBe(5);
  });

  test('handles division by zero', () => {
    expect(() => divideNumbers(10, 0)).toThrow();
  });
});

describe('findDuplicates', () => {
  test('finds duplicate numbers', () => {
    expect(findDuplicates([1, 2, 2, 3, 3, 4, 5, 5]))
      .toEqual([2, 3, 5]);
  });

  test('handles array with no duplicates', () => {
    expect(findDuplicates([1, 2, 3, 4, 5])).toEqual([]);
  });
}); 