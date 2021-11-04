import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public router:Router, private auth:AuthService) { }
  username = this.auth.user?.name;
  uid= this.auth.user?.id;


  ngOnInit(): void {
  }

  logout() {
    this.auth.logout();
    this.nav('login');
  }
  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
