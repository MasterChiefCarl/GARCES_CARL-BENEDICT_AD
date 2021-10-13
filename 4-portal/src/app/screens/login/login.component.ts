import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  title = 'portal';
  userCredential1:string = 'NULL';
  userCredential2:string = 'NULL';


  users: Array<any> =[
    {username: 'potato', password: 'tomato'},
    {username: 'potato1', password: 'tomato1'},
    {username: 'potato2', password: 'tomato2'},
    {username: 'potato3', password: 'tomato3'},
  ];

  login(email:string, password:string){
    this.userCredential1= email;
    this.userCredential2= password;
  }

}
