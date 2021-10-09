export interface CRUDReturn {
    success: boolean,
    data: any,
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

// async searchEngine(request: any, condition: string): Promise<any> {
//     try {
//         var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
//             await this.DB.collection("users").get();

//         for (const doc of dbData.docs) {
//             if (await doc.data[condition] === request) {
//                 var data = doc.data();
//                 return new User(
//                     data['name'],
//                     data['age'],
//                     data['email'],
//                     data['password'],
//                     doc.id);
//             }
//         }
//         return null;
//     } catch (e) {
//         return null;
//     }
// } //OK somehow

//     var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
    //         await this.DB.collection("users").get();
    //     for (const doc of dbData.docs) {
    //         if (doc.data()["email"] == email) {
    //             if (
    //                 options.exceptionID != undefined &&
    //                 doc.id == options.exceptionID
    //             ) continue;

    //         } else {
    //             return true;
    //         }
    //         return false;


    /*SUPERSHORTVERSION
        async emailExists(email: string,options?: { exceptionId: string }): Promise<boolean> {

            var userResults = await this.DB.collection("users")
                .where("email", "==", email)
                .get();
            if (userResults.empty) return false;
            for (const doc of userResults.docs) {
                if (doc.id == options.exceptionId) continue;
                if (doc.data()["email"] === email) {
                    return false;
                } else {
                    return true;
                }
            }

        }
        */
        /*for (const user of this.users.values()){
     
 
 
         if (user.matches(email)){
             if(
                 options.exceptionID != undefined && 
                 user.matches(options.exceptionID)
                 )
                 continue;
                 else return true;
             }
         }
         return false;*///OK from Sir :)

         /*OLD CODE
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
                        */

                        // try {
        //     var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
        //         await this.DB.collection("users").get();

        //     for (const doc of dbData.docs) {
        //         if (await doc.data[condition] === request) {
        //             var data = doc.data();
        //             var userSearch = new User(
        //                 data['name'],
        //                 data['age'],
        //                 data['email'],
        //                 data['password'],
        //                 doc.id);
        //             if (condition == "id")
        //                 if (userSearch.getID() == request)
        //                     return { success: true, data: userSearch };
        //             if (condition == "name")
        //                 if (userSearch.getName() == request)
        //                     return { success: true, data: userSearch };
        //             if (condition == "email")
        //                 if (userSearch.getEmail() == request)
        //                     return { success: true, data: userSearch };
        //             if (condition == "age")
        //                 if (userSearch.getAge() == request)
        //                     return { success: true, data: userSearch };
        //         }
        //     }
        //     return null;
        // } catch (e) {
        //     return null;
        // }

        // {
    //     try {
    //     var bodyCheck: CRUDReturn = Helper.validBody(body);
    //     var isUserFound: User = (await this.searchEngine(id, "id")).data;

        
    //         if (isUserFound!= null) {
    //             if (bodyCheck.success == true) {
    //                 if (body?.email == undefined || !await this.emailExists(body?.email, { exceptionID: id })) {
    //                     var newUser: User = await isUserFound;

    //                     if (body?.email != undefined && body?.email != null)
    //                         newUser.newEmail
    //                     if (body?.name != undefined && body?.name != null)
    //                         newUser.newName(body?.name);
    //                     if (body?.password != undefined && body?.password != null)
    //                         newUser.newPassword(body?.password);
    //                     if (body?.age != undefined && body?.age != null)
    //                         newUser.newAge(body?.age);
    //                     newUser.fixID(id); this.saveToDB(newUser);
    //                     return { success: true, data: newUser.toJson() };

    //                 } else return { success: false, data: `${body.email} is already in use by another user!` };
    //             }else return { success:false, data: "INVALID BODY"};
    //         }else return { success: false, data: `ID User: ${id} is not found in the database` };
    //     } catch (e) {
    //         return { success: false, data: `ERROR HIT MESSAGE: ${e}` };
    //     }
    // }

    /*
        try {
            var result = await this.DB.collection("users")
                .doc(id)
                .get();
            if (result.exists)
                return {
                    success: true,
                    data: result.data(),
                };
            else
                return {
                    success: false,
                    data: `User ${id} does not exist in database`,
                };
        } catch (error) {
            console.log(error);
            return { success: false, data: error };
        }
        async getUser(id: string): Promise<CRUDReturn> {
        */