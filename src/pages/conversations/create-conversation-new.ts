import { Component } from '@angular/core';
import {NavController, NavParams, AlertController  } from 'ionic-angular';

//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';
import {ConversationDetailsPage} from '../../pages/conversations/conversation-details';

/**
 * Generated class for the CreateConversationNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-create-conversation-new',
  templateUrl: 'create-conversation-new.html',
})
export class CreateConversationNewPage {
  conversationSubject:string ="";
  usersSelected=[];
  userDetails= [];
  Post_intro:any;
  // code:string;
   code:object;
   details: any;

  constructor(private OtherlyAPI: OtherlyApiProvider,
              private alertCtrl: AlertController,
              private Lds: LocaldataProvider,
              public navCtrl: NavController,
               public navParams: NavParams) {

    this.usersSelected = this.navParams.get('users');
    this.userDetails = this.navParams.get('userDetails');
    this.Post_intro = this.navParams.get('Post_infos');

    if(this.Post_intro[0]){
      this.conversationSubject = this.Post_intro[0].subject + ": " + this.Post_intro[0].text;
      console.log("POst infos ", JSON.stringify(this.Post_intro));
    }
    
     console.log(' Select user Details ******', JSON.stringify(this.userDetails));
     console.log(' Selected users ******', JSON.stringify(this.usersSelected));
  }

  GoBack(){
    this.navCtrl.pop();
  }

  createConversation(){
    if(this.conversationSubject == "" || this.conversationSubject == " "){
       let alert = this.alertCtrl.create({
        title: 'Please enter the talk title',
        buttons: ['OK']
        });
      alert.present();
      return false;
    }else{
      // console.log("  createConversation ", JSON.stringify(this.conversationSubject));
    this.OtherlyAPI.CreateConversation(this.usersSelected, this.conversationSubject).then(data=>{
     console.log(" Code Returned Create Conversations ", JSON.stringify(data) );
    
     this.DeeplinkNotification(data);
     
   //  this.code = data;
     console.log(" Create Conversation -- details  conv_code", data[0].code, " title ", data[0].title);
    //  this.navCtrl.push(ConversationDetailsPage,{conv_code:data[0].code,title: data[0].title});
   });

    }
   

  }


  DeeplinkNotification(response){
    let usersList=[];
    let users: string;
    let item_left: number;
    // this.details = response[0];

    // console.log(" DeeplinkNotification Awesome Data..... ",JSON.stringify(response[0].code) + JSON.stringify(response));
    console.log(" DeeplinkNotification Awesome Data..... ",JSON.stringify(response));
    // console.log(" DeeplinkNotification Awesome Data..... ",JSON.stringify(response[0]));
    // console.log(" DeeplinkNotification Awesome Data..... ",JSON.stringify(this.details));
    
    for(let item of response){
      console.log( " data title : " , item.title);
      for (let participant of item.participants) {
        usersList.push({
          id: participant.id,
          username: participant.user.username,
          hyperlink: this.Lds.deeplinkUrl+'conversations/'+item.code
        });
      }
    }
    

    // for(let info of this.userDetails){
    //   usersList.push({
    //     username: info.username,
    //     hyperlink: 'https://otherly.com/conversation/'+response[0].code
    //     ,
    //     shared_post_id: 65
    //   });
    // }
    console.log('Notification recipient list :' + JSON.stringify(usersList));
    this.OtherlyAPI.ShareDeeplinkNotification('conversation-new', response[0].code, JSON.stringify(usersList), '')
    .then((res)=>{
      console.log("Deeplink Create Conversation " + JSON.stringify(res));
          this.navCtrl.push(ConversationDetailsPage,{conv_code:response[0].code,title: response[0].title});
    });

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad CreateConversationNewPage');
  }

}
