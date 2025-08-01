// Objects
// Object literals
let student = {
  firstName: "Alex",
  lastName: "Bhujel",
  email: "alexbhujel@gmail.com",
  fullName: function () {
    return this.firstName + " " + this.lastName;
  },
};

console.log("Student's name is " + student.firstName);
console.log("Student's full name is " + student.fullName());
//Create an aobject to store different part of PaymentAddress. This object should have method called get getCompleteAddress() which will return
//complete address.

let address = {
  unit: 6,
  streetName: "64 Ben Boyd Road",
  suburbName: "Neutral Bay",
  getCompleteAddress: function () {
    const getCompleteAddress =
      this.unit + "/" + this.streetName + ", " + this.suburbName + ".";
    return getCompleteAddress;
  },
};
console.log(
  `the full address of the bloke is  ${address.getCompleteAddress()}`
);
// Constructor functions

function Student(firstName, lastName, email) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.email = email;

  this.fullName = function () {
    return this.firstName + " " + this.lastName;
  };
}

const student_1 = new Student("jim", "Lee", "jim.lee@gmail.com");
const student_2 = new Student("jim", "ma", "jim.ma@gmail.com");
const student_3 = new Student("tim", "Lee", "tim.lee@gmail.com");
console.log(
  `There are three students with name: ${student_1.firstName}, ${
    student_2.firstName
  }, ${
    student_3.firstName
  }. Their full name is ${student_1.fullName()}, ${student_2.fullName()}, ${student_3.fullName()} respectively.`
);
// Class
