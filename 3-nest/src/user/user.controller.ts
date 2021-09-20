import { Controller, Get , Post, Put, Patch, Delete,Body, Param  } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Get("/all")
    getAll(){
        return this.userService.getAll();
    }

    @Post("/register")
    createUser(@Body() body:any){
        return this.userService.addUser(body);
    }

}
