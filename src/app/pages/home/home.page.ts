import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Swiper } from 'swiper';
import { ApiService } from 'src/app/service/api.service';
import { register } from 'swiper/element/bundle';
import { forkJoin } from 'rxjs';

register();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

 
  constructor(
    public service: ApiService
  ) { }
  bannerData: any;
  categories: any[] = [];
  topRatedProducts: any;
  ngOnInit() {
    this.loadData();
  }

  loadData(){
    const banner$ = this.service.getBanner();
    const category$ = this.service.getCategory();
    const topRated$ = this.service.getTopRated();
  
    forkJoin([banner$, category$, topRated$]).subscribe((res: any[]) => {
      if (res[0].data) {
        this.bannerData = res[0].data;
      }
      this.categories = res[1];
      this.topRatedProducts = res[2];
    });
  }
  
  handleRefresh(event: any) {
    const banner$ = this.service.getBanner();
    const category$ = this.service.getCategory();
    const topRated$ = this.service.getTopRated();
  
    forkJoin([banner$, category$, topRated$]).subscribe((res: any[]) => {
      if (res[0].data) {
        this.bannerData = res[0].data;
      }
      this.categories = res[1];
      this.topRatedProducts = res[2];
      event.target.complete();
    });
  }

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }
 
  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  

}
