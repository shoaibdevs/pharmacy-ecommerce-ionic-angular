import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  constructor(
    private router: Router,
  ) { 
    console.log("shs")
    console.log("shs")

    this.checkToken();

  }
  token: boolean = false
  ngOnInit() {
    this.router.events
    .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects.includes('/tabs/account')) {

    this.checkToken();

      }
    });
  }

  checkToken(){
    console.log('check token')
    localStorage.getItem('token') ? this.token = true : this.token = false
  }


  logout(){
    if(this.token){
      localStorage.clear()
      this.router.navigateByUrl('/tabs/home')
    }else{
      this.router.navigateByUrl('/auth')

    }

  }

}
