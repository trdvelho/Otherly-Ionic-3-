import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';
import { HomeFeedPage } from '../home-feed/home-feed';
/**
 * Generated class for the VerifypasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verifypassword',
  templateUrl: 'verifypassword.html',
})
export class VerifypasswordPage {
  username:any;
  mobile:any = {};

  constructor(public navCtrl: NavController,
               public navParams: NavParams,
              public otherlyAPI:OtherlyApiProvider) {
    this.username = this.navParams.get('username');
    this.mobile.username = this.username;


  }
  resetPassword(){

    console.log( " Reset PAssword", this.mobile);
    console.log(" user nbame ", this.username);
    this.otherlyAPI.verifyPassword(this.mobile, this.username).then(res=>{
      console.log("  verified success", res);
      let data:any;
      data = res
      if(data){
        this.navCtrl.push(HomeFeedPage);
      }
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifypasswordPage');
  }

}
