import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchterm',
  templateUrl: './searchterm.component.html',
  styleUrls: ['./searchterm.component.scss']
})
export class SearchtermComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit(): void {
  }

  search(){
    console.log("Button Works!!!!");
  }
  
  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
