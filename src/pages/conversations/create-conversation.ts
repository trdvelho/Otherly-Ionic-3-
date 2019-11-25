import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, App, Platform , PopoverController} from 'ionic-angular';

// Modules
import {IonTagsInputModule} from "ionic-tags-input";

//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';

//PAGES
import { CreateConversationNewPage } from '../../pages/conversations/create-conversation-new';

// Filters 

import { SearchFriendsConvPipe } from '../../pipes/search-friends-conv/search-friends-conv';

/**
 * Generated class for the CreateConversationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-conversation',
  templateUrl: 'create-conversation.html'
})
export class CreateConversationPage {

  intro_user_infos:any;  //ARRAY WILL RECEIVE INFROMATIONS OF THE USER FROM FEED PAGE TO START A NEW INTRODUCTION
  user_infos=[]         //ARRAY FOR USER INFORMATIONS 
  next: boolean;
  Post_infos=[];

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
  conversationChip=[];
  friends_count=0;

 
  

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    private OtherlyAPI: OtherlyApiProvider,
    private Lds: LocaldataProvider,
    public events: Events,
    public app: App,
    private PopOverCtrl: PopoverController) {

    this.next = true;
    this.intro_user_infos = this.navParams.get('introductions');  
 
    this.Lds.getUser().then(data => {
          this.UserData = data;
 
          //USER INFORMATIONS ARE RECEIVED HERE
          
          this.OtherlyAPI.GetFriendsList(this.UserData.otherly_token,{})
          .then(data => {
            this.API_List = data;
            console.log("Friends page USER DATA: " + JSON.stringify(this.API_List))
 
            //if(this.API_List.length >= 2){
 
             for (let item in this.API_List)
             this.list.push(this.API_List[item])
 
 
             this.List = this.list.sort(function(a, b){
               if ( a.instance.full_name < b.instance.full_name )
                   return -1;
               if ( a.instance.full_name > b.instance.full_name )
                   return 1;
               return 0;
 
             });
            


            this.quantity = this.List.length;

            if(this.intro_user_infos)
              this.Adding_User_Intro();
 
          
          });
 
      });

  }

  GoBack(){
    this.navCtrl.pop();
  }

  Adding_User_Intro(){
    this.usersSelected.push(this.intro_user_infos.creator.username); 
    this.selectUserDetails.push(this.intro_user_infos.creator);

    

    this.conversationChip.push({
      username: this.intro_user_infos.creator.username,
      full_name:this.intro_user_infos.creator.full_name,
      photo_url: this.intro_user_infos.creator.photo_url,
      status: this.intro_user_infos.creator.status,
      rating: this.intro_user_infos.creator.rating,
      helps_given : this.intro_user_infos.creator.helps_given,
      chip: false
      }
    );

    this.Post_infos.push({
      subject: this.intro_user_infos.subject,
      text: this.intro_user_infos.text
    });

    for(let item in this.List){
       
          if(this.List[item].instance.username == this.intro_user_infos.creator.username){
            
            let index = this.List.indexOf(this.List[item]);
            console.log(" index ", index);
            if(index > -1 ){
              this.List.splice(index, 1);
              break;
            }
          }
         
      }
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


 selectUser(username:string,user:any){

    // if(!this.intro_user_infos){

      let there_is=0;
      let len = this.usersSelected.length;
      this.SetStyle(user.username);
      if(this.usersSelected.length == 0){
        this.usersSelected.push(username); 
        this.selectUserDetails.push(user);
        this.conversationChip.push({username:user.username,
          full_name:user.full_name,
          photo_url: user.photo_url,
          status: user.status,
          rating: user.rating,
          helps_given : user.helps_given,
          chip:false});
        this.friends_count = this.conversationChip.length;

        this.next = null;
        console.log(" Friends_count ", this.friends_count);
          

      }else{

        this.next = null;
        for(let item in this.usersSelected){
          if(len > 0){
            if(this.usersSelected[item] == username){
              console.log("Found User already selected");
              there_is = 1;
              // this.usersSelected.slice(this.usersSelected.indexOf(item));
              let index = this.usersSelected.indexOf(this.usersSelected[item]);
              console.log(" index ", index);
              if(index > -1 ){
                this.usersSelected.splice(index, 1);
                this.selectUserDetails.splice(index,1);
                this.conversationChip.splice(index,1);
                this.friends_count = this.conversationChip.length;
                console.log(" Friends_count ", this.friends_count);
                if(this.intro_user_infos){
                  if(this.friends_count == 1)
                    this.next = true;

                }
                else {
                  if(this.friends_count == 0)
                    this.next = true;
                }

              }
            }
            len = len -1;
            ;
          }
        }

        if(there_is == 0){
          this.usersSelected.push(username);
          this.selectUserDetails.push(user);
          this.conversationChip.push({username:user.username,
            full_name:user.full_name,
            photo_url: user.photo_url,
            status: user.status,
            rating: user.rating,
            helps_given : user.helps_given,
            chip:false});
            this.friends_count = this.conversationChip.length;
            console.log(" Friends_count ", this.friends_count);
        }
        
      }
    //}


    // INTRODUCTION LOGIC
    // else {
    //       let there_is;
    //       console.log("Chip size ", this.conversationChip.length);
    //       if(this.conversationChip.length == 1){ 
    //           this.SetStyle(user.username);
    //           this.usersSelected.push(username);
    //           this.selectUserDetails.push(user);
    //           this.conversationChip.push({username:user.username,
    //             full_name:user.full_name,
    //             photo_url: user.photo_url,
    //             status: user.status,
    //             rating: user.rating,
    //             helps_given : user.helps_given,
    //             chip:false});
    //           this.friends_count = this.conversationChip.length;
    //           console.log("CHIP ", JSON.stringify(this.conversationChip));
    //           this.next = null;

            
    //       }
    //       else {
    //         for(let item in this.usersSelected){
            
    //             if(this.usersSelected[item] == username){
    //               console.log("Found User already selected, deleting from list -> ", user.full_name);
    //               there_is = 1;
    //               this.SetStyle(user.username);
    //               let index = this.usersSelected.indexOf(this.usersSelected[item]);
    //               console.log(" index ", index);
    //               if(index > -1 ){
    //                 this.usersSelected.splice(index, 1);
    //                 this.selectUserDetails.splice(index,1);
    //                 this.friends_count = this.conversationChip.length;
    //                 console.log(" Friends_count ", this.friends_count);
    //                 this.next = true;
    //               }

    //               for (let user in this.conversationChip){
    //                 if(this.conversationChip[user].username == username){
    //                   let index = this.conversationChip.indexOf(this.conversationChip[item]);
    //                   if(index > -1){
    //                     this.conversationChip.splice(index, 1);
    //                     this.next = true;
    //                   }
    //                 }
    //               }
    //             }
              
    //         }
    //       }

    //       if(there_is == 0){
    //       this.usersSelected.push(username);
    //       this.selectUserDetails.push(user);
    //       this.conversationChip.push({username:user.username,
    //         full_name:user.full_name,
    //         photo_url: user.photo_url,
    //         status: user.status,
    //         rating: user.rating,
    //         helps_given : user.helps_given,
    //         chip:false});
    //         this.friends_count = this.conversationChip.length;
    //         console.log(" Friends_count ", this.friends_count);
    //     }


    //   }
  }

  
  onChange(val){
    console.log(this.usersSelected);
  }

  nextConversation(){
    
    this.navCtrl.push(CreateConversationNewPage,{users:this.usersSelected,userDetails:this.selectUserDetails, Post_infos: this.Post_infos}, {animate:false});
  }


  ShowDelete(data){
  
    Object.keys(this.conversationChip).forEach((key) => {
         if(this.intro_user_infos){
            if(this.conversationChip[key].username == data && this.intro_user_infos.creator.username !== data){
              this.conversationChip[key].chip = !this.conversationChip[key].chip;
              console.log("Chip value for " + this.conversationChip[key].username + "is " + this.conversationChip[key].chip)
             }
          }
          else{
            if(this.conversationChip[key].username == data){
              this.conversationChip[key].chip = !this.conversationChip[key].chip;
              console.log("Chip value for " + this.conversationChip[key].username + "is " + this.conversationChip[key].chip)
             }

          }
      });
  }


  
  delete(chip: Element, username:any){
    console.log("delete: " +chip);
    this.SetStyle(username);
    chip.remove();
 
    for(let item in this.conversationChip){
     
        if(this.conversationChip[item].username == username){
          let index = this.conversationChip.indexOf(this.conversationChip[item]);
          console.log(" index ", index); 
          if(index > -1 ){
            this.conversationChip.splice(index, 1);
            this.selectUserDetails.splice(index, 1);
            
          };
            
        }
        
        this.friends_count = this.conversationChip.length;
        console.log(" Friends_count ", this.friends_count);
      
    }

    for(let item in this.usersSelected){
     
        if(this.usersSelected[item] == username){
          let index = this.usersSelected.indexOf(this.usersSelected[item]);
          console.log(" index ", index); 
          if(index > -1 ){
            this.usersSelected.splice(index, 1);
            
          };
            
        }
      
    }

    if(this.intro_user_infos){
      if(this.friends_count == 1)
        this.next = true;

    }
    else {
      if(this.friends_count == 0)
        this.next = true;
    }
 
   }

   

   SetStyle(data) {
    
       console.log('STYLE OF ... ' + data);
    
      
         Object.keys(this.List).forEach((key) => {
               
               if(this.List[key].instance.username == data){
                 if (this.List[key].instance.style == '#EEF4F8'){
                   this.List[key].instance.style = '';
    
                 }
    
    
                 else{
                   this.List[key].instance.style = '#EEF4F8';
                   
                 }
               }
         });
      }
      
    
}
