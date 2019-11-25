import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, Events, App, Platform , PopoverController, AlertController } from 'ionic-angular';
import { AddConversationParticipantPage } from '../../pages/conversations/add-conversation-participant';
//  Adding Friends 

// Modules
import {IonTagsInputModule} from "ionic-tags-input";

//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';

//NATIVE FEATURES
import { Contacts } from '@ionic-native/contacts';

//PAGES
import { CreateConversationNewPage } from '../../pages/conversations/create-conversation-new';
import { ConversationDetailsPage } from '../../pages/conversations/conversation-details';
// Filters 

import { SearchFriendsConvPipe } from '../../pipes/search-friends-conv/search-friends-conv';

@Component({
  selector: 'page-c-details-participants',
  templateUrl: 'c-details-participants.html',
  providers:[Contacts]
})

export class CDetailsParticipantsPage {
  // @ViewChild('focusInput') myInput ;
  code:string;
  List = [];
  list = [];
  mobile_contact = [];
  API_List :any;
  items: any;
  contactlist: any;
  private UserData: any;
  private add_friends = false;
  private search_friend: any;
  private quantity : any;
  private search = -2;
  usersSelected=[];
  selectUserDetails=[];
  self:any;
  notifToggle:any;
  title:any;
  details:any;
  usersSelectedLength:any;
  isEditable = false;
  editTitle:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
     public viewCtrl: ViewController,
     public platform: Platform,
     private contact: Contacts,
     private OtherlyAPI: OtherlyApiProvider,
     private Lds: LocaldataProvider,
     public events: Events,
     public app: App,
     private PopOverCtrl: PopoverController,
     private alertCtrl: AlertController
    ) {
  
    this.code = navParams.get('conv_code');
    this.self = navParams.get('self');
    this.title = navParams.get('title');
    this.details = navParams.get('details');
    console.log(" SELF ", self);

    this.notifToggle =  this.self.notifications;
    console.log("Converstaion Settings Constructor");

    OtherlyAPI.ConversationParticipantList(this.code).then(res=>{
    //  console.log("Conversation Pafrticipant List ", JSON.stringify(res));
      for (let item in res){
        this.List.push(res[item]);
      }
      this.usersSelectedLength = this.List.length;
      console.log( " List of Users .. ", this.usersSelectedLength);
    });
  }

  GoBack(){
    this.Lds.TempVariable = this.title;
    this.navCtrl.pop();
  
  }

  notificationToggle(){
    this.OtherlyAPI.NotificationToggle(this.code,this.self.user).then(data=>{
       console.log(" Notification Toggle ",data);
         this.notifToggle = data;
    });
  }

  onInput(evt:any){
    console.log( " On Input evt  ",evt);
  }

  ionSelected() {
    console.log("Friends has been selected");
    this.add_friends = false;
    console.log(this.add_friends);
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      for (let i = 0; i < 30; i++) {
        this.List.push( this.List.length );
      }

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }


  Search(){
    this.search = -1;
    console.log("Search field : " + this.search_friend);
     for (let item in this.list){
       if( this.list[item].indexOf(this.search_friend) >= 0){
        console.log('Found: '+this.list[item].full_name);
        }
     }

  }

  Show_Add_friends(){
    this.add_friends = !this.add_friends;
  }


  selectUser(username:string,user:{}){
  //console.log(" Select User  ...................", username);
  // console.log(" updated Select User  ...................", this.usersSelected);

  //console.log(" User Data !!!!!!", user)
  let there_is=0;
  let len = this.usersSelected.length;
  if(this.usersSelected.length == 0){
  this.usersSelected.push(username); 
  this.selectUserDetails.push(user);  
  }else{
  for(let item in this.usersSelected){
    if(len > 0){
      if(this.usersSelected[item] == username){
     //   console.log("Found User already selected");
        there_is = 1;
        // this.usersSelected.slice(this.usersSelected.indexOf(item));
        let index = this.usersSelected.indexOf(this.usersSelected[item]);
     //   console.log(" index ", index);
        if(index > -1 ){
          this.usersSelected.splice(index, 1);
          this.selectUserDetails.splice(index,1);
        }
      }
      len = len -1;
    }
  }

  if(there_is == 0){
    this.usersSelected.push(username);
    this.selectUserDetails.push(user);
  }

  }


  }


  onChange(val){
    console.log(this.usersSelected);
  }

  addParticipant(){
  //  console.log(" add participant ");
      this.navCtrl.push(AddConversationParticipantPage,{code:this.code,title:this.title});

  }

  ionViewDidLoad() {
 //   console.log('ionViewDidLoad CDetailsParticipantsPage');
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
  leaveConversation(){


    let alert = this.alertCtrl.create({
      title:'Leave Conversation',
      buttons:[{
        text:'No',
        role:'cancel',
        handler:()=>{
       //   console.log('Cancel Clicked');
        }
      },
      {
        text:'Yes',
        handler:()=>{
           this.OtherlyAPI.LeaveConversation(this.code,this.self.user).then(data=>{
      
        //    console.log(" Leave Conversation!!!! ", data )
      
          });

        }
      }

    ]
    });

    alert.present();

   
  }
  removeFromConversation(user:string,first:string,last:string){
   // console.log(" removeFromConversation ",user, " Code ",this.code );
  

    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to remove  '+first+' '+last,
      
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            this.OtherlyAPI.RemoveFromConversation(this.code,user).then(res=>{
              console.log(" Finally removed ", JSON.stringify(res));
             let results:any = res;
              console.log(" Kicked out ", results);
              //if(results.kicked_out){

                for(let item in this.List){
                
                  if(this.List[item].user.username == user){
                    
                    let index = this.List.indexOf(this.List[item]);
                    console.log(" index ", index);
                    if(index > -1 ){
                      this.List.splice(index, 1);
                    
                    }
                  }
                }
                this.usersSelectedLength = this.List.length
             // }else{

              //  console.log(" Not Removed ( Kicked out ) ");
              //}

            });
          }
        }
      ]
    });
    alert.present();
  }

  allowEditing(){
   // console.log("Editable ..........");
    this.isEditable = true;
  }
  doneEditingTitle(){
    if(this.editTitle ==""){
      let alert = this.alertCtrl.create({
        title: 'Please Enter Talk Title',
        buttons: ['OK']
      });
      alert.present();
      // setTimeout(() => {
      //   this.myInput.setFocus();
      // },150);
      return false;
    }else{
      //  console.log("Done Editing  ..........", this.editTitle);
      this.isEditable = false;
      this.title = this.editTitle;
      this.OtherlyAPI.EditConversationTitle(this.code,this.title).then(res=>{
      //  console.log(" This is So Nice ", res);
      });

    }
  
    
  }

  
}
