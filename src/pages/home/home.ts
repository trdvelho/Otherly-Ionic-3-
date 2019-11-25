import { Component } from '@angular/core';
import { NavParams, NavController} from 'ionic-angular';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';


//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})



export class HomePageFriend {
  private post_text: any;
	UserData: any;
  constructor(	public navCtrl: NavParams,
  				      public Lds: LocaldataProvider,
                private OtherlyAPI: OtherlyApiProvider) {

    this.UserData = {
      username: this.navCtrl.get('username'),
      first_name: this.navCtrl.get('first_name'),
      full_name: this.navCtrl.get('full_name'),
      photo_url: this.navCtrl.get('photo_url'),
      helps_given: this.navCtrl.get('helps_given'),
      thanks_sent: this.navCtrl.get('thanks_sent')
    };
 
   console.log("USER DATA" + JSON.stringify(this.UserData));

  }


  createPost(){
    console.log("post text: " + this.post_text);

    // if(this.post_text!= ""){
    //   this.OtherlyAPI.CreatePost(this.post_text, this.UserData.username).then(res => {
    //     console.log(res);
    //   })
      
    //}

  }

}




// import { Component } from '@angular/core';
// import { NavController } from 'ionic-angular';

// @Component({
//   selector: 'page-home',
//   templateUrl: 'home.html'
// })
// export class HomePage {

//   constructor(public navCtrl: NavController) {

//   }

// }
