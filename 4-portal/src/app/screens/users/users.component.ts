import { Component, OnInit } from '@angular/core';
import { faTrash, faPenAlt } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/model/user.model';
import { ApiService } from 'src/app/shared/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: Array<User> = [];

  //icons
  faTrash = faTrash;
  faPenAlt=faPenAlt;
  searchValue: string = '';
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getData();
  }

  async deleteUser(i: number) {
    var decision = confirm('Are you sure you want to delete this user? ' + this.users[i].name);
    if(decision)
    {
      var result = await this.api.delete(`/user/${this.users[i].id}`);
      if(result.success){
        this.getData();
      }
    }
  }

  async resetDB(){
    var decision = confirm('Are you sure you want to reset Database?');
    if(decision)
    {
    var result = await this.api.patch('/user/reset');
    this.getData();
    }
  }

  async getData(term?: string) {
    if (term == undefined || term == null) {
      this.users = await this.getAll();
      console.log(this.users);
    }
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
}
