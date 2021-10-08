import * as admin from "firebase-admin";
import { CRUDReturn } from './crud_return.interface';
import { Helper } from './helper';

export class User {

  private id: string;
  private name: string;
  private age: number;
  private email: string;
  private password: string;





  constructor(name: string, age: number, email: string, password: string, id?: string) {
    if (id != undefined)
      this.id = id;
    else this.id = Helper.generateUID();
    this.name = name;
    this.age = age;
    this.email = email;
    this.password = password;
  }

  static async retrieve(id: string) {
    try {
      var DB = admin.firestore();
      var result = await DB.collection("users").doc(id).get();
      if (result.exists) {
        var data = result.data();
        return new User(
          data['name'],
          data['age'],
          data['email'],
          data['password'],
          result.id);
      }
    } catch (e) {
      console.log(e)
      return null;
    }

  }
  async commit(): Promise<CRUDReturn> {
    try {
      var DB = admin.firestore();
      var result = await DB.collection("users").doc(this.id).set(this.toJsonFull())
      return {
        success: true,
        data: this.toJsonID()
      };
    }
    catch (e) {
      console.log(e)
      return { success: false, data: e };
    }
  }

  matches(term: string): boolean {
    var keys: Array<string> = Helper.describeClass(User);
    keys = Helper.removeItemOnce(keys, 'password');
    for (const key of keys) {
      if (`${this[key]}` === term) return true;
    }
    return false;
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

  toJsonFull() {
    return {
      name: this.name,
      age: this.age,
      email: this.email,
      password: this.password
    };
  }
  toJson() {
    return {
      name: this.name,
      age: this.age,
      email: this.email
    };
  }
  toJsonID() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      email: this.email
    };
  }

  log() {
    console.log(this.toJson());
  }

  emptyUserCheck(input: User): CRUDReturn {
    if (input.name == '' || input.name == null) return { success: false, data: "User input has no name" };
    else if (input.age == null) return { success: false, data: "User input has no age" };
    else if (input.email == '') return { success: false, data: "User input has no email" };
    else if (input.password == '') return { success: false, data: "User input has no password" };
    else return { success: true, data: null };
  }


  // PRIVATE RETURN AND UPDATE (TO PROTECT CLASS DATA)
  getID() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getEmail() {
    return this.email;
  }
  getAge() {
    return this.age;
  }
  fixID(id: string) {
    this.id = id;
  }
  newName(name: string) {
    this.name = name;
  }

  newAge(age: number) {
    this.age = age;
  }

  newEmail(email: string) {
    this.email = email;
  }

  newPassword(password: string) {
    this.password = password;
  }

}





