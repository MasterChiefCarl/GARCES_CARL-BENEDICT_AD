import { Injectable } from '@nestjs/common';
import { CRUDReturn } from './crud_return.interface';
import { Helper } from './helper';
import { User } from './user.model';
import * as admin from 'firebase-admin';

const DEBUG: boolean = true;


@Injectable()
export class UserService {

    private users: Map<string, User> = new Map<string, User>();;
    private DB = admin.firestore();

    constructor() {
        this.logAllUsers();
    }

    //console/internal workflow
    async logAllUsers() {
        var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
        await this.DB.collection("users").get();
        for (const doc of dbData.docs) {
        
            console.log(doc.id);
            var data = doc.data();
            new User(
                data['name'],
                data['age'],
                data['email'],
                data['password'],
                doc.id).log();
        }
    } //OK
    async searchEngine(request: any, condition: string):Promise<any> { 
        var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
        await this.DB.collection("users").get();
        
        for (const doc of dbData.docs) {
            if (await doc.data[condition] == request) {
                var data = doc.data();
                return new User(
                    data['name'],
                    data['age'],
                    data['email'],
                    data['password'],
                    doc.id).toJson();
            }
        }
        return null;
    } //OK somehow
    async globalSearch(term: string): Promise<CRUDReturn> {
        var numTerm = parseInt(term);
        if (this.searchEngine(numTerm, 'id') == null) {
            if (this.searchEngine(term, 'name') == null) {
                if (this.searchEngine(term, 'email') == null) {
                    if (this.searchEngine(numTerm, 'age') == null) {
                        return { success: false, data: "Term: \"" + term + "does not exist in the database" };
                    } else return { success: true, data: (await this.searchEngine(numTerm, 'age')).toJson() };
                } else return { success: true, data:(await this.searchEngine(term, 'email')).toJson() };
            } else return { success: true, data:(await this.searchEngine(term, 'name')).toJson() };
        } else return { success: true, data:(await this.searchEngine(numTerm, 'id')).toJson() };
    }
    async emailExists(email: string, options?: { exceptionID: string }) {

        var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
        await this.DB.collection("users").get();
        for (const doc of dbData.docs) {
            if (doc.data()["email"] == email) {
                if (
                    options.exceptionID != undefined &&
                    doc.data()["email"] == options.exceptionID
                ) {
                    continue;
                }
            } else {
                return true;
            }
            return false;
        }
    }//OK from Sir :)

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
    // for (const user of this.users.values()){
    //     if (user.matches(email)){
    //         if(
    //             options.exceptionID != undefined && 
    //             user.matches(options.exceptionID)
    //             )
    //             continue;
    //             else return true;
    //         }
    //     }
    //     return false;

    async saveToDB(user: User): Promise<boolean> {
        try {
            var result = await user.commit();
            return result.success;
        } catch (error) {
            console.log(error);
            return false;
        }
    }



    //injectible workflow
    async populateUsers(): Promise<any> {
        try {
            this.users = Helper.populate();
            this.users.forEach((user) => {
                this.saveToDB(user);
            })
            await this.logAllUsers()
            var result: CRUDReturn = await this.getAll();
            console.log(result);
            return result;
        } catch (error) {
            return { success: false, data: error };
        }
    }//OK

    async getAll(): Promise<CRUDReturn> {
        var populatedData: Array<any> = [];
        try {
        var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
        await this.DB.collection("users").get();
        for (const doc of dbData.docs) {
                if (doc.exists) {
                    populatedData.push(doc.data());
                }
            }
            return { success: true, data: populatedData };
        } catch (e) {
            return { success: false, data: e }
        }

        // Original Function
        //    var populatedData = [];
        //    for(const user of this.users.values()){
        //        populatedData.push(user.toJson());
        //        user.log();
        //    }
        //    return {success:true , data:populatedData};
    }


    async addUser(body: any): Promise<CRUDReturn> {
        try {
            var validBody: CRUDReturn = Helper.validBodyPut(body);
            var newUser: User;

            if (validBody.success) {
                if (!this.emailExists(body.email)) {
                    var newUser: User = new User(
                        body.name,
                        body.age,
                        body.email,
                        body.password,
                    );

                    // email verifier: local edition
                    // for (const user of this.users.values()){ 
                    //     if (user.getEmail() === body?.email)
                    //     return {success:false, data:"Email exist in database. Only one account per email is allowed"};
                    // }
                    if (await this.saveToDB(newUser)) {
                        if (DEBUG) this.logAllUsers();
                        return {
                            success: true,
                            data: newUser.toJson()
                        };
                    } else throw new Error("generic database error");
                } else {
                    throw new Error(`${body.email} is already in use by another user`);
                }
            } else
                throw new Error(validBody.data);
        } catch (error) {
            console.log(error.message);
            return { success: false, data: `error adding account, ${error.message}` };
        }
    }

    // async getUser(id: string): Promise<CRUDReturn> {

    //     try {
    //         if(id != null){
    //         var result = await this.DB.collection("users")
    //             .doc(id)
    //             .get();
    //         if (result.exists){
    //             var data = result.data();
    //             return {
    //                 success: true,
    //                 data: new User(
    //                     data['name'],
    //                     data['age'],
    //                     data['email'],
    //                     data['password'],
    //                     result.id).toJson()
    //             }
    //         }else
    //         return {
    //             success: false,
    //             data: `User ${id} does not exist in database`,
    //         }
    //     }else
    //     return {
    //         success: false,
    //         data: `${id} is INVALID INPUT`,
    //     }
    //     } catch (error) {
    //         console.log(error);
    //         return { success: false, data: error }
    //     }
    // }
    async getUser(id:string): Promise<CRUDReturn>{
        
        
        try{
           var result = await this.DB.collection("users")
            .doc(id)
            .get();
        if (result.exists)
            return {
                success: true, 
                data: result.data(),
            }
        else 
            return {
                success:false, 
                data:`User ${id} does not exist in database`,
            }
        }catch(error){
            console.log(error);
            return{success:false, data: error}
        }
    }

    async replaceUser(id: string, body: any): Promise<CRUDReturn> {
    //     try {
    //         if (this.users.has(id)) {
    //             var validBody: CRUDReturn =
    //                 Helper.validBodyPut(body);
    //             if (validBody.success) {
    //                 if (!this.emailExists(body.email, { exceptionID: id })) {
    //                     var user: User = (await this.getUser(id).data.user);
    //                     var success = await this.saveToDB()
    //                     if (success)
    //                         return {
    //                             success: success,
    //                             data: user.toJson(),
    //                         };
    //                     else {
    //                         throw new Error('Failed to update user in db');
    //                     }
    //                 } else {
    //                     throw new Error(`${body.email} is already in use by another user!`);
    //                 }
    //             } else {
    //                 throw new Error(validBodyPut.data);
    //             }
    //         } else {
    //             throw new Error(`User ${id} is not in database`);
    //         }
    //     } catch (error) {
    //         return {
    //             success: false,
    //             data: error.message,
    //         };
    //     }
    // }
        var bodyCheck: CRUDReturn = Helper.validBodyPut(body);
        var isUserFound: User = await this.searchEngine(id, "id")
        var newUser: User;
        if (isUserFound != null) {
            if (bodyCheck.success == true) {
                if (!this.emailExists(body.email, { exceptionID: id })){
                    // for (const user of this.users.values()){ 
                    //     if (user.getEmail() == body?.email || user.getEmail() != user.getEmail())
                    //     return {success:false, data:"Email exist in database. Only one account per email is allowed"};
                    // }
                newUser = new User(body?.name, body?.age, body?.email, body?.password);
                newUser.fixID(id); this.saveToDB(newUser);
                return { success: true, data: newUser.toJson() }
                }else return {success:false, data: `${body.email} is already in use by another user!`}
            }
            else return bodyCheck;
        }
        else return { success: false, data: `ID User: ${id} is not found in the database` };
    
    }


    async deleteUser(id: string): Promise<CRUDReturn> {
        var isUserFound: User = await this.searchEngine(id, "id")

        if (isUserFound != null) {
            await this.DB.collection("users").doc(id).delete();
            return { success: true, data: `User ${id} deleted sucessfully!` };
        }
        return { success: false, data: `ID ${id} does not exist in database. Please try again.` };
    }


    async userLogin(login: any): Promise<CRUDReturn> {
        var foundUser: User = (await this.searchEngine(login?.email, "email"));
        if (foundUser != null) return foundUser.login(login?.password);
        else return { success: false, data: "Email Not Found. Please try again." };
    }


    async specialReplaceUser(id: string, body: any) {

        var bodyCheck: CRUDReturn = Helper.validBody(body);
        var isUserFound: User = await this.searchEngine(id, "id")

        try {
            if (isUserFound != null) {
                if (bodyCheck.success == true) {
                    if (!this.emailExists(body.email, { exceptionID: id })){
                    var newUser: User = isUserFound; 


                    if (body?.email != undefined && body?.email != null)
                        newUser.newEmail(body?.email);
                    if (body?.name != undefined && body?.name != null)
                        newUser.newName(body?.name);
                    if (body?.password != undefined && body?.password != null)
                        newUser.newPassword(body?.password);
                    if (body?.age != undefined && body?.age != null)
                        newUser.newAge(body?.age);
                    newUser.fixID (id);
                    this.saveToDB(newUser);

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
                }else return {success:false, data: `${body.email} is already in use by another user!`};
            }  
                else return bodyCheck;
            }
            else return { success: false, data: `ID User: ${id} is not found in the database` };

        } catch (e) {
            return { success: false, data: e };
        }
    }










}
