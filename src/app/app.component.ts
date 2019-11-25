import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Deeplinks } from '@ionic-native/deeplinks';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/more/home';
import { HomeFeedPage } from '../pages/home-feed/home-feed';
import { Friends } from '../pages/friends/friends';
import { TabsPage } from '../pages/tabs/tabs';
import { PostDetailPage } from '../pages/post-detail/post-detail';
import { ConversationDetailsPage } from '../pages/conversations/conversation-details';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public deeplinks: Deeplinks) {
    // platform.ready().then(() => {
    //   // Okay, so the platform is ready and our plugins are available.
    //   // Here you can do any higher level native things you might need.
    //   statusBar.styleDefault();
    //   splashScreen.hide();
    // });

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Friends', component: Friends }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('platform is : ' + this.platform._platforms);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      /////// Deeplinks for Native. Test on device ///////
      this.deeplinks.routeWithNavController(this.nav,
        { //'/about': AboutPage,
          '/posts/:code': PostDetailPage,
          'conversations/:conv_code': ConversationDetailsPage
        })
        .subscribe((match) => { console.log('Successfully routed', match); },
        (nomatch) => { console.error('Unmatched Route', nomatch); })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(TabsPage);//page.component
  }
}
