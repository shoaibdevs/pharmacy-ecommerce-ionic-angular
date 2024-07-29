import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { SplashScreen } from '@capacitor/splash-screen';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router
  ) {
    this.splash()

  }


  async splash(){
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }
}
