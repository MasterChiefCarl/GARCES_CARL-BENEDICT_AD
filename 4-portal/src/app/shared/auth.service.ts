import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { ApiService } from './api.service';
import { CRUDReturn } from '../model/crud_return.interface';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user?: User | null;
  public loginconfirm:boolean = false;
  constructor(private api: ApiService) {}

  get authenticated(): boolean {
    return this.user != undefined && this.user != null;
  }

  async login(email: string, password: string): Promise<CRUDReturn> {
    try {
      var result: any = await this.api.post('/user/login', { email, password });
      var output: CRUDReturn = { success: result.success, data: result.data };
      if (output.success === true) {
        this.user = User.fromJson(output.data.id, output.data);
        this.loginconfirm= true;
      }
      return output;
    } catch (error) {
      if (error instanceof Error)
        return { success: false, data: error.message };
      else return { success: false, data: 'unknown login error' };
    }
  }

  async register(payload: {
    name: string;
    age: number;
    email: string;
    password: string;
  },loginafterregister:boolean = false): Promise<CRUDReturn> {
    var result: any = await this.api.post('/user/register', payload);
    var output: CRUDReturn = { success: result.success, data: result.data };
    // if (output.success === true) {
    //   if (this.user == null){
    //     if (this.loginconfirm == false)
    //     this.user = User.fromJson(output.data.id, output.data);
    //   }
    // }
    console.log(`a user is logged in no swtich`);
    return output; 
  }

  async update(payload: {
    name?: string;
    age?: number;
    email?: string;
    password?:string;
  },id:string ): Promise<CRUDReturn>{
    var result = await this.api.patch(`/user/${id}`,payload);
    var output: CRUDReturn = {success: result.success, data: result.data};
    return output; // returns results wether true or false 
  }


  logout() {
    this.user = null;
    this.loginconfirm = false;
  }
}
