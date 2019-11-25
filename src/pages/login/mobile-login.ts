import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RegisterPage} from './register';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {OtherlyApiProvider} from '../../providers/otherly-api/otherly-api';
import {LocaldataProvider} from '../../providers/localdata/localdata';

import {HomePageFriend} from '../home/home';
import {HomeFeedPage} from '../home-feed/home-feed';
import {ForgotpasswordPage} from './forgotpassword';


/**
 * Generated class for the MobileLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mobile-login',
  templateUrl: 'mobile-login.html',
})
export class MobileLoginPage {
  mobile={};
  user:string;
  password:string;


  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public builder:FormBuilder,
     public otherlyApi:OtherlyApiProvider,
     public Lds:LocaldataProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MobileLoginPage');
  }

  signUp(){
    this.navCtrl.push(RegisterPage);
  }
  
  mobileSignUp(){
    // this.navCtrl.push(HomeFeedPage);
    let token="";
    this.otherlyApi.mobileSignUp(this.mobile).then((res:any)=>{
      console.log(" mobile Signup !!!", JSON.stringify(res));
      let user = res.user;
      token = res.token;
      console.log(" Mobile login token !!!!",token);
      if(token){
        this.Lds.setUser(user,token);
        localStorage.setItem("otherly-token",res.token); 
        this.navCtrl.push(HomeFeedPage); 
      } else {
        console.log(" Else Not able to login", res);  
      }

      // console.log(" login token ", res.token);

    })

    console.log( " Sign up  ", this.mobile);
   
  }
 
  forgotPassword(){
    console.log(" forgot PAssword");
    this.navCtrl.push(ForgotpasswordPage);
  }

}
