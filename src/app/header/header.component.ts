import {
  Component,
  ElementRef,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Category, NavigationItem, Product } from '../models/models';
import { RegisterComponent } from '../register/register.component';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';
import { User } from '../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('modalTitle') modalTitle!: ElementRef;
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  cartItems: number = 0;
  users:User[]=[];
  products: Product[] = [];

  navigationList: NavigationItem[] = [];
  constructor(
    private navigationService: NavigationService,
    public utilityService: UtilityService,
    public router : Router
  ) {}

  ngOnInit(): void {
    // Get Category List
    this.navigationService.getCategoryList().subscribe((list: Category[]) => {
      for (let item of list) {
        let present = false;
        for (let navItem of this.navigationList) {
          if (navItem.category === item.category) {
            navItem.subcategories.push(item.subCategory);
            present = true;
          }
        }
        if (!present) {
          this.navigationList.push({
            category: item.category,
            subcategories: [item.subCategory],
          });
        }
      }
    });

    // Cart
    if (this.utilityService.isLoggedIn()) {
      this.navigationService
        .getActiveCartOfUser(this.utilityService.getUser().id)
        .subscribe((res: any) => {
          this.cartItems = res.cartItems.length;
          this.users.push(this.utilityService.getUser());
        });
    }

    this.utilityService.changeCart.subscribe((res: any) => {
      if (parseInt(res) === 0) this.cartItems = 0;
      else this.cartItems += parseInt(res);
    });

    this.utilityService.cartItems$.subscribe((cartItems: number) => {
      this.cartItems = cartItems;
    });
  }

  // openModal(name: string) {
  //   this.container.clear();

  //   let componentType!: Type<any>;
  //   if (name === 'login') {
  //     componentType = LoginComponent;
  //     this.modalTitle.nativeElement.textContent = 'Đăng nhập';
  //   }
  //   if (name === 'register') {
  //     componentType = RegisterComponent;
  //     this.modalTitle.nativeElement.textContent = 'Đăng ký';
  //   }

  //   this.container.createComponent(componentType);
  // }
  onSearch(inputElement: EventTarget | null) {
    // Kiểm tra xem 'EventTarget' có phải là 'null' không
    if (inputElement instanceof HTMLInputElement) {
      // Ép kiểu 'EventTarget' thành 'HTMLInputElement' để truy cập thuộc tính 'value'
      const title = inputElement.value;
      // Gọi phương thức searchProductsByTitle từ NavigationService
      // để lấy kết quả tìm kiếm
      this.navigationService.searchProductsByTitle(title).subscribe(
        (results) => {
          // Xử lý kết quả tìm kiếm ở đây, ví dụ: hiển thị chúng trên giao diện người dùng
          this.utilityService.setSearchResults(results);
          console.log('Kết quả tìm kiếm:', results);
          this.router.navigate(['/search']);
        }
      );
    } else {
      console.warn('Phần tử nhập là null.');
    }
  }
  OpenRegister(){
    this.router.navigate(['/register']);
  }
  OpenLogin(){
    this.router.navigate(['/login']);
  }
}
