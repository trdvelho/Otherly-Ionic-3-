import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Facebook } from "@ionic-native/facebook";

import { LocaldataProvider } from '../../providers/localdata/localdata';

import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';
import { HomePageFriend } from '../../pages/home/home';
import { LoginPage } from '../../pages/login/login';




/**
 * Generated class for the MorePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {
 
  private UserData:any;
  private Communities:any;

  constructor(	public navCtrl: NavController, 
  				public navParams: NavParams, 
  				private inAppB: InAppBrowser,
  				private Lds: LocaldataProvider,
          private OtherlyAPI: OtherlyApiProvider,
          private FacebookCtrl: Facebook) {
  //this.goto('other.ly/more');
  this.Lds.getUser()
       .then(data => {
         this.UserData = data;
  });

  this.OtherlyAPI.GetCommunities('access_token', {}).then(data =>{
            this.Communities = data;
          console.log('COMMUNITIES ' + JSON.stringify(this.Communities));
  });


    
  }


  myState(){
  	this.navCtrl.push(HomePageFriend, this.UserData);
  }

  logout(){
    this.FacebookCtrl.logout().then(res=>{

      if(res == 'OK'){
        console.log('Otherly logout ');
        this.navCtrl.setRoot(LoginPage);
      }
    });

  }


  /*goto(params){
    const browser = this.inAppB.create("http://" + params+"" , '_self',{location:'no'}); 
  }*/

  
}
