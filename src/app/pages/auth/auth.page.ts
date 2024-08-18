import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  screen: any = 'signin';
  loginForm: FormGroup;
  registerForm: FormGroup;
  resetPasswordForm: FormGroup;
  loginError: any;
  registerError: any;


  isLoading: boolean = false;

  constructor(
    private fb:FormBuilder,
    private service: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/product-detail')) {
          let token  = localStorage.getItem('token')
    if(token){
      this.router.navigateByUrl('/tabs/home')
      
    }else{
      this.router.navigateByUrl('/auth')
    }
        }
      });
    this.loginForm = this.fb.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required]],
    });
    this.registerForm = this.fb.group({
      first_name: ['',[Validators.required]],
      last_name: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.email]],
      username: ['',[Validators.required]],
      password: ['',[Validators.required]],
      confirm_password: ['',[Validators.required]],
    })
    this.resetPasswordForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
    })
  }

  ngOnInit() {
    let token  = localStorage.getItem('token')
    if(token){
      this.router.navigateByUrl('/tabs/home')
    }
  }

  change(event: any){
    this.screen = event;
  }

  login(){
    if(this.loginForm.valid){
      this.service.showLoading()
      this.loginError = false
      this.isLoading = true
      this.service.login(this.loginForm.value).subscribe((res:any)=>{
        console.log(res);
        this.service.closeLoading()
        this.service.isLoading = false
        if(res.cookie){
          localStorage.setItem('token', res.cookie)
          localStorage.setItem('userData', JSON.stringify(res.user))
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/tabs/home';
          window.location.href = returnUrl
          
        }else{
        }
      },(err: any) => {
        console.log(err.error);
        if (err.error.message){
          this.loginError = err.error.message;
        }
        this.service.closeLoading()
        this.service.isLoading = false
      });
    }  else {
      this.service.showSnak("All fields are required!")
    }
  }

  register(){
    if(this.registerForm.valid){
      this.service.showLoading();
      this.isLoading = true
      let data = this.registerForm.value
      data.display_name = data.first_name + data.last_name
      data.wpgdprc = 1
      data.register = "Register"
      console.log(data)
      this.service.register(data).subscribe((res: any) => {
        console.log(res)
        if(res.user_nicename){
          let loginDetail = {
            "username": data.username,
            "password": data.password,
          }
          this.service.login(loginDetail).subscribe((res:any)=>{
            console.log(res);
            this.service.closeLoading()
            this.service.isLoading = false
            if(res.cookie){
              localStorage.setItem('token', res.cookie)
              localStorage.setItem('userData', JSON.stringify(res.user))
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/tabs/home';
              
              
              this.location.historyGo(returnUrl)
              
            }else{
            }
          },(err: any) => {
            console.log(err.error);
            if (err.error.message){
              this.registerError = err.error.message;
            }
            this.service.closeLoading()
            this.service.isLoading = false
          });
        } 
      },(err: any) => {
        console.log(err.error);
        if (err.error.message){
          this.registerError = err.error.message;
        }
        this.service.closeLoading()
        this.service.isLoading = false
      })
    } else {
      this.service.showSnak("All fields are required!")
    }
  }

  resetPassword(){
    // if(this.resetPasswordForm.valid){
    //   this.service.showLoading()
    //   this.loginError = false
    //   this.isLoading = true
    //   this.service.lostPassword(this.resetPasswordForm.value).subscribe((res:any)=>{
    //     console.log(res)
    //   })
    // } else {
    //   this.service.showSnak("All fields are required!")

    // }
  }
}