import { Component, ViewChild } from '@angular/core';
import { NavController, Events} from 'ionic-angular';

//import { AboutPage } from '../about/about';
//import { ContactPage } from '../contact/contact';
import { HomeFeedPage } from '../home-feed/home-feed';
//import { HomePage } from '../home/home';
import { Friends } from '../friends/friends';
import { ConversationsPage } from '../conversations/conversations';
import { NotificationsPage } from '../notifications/notifications';
import { MorePage } from '../more/more';

@Component({
	selector: 'tabs',
  	templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomeFeedPage;
  tab2Root = Friends;
  tab3Root = NotificationsPage;
  tab4Root = ConversationsPage ;
  tab5Root = MorePage;
  //tab3Root = ContactPage;

  @ViewChild('mainTabs') mainTabs: TabsPage;

  constructor(public nav: NavController, 
              public events: Events) {

  }


  public tapped() {
    this.events.publish('friends:refresh', Date.now() );
  }
  

}
