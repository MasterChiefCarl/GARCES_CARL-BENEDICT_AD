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

    async searchEngine(request: any, condition: string): Promise<any> {
        try {
            var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
                await this.DB.collection("users").get();

            for (const doc of dbData.docs) {
                var data = doc.data();
                var userSearch = new User(
                    data['name'],
                    data['age'],
                    data['email'],
                    data['password'],
                    doc.id);
                if (userSearch.matches(request))
                    return { success: true, data: userSearch };

            } return { success: false, data: null };
        } catch (e) {
            return { success: false, data: e };
        }

    } //OK somehow

    async globalSearch(term: any): Promise<CRUDReturn> {
        try {
            var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
                await this.DB.collection("users").get();

            for (const doc of dbData.docs) {
                var data = doc.data();
                var userSearch = new User(
                    data['name'],
                    data['age'],
                    data['email'],
                    data['password'],
                    doc.id);
                if (userSearch.matches(term))
                    return { success: true, data: userSearch.toJson() };

            } return { success: false, data: "Term: '" + term + "' does not exist in the database" };
        } catch (e) {
            return { success: false, data: e };
        }

        //     try{
        //     var numTerm = parseInt(term);
        //     if (await this.searchEngine(term, "id") == null) {
        //         if (await this.searchEngine(term, "name") == null) {
        //             if (await this.searchEngine(term, "email") == null) {
        //                 if (await this.searchEngine(numTerm, "age") == null) {
        //                     return { success: false, data: "Term: '" + term + "' does not exist in the database" };
        //                 } else return { success: true, data: (await this.searchEngine(numTerm, "age")).toJson() };
        //             } else return { success: true, data: (await this.searchEngine(term, "email")).toJson() };
        //         } else return { success: true, data: (await this.searchEngine(term, "name")).toJson() };
        //     } else return { success: true, data: (await this.searchEngine(term, "id")).toJson()} ;
        // }catch (error){
        //     return {success: false, data: `ERROR CAUGHT ${error}`};
        // }
    }//Somehow ok? // nope, OLD CODE release error in releasing input 

    async emailExists(email: string, options?: { exceptionID: string }): Promise<boolean> {
        try {
        var userResults: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
            await this.DB.collection("users").where ("email", "==", email)
            .get();
            console.log("Are the results empty?")
            console.log(userResults.empty); if (userResults.empty) return false;
        for (const doc of userResults.docs) {
            console.log(doc.data());
            console.log("Are all the options defined?");
            console.log(options != undefined);
            if(options != undefined){
                if (doc.id == options?.exceptionID) continue;
            }
            if(doc.data()["email"] === email){
                return true;
            }else{ 
                return false;
            }
        }return false;
    }catch(e){
        console.log("Email exists subfunction error")
        console.log(e.message);
        return false;
    }
    }

    async saveToDB(user: User): Promise<boolean> {
        console.log( `attempting to save user ${user.getID()} ${user.getEmail()}`)
        try {
            var result = (await user.commit(false));
            return result.success;
        } catch (error) {
            console.log("save to db error")
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
                    var data = doc.data();
                    var newUser = new User(
                        data['name'],
                        data['age'],
                        data['email'],
                        data['password'],
                        doc.id);
                    populatedData.push(newUser.toJsonID());
                }
            }
            return { success: true, data: populatedData };
        } catch (e) {
            return { success: false, data: e };
        }

        // Original Function
        //    var populatedData = [];
        //    for(const user of this.users.values()){
        //        populatedData.push(user.toJson());
        //        user.log();
        //    }
        //    return {success:true , data:populatedData};
    }OK


    async addUser(body: any): Promise<CRUDReturn> {
        try {
            var validBody: CRUDReturn = Helper.validBodyPut(body);
            var newUser: User = new User(
                body.name,
                body.age,
                body.email,
                body.password,
            );

            if (validBody.success) {
                if (!(this.emailExists(body?.email))) {
                
                    if (await this.saveToDB(newUser)) {
                        if (DEBUG) this.logAllUsers();
                        return {
                            success: true,
                            data: newUser.toJson()
                        };
                    } else throw new Error("generic database error");
                } else {
                    return { "success": false, "data": 'INVALID EMAIL' }
                }
            } else
                throw new Error(validBody.data);
        } catch (error) {
            console.log(error.message);
            return { success: false, data: `error adding account, ${error.message}` };
        }
    }

    async getUser(id: string): Promise<CRUDReturn> {
        try {

            var result = await this.DB.collection("users")
                .doc(id)
                .get();
            if (result.exists) {
                var data = result.data();
                return {
                    success: true,
                    data: new User(
                        data['name'],
                        data['age'],
                        data['email'],
                        data['password'],
                        result.id).toJson()
                };
            } else
                return {
                    success: false,
                    data: `User ${id} does not exist in database`,
                };
        } catch (error) {
            console.log(error);
            return { success: false, data: `DATA ERROR MESSAGE: ${error}` };
        }
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
    }

    async replaceUser(id: string, body: any): Promise<CRUDReturn> {

        var bodyCheck: CRUDReturn = Helper.validBodyPut(body);
        var isUserFound: User = (await this.searchEngine(id, "id")).data;

        if (isUserFound != null) {
            if (bodyCheck.success == true) {
                if (!await this.emailExists(body?.email, { exceptionID: id })) {
                    var newUser: User;
                    // for (const user of this.users.values()){ 
                    //     if (user.getEmail() == body?.email || user.getEmail() != user.getEmail())
                    //     return {success:false, data:"Email exist in database. Only one account per email is allowed"};
                    // }
                    newUser = new User(body?.name, body?.age, body?.email, body?.password);
                    newUser.fixID(id); this.saveToDB(newUser);
                    return { success: true, data: newUser.toJson() }
                } else return { success: false, data: `${body.email} is already in use by another user!` }
            }
            else return bodyCheck;
        }
        else return { success: false, data: `ID User: ${id} is not found in the database` };
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
    }

    async deleteUser(id: string): Promise<CRUDReturn> {
        var isUserFound: User = (await this.searchEngine(id, "id")).data;

        if (isUserFound != null) {
            await this.DB.collection("users").doc(id).delete();
            return { success: true, data: `User ${id} deleted sucessfully!` };
        }
        return { success: false, data: `ID ${id} does not exist in database. Please try again.` };
    }


    async userLogin(login: any): Promise<CRUDReturn> {
        var foundUser: User = ((await this.searchEngine(login?.email, "email")).data);
        if (foundUser != null) return foundUser.login(login?.password);
        else return { success: false, data: "Email Not Found. Please try again." };
    }


    async specialReplaceUser(id: string, body: any) {

        try {
            var result = await this.DB.collection("users")
                .doc(id)
                .get();
            if (result.exists) {
                var validBodyPut: CRUDReturn =
                    Helper.validBodyPut(body);
                if (validBodyPut.success) {
                    if (!this.emailExists(body.email, { exceptionID: id })) {
                        var newUser: User = new User(
                            result['name'],
                            result['age'],
                            result['email'],
                            result['password'],
                            result.id);

                        if (body?.email != undefined && body?.email != null)
                            newUser.newEmail
                        if (body?.name != undefined && body?.name != null)
                            newUser.newName(body?.name);
                        if (body?.password != undefined && body?.password != null)
                            newUser.newPassword(body?.password);
                        if (body?.age != undefined && body?.age != null)
                            newUser.newAge(body?.age);
                        newUser.fixID(id); this.saveToDB(newUser);
                        return { success: true, data: newUser.toJson() };
                    } else {
                        throw new Error(`${body.email} is already in use by another user!`);
                    }
                } else {
                    throw new Error(validBodyPut.data);
                }
            } else {
                throw new Error(`User ${id} is not in database`);
            }
        } catch (error) {
            return {
                success: false,
                data: error.message,
            };
        }
    }





}
