function square(num) {
  return num * num;
}

function addSquare(a, b) {
  function square(num) {
    return num * num;
  }
  return square(a) + square(b);
}

//fibonacci
//0, 1, 1, 2, 3, 5, 8, 13;
//factorial
// 5! = 5 * 4 * 3 * 2 * 1;
function factorial(num) {
  if (num === 0 || num === 1) {
    return 1;
  }
  return num * factorial(num - 1);
}

//IIFE
(function sayHello() {
  console.log(`Hello`);
})();

function greeting(salutation = "Hello world") {
  console.log(salutation);
}
console.log(salutation);
console.log("Hello world!");

function sum() {
  console.log(arguments);
}
sum(1);
sum(1, 3);
sum(1, 3, 5);

function multiplier(mult, ...other) {
    return other.map((a) => a * mult);
}

