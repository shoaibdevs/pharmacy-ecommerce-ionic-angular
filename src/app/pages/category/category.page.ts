import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categories: any;
  constructor(
    public service: ApiService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const category$ = this.service.getCategory();
    forkJoin([category$]).subscribe((res: any[]) => {
      this.categories = res[0];
    });
  }
  handleRefresh(event: any) {
    const category$ = this.service.getCategory();
    forkJoin([category$]).subscribe((res: any[]) => {
      this.categories = res[0];
      event.target.complete();
    });
  }

}
