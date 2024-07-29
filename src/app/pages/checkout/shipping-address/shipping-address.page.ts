import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.page.html',
  styleUrls: ['./shipping-address.page.scss'],
})
export class ShippingAddressPage implements OnInit {
  addressForm!: FormGroup;

  constructor(
    private fb:FormBuilder,
    private service: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.addressForm = this.fb.group({
      first_name: ['',[Validators.required]],
      last_name: ['',[Validators.required]],
      city: ['',[Validators.required]],
      company: [''],
      country: ['IN',[Validators.required]],
      address_1: ['',[Validators.required]],
      address_2: [''],
      email: ['',[Validators.required, Validators.email]],
      phone: ['',[Validators.required]],
      state: ['',[Validators.required]],
      postcode: ['',[Validators.required]],
    })
  }

  continue(){
    if(this.addressForm.valid){
      console.log(this.addressForm.value)
      localStorage.setItem('billing', JSON.stringify(this.addressForm.value))
      let shipping = this.addressForm.value
      delete shipping.email
      delete shipping.phone
      localStorage.setItem('shipping', JSON.stringify(shipping))
      this.router.navigateByUrl('/checkout/shipping-method')
    }else{
      this.addressForm.markAllAsTouched();
      this.service.showSnak("All fields are required!")
    }
  }

}
