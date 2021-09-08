import { Injectable } from '@nestjs/common';

@Injectable()
export class Exersice3Service {
    helloWorld():string{
        return "Hello, ITS MEEEE!!!"
    }

    loopsTriangle(height:number){
        for (var col = 0; col < height; col++) {
            var triangleInput = "*"
            for (var row = 0; row < col; ++row) {
                triangleInput += "*";
            }
            console.log(triangleInput);
        }
        return;
    }
    
}
