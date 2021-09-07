var triangleInput;
var col;
var row;

for (col = 0; col < 10; col++) {
    triangleInput = "*"
    for (row = 0; row < col; ++row) {
        triangleInput += "*";
    }
    console.log(triangleInput);
}