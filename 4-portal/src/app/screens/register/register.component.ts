import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(private router: Router, public auth: AuthService) {}

  registerForm: FormGroup = new FormGroup({
    fcName: new FormControl('', Validators.required),
    fcAge: new FormControl(0, Validators.min(1)),
    fcEmail: new FormControl('', Validators.required),
    fcPassword: new FormControl('', Validators.required),
    fcPassword2: new FormControl('', Validators.required),
  });

  error: string = '';

  ngOnInit(): void {

  }


  onSubmit() {
    if (
      this.registerForm.value['fcPassword'] !==
      this.registerForm.value['fcPassword2']
    ) {
      this.error = 'Password doesnt match!';
      console.log(this.error);
      return;
    }
    if (!this.registerForm.valid) {
      {
        this.error = 'No fields must be empty';
        console.log(this.error);
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
        age: parseInt(this.registerForm.value.fcAge),
        email: this.registerForm.value.fcEmail,
        password: this.registerForm.value.fcPassword,
      };
      console.log(`Adding payload ${payload.name} account details`);
      this.auth.register(payload).then((data) => {
        console.log(data);
        if (data.success == true && this.auth.authenticated) {
          this.error = `${payload.name} has been sucessfully registered and loged in. Click Logout to leave.`;
        } else {
          this.error = data.data + "\nPlease check inputs and try again";
          console.log(this.error);
        }
      });
    }
  }

  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
