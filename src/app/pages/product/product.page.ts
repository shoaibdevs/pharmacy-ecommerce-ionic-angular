import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public service: ApiService,
    private actionSheetController: ActionSheetController,
  ) { }
  public id:any = this.route.snapshot.paramMap.get('id');
  public categoryName:any = this.route.snapshot.paramMap.get('categoryName') || 'None';
  products: any;

  public sort = [
    {
      title: 'Newest',
      text: 'orderby=date&order=asc'
    },
    {
      title: 'A - Z',
      text : 'orderby=title&order=asc'
    },
    {
      title: 'Z- A',
      text: 'orderby=title&order=desc'
    },
    {
      title: 'Price : High - Low',
      text: 'orderby=price&order=desc'
    },
    {
      title: 'Price : Low - High',
      Text: 'orderby=price&order=asc'
    },
    {
      title: 'On Sale',
      text: 'orderby=date&order=asc&on_sale=true'
    },
    {
      title: 'Featured',
      text: 'orderby=date&order=asc&featured=true'
    },
  ]
  public selectedSort: any;
  public page: number= 1;

  filterValue: any = this.sort[0].text;
  loadNextPage: boolean = true;
  ngOnInit() {
    if(this.id){
      this.loadData(this.filterValue)
    }
  }

  loadData(value:any){
    this.filterValue = value
    const productsByCategory$ = this.service.getProductsByCategory(this.id, this.page, this.filterValue);
    forkJoin([productsByCategory$]).subscribe((res: any[]) => {
      this.products = res[0];
      if(this.service.isLoading) this.service.closeLoading()
    });
  }
  
  onIonInfinite(ev: any) {
    if(!this.loadNextPage){
      ev.target.complete();
      return;
    }
    this.page = this.page + 1
    this.service.getProductsByCategory(this.id, this.page, this.filterValue).subscribe((res: any) => {
      if(res.length != 0){
        this.products = [...this.products, ...res]
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
    const productsByCategory$ = this.service.getProductsByCategory(this.id, this.page, this.filterValue);
    forkJoin([productsByCategory$]).subscribe((res: any[]) => {
      this.products = res[0];
      event.target.complete();
    });
  }



  async presentSortSheet() {

    const buttons = this.sort.map(option => ({
      text: option.title,
      handler: () => {
        this.service.showLoading()
        this.selectedSort = option
        this.loadData(option.text);
        
      }
    }));

    const actionSheet = await this.actionSheetController.create({
      header: 'Sort By',
      buttons: buttons
    });
    await actionSheet.present();
  }

  removeSort(){
    this.selectedSort = false;
    this.service.showLoading()
    this.loadData(this.sort[0].text)
  }


  
  
}
