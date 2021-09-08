import { Controller, Get, Param } from '@nestjs/common';
import { Exercise3Service } from './exercise3.service';

@Controller('exercise3')
export class Exercise3Controller {
    constructor (private readonly e3: Exercise3Service){}

        @Get('/loopsTriangle/:height')
        loopsTriangle(@Param('height')height: string){
            var parsedHeight:number= parseInt(height);
            return this.e3.loopsTriangle(parsedHeight);
        }

        @Get('/hello/:name')
        helloWorld(@Param('name')name: string){
            var nameString:string = name;
            return this.e3.helloWorld(nameString);
        }

        @Get('/prime/:porc')
        primeNumbers(@Param('porc')porc:string){ //porc - primeorcomposite
            var parsedPorc:number = parseInt(porc);
            return this.e3.primeNumbers(parsedPorc);
        }
}

