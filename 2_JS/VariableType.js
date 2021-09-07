/*Variable Types by Carl Garces*/
//number
var number = 1;
//string 
var a = "Welcome to my assignment that needs no futher introduction tbh. Yeah IDK why im doing this\nSince you kept reading ill just rickroll u in the process.\nhere's a link: https://www.youtube.com/watch?v=o-YBDTqX_ZU";
//object
var b = { one: "one", "two": 2, three: [5, 10, 15, 20] };
//array
var c = [1, 2, 3, 4, 5, 6];
//null
var d = null;
//string within object
b.four = "Hi y'all!";
//object within object: scenario 1
b["five"] = { one: "Genshin", three: "Impact", two: "Honkai", four: "Mihoyo" };
//object within object: scenario 2 (to test final console.log)
//b["five"] = { one: "Honkai", three: "Impact", two: "Genshin", four: "Mihoyo" };
//boolean within object
b.six = false;
//b.seven is one of the examples for the undefined

console.log("\nVariable Types Assignment\nBy Carl Garces\n\n");

console.log(`The variable ${number} is of the type \"${typeof number}\" \n`);

console.log(typeof a);
console.log(a + "\n");

console.log(typeof c);
console.log(`The variable ${c} is of the type ${typeof c}\n `);

console.log(typeof d);
console.log(d + "\n");

console.log(typeof b);
console.log(b + "\n");

console.log(typeof b.seven);
console.log(b.seven + "\n");

console.log(`I love ${b.five.one} ${b.five.three} but i love ${b.five.two} ${b.five.three} better.\nIn the end, ${b.five.four} wins.\n\#StopGachaAddiction`);