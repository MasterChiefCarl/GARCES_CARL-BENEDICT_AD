import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent implements OnInit {

  constructor(private router: Router, private api: HttpClient) {}

  ngOnInit(): void {
  }

  

  registerForm: FormGroup = new FormGroup({
    fcName: new FormControl('', Validators.required),
    fcAge: new FormControl(0, Validators.min(1)),
    fcEmail: new FormControl('', Validators.required),
    fcPassword: new FormControl('', Validators.required),
    fcPassword2: new FormControl('', Validators.required),
  });
  
  result: any ={success:false, data:'Fill In data to Register'};

  error: string = '';


  async onSubmit():Promise<any>{
    if (
      this.registerForm.value['fcPassword'] !==
      this.registerForm.value['fcPassword2']
    ) {
      this.error = 'Password doesnt match!';
      this.result = {success: false, data:'Registration Failed'};
      return;
    }
    if (!this.registerForm.valid) {
      {
        this.error = 'No fields must be empty';
        this.result = {success: false, data:'Registration Failed'};
        return;
      }
    }
    if (this.registerForm.valid) {
      var payload: {
        name: string;
        email: string;
        age: number;
        password: string;
      };
      payload = {
        name: this.registerForm.value.fcName,
        age: this.registerForm.value.fcAge,
        email: this.registerForm.value.fcEmail,
        password: this.registerForm.value.fcPassword,
      };
      console.log(payload);
      
      this.result= await this.api
      .post(environment.API_URL+'/user/register', {
        name: payload.name,
        age: payload.age,
        email: payload.email,
        password: payload.password,
      }).toPromise();

      console.log(this.result);

      if (this.result.success) {
        this.result = {success: true, data:'Registration Success'};
        this.error = 'SUCCESS'
        return;
      }
      else  {
        this.error = 'FAILURE'
        return;
      }

    }
  }

  nav(destination: string) {
    this.router.navigate([destination]);
  }
}