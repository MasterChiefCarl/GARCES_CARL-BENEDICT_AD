import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor (private router:Router){};


  title = 'portal';
  private userCredential1:string = 'carlgarces7@gmail.com';
  private userCredential2:string = 'trollwarlord69';

  ngOnInit():void{}

  users: Array<any> =[
    {username: 'potato', password: 'tomato'},
    {username: 'potato1', password: 'tomato1'},
    {username: 'potato2', password: 'tomato2'},
    {username: 'potato3', password: 'tomato3'},
  ];

  login(email:string, password:string){
    if (email == this.userCredential1 && password == this.userCredential2){
      this.router.navigate(["home"]);

    }else {
      alert ("incorrect credentials");
      if (email !=this.userCredential1) console.log ("Wrong username");
      if (password !=this.userCredential1) console.log ("Wrong password");

    }
  }

}
