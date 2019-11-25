import { Component } from '@angular/core';
import { NavParams, NavController} from 'ionic-angular';

import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';


//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';


@Component({
  selector: 'page-home-more',
  templateUrl: 'home.html',
  providers:[OtherlyApiProvider]

})



export class HomePage {
  private post_text: any;
  my_Posts:any;
	UserData: any;
  constructor(	public navCtrl: NavParams,
  				      public Lds: LocaldataProvider,
                private OtherlyAPI: OtherlyApiProvider) {

    	//this.UserData = this.navCtrl.get('UserData');
  	this.Lds.getUser()
       .then(data => {
         this.UserData = data;



         this.OtherlyAPI.GetFeedList(this.UserData.otherly_token, {}).then(res =>{
          this.my_Posts = res;

          console.log("My state POSTS " + JSON.stringify(this.my_Posts));
      
          });




     });





  }
  


  createPost(){
    console.log("post text: " + this.post_text);

    if(this.post_text!= ""){
      this.OtherlyAPI.CreatePost(this.post_text, this.UserData.username).then(res => {
        console.log(res);
      })
      
    }

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
