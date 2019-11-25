import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams  } from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {OtherlyApiProvider} from '../../providers/otherly-api/otherly-api';
import {VerifyPage} from './verify';
import {MobileLoginPage} from './mobile-login';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
// import { FormBuilder, Control, ControlGroup, Validators, FORM_DIRECTIVES } from '@angular/common';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  // first_name:string;
  // myInput:any;
  // myname:string="";
  mobile:any={};
  // todo = {}
  // logForm() {
  //   console.log(this.todo)
  // }
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public otherlyApi:OtherlyApiProvider,
    builder:FormBuilder) {
  }
  // submitForm(form:NgForm){
  //   console.log(" form ", form.value.name  );
  // }
  
//   onAdd(form:NgForm){
// console.log(form);
//   }

  verifyMobile(){
    console.log(" VerifyMobile ",this.mobile);
    
    this.otherlyApi.RegisterMobile(this.mobile).then((res)=>{
      
      let response:any =res;
     console.log(" Verified ",JSON.stringify(response));
      // console.log(" username", res[0].username);

      if(response.username){
        // console.log(" username true");
         this.navCtrl.push(VerifyPage,{username:response.username})
      }else{
         console.log(" user issuessss error ",response);
      }
    });


  }
  signIn(){

    this.navCtrl.push(MobileLoginPage);
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}
