import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



/*
  Generated class for the LocaldataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

/*
 
 LocalDataServiceProvider
 ========================
 
	* Delivers data about the user to UI views
	* GLobal variables
	
 */

@Injectable()
export class LocaldataProvider {

	public UserData: any = {};
	public TempVariable:any;
	public deeplinkUrl = 'http://localhost:8100/#/';

  constructor(public http: Http) {
    console.log('Hello LocaldataProvider Provider');


    this.UserData = { // APP starts as online to be able to comunicate to the server and get user credentials
			email: '',
			first_name: 'Thiago',
			last_name: 'Velho',
			photo_url: "https://front-end-dev-bucket.s3.amazonaws.com/media/userphotos/38d9046d601045cf91a10ab558064836.jpg",
			username:'trdvelho',
			helps_given: 0,
			friends_count: 0

		}
  }


  	getUser(){
		return new Promise(resolve => {
			let res = this.UserData
				return resolve(res);
		});
	}

	setUser(user: any, Otherly_data: any){
		
		return new Promise(resolve => {

			this.UserData = {
				otherly_token: Otherly_data,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name,
				photo_url: user.photo_url,
				user_name: user.user_name,
				// thanks_sent: Otherly_data.user.thanks_sent,
				// helps_given: Otherly_data.user.helps_given,
				// date_joined: Otherly_data.user.date_joined
				thanks_sent: user.thanks_sent,
				helps_given: user.helps_given,
				date_joined: user.date_joined
			}
		});
		
	}

}
