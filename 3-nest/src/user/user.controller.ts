import { Controller, Get , Post, Put, Patch, Delete,Body, Param  } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @Get('/all')
    getAll(){
        return this.userService.getAll();
    }

    @Post('/register')
    createUser(@Body() body:any){
        return this.userService.addUser(body);
    }

    @Get ('/:id')
    getUser(@Param("id") id:string){
        return this.userService.getUser(id);
    }

    @Put ('/:id')
    replaceUser(@Param("id") id:string, @Body() body: any){
        return this.userService.replaceUser(id,body);
    }

    @Delete('/:id')
    deleteUser(@Param("id") id:string){
        return this.userService.deleteUser(id);
    }

    @Post ('/login')
    userLogin (@Body() body:any){
        return this.userService.userLogin(body);
    }

    @Get ('/search/:term')
    globalSearch (@Param("term") term:string){
        return this.userService.globalSearch(term);
    }

    @Patch ('/:id')
    specialReplaceUser (@Param("id") id:string, @Body() body:any){

        return this.userService.specialReplaceUser(id, body);
    }

}
