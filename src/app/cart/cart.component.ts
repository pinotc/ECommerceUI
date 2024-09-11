import { Router } from '@angular/router';
import { CartItem } from './../models/models';
import { NavigationService } from './../services/navigation.service';
import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { Cart, Payment } from '../models/models';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  userid:number = 0;
  usersCart: Cart = {
    id: 0,
    user: this.utilityService.getUser(),
    cartItems: [],
    ordered: false,
    orderedOn: '',
  };

  usersPaymentInfo: Payment = {
    id: 0,
    user: this.utilityService.getUser(),
    paymentMethod: {
      id: 0,
      type: '',
      provider: '',
      available: false,
      reason: '',
    },
    totalAmount: 0,
    shipingCharges: 0,
    amountReduced: 0,
    amountPaid: 0,
    createdAt: '',
  };

  usersPreviousCarts: Cart[] = [];

  constructor(
    public utilityService: UtilityService,
    private navigationService: NavigationService,
    private router:Router
  ) {}

  ngOnInit(): void {
    // Get Cart
    this.navigationService
      .getActiveCartOfUser(this.utilityService.getUser().id)
      .subscribe((res: any) => {
        this.userid = this.utilityService.getUser().id
        this.usersCart = res;
        // Calculate Payment
        this.utilityService.calculatePayment(
          this.usersCart,
          this.usersPaymentInfo
        );
      });

    // Get Previous Carts
    this.navigationService
      .getAllPreviousCarts(this.utilityService.getUser().id)
      .subscribe((res: any) => {
        this.usersPreviousCarts = res;
      });
  }


  deleteItem(cartItemId: number) {
    const index = this.usersCart.cartItems.findIndex(item => item.id === cartItemId);
    if (index !== -1) {
      this.usersCart.cartItems.splice(index, 1);
    }
    // Gọi API xóa sản phẩm
    this.navigationService.deleteCartItem(this.userid,cartItemId).subscribe(
      () => {
        // Làm mới thông tin giỏ hàng sau khi xóa thành công
        this.navigationService.getActiveCartOfUser(this.userid).subscribe(
          (cartRes: any) => {
            this.usersCart = cartRes;
            this.utilityService.calculatePayment(
              this.usersCart,
              this.usersPaymentInfo
            );
            console.log('Xóa thành công');
            this.utilityService.updateCartItemsCount(this.usersCart.cartItems.length)
          }
        );
      }
    );
  }
}
