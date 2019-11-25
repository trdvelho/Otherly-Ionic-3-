import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, App, Platform, PopoverController } from 'ionic-angular';

// Modules
import { IonTagsInputModule } from "ionic-tags-input";

//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';

//NATIVE FEATURES
import { Contacts } from '@ionic-native/contacts';

//PAGES
import { CreateConversationNewPage } from '../../pages/conversations/create-conversation-new';
import { ConversationDetailsPage } from '../../pages/conversations/conversation-details'
// Filters 

import { SearchFriendsConvPipe } from '../../pipes/search-friends-conv/search-friends-conv';


@Component({
  selector: 'page-add-conversation-participant',
  templateUrl: 'add-conversation-participant.html',
  providers: [Contacts]
})
export class AddConversationParticipantPage {

  List = [];
  list = [];
  mobile_contact = [];
  API_List: any;
  items: any;
  contactlist: any;
  private UserData: any;
  private add_friends = false;
  private search_friend: any;
  private quantity: any;
  private search = -2;
  usersSelected = [];
  selectUserDetails = [];
  conversationChip = [];
  friends_count = 0;
  code: any;
  title: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private contact: Contacts,
    private OtherlyAPI: OtherlyApiProvider,
    private Lds: LocaldataProvider,
    public events: Events,
    public app: App,
    private PopOverCtrl: PopoverController) {

    this.code = this.navParams.get('code');
    this.title = this.navParams.get('title');


    // The Next Couple of Functions in here gets the Frieds for the Signed in User
    this.platform.ready().then(() => {
      var opts = {
        filter: "M",
        multiple: true,
        hasPhoneNumber: true,
        fields: ['displayName', 'name']
      };
      contact.find(['displayName', 'name'], opts).then((contacts) => {
        this.contactlist = contacts;
        this.MobileContactsinArray();
        //console.log("contact list: " + JSON.stringify(this.contactlist));
      }, (error) => {
        console.log(error);
      })
    })
    this.Lds.getUser().then(data => {
      this.UserData = data;
      //USER INFORMATIONS HAVE BEEN RECEIVED HERE

      this.OtherlyAPI.GetFriendsList(this.UserData.otherly_token, {})
        .then(data => {
          this.API_List = data;
          console.log("Friends page USER DATA: " + JSON.stringify(this.API_List))

          //if(this.API_List.length >= 2){

          for (let item in this.API_List)
            this.list.push(this.API_List[item])
          this.List = this.list.sort(function (a, b) {
            if (a.instance.full_name < b.instance.full_name)
              return -1;
            if (a.instance.full_name > b.instance.full_name)
              return 1;
            return 0;
          });
          //console.log('LIST O & M: ' + JSON.stringify(this.List));
          this.quantity = this.List.length;
          console.log('LIST O & M: ' + JSON.stringify(this.List));
        });
    });
  }
  MobileContactsinArray() {
    for (let item in this.contactlist) {
      this.list.push({
        instance: {
          full_name: this.contactlist[item].displayName,
          photo_url: '',
          mobile_number: this.contactlist[item].phoneNumbers[0].value,
          rating: '',
          helps_given: '',
          source: 'M'
        }
      })

    }
  }
  onInput(evt: any) {
    console.log(" On Input evt  ", evt);
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
        this.List.push(this.List.length);
      }

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }


  Search() {
    this.search = -1;
    console.log("Search field : " + this.search_friend);


    for (let item in this.list) {
      if (this.list[item].indexOf(this.search_friend) >= 0) {
        console.log('Found: ' + this.list[item].full_name);
      }
    }

  }

  Show_Add_friends() {
    this.add_friends = !this.add_friends;
  }

  selectUser(username: string, user: any) {
    let there_is = 0;
    let len = this.usersSelected.length;
    this.SetStyle(user.username);
    if (this.usersSelected.length == 0) {
      this.usersSelected.push(username);
      this.selectUserDetails.push(user);
      this.conversationChip.push({
        username: user.username,
        full_name: user.full_name,
        photo_url: user.photo_url,
        status: user.status,
        rating: user.rating,
        helps_given: user.helps_given,
        chip: false
      });
      this.friends_count = this.conversationChip.length;
    } else {
      for (let item in this.usersSelected) {
        if (len > 0) {
          if (this.usersSelected[item] == username) {
            there_is = 1;
            let index = this.usersSelected.indexOf(this.usersSelected[item]);
            if (index > -1) {
              this.usersSelected.splice(index, 1);
              this.selectUserDetails.splice(index, 1);
              this.conversationChip.splice(index, 1);
              this.friends_count = this.conversationChip.length;
            }
          }
          len = len - 1;
        }
      }

      if (there_is == 0) {
        this.usersSelected.push(username);
        this.selectUserDetails.push(user);
        this.conversationChip.push({
          username: user.username,
          full_name: user.full_name,
          photo_url: user.photo_url,
          status: user.status,
          rating: user.rating,
          helps_given: user.helps_given,
          chip: false
        });
        this.friends_count = this.conversationChip.length;
      }

    }
  }

  onChange(val) {
    console.log(this.usersSelected);
  }

  nextConversation() {

    this.navCtrl.push(CreateConversationNewPage, { users: this.usersSelected, userDetails: this.selectUserDetails });
  }


  ShowDelete(data) {

    Object.keys(this.conversationChip).forEach((key) => {

      if (this.conversationChip[key].username == data) {
        this.conversationChip[key].chip = !this.conversationChip[key].chip;
      }
    });
  }
  delete(chip: Element, username: any) {

    this.SetStyle(username);
    chip.remove();

    for (let item in this.conversationChip) {

      if (this.conversationChip[item].username == username) {

        let index = this.conversationChip.indexOf(this.conversationChip[item]);


        if (index > -1) {
          this.conversationChip.splice(index, 1);
        };

      }

      this.friends_count = this.conversationChip.length;
    }
  }
  SetStyle(data) {

    Object.keys(this.List).forEach((key) => {

      if (this.List[key].instance.username == data) {
        if (this.List[key].instance.style == '#EEF4F8') {
          this.List[key].instance.style = '';

        }
        else {
          this.List[key].instance.style = '#EEF4F8';

        }
      }
    });
  }

  addParticipant() {

    this.OtherlyAPI.AddParticipant(this.usersSelected, this.code).then(data => {
      console.log(" Add Participant Code Returned  ", JSON.stringify(data));

      this.DeeplinkNotification(data);
      //  this.navCtrl.push(ConversationDetailsPage,{conv_code:this.code, title:this.title});
    });
  }

  DeeplinkNotification(response) {
    let usersList = [];

    // console.log(" DeeplinkNotification Awesome Data..... ", JSON.stringify(response));

    for (let item of response) {
      // console.log( " data title : " , item.conversation.code);
      for (let participant of item.conversation.participants) {
        usersList.push({
          id: participant.id,
          username: participant.user.username,
          hyperlink: this.Lds.deeplinkUrl+'conversations/' + item.conversation.code
        });
      }
    }

    console.log('Deeplink Add Conversation :' + JSON.stringify(usersList));
    this.OtherlyAPI.ShareDeeplinkNotification('conversation-added', response[0].conversation.code, JSON.stringify(usersList), '')
      .then((res) => {
        console.log("Deeplink response from server " + JSON.stringify(res));
        this.navCtrl.push(ConversationDetailsPage, { conv_code: response[0].conversation.code, title: response[0].conversation.title });
      });

  }
}
