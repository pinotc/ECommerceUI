import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';
import { Product } from '../models/models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  view: 'grid' = 'grid';
  sortby: 'default' | 'htl' | 'lth' = 'default';
  products: Product[] = [];

  onClick(item: any) {
    // Đảo ngược trạng thái clicked của phần tử được click
    item.clicked = !item.clicked;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService,
    public utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      let category = params.category;
      let subcategory = params.subcategory;

      if (category && subcategory) {
        this.navigationService
          .getProducts(category, subcategory, 10)
          .subscribe((res: any) => {
            this.products = res;
            console.log(res) // Gán kết quả truy vấn vào mảng products
          });
      } else {
        // Nếu không có category và subcategory trong queryParams, không thực hiện truy vấn mà giữ nguyên mảng products
      }
    });
    this.utilityService.currentSearchResults$.subscribe((results: Product[]) => {
      this.products = results;
    });
  }

  sortByPrice(sortKey: string) {
    this.products.sort((a, b) => {
      if (sortKey === 'default') {
        return a.id > b.id ? 1 : -1;
      }
      return (
        (sortKey === 'htl' ? 1 : -1) *
        (this.utilityService.applyDiscount(a.price, a.offer.discount) >
        this.utilityService.applyDiscount(b.price, b.offer.discount)
          ? -1
          : 1)
      );
    });
  }
}
