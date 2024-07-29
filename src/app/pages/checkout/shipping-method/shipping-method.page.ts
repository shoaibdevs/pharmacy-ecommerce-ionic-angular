import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/service/api.service';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-shipping-method',
  templateUrl: './shipping-method.page.html',
  styleUrls: ['./shipping-method.page.scss'],
})
export class ShippingMethodPage implements OnInit {

  constructor(
    private service: ApiService,
    private cartService: CartService
  ) {}
  method: any;
  async ngOnInit() {
    await this.service.showLoading();
    this.service.isLoading = true;
    this.service.getShippingMethod().subscribe((res: any)=> {
      let total = this.cartService.getCartTotal()
      let minValue = Number(res[1].settings.min_amount.value)
      let showFree = total > minValue
      if (showFree) {
        this.method = res[1]
      }else{
        this.method = res[0]
      }
      localStorage.setItem('shippingMethod', JSON.stringify(this.method))
      this.service.closeLoading();
      this.service.isLoading = false;
    },(err)=> this.service.closeLoading())
    
  }

}
