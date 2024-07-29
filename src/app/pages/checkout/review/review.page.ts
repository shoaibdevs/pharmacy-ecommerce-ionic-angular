import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { filter, finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/service/api.service';
@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  cart: any;
  public total: number = 0;
  emptyCart = false;
  shippingAddress: any;
  shippingMethod: any;
  shippingCharge: number = 0;
  mode: any;
  constructor(
    public service: ApiService,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/checkout/review')) {
          this.loadCart();
        }
      });
  }

  loadCart() {
    this.route.queryParamMap.subscribe((params) => {
      this.mode = params.get('mode');
      console.log(this.mode);
      if (this.mode == 'cod' || this.mode == 'online') {
      } else {
        this.router.navigateByUrl('/tabs/home');
      }
      console.log(this.mode); // should log 'cod'
    });
    let shipping: any = localStorage.getItem('shipping');
    let shippingMethod: any = localStorage.getItem('shippingMethod');

    shipping = JSON.parse(shipping);
    shippingMethod = JSON.parse(shippingMethod);

    this.shippingAddress = shipping;

    this.shippingMethod = shippingMethod;
    if (this.shippingMethod.method_id === 'free_shipping') {
      this.shippingCharge = 0;
    } else {
      this.shippingCharge = Number(this.shippingMethod.settings.cost.value);
    }

    let cart: any = localStorage.getItem('cart');
    if (cart) {
      cart = JSON.parse(cart);
      this.loadProduct(cart);
      if (cart.length == 0) {
        this.cart = false;
        this.emptyCart = true;
      }
    } else {
      this.cart = false;
      this.emptyCart = true;
    }
  }

  loadProduct(cartData: any) {
    let ids = cartData?.map((product: any) => product.id);
    this.service.showLoading();
    this.service.isLoading = true;
    this.service.getRelatedProduct(ids).subscribe(
      (res: any) => {
        console.log('Products', res);
        const productMap = new Map(
          res.map((product: any) => [product.id, product])
        );
        this.cart = cartData.map((cartProduct: any) => {
          const productData = productMap.get(cartProduct.id);
          if (productData) {
            return {
              ...cartProduct,
              ...productData,
              quantity: cartProduct.quantity,
            };
          }
          return cartProduct;
        });
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.calculateTotal();
        this.service.closeLoading();
      },
      (err: any) => {
        this.service.closeLoading();
        this.service.isLoading = false;
      }
    );
  }

  calculateTotal() {
    this.total = this.cart.reduce(
      (acc: any, item: any) => acc + item.quantity * item.sale_price,
      0
    );
  }

  placeOrder() {
    this.service.isLoading = true;
    this.service.showLoading();
    let billing: any = localStorage.getItem('billing');
    let userData: any = localStorage.getItem('userData');

    let token: any = localStorage.getItem('token');
    billing = JSON.parse(billing);
    billing.postcode = String(billing.postcode);
    this.shippingAddress.postcode = String(this.shippingAddress.postcode);

    userData = JSON.parse(userData);
    let line_items: any = [];
    for (let i = 0; i < this.cart.length; i++) {
      let newCart = {
        quantity: this.cart[i].quantity,
        product_id: this.cart[i].id,
        price: Number(this.cart[i].sale_price),
        total: String(this.cart[i].sale_price * this.cart[i].quantity),
        meta_data: this.cart[i].meta_data,
      };
      line_items.push(newCart);
    }
    let data = {
      billing: billing,
      shipping: this.shippingAddress,
      sameAddress: true,
      line_items: line_items,
      payemnt_method: this.mode == 'cod' ? 'Cash On Delievery' : 'razorpay',
      payment_method_title:
        this.mode == 'cod' ? 'cod' : 'Razorpay',
      platform: 'app',
      customer_id: userData?.id,
      customer_note: '',
      coupons: [],
      on_page: '2',
      token: token,
      shipping_ids: [this.shippingMethod],
    };
    this.service.createOrder(data).subscribe(
      (res: any) => {
        console.log(res);
        localStorage.removeItem('cart')
        this.service.cart_count = 0
        localStorage.removeItem('shippingMethod')
        localStorage.removeItem('billing')
        localStorage.removeItem('shipping')
        localStorage.removeItem('product')
        this.service.closeLoading();
        this.service.isLoading = false;
        this.confirmDelete();
      },
      (err: any) => {
        this.service.closeLoading();
        this.service.isLoading = false;
      }
    );
    console.log(data);
  }
  dismiss() {
    this.alertController.dismiss();

    this.router.navigateByUrl('/tabs/home');
  }
  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Success!',
      message: 'Order Created Successfully.',
      buttons: [
        {
          text: 'OK',
          role: 'OK',
          cssClass: 'secondary',
          handler: () => {
            this.dismiss();
          },
        },
      ],
    });

    await alert.present();
  }
}
