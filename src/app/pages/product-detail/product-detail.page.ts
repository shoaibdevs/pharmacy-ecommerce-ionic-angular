import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { CartService } from 'src/app/service/cart.service';
import { Swiper } from 'swiper';
import { register } from 'swiper/element/bundle';
import { filter } from 'rxjs/operators';

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
    public cartService: CartService,
    private router: Router
  ) { }
  public id:any = this.route.snapshot.paramMap.get('id');
  public productName:any = this.route.snapshot.paramMap.get('productName') || 'None';
  public product:any;
  public relatedProducts: any;
  public quantity: number = 0;

  ngOnInit() {
    this.loadData();
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/product-detail')) {
          this.updateQuantity();
        }
      });
  }

  loadProduct(loading: boolean = false){
    if (loading) this.service.showLoading(); this.service.isLoading = true;
    this.service.getProductsById(this.id).subscribe((res: any) => {
      localStorage.setItem('product', JSON.stringify(res))
      this.product = res;
      if (loading) this.service.closeLoading();this.service.isLoading = false;
      this.loadRelatedProduct();
    })
  }

  loadRelatedProduct(){
    if(this.product && this.product.related_ids.length !== 0){
      this.service.getRelatedProduct(this.product.related_ids).subscribe((res: any) => {
        this.relatedProducts = res;
      })
    }
  }

  loadData(){
    this.quantity = 0;
    this.product = false;
    this.relatedProducts = false;
    let data = localStorage.getItem('product')
    if(data){
      this.product = JSON.parse(data)
      this.loadProduct();
      this.updateQuantity();
    } else {
      this.loadProduct(true);
    }
  }

  updateQuantity(){
    let cart: any = localStorage.getItem('cart');
    if (cart) {
      cart = JSON.parse(cart);
      this.service.cart_count = cart.length;
      let productInCart = cart.find((item: any) => item.id === this.product.id);
      if (productInCart) {
        this.quantity = productInCart.quantity;
      }else{
        this.quantity = 0
      }
    }else{
      this.quantity = 0
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
    this.updateCart();
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity -= 1;
      this.updateCart();
    }
  }

  addToCart(){
    this.quantity = 1
    this.product.quantity = this.quantity;
    this.cartService.addToCart(this.product);
  }

  updateCart(){
    this.product.quantity = this.quantity;
    this.cartService.updateCart(this.product);
  }
  
  

}
