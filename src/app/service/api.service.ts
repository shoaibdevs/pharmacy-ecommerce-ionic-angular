import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public consumer_key: string= "ck_7bbeb694c9d4980c962e858cb0dcc4ea250c0385";
  public consumer_secret: string= "cs_6cc886dff4a4ebad38827d8fc9812ee722403d4e";
  public key: string;
  public isLoading: boolean = false;
  public cart_count: number= 0;
  public cart_data: any;
  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public toastController: ToastController
  ) { 
    this.key = `consumer_key=${this.consumer_key}&consumer_secret=${this.consumer_secret}`;
    this.updateCartCount();
  }

  updateCartCount(){
    let cart: any = localStorage.getItem('cart')
    if (cart){
      cart = JSON.parse(cart)
      this.cart_data = cart;
      this.cart_count = cart?.length
    } else {
      this.cart_count = 0;
    }
  }
  async showSnak(text: string) {
    const toast = await this.toastController.create({
      message: text,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
  closeSnak(){
    this.toastController.dismiss()
  }


  async showLoading() {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    loading.present();
  }
  storeProduct(data: any){
    localStorage.setItem('product', JSON.stringify(data));
  }

  closeLoading(){
    if(this.isLoading){
      console.log("Loading close")
      this.loadingCtrl.dismiss()
      this.isLoading = false;
    }

  }

  getBanner(){
    return this.http.get("https://www.sommedicose.com/wp-json/api/tc_settings/app_all_banners")
  }

  getCategory(){
    return this.http.get("https://www.sommedicose.com/wp-json/wc/v3/products/categories?per_page=99&page=1&lang=en&currency=INR&status=publish&"+this.key)
  }

  getTopRated(){
    return this.http.get("https://www.sommedicose.com/wp-json/wc/v3/products?per_page=10&page=1&sortType=ASC&topSelling=1&lang=en&currency=INR&status=publish&"+this.key)
  }
  getProductsById(id:number){
    return this.http.get(`https://www.sommedicose.com/wp-json/wc/v3/products/${id}?lang=en&currency=INR&status=publish&${this.key}`)
  }
  getProductsByCategory(id:number, page:Number, value: any){
    return this.http.get(`https://www.sommedicose.com/wp-json/wc/v3/products?category=${id}&per_page=10&page=${page}&${value}&${this.key}`)
  }

  getRelatedProduct(id: any){
    return this.http.get(`https://www.sommedicose.com/wp-json/wc/v3/products?include=${id.join(',')}&`+this.key)
  }

  getShippingMethod(){
    return this.http.get(`https://www.sommedicose.com/wp-json/wc/v3/shipping/zones/0/methods?lang=en&currency=INR&`+this.key)
  }

  getPaymentMethod() {
    return this.http.get(`https://www.sommedicose.com/wp-json/wc/v3/payment_gateways?lang=en&currency=INR&`+this.key)
  }


  register(data: any){
    return this.http.post(`https://www.sommedicose.com/wp-json/api/tc_user/register/?insecure=cool`, data)
  }

  login(data: any){
    return this.http.post(`https://www.sommedicose.com/wp-json/api/tc_user/generate_cookie/?insecure=cool`, data)
  }

  createOrder(data: any){
    return this.http.post(`https://www.sommedicose.com/wp-json/wc/v3/orders?`+this.key, data)
  }


  getOrders(page: number) {
    let user: any = localStorage.getItem('userData')
    user = JSON.parse(user)
    return this.http.get(`https://www.sommedicose.com/wp-json/wc/v3/orders/?page=${page}&customer=${user.id}&lang=en&currency=INR&`+this.key)
  }

  getOrderById(id: number) {
    let user: any = localStorage.getItem('userData')
    user = JSON.parse(user)
    return this.http.get(`https://www.sommedicose.com/wp-json/wc/v3/orders/${id}?customer=${user.id}&`+this.key)
  }

  lostPassword(data: any){
    return this.http.post(`https://www.sommedicose.com/api/client/lost-password`, data)
  }
  

}
