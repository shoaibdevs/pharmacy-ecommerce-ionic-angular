import { Component, OnInit } from '@angular/core';
import {  Router, NavigationEnd, Event } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { filter, finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cart: any;
  public total: number = 0;
  emptyCart  = false;
  constructor(
    public service: ApiService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/tabs/cart')) {
          this.loadCart();
        }
      });
  }

  loadCart() {
    this.emptyCart = false
    let cart:any = localStorage.getItem('cart');
    if (cart) {
      cart = JSON.parse(cart);
      this.loadProduct(cart);
      if (cart.length == 0) {
        this.cart = false; this.emptyCart = true
      }
    } else {
      this.cart = false;
      this.emptyCart = true
    }
  }

  loadProduct(cartData:any) {
    let ids = cartData?.map((product:any) => product.id);
    this.service.showLoading();
    this.service.isLoading = true;
    const productsByCategory$ = this.service.getRelatedProduct(ids);
    forkJoin([productsByCategory$]).subscribe((res: any[]) => {
      console.log("Products", res[0]);
      const productMap = new Map(res[0].map((product: any) => [product.id, product]));
      this.cart = cartData.map((cartProduct: any) => {
        const productData = productMap.get(cartProduct.id);
        if (productData) {
          return {
            ...cartProduct,
            ...productData,
            quantity: cartProduct.quantity
          };
        }
        return cartProduct;
      });
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.calculateTotal();
      this.service.closeLoading(); 
      this.service.isLoading=false
    });
  }
  
  updateCart(product: any, method: string) {
    let cart: any = localStorage.getItem('cart');
    if (cart) {
      cart = JSON.parse(cart);
      let productIndex = cart.findIndex((item: any) => item.id === product.id);
      if (productIndex > -1) {
        if (method === '+') {
          cart[productIndex].quantity += 1;
        } else if (method === '-') {
          if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;
          } else {
            this.confirmDelete(product);
            return;
          }
        } else {
          this.confirmDelete(product);
          return;
        }
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      this.cart = cart;
      this.calculateTotal();
    }
  }

  async confirmDelete(product: any) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to remove this product from the cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Delete canceled');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.removeFromCart(product);
          }
        }
      ]
    });

    await alert.present();
  }

  removeFromCart(product: any) {
    const productIndex = this.cart.findIndex((item: any) => item.id === product.id);
    if (productIndex > -1) {
      this.cart.splice(productIndex, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      console.log('Product removed', this.cart);
      this.calculateTotal();
    }
  }
  calculateTotal() {
    this.total = this.cart.reduce((acc: any, item: any) => acc + item.quantity * item.sale_price, 0);
  }

}