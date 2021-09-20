import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {

    private users: Map<number,User> = new Map<number,User>();
    private counter:number = 1;

    constructor(){
        this.populate();
    }

    getAll(){
       var populatedData = [];
       for(const user of this.users.values()){
           populatedData.push(user.toJson());
       }
       return populatedData;
    }

    populate(){
        this.users.set(this.counter,new User(1,"James",18,"james@email.com","123456")); this.counter++;
        this.users.set(this.counter,new User(2,"John",18,"john@email.com","143441")); this.counter++;
        this.users.set(this.counter,new User(3,"Luke",18,"luke@email.com","654321")); this.counter++;
        this.users.set(this.counter,new User(4,"Judas",13,"judas@email.com","696969")); this.counter++;
    }
    
    addUser(user:any){
        var newUser: User; 
        newUser = new User (this.counter,user?.name,user?.age,user?.email,user?.password);
        this.users.set(this.counter, newUser);
        this.counter++;
        this.logAllUsers();
    }

    logAllUsers(){
        for(const [key,user] of this.users.entries()){
          console.log(key);
          user.log();
        }
       }
}

