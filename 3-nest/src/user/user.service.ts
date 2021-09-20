import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {

    private users: Map<number,User> = new Map<number,User>();
    private counter:number = 1;
    private LIMIT: number = 10;

    constructor(){
        this.populate();
    }

    getAll(){
       var populatedData = [];
       for(const user of this.users.values()){
           populatedData.push(user.toJson());
           user.log();
       }
       return populatedData;
    }

    populate(){
        this.users.set(this.counter,new User(this.counter,"James",18,"james@email.com","123456")); this.counter++;
        this.users.set(this.counter,new User(this.counter,"John",18,"john@email.com","143441")); this.counter++;
        this.users.set(this.counter,new User(this.counter,"Luke",18,"luke@email.com","654321")); this.counter++;
        this.users.set(this.counter,new User(this.counter,"Judas",13,"judas@email.com","696969")); this.counter++;
    }
    
    addUser(user:any){
        var newUser: User; 
        newUser = new User (this.counter,user?.name,user?.age,user?.email,user?.password);
        if (this.counter <= this.LIMIT ){
            this.users.set(this.counter, newUser);
            this.logAllUsers();
            this.counter++;
            return `New user has been sucessfully added. Thank you for Registering!`;
            }
            else return `LIMIT REACHED!\nUser Registration has reached its LIMIT (${this.LIMIT}).\nPlease Contact Support for more info.`;
         }


    logAllUsers(){
        for(const [key,user] of this.users.entries()){
          console.log(key);
          user.log();
        }
    }

    getUser(id:number){
        return this.users.get(id).toJson();
    }

    replaceUser(id:number, user:any){
        var newUser: User; 
        newUser = new User(id,user?.name,user?.age,user?.email,user?.password);
        this.users.set(id,newUser);
        this.logAllUsers();
      }

      deleteUser(id:number){
            if(this.users.has(id))
            this.users.delete(id);
            else console.log("User "+id+" does not exist in database!");
          }
      
}
    


