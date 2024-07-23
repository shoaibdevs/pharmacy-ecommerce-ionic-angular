import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { Swiper } from 'swiper';
import { register } from 'swiper/element/bundle';


register();

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  constructor(
    private route: ActivatedRoute,
    public service: ApiService,
    private actionSheetController: ActionSheetController,
  ) { }
  public id:any = this.route.snapshot.paramMap.get('id');
  public productName:any = this.route.snapshot.paramMap.get('productName') || 'None';
  public product:any;
  public relatedProducts: any;
  public quantity: number = 0;

  public cart_count: number = 0;
  public isProductInCart: boolean = false;

  ngOnInit() {
    this.loadData()
  }

  loadData(){
    let data = localStorage.getItem('product')
    if(data){
      this.product = JSON.parse(data)
      console.log(this.product)
      this.service.getRelatedProduct(this.product.related_ids).subscribe((res: any) => {
        this.relatedProducts = res;
      })
      let cart: any = localStorage.getItem('cart');
      if (cart) {
        cart = JSON.parse(cart);
        this.cart_count = cart.length;
        let productInCart = cart.find((item: any) => item.id === this.product.id);
        if (productInCart) {
          this.quantity = productInCart.quantity;
          this.isProductInCart = true
        }
      } 
    }
  }
  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }
 
  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  increaseQuantity() {
    this.quantity += 1;
  }

  decreaseQuantity() {
    if (this.quantity > 0) { // Ensure quantity does not go below 1
      this.quantity -= 1;
    }
  }

  addToCart() {
    this.isProductInCart = true
    this.product.quantity = this.quantity;
    let cart: any = localStorage.getItem('cart');
  
    if (cart) {
      cart = JSON.parse(cart);
  
      let productIndex = cart.findIndex((item: any) => item.id === this.product.id);
  
      if (productIndex > -1) {
        if (this.quantity === 0) {
          cart.splice(productIndex, 1); // Remove product if quantity is 0
          this.isProductInCart = false
        } else {
          cart[productIndex].quantity = this.quantity; // Update quantity if not 0
        }
      } else {
        if (this.quantity > 0) {
          cart.push(this.product); // Add product if not already in cart and quantity is greater than 0
        }
      }
    } else {
      if (this.quantity > 0) {
        cart = [this.product]; // Create new cart with product if quantity is greater than 0
      } else {
        cart = []; // Ensure cart is empty if no items to add
      }
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart);
    this.cart_count = cart.length;
  }
  
  

}
