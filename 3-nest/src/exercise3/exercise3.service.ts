import { Injectable } from '@nestjs/common';

@Injectable()
export class Exercise3Service {
    
    loopsTriangle(limit:number){
        for (var col = 0; col < limit; col++) {
            var triangleInput = "*"
            for (var row = 0; row < col; ++row) {
                triangleInput += "*";
            }
            console.log(triangleInput);
        }
    }

    helloWorld(name:string){
        return "Hello, " + name + ", its me you're looking for. Charr!"
    }

    primeNumbers(select:number){
        var looper;
        var primeComposite = 0;



    for (looper = 2; looper <= select / 2; looper++) {
        if (select % looper == 0) {
            primeComposite = primeComposite + 1;
        break;
    }
    }
    if (select == 1 || select == 0) {
        console.log(select + " is neither prime nor composite");
        return select + " is neither prime nor composite"
    } 
    else 
    {

        if (primeComposite == 0) {
            
            console.log(select + " is a Prime");
            return select + " is a Prime"
        } 
        else {
            console.log(select + " is a Composite");
            return select + " is a Composite"
        }
    }
    }

}
