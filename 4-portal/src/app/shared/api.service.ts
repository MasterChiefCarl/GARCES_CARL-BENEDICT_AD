import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private api: HttpClient) { }

  async post(url: string, body: any):Promise<any> {
    try{
    return await this.api.post(url, body).toPromise();
    }catch (e){
      console.log(e);
      return null;
    }
  }
}
