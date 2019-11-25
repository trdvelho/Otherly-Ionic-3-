import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeFeedPage } from './home-feed';

@NgModule({
  declarations: [
    HomeFeedPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeFeedPage),
  ],
})
export class HomeFeedPageModule {}
