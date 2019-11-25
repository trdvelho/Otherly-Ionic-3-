import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, Events } from 'ionic-angular';
import { Contacts } from '@ionic-native/contacts';

//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';
import { CreateConversationPage } from '../../pages/conversations/create-conversation';
import { ConversationDetailsPage } from '../../pages/conversations/conversation-details';
import { HomePageFriend } from '../../pages/home/home';
import moment from 'moment';

//  Filters 

import { ConversationPipe } from '../../pipes/conversation/conversation';

@Component({
  selector: 'page-conversations',
  templateUrl: 'conversations.html',
  providers: [Contacts]
})
export class ConversationsPage {

  Conversations: any;
  NumberofUsers: Number;


  constructor(private OtherlyAPI: OtherlyApiProvider,
    private Lds: LocaldataProvider,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    public events: Events,
    private zone: NgZone) {



    OtherlyAPI.GetConversations('', {})
      .then(data => {

        // console.log(" converstions mymy", data);

        this.Conversations = data;
        for (let item of this.Conversations) {
          var jun = moment(item.post.conversation_created);
          // console.log( "Date : Item", jun.fromNow()  );
          //console.log("$$$$$$$$$$", item.  post.last_conversation.text);

          let nowT = jun.fromNow();
          item.post.conversation_created_now = nowT;
        }

        // console.log(" Conversations --- ",JSON.stringify(this.Conversations))
        var conversationTemp: any = JSON.stringify(data);
        let numU = [];

        numU.push(this.Conversations);

        console.log(" New Conversations ######", JSON.stringify(this.Conversations));
      });


    this.events.subscribe('updateScreen', () => {
      this.zone.run(() => {
        console.log('force update the screen');
      });
    });
  }

  ShowProfile(friend) {
    this.navCtrl.push(HomePageFriend, { username: friend.username, first_name: friend.first_name, full_name: friend.full_name, photo_url: friend.photo_url, status: friend.status, helps_given: friend.helps_given, thanks_sent: friend.thanks_sent });

  }

  onInput(evt: any) {
    // console.log(" evt ", evt.target.value);

  }
  new_talk() {
    this.navCtrl.push(CreateConversationPage, {}, { animate: false });
  }
  showConversationDetails(code: string, title: string, user: string) {

    this.navCtrl.push(ConversationDetailsPage, { conv_code: code, title: title, user: user });

  }

  deleteConversation(code: string, user: string) {
    console.log(" Delete Conversation  code ", code, " user ", user);
    let alert = this.alertCtrl.create({

      title: 'Are you sure you want to delete the talk',
      // message:' Are you sure you want to leave ',
      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('Cancel Clicked');
        }
      },
      {
        text: 'Yes',
        handler: () => {
          this.OtherlyAPI.LeaveConversation(code, user).then(data => {
            console.log(" Remove Conversation ", data);

            if (data) {

              for (let item in this.Conversations) {

                if (this.Conversations[item].post.code == code) {

                  let index = this.Conversations.indexOf(this.Conversations[item]);
                  console.log(" index ", index);
                  if (index > -1) {
                    this.Conversations.splice(index, 1);

                  }
                }
              }
            }
          });

        }
      }

      ]

    });
    alert.present();

  }
}
