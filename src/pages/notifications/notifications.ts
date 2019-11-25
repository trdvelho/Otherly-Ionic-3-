import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the NotificationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private inAppB: InAppBrowser) {
  this.goto('other.ly/notifications');
    
  }


  goto(params){

  	const browser = this.inAppB.create("http://" + params+"" , '_self',{location:'no'}); 
    // window.open("http://" + params+"" , '_self');
  }

  
}
