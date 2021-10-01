import { CRUDReturn } from './crud_return.interface';
import { Helper } from './helper';

export class User {

    private id: string;
    private name: string;
    private age:number;
    private email:string;
    private password: string;

    constructor(name: string, age: number, email: string, password: string) {
        this.id = Helper.generateUID();
        this.name = name;
        this.age = age;
        this.email = email;
        this.password = password;
      }
    
     
       
    login(password: string): CRUDReturn {
        try {
          if (this.password === password) {
            return { success: true, data: this.toJson() };
          } else {
            throw new Error(`${this.email} login fail, password does not match`);
          }
        } catch (error) {
          return { success: false, data: error.message };
        }
      }
    

    toJson(){
        return {
            id: this.id,
            name:this.name,
            age: this.age,
            email: this.email
        };
    }

    log() {
        console.log(this.toJson());
      }
    
    emptyUserCheck(input:User):CRUDReturn {
      if (input.name == '' || input.name == null) return {success:false, data:"User input has no name"};
      else if (input.age == null) return  {success:false, data:"User input has no age"};
      else if (input.email == '') return {success:false, data:"User input has no email"};
      else if (input.password == '') return {success:false, data:"User input has no password"};
      else return {success:true, data:null};
    }

    
    // PRIVATE RETURN AND UPDATE (TO PROTECT CLASS DATA)
    getID(){
      return this.id;
    }
    getName(){
      return this.name;
    }
    getEmail(){
      return this.email;
    }
    getAge(){
      return this.age;
    }
    fixID(id:string){
      this.id = id;
    }
    newName(name:string){
        this.name = name;
    }

    newAge(age:number){
        this.age = age;
    }

    newEmail(email:string){
        this.email = email;
    }

    newPassword(password:string){
        this.password = password;
    }
   
}

  
  

   
