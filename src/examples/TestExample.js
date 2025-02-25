// Example functions to test
export const calculateFactorial = (n) => {
  if (n < 0) throw new Error('Factorial not defined for negative numbers');
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
};

export const sortArray = (arr) => {
  if (!Array.isArray(arr)) throw new Error('Input must be an array');
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
};

export const divideNumbers = (a, b) => {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
};

export const findDuplicates = (arr) => {
  if (!Array.isArray(arr)) throw new Error('Input must be an array');
  let duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
};

// Example usage
const numbers = [5, 2, 8, 1, 9];
console.log('Sorted array:', sortArray(numbers));
console.log('Factorial of 5:', calculateFactorial(5));
console.log('Division result:', divideNumbers(10, 2));
console.log('Duplicates:', findDuplicates([1, 2, 2, 3, 3, 4, 5, 5])); 