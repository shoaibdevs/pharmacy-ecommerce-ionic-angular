import { Component, OnInit } from '@angular/core';
import {  Router, NavigationEnd, Event } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { filter } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cart: any[] = [];
  public total: number = 0;
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
    let cart = localStorage.getItem('cart');
    if (cart) {
      this.cart = JSON.parse(cart);
      this.calculateTotal();
    }
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
    const productIndex = this.cart.findIndex(item => item.id === product.id);
    if (productIndex > -1) {
      this.cart.splice(productIndex, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      console.log('Product removed', this.cart);
      this.calculateTotal();
    }
  }
  calculateTotal() {
    this.total = this.cart.reduce((acc, item) => acc + item.quantity * item.sale_price, 0);
  }

}