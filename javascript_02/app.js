// //conditions
// //if..else statement
// const today = "Monday";
// if (today === "Sunday") {
//   console.log("Today is Sunday");
// } else if (today === "Monday") {
//   console.log("Today is Monday");
// } else if (today === "Saturday" || today === "Friday") {
//   console.log("Today is Fun Day!");
// } else {
//   console.log("Too tired to work.");
// }
// //switch statement
// switch (today) {
//   case "Sunday":
//     console.log("Today is Sunday");
//     break;
//   case "Monday":
//     console.log("Today is Monday");
//     break;
//   case "Saturday":
//   case "Friday":
//     console.log("Today is fun day!");
//     break;
//   default:
//     console.log("Too tired to work.");
// }
// //exception handeling
// try {
//   console.log("This is error handeling code");
//   throw Error();
// } catch (error) {
//   console.log(error);
// }
// console.log("Rest of the code...");

// let mobile = prompt("Enter your number...");
// try {
//     if (isNaN(Number(mobile))) {
//         throw Error("This is not a valid number.");
//     }
//     console.log("Send sms to " + mobile);
// } catch (e) {
//     console.log(e.message);
// }
// finally {
//     console.log("This is finally Test block");
// }
//loops
//for loop
// for(let i = 1; i <= 1000000; i = i*2 ) {
//     console.log(i);
// }
// //do/while loop
// let j = 100;
// do {
//     console.log("j =", j);
//     j ++;
// } while (j < 100);
// let k = 1;
// while (k < 100) {
//     console.log("k = ", k);
//     k++;
// }
// //for in
// let student = {
//     firstName: "Alex",
//     lastName: "Lee",
//     email: "alexlee@gmail.com",
//     mobile: "045373848",
// };
// for (property in student) {
//     console.log(property, student[property]);
// }
// //for if
// let months = ['Jan', 'Feb', "March"];
// for (month of months) {
//     console.log(months);
// }
// for (let l = 1; l < 10; l++) {
//     if (l == 5 || l == 8) {
//         continue;
//     }
//     console.log('l = ', l);
//         if (l == 4) {
//             break;
//         }
// }
// //nested loop
// for(let i = 2; i < 10; i++) {
//     for (let j = 1; j <= 10; j++) {
//         console.log( i + "*" + j + "=" + i * j);
//     }
//     console.log("_______________________");
// }
//functions
function multiplicationTable(i) {
    for (let j = 1; j <= 10; j++) {
        console.log( i + "*" + j + "=" + i * j);
    }
}
multiplicationTable(233);