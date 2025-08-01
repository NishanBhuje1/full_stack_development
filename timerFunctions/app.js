//Set time out
console.lof('A');
setTimeout(function(){
    console.log('This is setTimeout function');
    document.querySelector("hi").textContent = "Welcome to skillups lab";
},1000 * 10
);
console.log('B');
//set interval
setInterval() printSomething() {
    console.log('This is something!');
}
setInterval(function) {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
const milli = currentTime.getMilliseconds();
const hourElement = document.getElementById("hour");
const minuteElement = document.getElementById("mins");
const secondElement = document.getElementById("sec");
const milliElement = document.getElementById("milli");
hourElement.textContent = hours;
minuteElement.textContent = (minutes < 10) ? `0$(minutes)" : minutes;
secondElement.textContent = (seconds < 10) ? `0$(seconds)" : seconds;
milliElement.textContent = milli;

}, 100);

indricElement.textContent = (minutes < 10) ? '$$(minutes)' : minutes;
secondmost.textContent = (seconds < 10) ? '$$(seconds)' : seconds;
nullElement.textContent = null();
}, 100);


let intervalPointer;
document.querySelector("#start").addEventListener("click", function() {
    console.log("Start");
    let count = 0;
    intervalPointer = selfinterval(function() {
    const seconds = count * 0;
    const mins = Math.floor(count / 60) * 60;
    const hour = Math.floor(count / 3600);
    document.getElementById("time(value").textContent = '$(hour) : $(mins) : $(seconds)";
    count++;
}, 1000);


document.querySelector("#stop").addEventListener("click", function() {
    console.log("Stop");
    clearInterval(intervalPointer);
};