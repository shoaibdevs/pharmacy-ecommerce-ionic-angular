import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    public service: ApiService
  ) { }

  getCart(){
    let cart: any = localStorage.getItem('cart');
    if (cart) {
      cart = JSON.parse(cart);
    } else {
      cart = []
    }
    return cart
  }

  addToCart(product: any){
    let cart: any = localStorage.getItem('cart');
    if (cart) {
      cart = JSON.parse(cart);
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.service.cart_count = cart.length;
    } else {
      let cartData = []
      cartData.push(product)
      localStorage.setItem('cart', JSON.stringify(cartData));
      this.service.cart_count = 1;
    }
  }

  updateCart(product: any){
    let cart: any = localStorage.getItem('cart');
    if (cart) {
      cart = JSON.parse(cart);
      let productIndex = cart.findIndex((item: any) => item.id === product.id);
      if (productIndex > -1) {
        if (product.quantity === 0) {
          cart.splice(productIndex, 1);
        } else {
          cart[productIndex].quantity = product.quantity;
        }
      } else {
        if (product.quantity > 0) {
          cart.push(product);
        }
      }
    } else {
      if (product.quantity > 0) {
        cart = [product];
      } else {
        cart = [];
      }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart);
    this.service.cart_count = cart.length;
  }


  getCartTotal(){
    let cart = this.getCart()
    return cart.reduce((acc: any, item: any) => acc + item.quantity * item.sale_price, 0);
  }
}
