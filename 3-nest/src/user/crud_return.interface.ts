export interface CRUDReturn {
    success: boolean,
    data: any
}

// replaceUser(id:number, user:any){
//     var newUser: User; 
//     var replaceUserError: string ="Replace User "+ id +"Sucessfully";
//     if (user?.name != null && user?.age != null && user?.email != null&&user?.password != null){
//     newUser = new User(id,user?.name,user?.age,user?.email,user?.password);
//     this.users.set(id,newUser);
//     this.logAllUsers();
//     return replaceUserError;
//     }
//     else {
//         replaceUserError = "Error Replacement. NEED Necessary Inputs to replace..."
//         if(user?.name == null) replaceUserError += "\"name\"...";
//         if(user?.email == null) replaceUserError += "\"email\"...";
//         if(user?.password == null) replaceUserError += "\"password\"...";
//         if(user?.age == null) replaceUserError += "\"age\"...";
//         return replaceUserError;
//     }
//   }

// deleteUser(id:string, login:any){
//     if(this.users.has(id)){
//         this.users.delete(id); 
//         this.counter--; 
//         return `User ${id} deleted sucessfully!`
//     }
//     else console.log("User "+id+" does not exist in database!");
//     return 50;
// }