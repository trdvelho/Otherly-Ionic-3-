import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {OtherlyApiProvider} from '../../providers/otherly-api/otherly-api';
import { VerifypasswordPage} from './verifypassword';

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {
  mobile:any={};

  constructor(public navCtrl: NavController, public navParams: NavParams,public otherlyApi:OtherlyApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }
  submitNumber(){
    console.log(" Submit me ", this.mobile);
    this.otherlyApi.forgotPassword(this.mobile).then(res=>{
      let response:any = {};
      response = res
      console.log(" response f PAssword" ,response.username);
      if(response.username){
        this.navCtrl.push(VerifypasswordPage,{username :response.username});
      }

      console.log(" response f PAssword" ,JSON.stringify(res));
    })
  }

}
