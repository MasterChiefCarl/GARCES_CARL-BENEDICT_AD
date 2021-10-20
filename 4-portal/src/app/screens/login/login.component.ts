import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})


export class LoginComponent implements OnInit {
  constructor(private router: Router, private api: HttpClient) {}

  ngOnInit(): void {}

  fcEmail = new FormControl();
  fcPassword = new FormControl();
  requestResult = '';
  successID:{name:string, age:number, email:string,password:string} = {name:"", age:0, email:"",password:""};
  
  async login() {
    var result: any = await this.api
      .post(environment.API_URL + '/user/login', {
        email: this.fcEmail.value,
        password: this.fcPassword.value,
      })
      .toPromise();
    if(result.success){
      this.successID = {name: result.data.name, age:result.data.age, email: result.data.email, password: this.fcPassword.value}
      this.nav('home');
    }
    
    // if (
    //   this.fcEmail.value == 'daniel@gmail.com' &&
    //   this.fcPassword.value == '12345678'
    // ) {
    //   this.nav('home');
    // } else {
    //   alert('Incorrect credentials');
    //   console.log('Nagkakamali ka ng susi');
    // }
  }
  


  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
