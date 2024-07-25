import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  screen: any = 'signin';
  loginForm: FormGroup;
  registerForm: FormGroup;

  loginError: any;
  registerError: any;


  isLoading: boolean = false;
   newd = {
    "email": "teslkfaksdajfdksaj@gmail.com",
    "password": "shoaib123",
    "first_name": "shoaib",
    "last_name": "khan",
    "username": "shoaibkhan",
    "confirm_password": "shoaib123",
    "wpgdprc": 1,
    "register": "Register",
    "display_name": "shoaib khan"
}
  constructor(
    private fb:FormBuilder,
    private service: ApiService,
    private router: Router
  ) {
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
        if(res.cookie){
          localStorage.setItem('token', res.cookie)
          localStorage.setItem('userData', JSON.stringify(res.user))
          this.router.navigateByUrl('/tabs/home')
        }else{
        }
      },(err: any) => {
        console.log(err.error);
        if (err.error.message){
          this.loginError = err.error.message;
        }
        this.service.closeLoading()
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
            if(res.cookie){
              localStorage.setItem('token', res.cookie)
              localStorage.setItem('userData', JSON.stringify(res.user))
              this.router.navigateByUrl('/tabs/home')
            }else{
            }
          },(err: any) => {
            console.log(err.error);
            if (err.error.message){
              this.registerError = err.error.message;
            }
            this.service.closeLoading()
          });
        } 
      },(err: any) => {
        console.log(err.error);
        if (err.error.message){
          this.registerError = err.error.message;
        }
        this.service.closeLoading()
      })
    } else {
      this.service.showSnak("All fields are required!")
    }
  }
}