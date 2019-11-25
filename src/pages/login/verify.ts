import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {OtherlyApiProvider} from '../../providers/otherly-api/otherly-api';
import { HomeFeedPage } from '../home-feed/home-feed';

/**
 * Generated class for the VerifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-verify',
  templateUrl: 'verify.html',
})
export class VerifyPage {
  register:any={};
  username:any;

  constructor(public navCtrl: NavController,     
              public navParams: NavParams,
              public otherlyApi:OtherlyApiProvider
          ) {

    this.username = navParams.get('username');
    this.register.username = this.username;
    console.log(" Register ...", this.register);
  }

  verifyCode(){

    this.otherlyApi.VerifyMobile(this.register).then((res:string)=>{
      let token:string="";
      token = res;
      if(token){
        this.navCtrl.push(HomeFeedPage);
      }
      console.log( " Verified ", res);

    });



  }
  resendCode(){
    // let uname = 'mustafaqureshi91294';
    // this.otherlyApi.resendCode(uname).then(res=>{
    this.otherlyApi.resendCode(this.username).then(res=>{
      console.log(" Resend Code ",res);
      let data:any;
      data = res;
      var message = document.getElementById('message');
      if(data.sent){
        message.innerHTML = " Verification Code Send Again";
      }
    });

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyPage');
  }

}
