/*
Literals
*/
// String Literals
// // "Skillups Labs",  'info@skilluplabs@.com.au', 'A', '100'
// console.log("Skillup Labs");

// // Numeric Literals
// // 100, 245.23
// console.log(1000);

// // Boolean literals
// console.log(true);
// // true, false

// Array litereals []
//[ "Sunday", "Monday", "Tuesday", 100, true ]

// Object literals {}
/*
{
    firstName: "Alex", 
    lastName: "Bhujel",
    email: "nishan@email.com",
    salary: 230000,
    isMarried: false,
    address: {
        street: "Ben Boyd Road",
        suburb: "Granville"
        }
}
/*

// RegExp Literal
*/
//variables
// //Decleration and Assignment

// var firstNumber;
// firstNumber = 500;
// console.log(firstNumber);
// console.log("This is the first number" + firstNumber);
// let email = "info@nish.com.au";
// email = "info@nishan.co.au";
// console.log("email me at :" + email);
// const mobile = '0452508594';
// console.log(mobile);

const fullName = "Rabindra Nath Tagore";
const firstName = fullName.slice(0, fullName.indexOf(" ")); 
console.log(firstName);
const secondName = fullName.slice(fullName.indexOf(" ") + 1, fullName.lastIndexOf(' ')); 
console.log(secondName);
const lastName = fullName.slice(fullName.lastIndexOf(' ') + 1, fullName.length); 
console.log(lastName);