import { Controller, Get, Param } from '@nestjs/common';

import { Exersice3Service } from './exersice3.service';

@Controller('exersice3')
export class Exersice3Controller {
constructor(private readonly e3: Exersice3Service){}   
    
  @Get("/helloWorl/:name")
    getHello@Param('name') name:String(): string 
    {
      return this.e3.helloWorld();
    }


  @Get("/loopsTriangle/:height")
    loopsTriangle(@Param('height') height:string) {
      var parsedHeight= parseInt(height);
      return this.e3.loopsTriangle(5)
    }
    
  @Get ('/primeNumber')
}
