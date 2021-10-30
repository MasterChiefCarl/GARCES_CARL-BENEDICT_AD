import { Component, OnInit } from '@angular/core';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  faHeart = faHeart;
  ngOnInit(): void {
  }

}
