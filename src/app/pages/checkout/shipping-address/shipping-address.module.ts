import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingAddressPageRoutingModule } from './shipping-address-routing.module';

import { ShippingAddressPage } from './shipping-address.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ShippingAddressPageRoutingModule,
  ],
  declarations: [ShippingAddressPage, ],
  exports: []

  
})
export class ShippingAddressPageModule {}
