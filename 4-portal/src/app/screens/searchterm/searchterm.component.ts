import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'searchwin',
  templateUrl: './searchterm.component.html',
  styleUrls: ['./searchterm.component.scss']
})
export class SearchtermComponent implements OnInit {

  constructor(public router:Router) { }
  @Output() backEvent = new EventEmitter<string>();
  ngOnInit(): void {
  }

  searchForm: FormGroup = new FormGroup({
    fcSearch: new FormControl('', Validators.required),
  });
  error: string = '';

  search(){
    console.log("Button Works!!!!");
  }
  
  async onSubmit() {
    if (!this.searchForm.valid) {
      {
        this.error = 'Search must not be empty';
        console.log(this.error);
        return;
      }
    }
    if(this.searchForm.valid) {
      this.backEvent.emit(this.searchForm.value.fcSearch);
    }
  }
  
  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
