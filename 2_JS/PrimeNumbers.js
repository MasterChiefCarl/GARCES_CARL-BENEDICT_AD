var looper;
var primeComposite = 0;
var number = 15;


for (looper = 2; looper <= number / 2; looper++) {
    if (number % looper == 0) {
        primeComposite = primeComposite + 1;
        break;
    }
}
if (number == 1) {

    console.log("1 is neither prime nor composite");

} else {

    if (primeComposite == 0) {
        console.log(`${number} is a Prime`);
    } else {
        console.log(`${number} is a Composite`);
    }
}