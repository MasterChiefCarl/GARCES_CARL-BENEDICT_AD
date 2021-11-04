import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/shared/auth.service';


@Component({
  selector: 'edit-user',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {}

  @Input() user:User|undefined;
  @Input() id:string | undefined;
  @Output() backEvent = new EventEmitter<boolean>();

  registerForm: FormGroup = new FormGroup({
    fcName: new FormControl('', Validators.required),
    fcAge: new FormControl(0, Validators.min(1)),
    fcEmail: new FormControl('', Validators.required),
  });

  error: string = '';

  goBack(){
    this.backEvent.emit(true);
  }

  ngOnInit(): void {
    if(this.user!=undefined){
      this.registerForm.setValue({
        fcName:this.user.name,
        fcAge: this.user.age,
        fcEmail:this.user.email
      });
    }
  }

  onSubmit() {
    console.log("onSubmit button");
    // // if (
    // //   this.registerForm.value['fcPassword'] !==
    // //   this.registerForm.value['fcPassword2']
    // // ) {
    // //   this.error = 'Password doesnt match!';
    // //   console.log(this.error);
    // //   return;
    // // }
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
      };
      payload = {
        name: this.registerForm.value.fcName,
        age: parseInt(this.registerForm.value.fcAge),
        email: this.registerForm.value.fcEmail,
      };
      console.log(`Updating payload ${payload.name} into ${this.id} \'s account details`);

      this.auth.update(payload,`${this.id}`).then((data) => {
        console.log(data);
        if (data.success == true && this.auth.authenticated) {
          this.error = `${payload.name} has been sucessfully updated. Return User List to see updated results`;
        } else {
          this.error = data.data;
          console.log(this.error);
        }
      });
    }
  }

  nav(destination: string) {
    console.log(`routing to ${destination}`);
    this.router.navigate([destination]);
  }
}
