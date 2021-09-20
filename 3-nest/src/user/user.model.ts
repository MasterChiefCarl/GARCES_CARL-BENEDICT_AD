export class User {
    private id: number;
    private name: string;
    private age:number;
    private email:string;
    private password: string;

    constructor(id:number,name:string,age:number,email:string,password:string){
        this.id=id;
        this.name=name;
        this.age=age;
        this.email = email;
        this.password = password;
    }

    login(email:string, password:string){
        
        if (email == this.email && password == this.password)
            return true;
        else 
            return false;

    }

    toJson(){
        return {
            id: this.id,
            name:this.name,
            age: this.age,
            email: this.email
        };
    }

    log(){
        console.log(`ID:\t${this.id}\nName:\t${this.name}\nAge:\t${this.age}\nEmail:\t${this.email}`);
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