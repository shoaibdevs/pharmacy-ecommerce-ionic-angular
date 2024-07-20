import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  screen: any = 'signin';
  formData: FormGroup;
  isLoading: boolean = false;
  constructor(private fb:FormBuilder) {
    this.formData = this.fb.group({
      name: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required]],
    });
  }

  ngOnInit() {}

  change(event: any){
    this.screen = event;
  }

  login(){
    var formData: any = new FormData();
    if(this.formData.valid){
      this.isLoading = true
      // formData.append('email', this.formData.get('email').value);
      // formData.append('password', this.formData.get('password').value);
      // console.log(this.formData)
      // this.auth.userLogin(formData).subscribe((data:any)=>{
      //   console.log(data);
      // });
    }  
  }

  register(){
    var formData: any = new FormData();
    if(this.formData.valid){
      this.isLoading = true
      // formData.append('name', this.formData.get('name').value);
      // formData.append('email', this.formData.get('email').value);
      // formData.append('password', this.formData.get('password').value);
      // console.log(this.formData)
      // this.auth.userRegister(formData).subscribe((data:any)=>{
      //   console.log(data);
      // });
    }  
  }
}