import { Component } from '@angular/core';
import { NavParams } from "ionic-angular";

//PROVIDER 
import { UserProfileProvider } from '../../providers/user-profile/user-profile';

/**
 * Generated class for the WhatIDoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'what_i_do',
  templateUrl: 'what-i-do.html'
})
export class WhatIDoComponent {
  Username:any;
  profession={};
 
  start_date: any; //COMPLETE START DATE (YYYY-MM-DD) 
  end_date: any; //COMPLETE END DATE (YYYY-MM-DD) 

  constructor( 	private UserProfileCtrl: UserProfileProvider,
  				private NavParamCtrl: NavParams) {

  	this.Username = this.NavParamCtrl.get("username");
    console.log('Hello WhatIDoComponent Component');
    //this.text = 'Hello World';
  }

  NewProfessionaBG(){
  	let S_date = new String(this.start_date);
  	let E_date = new String(this.end_date);
  	let splited_S_date, splited_E_date;

  	//Verifies if the start date has DD
  	if(S_date.length == 10){
  		splited_S_date = S_date.split("-", 3);
  	}
  	else{
  		splited_S_date = S_date.split("-", 2);
  	}

  	if(E_date.length == 10){
  		splited_E_date = S_date.split("-", 3);
  	}
  	else{
  		splited_E_date = S_date.split("-", 2);
  	}

  	console.log("POPOver ", splited_E_date);
  	this.UserProfileCtrl.NewBgPosition(this.Username, this.profession, splited_S_date, splited_E_date).then((res)=>{
  		console.log("NEW PRO", res);
  	});
  }

}
