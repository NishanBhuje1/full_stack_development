//arrow function

// const sayHellow = (name) => {
//   return "Hello " + name;
// };
const findLength = (str) => str.length;
console.log(findLength("Nishan"));
//
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for (let i = 0; i < numbers.length - 1; i++) {
  console.log(numbers[i]);
}

for (j in numbers) {
  console.log(numbers[j] * 10);
}

numbers.forEach((num) => console.log(num * 2));
const doubleNumbers = numbers.map((num) => num * 2);
console.log(doubleNumbers);
const evenNumbers = numbers.filter((num) => num % 2 === 0);
evenNumbers;
const oddNumbers = numbers.filter((num) => num % 2 >= 0);
console.log(oddNumbers);
numbers.push(11);
numbers.pop();
numbers.unshift(1000);
numbers.shift();
const numbers.slice(4, 6);
const sortNumbers = numbers.shot