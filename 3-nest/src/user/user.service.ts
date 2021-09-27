import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {

    private users: Map<number,User> = new Map<number,User>();
    private counter:number = 1;
    private LIMIT: number = 20;

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
        this.users.set(this.counter,new User(this.counter,"John",19,"john@email.com","143441")); this.counter++;
        this.users.set(this.counter,new User(this.counter,"Luke",20,"luke@email.com","654321")); this.counter++;
        this.users.set(this.counter,new User(this.counter,"Judas",21,"judas@email.com","696969")); this.counter++;
    }
    
    addUser(user:any){
        var newUser: User; 
        var addUserStatus:string =``;
        if (user?.name != null && user?.age != null && user?.email != null&&user?.password != null){
        newUser = new User (this.counter,user?.name,user?.age,user?.email,user?.password);
        if (this.counter <= this.LIMIT){
            this.users.set(this.counter, newUser);
            this.logAllUsers();
            this.counter++;
            addUserStatus=`New user has been sucessfully added. Thank you for Registering!\nSlots Remaining:${this.counter}`
            return addUserStatus;
            }
            else {
                addUserStatus =`LIMIT REACHED!\nUser Registration has reached its LIMIT (${this.LIMIT}).\nPlease Contact Support for more info.`
                return addUserStatus;
            }
        }
        else{
            addUserStatus = "Error Replacement. NEED Necessary Inputs to replace..."
            if(user?.name == null) addUserStatus += "\"name\"...";
            if(user?.email == null) addUserStatus += "\"email\"...";
            if(user?.password == null) addUserStatus += "\"password\"...";
            if(user?.age == null) addUserStatus += "\"age\"...";
            return addUserStatus;
        }
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
        var replaceUserError: string ="Replace User "+ id +"Sucessfully";
        if (user?.name != null && user?.age != null && user?.email != null&&user?.password != null){
        newUser = new User(id,user?.name,user?.age,user?.email,user?.password);
        this.users.set(id,newUser);
        this.logAllUsers();
        return replaceUserError;
        }
        else {
            replaceUserError = "Error Replacement. NEED Necessary Inputs to replace..."
            if(user?.name == null) replaceUserError += "\"name\"...";
            if(user?.email == null) replaceUserError += "\"email\"...";
            if(user?.password == null) replaceUserError += "\"password\"...";
            if(user?.age == null) replaceUserError += "\"age\"...";
            return replaceUserError;
        }
      }

    deleteUser(id:number){
        if(this.users.has(id)){
            this.users.delete(id); 
            this.counter--; 
            return `User ${id} deleted sucessfully!`
        }
        else console.log("User "+id+" does not exist in database!");
    }
      
    userLogin(body:any){
        var foundUser:User = this.searchEngine(body?.email,"email");
        if (foundUser != null)return foundUser.login(body?.email,body?.password);
        else return "Email Not Found. Please try again.";
    }
    
    

    globalSearch(term:string){
        var numTerm = parseInt(term);
        if (this.searchEngine(numTerm,'id')==null){
            if (this.searchEngine(term,'name')==null){
                if(this.searchEngine(term,'email') == null){
                    if (this.searchEngine(numTerm,'age')==null){
                        return `Term \"${term}\"cannot be found all over the database`
                    }else return this.searchEngine(numTerm,'age').toJson();
                }else return this.searchEngine(term,'email').toJson();
            }else return this.searchEngine(term,'name').toJson();
        }else return this.searchEngine(numTerm,'id').toJson();
    }
    
    searchEngine(request:any,condition:string)
    {
        for(const[key,user] of this.users.entries()){
            if(user[condition] == request){
            return user;
            }
        }
        return null;
    }

    specialReplaceUser(id:number, body:any){
        var foundUser:User = this.searchEngine(id,"id");
        if (foundUser == undefined || foundUser == null) return `ID ${id} not found. PLEASE CHECK AGAIN`;
        else{
            if (body?.email != undefined && body?.email != null)
                foundUser.newEmail(body?.email);
            if (body?.name != undefined && body?.name != null)
                foundUser.newName(body?.name);
            if (body?.password != undefined && body?.password != null)
                foundUser.newPassword(body?.password);
            if (body?.age != undefined && body?.age != null)
                foundUser.newAge(body?.age);
            this.users.set(id,foundUser);
            this.logAllUsers();
            return `User ${id} has been updated, successfully!`;
        }

    }
    
}
    


