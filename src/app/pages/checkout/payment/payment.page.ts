import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  constructor(
    private service: ApiService
  ) { }

  ngOnInit() {
    this.service.getPaymentMethod().subscribe((res: any) => {
      console.log(res)
    })
  }

}
