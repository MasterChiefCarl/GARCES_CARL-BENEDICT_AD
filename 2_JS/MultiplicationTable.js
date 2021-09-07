var TableOutput;
var col;
var row;
var multTableValue = window.prompt("Enter the Multiplication Table Limit:");

for (col = 1; col <= multTableValue; col++) {
    TableOutput = `${col}\t`;
    for (row = 2; row <= multTableValue; row++) {
        TableOutput += `${col*row}\t`;
    }
    console.log(TableOutput);
}