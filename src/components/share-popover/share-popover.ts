import { Component } from '@angular/core';
import { App, NavParams, NavController, ToastController, ViewController } from 'ionic-angular';

import { SocialSharing } from '@ionic-native/social-sharing';

//PROVIDERS
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';
import { LocaldataProvider } from '../../providers/localdata/localdata';
//PAGES
import { ShareWithFriendsPage } from '../../pages/share-with-friends/share-with-friends';

/**
 * Generated class for the SharePopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'share-popover',
  templateUrl: 'share-popover.html',
  providers:[SocialSharing]
})
export class SharePopoverComponent {

  Communities: any;
  ComunitiesSelected=[];
  text: string;
  ShareOptions: any;
  Friends:any;
  Post:any;

  

  //font-color for selected options:
  friends_style:string;
  community_style: string;
  facebook_style: string;
  import_style: string;


  constructor(	private SociaCtrl: SocialSharing,
  				      private OtherlyCtrl: OtherlyApiProvider,
                private Lds: LocaldataProvider,
                private NavCtrl: NavController,
                public NavParamsCtrl: NavParams,
                private ToastCtrl: ToastController,
                private ViewCtrl: ViewController,
                public AppCtrl: App) {

  	
    this.Post = this.NavParamsCtrl.get('post_details');
    console.log("POST DETAILS :" + JSON.stringify(this.Post));


   
  }

  ShareFB(){

  	this.SociaCtrl.canShareVia('com.apple.social.facebook');
  	this.SociaCtrl.shareViaFacebook(this.Post.post.post.text, this.Post.post.post.creator.photo_url, null).then(res=>{
  		console.log("facebook share reply ", JSON.stringify(res));
  	});
  }

  ShareWithFriends(){
    
  }

  ShareWithCommunities(){
    
  }

  changed(){
  	console.log('Selected ' + this.ShareOptions);
  }

  ionViewCanLeave() {
    //this.ViewCtrl.dismiss();
  }


  ShareWith(sharing_with:string){
    if(sharing_with == 'friends'){
      this.community_style = 'black';
      this.facebook_style= 'black';
      this.import_style ='black';
      this.friends_style = 'blue';
      //this.ViewCtrl.dismiss();
      //this.Lds.TempVariable = "friends";
      this.ViewCtrl.dismiss("friends");
      //this.NavCtrl.push(ShareWithFriendsPage, {post_details: this.Post, action:'friends'});
      }

    if(sharing_with == 'community'){

      this.community_style = 'blue';
      this.facebook_style= 'black';
      this.import_style ='black';
      this.friends_style = 'black';

      this.ViewCtrl.dismiss("communities");
      //this.NavCtrl.push(ShareWithFriendsPage, {post_details: this.Post, action:'communities'});
    }

    if(sharing_with == 'facebook'){

      this.community_style = 'black';
      this.facebook_style= 'blue';
      this.import_style ='black';
      this.friends_style = 'black';
      this.SociaCtrl.canShareVia('com.apple.social.facebook');
        this.SociaCtrl.shareViaFacebook(this.Post.text, this.Post.creator.photo_url, null).then(res=>{
        console.log("facebook share reply ", JSON.stringify(res));
    });
    }

    if(sharing_with == 'me'){

      this.community_style = 'black';
      this.facebook_style= 'black';
      this.import_style ='blue';
      this.friends_style = 'black';
      let users = '{"trdvelho":true}';
      
      this.OtherlyCtrl.ImportPost(this.Post.code,'').then(res=>{
        console.log("Shared post" + JSON.stringify(res));
        
          let data: any = res;

          //console.log("Promise return "+ JSON.stringify(data));
          
          // if(data.error_status){
          //   console.log("Share error " + data.error_status);
          //   this.showPush(data[0].error_status, 'shared_error');
          // }
          //  if(data.id){
          //   console.log("Share success " + data.id);
          //   this.showPush('Post has been shared','shared_ok');
          //    }
           //console.log("Share success " + data.id);
           console.log("Posted to my page: ", data.id)
           if(data.error_status){
            console.log("Share error " + data.error_status);
            this.showPush("An error has happened, try again later", 'post_created_ok');
          }
           if(data.id){
            console.log("Share success " + data.id);
            this.showPush('Post has been shared on my page ','post_created_ok');
          }
           //this.showPush('Post has been share to my page','shared_ok');

       });
    }

  }

  showPush(message, back_g_color){
    console.log(back_g_color);
    let toast = this.ToastCtrl.create({
          message: message,
          duration: 5000,
          position: 'top',
          'cssClass': back_g_color
    });
    toast.present();

  }

  ChooseCommunity(community){
  	console.log('Community ' + community);

    //console.log(" Select User  ...................", JSON.stringify(user));
  //console.log(" updated Select User  ...................", this.usersSelected);

  let there_is=0;
  let len = this.ComunitiesSelected.length;
  if(this.ComunitiesSelected.length == 0){
    this.ComunitiesSelected.push(community); 
    
  }
  else{
    for(let item in this.ComunitiesSelected){
      if(len > 0){
        if(this.ComunitiesSelected[item] == community){
          console.log("Found User already selected");
          there_is = 1;
          // this.usersSelected.slice(this.usersSelected.indexOf(item));
          let index = this.ComunitiesSelected.indexOf(this.ComunitiesSelected[item]);
          console.log(" index ", index);
          if(index > -1 ){
            this.ComunitiesSelected.splice(index, 1);
            
          }
        }
        len = len -1;
      }
    }

    if(there_is == 0){
      this.ComunitiesSelected.push(community);
     
    }
    
  }
  console.log("POST CODE: " + this.Post.post.post.code);



  }

  Leave(){
    this.ViewCtrl.dismiss();
  }


  Share(){
    let toast = this.ToastCtrl.create({
        message: 'Post Shared Successfully',
        duration: 3000,
        position: 'top'
     });

    if(this.ShareOptions == "my-community"){

      let toast = this.ToastCtrl.create({
            message: 'Post Shared Successfully',
            duration: 3000,
            position: 'top'
      });

      let dictionary:string;
      let item_left: number;
      item_left = this.ComunitiesSelected.length;
      dictionary = '{';
      for (let slug of this.ComunitiesSelected){
       
        dictionary += '"'+slug+'": true';
        item_left = item_left - 1;
        if(item_left != 0 ){
          dictionary += ",";
        }

      }
      dictionary += '}';



      this.OtherlyCtrl.SharePost(this.Post.post.post.code, dictionary, 'community','').then(res=>{
        console.log("Shared post" + JSON.stringify(res));
        toast.present();

       });
    }

    else{
      this.OtherlyCtrl.ImportPost(this.Post.post.post.code, '').then(res=>{
        console.log("Shared post" + JSON.stringify(res));
        toast.present();

       });
    }

  }

}
