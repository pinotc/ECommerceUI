import { Component, OnInit } from '@angular/core';
import { SuggestedProduct } from '../models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  suggestedProducts: SuggestedProduct[] = [
    {
      banerimage: 'Baner/image 2.png',
      category: {
        id: 0,
        category: 'ANANAS',
        subCategory: 'ANANAS-Canvas',
      },
    },
    {
      banerimage: 'Baner/image 5.png',
      category: {
        id: 1,
        category: 'NIKE',
        subCategory: 'NIKE-Canvas',
      },
    },
    {
      banerimage: 'Baner/desktop_productlist.jpg',
      category: {
        id: 1,
        category: 'ANANAS',
        subCategory: 'ANANAS-Cotton',
      },
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
