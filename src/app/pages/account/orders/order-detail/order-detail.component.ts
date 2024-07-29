import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent  implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private service: ApiService
  ) { }
  public id:any = this.route.snapshot.paramMap.get('id');
  order: any;
  ngOnInit() {
    this.service.showLoading()
    this.service.getOrderById(this.id).subscribe((res: any) => {
      this.order = res;
      console.log(res)
      this.service.closeLoading()
    })
  }

}
