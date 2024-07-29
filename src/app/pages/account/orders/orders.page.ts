import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { Swiper } from 'swiper';
import { register } from 'swiper/element/bundle';
import { filter } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

register();
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
    @ViewChild('swiper')
    swiperRef: ElementRef | undefined;
    swiper?: Swiper;

    filterValue:any= 'All';
    loadNextPage: boolean = true
  constructor(
    private service: ApiService
  ) { }
  page: number = 1;
  orders: any;
  ngOnInit() {
    this.loadData();
  } 

  loadData(){
    this.service.getOrders(this.page).subscribe((res: any) => {
      console.log(res);
      this.orders = res
    })
  }

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }
 
  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }


  getData(){
    return this.filterValue === 'All' ? this.orders : this.orders.filter((item: any) => item.status === this.filterValue)
  }

  onIonInfinite(ev: any) {
    if(!this.loadNextPage){
      ev.target.complete();
      return;
    }
    this.page = this.page + 1
    this.service.getOrders(this.page).subscribe((res: any) => {
      if(res.length != 0){
        this.orders = [...this.orders, ...res]
        this.loadNextPage = true
      }else{
        this.page = this.page - 1
        this.loadNextPage = false
      }
      ev.target.complete();
    })
  }

  handleRefresh(event: any) {
    this.page = 1
    this.loadNextPage = true
    const productsByCategory$ = this.service.getOrders(this.page);
    forkJoin([productsByCategory$]).subscribe((res: any[]) => {
      this.orders = res[0];
      event.target.complete();
    });
  }
}
