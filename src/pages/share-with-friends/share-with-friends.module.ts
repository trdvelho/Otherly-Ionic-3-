import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareWithFriendsPage } from './share-with-friends';

@NgModule({
  declarations: [
    ShareWithFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShareWithFriendsPage),
  ],
})
export class ShareWithFriendsPageModule {}
