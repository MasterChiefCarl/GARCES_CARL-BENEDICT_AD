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
                    return { success: true, data: userSearch.toJsonID() };

            } return { success: false, data: "Term: '" + term + "' does not exist in the database" };
        } catch (e) {
            return { success: false, data: e };
        }
    }//Somehow ok? // nope, OLD CODE release error in releasing input 

    async emailExists(email: string, options?: { exceptionId: string }): Promise<boolean> {
        try {
            var userResults = await this.DB.collection("users").where("email", "==", email).get();
            console.log("Are the user results empty? ");
            console.log(userResults.empty);
            if (userResults.empty) return false;
            for (const doc of userResults.docs) {
                console.log(doc.data());
                console.log("Are the options defined?");
                console.log(options != undefined);
                if (options != undefined) {
                    if (doc.id == options?.exceptionId) continue;
                }
                if (doc.data()["email"] === email) {
                    return true;
                } else {
                    return false;
                }
            }
        } catch (e) {
            console.log("Email exists subfunction error");
            console.log(e.message);
            return false;
        }
    }


    async saveToDB(user: User): Promise<boolean> {
        console.log(`attempting to save user ${user.getID()} ${user.getEmail()}`)
        try {
            var result = (await user.commit(false));
            if (result.success)
            return true;
            else new Error ("somthing is not right")
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
        //        populatedData.push(user.toJsonID());
        //        user.log();
        //    }
        //    return {success:true , data:populatedData};
    }//OK


    async addUser(body: any): Promise<CRUDReturn> {
        try {
            var validBody: CRUDReturn =
                Helper.validBodyPut(body);
            if (validBody.success) {
                if (!(await this.emailExists(body.email))) {
                    var newUser: User = new User(
                        body.name,
                        body.age,
                        body.email,
                        body.password,
                    );
                    if (this.saveToDB(newUser)) {
                        if (DEBUG) this.logAllUsers();
                        return {
                            success: true,
                            data: newUser.toJsonID(),
                        };
                    } else {
                        throw new Error('generic database error');
                    }
                } else
                    throw new Error(`${body.email} is already in use by another user!`);
            } else {
                throw new Error(validBody.data);
            }
        } catch (error) {
            console.log(error.message);
            return { success: false, data: `Error adding account, ${error.message}` };
        }
    }

    async getUser(id: string): Promise<CRUDReturn> {
        try {
            var result = await this.DB.collection("users")
                .doc(id)
                .get();
            if (result.exists) {
                var data = result.data();
                var userSearch = new User(
                    data['name'],
                    data['age'],
                    data['email'],
                    data['password'],
                    result.id);

                return { success: true, data: userSearch.toJsonID() };
            } else
                return {
                    success: false,
                    data: `User ${id} does not exist in database!` ,
                };
        } catch (e) {
            return { success: false, data: `ERROR MESSAGE: ${e}` };
        }
    }



    async replaceUser(id: string, body: any): Promise<CRUDReturn> {

        try {
            var result = await this.DB.collection("users")
                .doc(id)
                .get();
            if (result.exists) {
                var data = result.data();
                var userSearch = new User(
                    data['name'],
                    data['age'],
                    data['email'],
                    data['password'],
                    result.id);
                var validBodyPut: CRUDReturn =
                    Helper.validBodyPut(body);
                if (validBodyPut.success) {
                    if (!await this.emailExists(userSearch.getEmail(), { exceptionId: id })) {
                        var user: User = userSearch;
                        user.replaceValues(body);
                        var success = this.saveToDB(user);
                        if (success)
                            return {
                                success: true,
                                data: user.toJsonID(),
                            };
                        else {
                            throw new Error('Failed to update user in db');
                        }
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

    async deleteUser(id: string): Promise<CRUDReturn> {
        var isUserFound: User = (await this.searchEngine(id, "id")).data;

        if (isUserFound != null) {
            await this.DB.collection("users").doc(id).delete();
            return { success: true, data: `User ${id} deleted sucessfully!` };
        }
        return { success: false, data: `ID ${id} does not exist in database. Please try again.` };
    }


    async userLogin(login: any): Promise<CRUDReturn> {
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
                if (userSearch.getEmail() === login?.email) {
                    var foundUser: User = userSearch;
                    if (foundUser != null) return foundUser.login(login?.password);
                }
            } return { success: false, data: "Email Not Found. Please try again." };
        } catch (e) {
            console.log(`ERROR MESSAGE: ${e.message}`);
            return { success: false, data: `ERROR MESSAGE: ${e.message}` };
        }
    }


    async specialReplaceUser(id: string, body: any) {
        try {
            var result = await this.DB.collection("users")
                .doc(id)
                .get();
            if (result.exists) {
                var data = result.data();
                var userSearch = new User(
                    data['name'],
                    data['age'],
                    data['email'],
                    data['password'],
                    result.id);
                var validBodyPatch: CRUDReturn =
                    Helper.validBody(body);
                if (validBodyPatch.success) {
                    if (!await this.emailExists(userSearch.getEmail(), { exceptionId: userSearch.getID() })) {
                        var user: User = userSearch;
                        user.replaceValues(body);
                        var success = this.saveToDB(user);
                        if (success)
                            return {
                                success: true,
                                data: user.toJsonID(),
                            };
                        else {
                            throw new Error('Failed to update user in db');
                        }
                    } else {
                        throw new Error(`${body.email} is already in use by another user!`);
                    }
                } else {
                    throw new Error(validBodyPatch.data);
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
