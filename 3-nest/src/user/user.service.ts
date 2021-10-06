import { Injectable } from '@nestjs/common';
import { CRUDReturn } from './crud_return.interface';
import { Helper } from './helper';
import { User } from './user.model';
import * as admin from 'firebase-admin';

const DEBUG: boolean = true;


@Injectable()
export class UserService {

    private users: Map<string,User>= new Map<string, User>();;
    private DB = admin.firestore();
    
    constructor(){
        this.users = Helper.populate();
        this.logAllUsers();
    }

    //console/internal workflow
    logAllUsers(){
        for(const [key,user] of this.users.entries()){
          console.log(key);
          user.log();
        }
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



    //injectible workflow
    getAll(): CRUDReturn{
       var populatedData = [];
       for(const user of this.users.values()){
           populatedData.push(user.toJson());
           user.log();
       }
       return {success:true , data:populatedData};
    }
    
    
    addUser(body:any): CRUDReturn{
        var bodyCheck:CRUDReturn = Helper.validBodyPut(body);
        var newUser:User;

        if (bodyCheck.success == true){
                for (const user of this.users.values()){ 
                    if (user.getEmail() === body?.email)
                    return {success:false, data:"Email exist in database. Only one account per email is allowed"};
                }
                newUser = new User (body?.name, body?.age, body?.email, body?.password);
                this.saveToDB(newUser);
                this.users.set(newUser.getID(), newUser); // to be removed                
                return {success:true, data: newUser.toJson()}
            }
        
        else return Helper.validBodyPut(body);
    }


    

    getUser(id:string): CRUDReturn{
        for (const user of this.users.values()){ 
            if (user.getID() === id)
            return {success:true, data:user.toJson()};
        }
        return {success:false, data:"ID does not exist in database. Please try again."};
    }


    replaceUser(id:string, body:any):CRUDReturn{
        var bodyCheck:CRUDReturn = Helper.validBodyPut(body);
        var isUserFound: User = this.searchEngine(id,"id")
        var newUser:User;

        
        if (isUserFound!=null){
            if (bodyCheck.success == true){
                for (const user of this.users.values()){ 
                    if (user.getEmail() == body?.email || user.getEmail() != user.getEmail())
                    return {success:false, data:"Email exist in database. Only one account per email is allowed"};
                }
                newUser = new User (body?.name, body?.age, body?.email, body?.password);
                this.users.set (newUser.getID(), newUser);
                return {success:true, data: newUser.toJson()}
            }
            else return bodyCheck;
        }
        else return {success:false, data:`ID User: ${id} is not found in the database`};
    }

    

    deleteUser(id:string):CRUDReturn{
        var isUserFound: User = this.searchEngine(id,"id")

        if(isUserFound != null){
                this.users.delete(id); 
                return {success: true, data:`User ${id} deleted sucessfully!`};
        }
        return {success:false, data:`ID ${id} does not exist in database. Please try again.`};
    }  


    userLogin(login:any): CRUDReturn{
        var foundUser:User = this.searchEngine(login?.email,"email");
        if (foundUser != null)return foundUser.login(login?.password);
        else return {success:false, data:"Email Not Found. Please try again."};
    }
    
    

    globalSearch(term:string): CRUDReturn{
        var numTerm = parseInt(term);
        if (this.searchEngine(numTerm,'id')==null){
            if (this.searchEngine(term,'name')==null){
                if(this.searchEngine(term,'email') == null){
                    if (this.searchEngine(numTerm,'age')==null){
                        return {success:false,data:"Term: \""+term+"does not exist in the database"};
                    }else return {success:true, data:this.searchEngine(numTerm,'age').toJson()}; 
                }else return {success:true, data:this.searchEngine(term,'email').toJson()};
            }else return {success:true, data:this.searchEngine(term,'name').toJson()};
        }else return {success:true, data:this.searchEngine(numTerm,'id').toJson()};
    }
    
    
    specialReplaceUser(id:string, body:any){
        
        var bodyCheck:CRUDReturn = Helper.validBody(body);
        var isUserFound: User = this.searchEngine(id,"id")

        
        if (isUserFound!=null){
            if (bodyCheck.success == true){
                for (const user of this.users.values()){ 
                    if (user.getEmail() === body?.email && user.getEmail() !== isUserFound.getEmail())
                    return {success:false, data:"Email exist in database. Only one account per email is allowed"};
                }
                if (body?.email != undefined && body?.email != null)
                isUserFound.newEmail(body?.email);
                if (body?.name != undefined && body?.name != null)
                isUserFound.newName(body?.name);
                if (body?.password != undefined && body?.password != null)
                isUserFound.newPassword(body?.password);
                if (body?.age != undefined && body?.age != null)
                isUserFound.newAge(body?.age);
                this.users.set(id,isUserFound);
                this.logAllUsers();
                return {success:true, data: isUserFound.toJson()}
            }
            else return bodyCheck;
        }
        else return {success:false, data:`ID User: ${id} is not found in the database`};
    }


    

    

saveToDB (user:User): boolean{
    try {
        var statReturn = this.DB.collection("users").doc(user.getID()).set(user.toJson());
        console.log(statReturn);
        this.users.set (user.getID(),user);
        return this.users.has(user.getID());
    }catch (error){
        console.log(error);
        return false;
        }
    }
}