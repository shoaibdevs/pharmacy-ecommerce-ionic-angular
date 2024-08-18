import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private platform: Platform,
    private location: Location
  ) {
    this.splash()
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url.includes('/tabs/cart' || '/tabs/account'|| '/tabs/category')) {
        // Replace the current navigation with the home page route
        this.router.navigate(['/tabs/home'], { replaceUrl: true });
      } else {
        // Otherwise, perform the default back action
        this.location.back();
      }
  });
  }


  async splash(){
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }
}
