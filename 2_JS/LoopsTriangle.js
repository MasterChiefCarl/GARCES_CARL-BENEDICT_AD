var triangleInput;
var col;
var row;
var limit = 100;

for (col = 0; col < limit; col++) {
    triangleInput = "*"
    for (row = 0; row < col; ++row) {
        triangleInput += "*";
    }
    console.log(triangleInput);
}