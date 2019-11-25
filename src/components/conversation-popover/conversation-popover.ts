import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { AddConversationParticipantPage } from '../../pages/conversations/add-conversation-participant';
import {OtherlyApiProvider} from '../../providers/otherly-api/otherly-api';

@Component({
  selector: 'conversation-popover',
  templateUrl: 'conversation-popover.html'
})
export class ConversationPopoverComponent {

  text: string;
  code:string;

  constructor( public viewCtrl: ViewController,
               private navCtr: NavController,
               public NavParamsCtrl: NavParams,
               private OtherlyApi:OtherlyApiProvider ) {

    console.log('ConversationPopoverComponent Constructor');
    this.text = 'Conversation Participants  ';
    this.code = NavParamsCtrl.get('conv_code');
  }

  addParticipant(){
    console.log(" Pushing Add Participant page ");
    this.navCtr.push(AddConversationParticipantPage,{conv_code:this.code});
  }
  
  muteConversation(){
    console.log(" Muting Conversation ");
  }
  
  close(){
    this.viewCtrl.dismiss();
  }

}
