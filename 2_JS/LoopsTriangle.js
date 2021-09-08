var triangleInput;
var col;
var row;
var heightLimit = 100;

for (col = 0; col < heightLimit; col++) {
    triangleInput = "*"
    for (row = 0; row < col; ++row) {
        triangleInput += "*";
    }
    console.log(triangleInput);
}