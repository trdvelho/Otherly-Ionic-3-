import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera } from '@ionic-native/camera';
import { ImageResizer } from '@ionic-native/image-resizer';
import { ImageCropperModule } from 'ngx-image-cropper';


//Pages
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { VerifyPage } from '../pages/login/verify'; 
import { RegisterPage} from '../pages/login/register';
import {ForgotpasswordPage} from '../pages/login/forgotpassword';
import {VerifypasswordPage} from '../pages/login/verifypassword';
import { HomePageFriend } from '../pages/home/home';
import { HomePage } from '../pages/more/home';
import { HomeFeedPage } from '../pages/home-feed/home-feed';
import { PostDetailPage } from '../pages/post-detail/post-detail';
import { Friends } from '../pages/friends/friends';
import { FriendsStatePage } from '../pages/friends/FriendsStatePage';
import { ShareWithFriendsPage } from '../pages/share-with-friends/share-with-friends';
import { PostShareWithFriendsPage } from '../pages/share-with-friends/post-share-with-friends';
import { ConversationsPage } from '../pages/conversations/conversations';
import { ConversationDetailsPage } from '../pages/conversations/conversation-details';
import { CreateConversationNewPage } from '../pages/conversations/create-conversation-new';
import { CreateConversationPage } from '../pages/conversations/create-conversation';
import { CDetailsParticipantsPage } from '../pages/conversations/c-details-participants';
import { AddConversationParticipantPage } from '../pages/conversations/add-conversation-participant';
import { NotificationsPage } from '../pages/notifications/notifications';
import { MorePage } from '../pages/more/more';
import { TabsPage } from '../pages/tabs/tabs';
import { MobileLoginPage } from '../pages/login/mobile-login';

//COMPONENTS
import { SharePopoverComponent } from '../components/share-popover/share-popover';
import { ConversationPopoverComponent } from '../components/conversation-popover/conversation-popover';
import { MoreButtonPostPopoverComponent } from '../components/more-popover/more-button-post-popover';
import { CreatePostComponent } from '../components/create-post/create-post';
import { SelectLocationComponent } from '../components/select-location/select-location';
import { MoreOptionButtonComponent } from '../components/more-option-button/more-option-button';
import { RelationshipStatusComponent } from '../components/relationship-status/relationship-status';
import { WhatIDoComponent } from '../components/what-i-do/what-i-do';
import { IonTagsInputModule } from "ionic-tags-input";


//Providers
import { Facebook } from "@ionic-native/facebook";
import { GooglePlus } from '@ionic-native/google-plus';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Deeplinks } from '@ionic-native/deeplinks';
import { LocaldataProvider } from '../providers/localdata/localdata';
import { OtherlyApiProvider } from '../providers/otherly-api/otherly-api';
import { LocationProvider } from '../providers/location/location';
import { UserProfileProvider } from '../providers/user-profile/user-profile';

//PIPES - Filter
import { FilterFriendsPipe } from '../pipes/filter-friends/filter-friends';
import { FilterCommunityPipe } from '../pipes/filter-community/filter-community';
import  { ConversationPipe } from '../pipes/conversation/conversation';
import { SearchFriendsConvPipe } from '../pipes/search-friends-conv/search-friends-conv';

//DIRECTIVES
import { CreatePostAreaDirective } from '../directives/create-post-area/create-post-area';
import { CreateCommentDirective } from '../directives/create-comment/create-comment';
import { MediaPopoverComponent } from '../components/media-popover/media-popover';
import { PermissionsService } from '../providers/permissions/permission-service';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Crop } from '@ionic-native/crop';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ImagePicker } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { CropImagePage } from '../pages/friends/browser-crop-image';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    VerifyPage,
    RegisterPage,
    HomeFeedPage,
    PostDetailPage,
    HomePage,
    HomePageFriend,
    Friends,
    FriendsStatePage,
    ShareWithFriendsPage,
    PostShareWithFriendsPage,
    ConversationsPage,
    ConversationDetailsPage,
    CreateConversationPage,
    CDetailsParticipantsPage,
    AddConversationParticipantPage,
    CreateConversationNewPage,
    NotificationsPage,
    MorePage,
    TabsPage,
    SharePopoverComponent,
    MoreButtonPostPopoverComponent,
    MediaPopoverComponent,
    CreatePostComponent,
    ConversationPopoverComponent,
    WhatIDoComponent,
    FilterFriendsPipe,
    FilterCommunityPipe,
    ConversationPipe,
    SearchFriendsConvPipe,
    CreatePostAreaDirective,
    CreateCommentDirective,
    MobileLoginPage,
    ForgotpasswordPage,
    VerifypasswordPage,
    CropImagePage
  ],
  imports: [
    BrowserModule,
    ImageCropperModule,
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom',
      platforms: {
        ios: {
          tabsPlacement: 'bottom'

        },
        android: {
          tabsPlacement: 'bottom'

        }
      }, tabsHideOnSubPages: "false"
    },
      {
        links: [
          { component: LoginPage, name: 'LoginPage', segment: '' },
          // { component: TabsPage, name: 'tabs', segment: 'tabs' },
          // { component: HomeFeedPage, name: 'HomeFeedPage', segment: 'posts' },
          { component: HomeFeedPage, name: 'HomeFeedPage', segment: '' },
          { component: Friends, name: 'Friends', segment: '' },
          { component: NotificationsPage, name: 'NotificationsPage', segment: '' },
          { component: ConversationsPage, name: 'ConversationsPage', segment: '' },
          { component: MorePage, name: 'MorePage', segment: '' },
          { component: PostDetailPage, name: 'PostDetailPage', segment: 'posts/:code' },
          { component: ConversationDetailsPage, name: 'ConversationDetailsPage', segment: 'conversations/:conv_code'}
        ]

      }
    ),
    HttpModule,
    IonTagsInputModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    VerifyPage,
    HomeFeedPage,
    PostDetailPage,
    HomePage,
    HomePageFriend,
    Friends,
    FriendsStatePage,
    ShareWithFriendsPage,
    PostShareWithFriendsPage,
    ConversationsPage,
    ConversationDetailsPage,
    CreateConversationPage,
    CreateConversationNewPage,
    CDetailsParticipantsPage,
    AddConversationParticipantPage,
    NotificationsPage,
    MorePage,
    TabsPage,
    SharePopoverComponent,
    MoreButtonPostPopoverComponent,
    MediaPopoverComponent,
    CreatePostComponent,
    WhatIDoComponent,
    MobileLoginPage,
    ForgotpasswordPage,
    VerifypasswordPage,
     CropImagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocaldataProvider,
    InAppBrowser,
    GooglePlus,
    Facebook,
    SocialSharing,
    OtherlyApiProvider,
    LocationProvider,
    UserProfileProvider,
    Deeplinks,
    PermissionsService,
    Diagnostic,
    Camera,
    FileTransfer,
    Crop,
    PhotoViewer,
    ImagePicker,
    ImageResizer,
    File
  ]
})
export class AppModule {}
