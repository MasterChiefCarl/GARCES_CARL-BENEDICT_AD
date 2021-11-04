import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faTrash, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/model/user.model';
import { ApiService } from 'src/app/shared/api.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: Array<User> = [];

  //icons
  faTrash = faTrash;
  faEdit = faEdit;
  faSearch = faSearch;
  // searchValue: string = '';
  viewedUserIndex:number | undefined;
  userID:string |undefined;
  searchService:boolean |undefined;
  searched:string | undefined;
  constructor(private router: Router,private api: ApiService,private auth:AuthService) {}

  

  ngOnInit(): void {
    console.log(`collecting this.users data`)
    this.getData();

  }

  nav(destination: string) {
    this.router.navigate([destination]);
  }

  async search(term:any){
    var result = await this.api.get(`/user/search/${term}`);
    var temp: Array<User> = [];
    if (result.success) {
      result.data.forEach((json: any) => {
        var tempU = User.fromJson(json.id, json);
        if (tempU != null) temp.push(tempU);
      });
    }
    return temp;
  }

  async deleteUser(i: number) {
    if (this.users[i].id == this.auth.user?.id){
      console.log(`${this.users[i].id} CANT BE DELETED!`);
      window.alert(`${this.users[i].name} CAN'T BE DELETED BECUASE IT IS CURRENTLY LOGGED IN!\nLOG OUT ACCOUNT TO DELETE`);
    }
    else{
    console.log(`${this.users[i].id} is about to be DELETED!`);
    var decision = confirm('Are you sure you want to delete this user? ' + this.users[i].name);
    if(decision)
    {
      var result = await this.api.delete(`/user/${this.users[i].id}`);
      if(result.success){
        this.getData();
      }
    }
  }
  }

  async resetDB(){
    console.log("ResetDB PRESSED!");
    var decision = confirm('Are you sure you want to reset Database? \nThis Reset Action cannot be undone!');
    if(decision)
    {
    var result = await this.api.patch('/user/reset');
    this.getData();
    console.log("RESETDB SUCCESS");
    }
    else console.log("RESETDB CANCELLED");
  }

  async getData(term?: string) {
    if (term == undefined || term == null || term=='') {
      this.users = await this.getAll();
    }
    else {
      this.users = await this.search(term);
    }
    console.log(this.users);
  }
  
  async getAll(): Promise<Array<User>> {
    var result = await this.api.get('/user/all');
    var temp: Array<User> = [];
    if (result.success) {
      result.data.forEach((json: any) => {
        var tempU = User.fromJson(json.id, json);
        if (tempU != null) temp.push(tempU);
      });
    }
    return temp;
  }

  handleBackEvent(event:any){
    if(typeof event == 'boolean'||event == true){
      this.viewedUserIndex = undefined;
      this.searchService =undefined;
      this.getData();
    }
    else if (typeof event == 'string'){
      this.viewedUserIndex = undefined;
      this.searchService =undefined;
      this.searched = event;
      this.getData (event);
      
    }
  }

  enableSearchService(){
    this.searchService = true;
  }

  viewUserData(i:number) {
   this.viewedUserIndex = i;
   this.userID = this.users[i].id;
  }
  
  resetSearch(){
    this.viewedUserIndex = undefined;
      this.searchService =undefined;
      this.getData();
      this.searched = undefined;
  }
}
