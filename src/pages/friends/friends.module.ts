import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Friends } from './friends';
import { FilterFriendsPipe } from '../../pipes/filter-friends/filter-friends'

@NgModule({
  declarations: [
    Friends,
    FilterFriendsPipe
  ],
  imports: [
    IonicPageModule.forChild(Friends),
  ],
})
export class FriendsPageModule {}
