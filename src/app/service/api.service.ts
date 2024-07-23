import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { LoadingController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public consumer_key: string= "ck_7bbeb694c9d4980c962e858cb0dcc4ea250c0385";
  public consumer_secret: string= "cs_6cc886dff4a4ebad38827d8fc9812ee722403d4e";
  public key: string;
  public isLoading: boolean = false;
  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController
  ) { 
    this.key = `consumer_key=${this.consumer_key}&consumer_secret=${this.consumer_secret}`;
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
    this.loadingCtrl.dismiss()
    this.isLoading = false;
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

  getProductsByCategory(id:number, page:Number, value: any){
    return this.http.get(`https://www.sommedicose.com/wp-json/wc/v3/products?category=${id}&per_page=10&page=${page}&${value}&${this.key}`)
  }

  getRelatedProduct(id: any){
    return this.http.get(`https://www.sommedicose.com/wp-json/wc/v3/products?include=${id.join(',')}&`+this.key)
  }
  // https://www.sommedicose.com/wp-json/wc/v3/products?per_page=10&page=1&orderby=price&order=desc&category=70&lang=en&currency=INR&status=publish
}
