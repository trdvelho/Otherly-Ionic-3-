import { Component, ViewChild, ElementRef, Renderer, Input, OnInit } from '@angular/core';
import {
  Platform, NavController, ModalController, ViewController, NavParams, PopoverController, ToastController,
  LoadingController, ActionSheetController
} from 'ionic-angular';
import { Content } from 'ionic-angular/index';
import { Observable } from 'rxjs/Observable';
import { ForkJoinObservable } from "rxjs/observable/ForkJoinObservable";
import { File, Entry, FileEntry } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';


import { HomePageFriend } from '../../pages/home/home';
//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';
import { ConversationPopoverComponent } from '../../components/conversation-popover/conversation-popover';
// import {CDetailsParticipantsPage} from '../../pages/c-details-participants/c-details-participants';
import { CDetailsParticipantsPage } from '../../pages/conversations/c-details-participants';
import moment, { monthsShort } from 'moment';
import { TabsPage } from '../tabs/tabs';
import { getLocaleMonthNames } from '@angular/common/src/i18n/locale_data_api';
// import { CreatePostPage } from '../post-detail/create-post';
// import { ConversationAttachmentPage } from './conversation-attachment';
import { PermissionsService } from '../../providers/permissions/permission-service';
// import { Cordova } from '@ionic-native/core';

declare let cordova: any;
@Component({
  selector: 'page-conversation-details',
  templateUrl: 'conversation-details.html',
})
export class ConversationDetailsPage implements OnInit {
  accordionExapanded = false;
  @ViewChild(Content) content: Content;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('chatbox') chatbox: ElementRef;

  @ViewChild("cc") cardContent: any;
  @Input('title') title: string;

  icon: string = "arrow-forward";


  reply: any;
  code: string;
  next: string = null;
  onLoadMoreClick: boolean = false;
  details: any;
  Details = [];
  replies = [];
  showButton: boolean;
  participants: any[] = [];
  participantsno: number;
  new_conv_code: any;
  self: any;
  title_settings: any;
  user: string;

  loading: any;
  isCore: boolean = false;
  selectedImages = [];
  imageEvent: Event;
  filesToUpload: Array<File> = [];
  // blobsToUpload: Array<Blob> = [];
  self_postcode: string;
  formData: any;
  imageFile = null;



  constructor(public platform: Platform,
    private OtherlyAPI: OtherlyApiProvider,
    public renderer: Renderer,
    private Lds: LocaldataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public PopOverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    private crop: Crop,
    public imagePicker: ImagePicker,
    public toastCtrl: ToastController,
    public loadingController: LoadingController,
    public permission: PermissionsService,
    private readonly file: File,
    public imageResizer: ImageResizer
  ) {
    this.showButton = false;

    this.OtherlyAPI.setToken();
    if (this.platform._platforms.indexOf('core') > -1) {
      this.isCore = true;
    }
    else {
      this.isCore = false;
    }

    // The First If is for Create Conversation Code Getting an Error so not currently using it //
    //******************************************************************************************/
    if (this.navParams.get('new_conv_code')) {
      this.new_conv_code = this.navParams.get('new_conv_code');
      this.details = this.new_conv_code;


      let partno: string[] = [];

      for (let participant in this.new_conv_code.participants) {
        //  console.log(" Participants@@@@@ ", this.new_conv_code.participants[participant]);

        this.participants.push(this.new_conv_code.participants[participant]);
        partno.push(this.new_conv_code.participants[participant]);
      }
      //console.log(" participant array ", partno.length);
      this.participantsno = partno.length;
      // for(let participant of  this.new_conv_code[item].participant){
      // console.log(" Participants offfffff Create Conversation", JSON.stringify(this.participants ));
      // }


      for (let reply in this.new_conv_code.replies) {
        // console.log(" Wowwww", this.new_conv_code)

        //  console.log(" replies ..... ",this.new_conv_code[item].replies[reply].created);
        var time = moment(this.new_conv_code.replies[reply].created);
        var timenow = time.fromNow();
        this.new_conv_code.replies[reply].time_created = timenow;
        console.log("Date : Item", time.fromNow() + 'time in json : ' + time.toJSON());
        this.replies.push(this.new_conv_code.replies[reply]);
      }
      //  }
      this.replies.reverse();
      //  console.log(" replies ", this.replies);
      for (let item in this.new_conv_code) {
        this.Details.push(this.new_conv_code[item]);
      }
    }
    else {
      this.code = this.navParams.get('conv_code');
      this.title = this.navParams.get('title');


      if (this.code === 'oly') {
        this.user = this.navParams.get('user');
        this.OlyConversationDetails(false);

      } else {

        // console.log(" New Conv  Details Code !!!!", this.new_conv_code);
        this.GetConversationReplyList(false);
      }
    }
  }

  GetConversationReplyList(onLoadMoreClick: boolean) {

    /////            New API GetConversationReplyList

    this.OtherlyAPI.GetConversationReplyList(this.code, this.next).then(data => {
      // console.log(" Test..... ", JSON.stringify(data));
      let moreReplies = [];

      if (onLoadMoreClick) {
        for (let item in data) {
          if (data[item].next != null) {
            this.next = data[item].next;
          } else {
            this.next = null;
          }
          // console.log(" Awesome Conversation Data next..... ", JSON.stringify(data[item].next));
          moreReplies = data[item].results;

          moreReplies.reverse();

          for (let time in moreReplies) {

            // console.log(" Time length... ", this.replies.length);
            let times = moment(moreReplies[time].created);
            let timenow = times.fromNow();
            // console.log("Date : Item", times.fromNow() + ' time in date and month : ' + times.date() + monthsShort(times.month()));

            moreReplies[time].time_created = timenow;
          }
        }

        // console.log(" moreReplies ", JSON.stringify(moreReplies));

        let tempVar: string;
        let tempReplies = [];
        for (let item in moreReplies) {
          if (tempVar == undefined) {
            let times = moment(moreReplies[item].created);
            tempVar = times.date() + ' ' + monthsShort(times.month());
            tempReplies.push({ changed_date: tempVar });
            tempReplies.push(moreReplies[item]);
          }
          else {
            let times = moment(moreReplies[item].created);
            let temp1 = times.date() + ' ' + monthsShort(times.month());
            if (temp1 == tempVar) {
              tempReplies.push(moreReplies[item]);
            } else {
              tempVar = times.date() + ' ' + monthsShort(times.month());
              tempReplies.push({ changed_date: tempVar });
              tempReplies.push(moreReplies[item]);
            }
          }
        }
        // console.log(" tempReplies replies ", JSON.stringify(tempReplies));

        // console.log(" replies data after assigning tempReplies", JSON.stringify(tempReplies));

        let times = moment(tempReplies[tempReplies.length - 1].created);
        let tempTime = times.date() + ' ' + monthsShort(times.month());

        if (this.replies[0].changed_date == tempTime) {
          this.replies.reverse();
          this.replies.pop();
          this.replies.reverse();

          var tempArray: Array<any> = [] //empty array which we are going to push our selected items, always define types 

          for (let item in tempReplies) {
            tempArray.push(tempReplies[item])
          }
          for (let item in this.replies) {
            tempArray.push(this.replies[item])
          }

          // console.log(" replies data after assigning tempArray ", JSON.stringify(tempArray));
          this.replies = tempArray;

          // console.log(" replies data after assigning if ", this.replies.length + '   data  ' 
          // + JSON.stringify(this.replies));

        }
        else {
          var tempArray: Array<any> = [] //empty array which we are going to push our selected items, always define types 

          for (let item in tempReplies) {
            tempArray.push(tempReplies[item])
          }
          for (let item in this.replies) {
            tempArray.push(this.replies[item])
          }
          this.replies = tempArray;
          // console.log(" replies data after assigning else", JSON.stringify(this.replies));
        }

      }
      else {

        for (let item in data) {
          if (data[item].next != null) {
            this.next = data[item].next;
          }
          else {
            this.next = null;
          }
          // console.log(" Awesome Conversation Data next..... ", JSON.stringify(data[item].next));
          this.replies = data[item].results;

          this.replies.reverse();

          for (let time in this.replies) {

            // console.log(" Time length... ", this.replies.length);
            let times = moment(this.replies[time].created);
            let timenow = times.fromNow();
            // console.log("Date : Item", times.fromNow() + ' time in date and month : ' + times.date() + monthsShort(times.month()));

            this.replies[time].time_created = timenow;
          }

          ///
        }
        // console.log(" this.replies ", JSON.stringify(this.replies));

        let tempVar: string;
        let tempReplies = [];
        for (let item in this.replies) {
          if (tempVar == undefined) {
            let times = moment(this.replies[item].created);
            tempVar = times.date() + ' ' + monthsShort(times.month());
            tempReplies.push({ changed_date: tempVar });
            tempReplies.push(this.replies[item]);
          }
          else {
            let times = moment(this.replies[item].created);
            let temp1 = times.date() + ' ' + monthsShort(times.month());
            if (temp1 == tempVar) {
              tempReplies.push(this.replies[item]);
            } else {
              tempVar = times.date() + ' ' + monthsShort(times.month());
              tempReplies.push({ changed_date: tempVar });
              tempReplies.push(this.replies[item]);
            }
          }
        }
        // console.log(" tempReplies replies ", JSON.stringify(tempReplies));
        this.replies = tempReplies;
        // console.log(" replies data after assigning", JSON.stringify(this.replies));

        setTimeout(() => {
          this.content.scrollToBottom(300);
        }, 500);

        this.GetConversationDetails();
      }
    });

  }

  GetConversationDetails() {
    this.OtherlyAPI.GetConversationDetails(this.code).then(data => {
      this.details = data;


      // console.log(" !!!!! Details !!!!!", JSON.stringify(this.details));
      for (let item in this.details) {
        this.title = this.details[item].title;
        let partno: string[] = [];

        console.log(" Selfffffffffff", JSON.stringify(this.details[item]));
        this.self = this.details[item].self;

        for (let participant in this.details[item].participant) {
          // console.log(" Participants ", this.details[item].participant[participant].user.username );

          this.participants.push(this.details[item].participant[participant]);
          partno.push(this.details[item].participant[participant]);
        }
        //  console.log(" participant array ", partno.length);
        this.participantsno = partno.length;
        // for(let participant of  this.details[item].participant){
        // console.log(" Participants offfffff", JSON.stringify(this.participants ));
        // }

        // console.log("Details this.details[item]", this.details[item], "this.details[item].replies", this.details[item].replies)

        for (let reply in this.details[item].replies) {

          console.log(" replies ..... ", this.details[item].replies[reply].created);
          var time = moment(this.details[item].replies[reply].created);
          var timenow = time.fromNow();
          this.details[item].replies[reply].time_created = timenow;
          // console.log( "Date : Item", time.fromNow()  );
          // this.replies.push(this.details[item].replies[reply]);
        }
      }

      for (let item in this.details) {
        this.Details.push(this.details[item]);
      }
    });
  }

  OlyConversationDetails(onLoadMoreClick: boolean) {
    // this.onLoadMoreClick = onLoadMoreClick;
    // console.log('next :' + this.next);
    this.OtherlyAPI.OlyConversationDetails(this.user, this.next).then((data: any) => {
      // console.log(" OLY Data", JSON.stringify(data));
      let moreReplies = [];

      if (onLoadMoreClick) {
        if (data != null) {
          for (let item in data) {
            if (data[item].next != null) {
              this.next = data[item].next;
            } else {
              this.next = null;
            }
            // console.log(" Awesome Conversation Data next..... ", JSON.stringify(data[item].next));
            moreReplies = data[item].results;
            moreReplies.reverse();

            for (let time in moreReplies) {
              let times = moment(moreReplies[time].created);
              let timenow = times.fromNow();
              // console.log("Date : Item", times.fromNow() + ' time in date and month : ' + times.date() + monthsShort(times.month()));
              moreReplies[time].time_created = timenow;
            }
          }

          // console.log(" moreReplies ", JSON.stringify(moreReplies));

          let tempVar: string;
          let tempReplies = [];
          for (let item in moreReplies) {
            if (tempVar == undefined) {
              let times = moment(moreReplies[item].created);
              tempVar = times.date() + ' ' + monthsShort(times.month());
              tempReplies.push({ changed_date: tempVar });
              tempReplies.push(moreReplies[item]);
            }
            else {
              let times = moment(moreReplies[item].created);
              let temp1 = times.date() + ' ' + monthsShort(times.month());
              if (temp1 == tempVar) {
                tempReplies.push(moreReplies[item]);
              } else {
                tempVar = times.date() + ' ' + monthsShort(times.month());
                tempReplies.push({ changed_date: tempVar });
                tempReplies.push(moreReplies[item]);
              }
            }
          }
          // console.log(" tempReplies replies ", JSON.stringify(tempReplies));

          // console.log(" replies data after assigning tempReplies", JSON.stringify(tempReplies));

          let times = moment(tempReplies[tempReplies.length - 1].created);
          let tempTime = times.date() + ' ' + monthsShort(times.month());

          if (this.replies[0].changed_date == tempTime) {
            this.replies.reverse();
            this.replies.pop();
            this.replies.reverse();

            var tempArray: Array<any> = [] //empty array which we are going to push our selected items, always define types 

            for (let item in tempReplies) {
              tempArray.push(tempReplies[item])
            }
            for (let item in this.replies) {
              tempArray.push(this.replies[item])
            }

            // console.log(" replies data after assigning tempArray ", JSON.stringify(tempArray));
            this.replies = tempArray;

            // console.log(" replies data after assigning if ", this.replies.length + '   data  ' 
            // + JSON.stringify(this.replies));

          }
          else {
            var tempArray: Array<any> = [] //empty array which we are going to push our selected items, always define types 

            for (let item in tempReplies) {
              tempArray.push(tempReplies[item])
            }
            for (let item in this.replies) {
              tempArray.push(this.replies[item])
            }
            this.replies = tempArray;
            console.log(" replies data after assigning else", JSON.stringify(this.replies));
          }
        }
        // this.onLoadMoreClick = false;
      }
      else {
        if (data != null) {

          for (let item in data) {
            if (data[item].next != null) {
              this.next = data[item].next;
            }
            else {
              this.next = null;
            }
            console.log(" Awesome Conversation Data next..... ", JSON.stringify(data[item].next));
            this.replies = data[item].results;

            this.replies.reverse();

            for (let time in this.replies) {

              // console.log(" Time length... ", this.replies.length);
              let times = moment(this.replies[time].created);
              let timenow = times.fromNow();
              // console.log("Date : Item", times.fromNow() + ' time in date and month : ' + times.date() + monthsShort(times.month()));

              this.replies[time].time_created = timenow;
            }  ///
          }

          let tempVar: string;
          let tempReplies = [];
          for (let item in this.replies) {
            if (tempVar == undefined) {
              let times = moment(this.replies[item].created);
              tempVar = times.date() + ' ' + monthsShort(times.month());
              tempReplies.push({ changed_date: tempVar });
              tempReplies.push(this.replies[item]);
            }
            else {
              let times = moment(this.replies[item].created);
              let temp1 = times.date() + ' ' + monthsShort(times.month());
              if (temp1 == tempVar) {
                tempReplies.push(this.replies[item]);
              } else {
                tempVar = times.date() + ' ' + monthsShort(times.month());
                tempReplies.push({ changed_date: tempVar });
                tempReplies.push(this.replies[item]);
              }
            }
          }
          // console.log(" tempReplies replies ", JSON.stringify(tempReplies));
          this.replies = tempReplies;
          console.log(" replies data after assigning", JSON.stringify(this.replies));

          setTimeout(() => {
            this.content.scrollToBottom(300);
          }, 500);

        }
      }

    });
  }

  resize() {

    // this.chatbox.nativeElement.style.height = this.chatbox.nativeElement.scrollHeight + 'px';
    //  var element = this.chatbox['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    //   var scrollHeight = element.scrollHeight;
    //   element.style.height = scrollHeight + 'px';
    //   this.chatbox['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
    let textArea = this.chatbox['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + "px";

    console.log(" textArea", textArea);

  }
  ionViewDidLoad() {

    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 1000);
  }

  GoBack() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    }
    else {
      this.navCtrl.setRoot(TabsPage);
      // this.navCtrl.setRoot(TabsPage, {selectedTab: 3});
    }
  }

  replyConversation() {
    let text = this.reply;
    if (this.reply != null && this.reply != undefined && this.reply != "") {
      this.showLoadingController('Uploading the conversation');
      if (this.code === 'oly') {
        this.OtherlyAPI.OlyReplyCreate(this.user, this.reply).then((res: any) => {
          let response: any = res;
          // console.log(" OLY Reply ", JSON.stringify(res));
          if (response.id) {
            this.self_postcode = response.id;
            if (this.isCore) {
              if (this.filesToUpload.length > 0) {
                this.OtherlyAPI.createConversationAttachmentWithCore(response.id, this.filesToUpload)
                  .then(res => {
                    console.log('conversation attachment response : ' + JSON.stringify(res));
                    response = res;
                    if (response.id != undefined) {
                      this.showPush("Images attached successfully!", "post_created_ok");
                    }
                    else {
                      this.showPush("An error occured while attachment of images!", "post_created_error");
                    }
                    this.dismissLoadingController();
                  });
              } else { this.dismissLoadingController(); }
            } else {
              if (this.selectedImages.length > 0) {
                // this.uploadFile(response.id, this.selectedImages);
                this.OtherlyAPI.conversationAttachment(response.conversation,
                  this.selectedImages[0]).then(res => {
                    console.log('conversation attachment response : ' + res);
                    response = res;
                    if (response.responseCode == 201) {
                      this.showPush("Images attached successfully!", "post_created_ok");
                    }
                    else {
                      this.showPush("An error occured while attachment of images!", "post_created_error");
                    }
                    this.dismissLoadingController();
                  });
              } else { this.dismissLoadingController(); }
            }
          }
          else {
            this.dismissLoadingController();
            this.showPush("An error has happened, try again later.", "post_created_error");
          }

        });

      }
      else {
        if (this.isCore) {
          this.formData = new FormData();
          this.formData.append('message', this.reply);
          this.formData.append('conversation', this.code);

          if (this.filesToUpload != undefined && this.filesToUpload.length > 0) {
            // const files: Array<File> = this.filesToUpload;

            this.formData.append('image', this.filesToUpload[0], (this.filesToUpload[0] as any).name);
          }
          // .reply, this.code, this.filesToUpload
          this.OtherlyAPI.ReplyConversation(this.formData).then(data => {
            let response: any = data;
            // console.log('ReplyConversation '+ JSON.stringify(response));
            if (response.id) {
              // this.showPush("Images attached successfully!", "post_created_ok");

              response.time_created = moment(response.created).fromNow();
              // console.log(" Time length... ", response.time_created);
              this.replies.push(response);
            } else {
              // this.showPush("An error occured while attachment of images!", "post_created_error");
            }
            this.cancelConversation();
            this.dismissLoadingController();
          })
        }
        else {
          this.prepareImageFilesToReplyConversation();
        }
       
      }

     
    }

    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 1000);

    this.reply = '';

  }
  clearConversation() {
    this.reply = '';
  }
  showSendButton() {

    this.showButton = true;
  }
  hideSendButton() {
    console.log(" AaAaaa");
    this.showButton = false;
  }

  ionViewDidEnter() {
    this.content.scrollToBottom();
  }

  ionViewCanEnter() {
    console.log('CONVERSATION->Entered');

    if (this.Lds.TempVariable) {
      this.title = this.Lds.TempVariable;
      this.Lds.TempVariable = null;
    }
  }

  ShowProfile(friend) {
    this.navCtrl.push(HomePageFriend, { username: friend.username, first_name: friend.first_name, full_name: friend.full_name, photo_url: friend.photo_url, status: friend.status, helps_given: friend.helps_given, thanks_sent: friend.thanks_sent });
  }

  ngOnInit() {
    // console.log(this.cardContent.nativeElement);
    // this.renderer.setElementStyle(this.cardContent.nativeElement, "webkitTransition", "max-height 500ms, padding 500ms");

    // console.log("INIT             !!!!!!!!!!!!!!!!!!!!!");

  }
  openConversationParticipants(title: any, details: any) {

    // console.log(" Great openConversationParticipants ....");
    let profileModal = this.modalCtrl.create(CDetailsParticipantsPage, { conv_code: this.code, self: this.self, title, details });
    // this.navCtrl.push(CDetailsParticipantsPage,{conv_code:this.code,self:this.self,title,details});


    profileModal.present();
    // this.viewCtrl.onDidDismiss(data=>{
    //   console.log("Data back from Setttings ",  JSON.stringify(data));
    // });


  }


  toggleAccordion() {
    if (this.accordionExapanded) {
      this.renderer.setElementStyle(this.cardContent.nativeElement, "max-height", "0px");
      this.renderer.setElementStyle(this.cardContent.nativeElement, "padding", "0px 16px");

    } else {
      this.renderer.setElementStyle(this.cardContent.nativeElement, "max-height", "500px");
      this.renderer.setElementStyle(this.cardContent.nativeElement, "padding", "13px 16px");

    }

    this.accordionExapanded = !this.accordionExapanded;
    this.icon = this.icon == "arrow-forward" ? "arrow-down" : "arrow-forward";

  }
  conversationPopover() {
    let Popover = this.PopOverCtrl.create(ConversationPopoverComponent, { conv_code: this.code });
    Popover.present();

  }

  // openConversationAttachmentPage() {
  //   this.navCtrl.push(ConversationAttachmentPage, { reply: this.reply, conv_code: this.code, user: this.user });
  // }


  openMedia() {
    setTimeout(() => {
      if (this.isCore) {
        this.fileInput.nativeElement.click();
      }
      else { this.mediaActionSheet(); }
    }, 500);
  }

  mediaActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Camera',
          role: 'camera',
          handler: () => {
            console.log('Camera clicked');
            this.openWithCamera();
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            console.log('Gallery clicked');
            this.openWithGallery();
            // this.openImagePicker();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }



  openWithCamera(): Promise<any> {
    this.filesToUpload = null;
    this.selectedImages = new Array<string>();
    if (this.permission.checkCameraPermissions()) {
      const options: CameraOptions = {
        // allowEdit: true,
        quality: 20,
        sourceType: this.camera.PictureSourceType.CAMERA,
        mediaType: this.camera.MediaType.ALLMEDIA,
        destinationType: this.camera.DestinationType.FILE_URI,
        correctOrientation: true

      }

      // Get Image from ionic-native's built in camera plugin
      return this.camera.getPicture(options)
        .then((fileUri) => {
          this.imageResizer.resize({
            uri: fileUri,
            quality: 30,
            width: 1280,
            height: 1280
          }).then(fileUri => {
            if (this.platform.is('ios')) {
              return this.crop.crop(fileUri, { quality: 75, targetHeight: 100, targetWidth: 100 });

            } else if (this.platform.is('android')) {
              // Modify fileUri format, may not always be necessary
              fileUri = 'file://' + fileUri;
              console.log(' fileUri from android : ' + fileUri);
              return this.crop.crop(fileUri, { quality: 75, targetHeight: 150, targetWidth: 150 });
            }

            else {
              fileUri = 'data:image/jpeg;base64,' + fileUri;
              return this.crop.crop(fileUri, { quality: 75, targetHeight: 100, targetWidth: 100 });
            }
          }).then((fileUri) => {
            // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
            console.log('Cropped Image Path!: ' + fileUri);
            var filename = fileUri.substr(fileUri.lastIndexOf('/') + 1);
            // console.log('filename :' + filename);

            this.imageFile = {
              name: filename,
              url: fileUri
            }
            // console.log('android imageFile : ' + JSON.stringify(this.imageFile));
            this.selectedImages.push(fileUri);
            return fileUri;
          })
        })
    }
  }

  /*******select image from gallery
   * 
   */

  openWithGallery(): Promise<any> {
    this.selectedImages = new Array<string>();
    // if platform is cordova, then it will run on real devices and on browser

    console.log('cordova platform : ' + this.platform._platforms);
    if (this.permission.checkCameraPermissions()) {
      const options: CameraOptions = {
        // allowEdit: true,
        quality: 20,
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        mediaType: this.camera.MediaType.ALLMEDIA,
        destinationType: this.camera.DestinationType.DATA_URL,
        correctOrientation: true
      }

      // Get Image from ionic-native's built in camera plugin
      return this.camera.getPicture(options)
        .then((fileUri) => {
          this.imageResizer.resize({
            uri: fileUri,
            quality: 30,
            width: 1280,
            height: 1280
          }).then(fileUri => {
            if (this.platform.is('ios')) {
              return this.crop.crop(fileUri, { quality: 75, targetHeight: 100, targetWidth: 100 });

            } else if (this.platform.is('android')) {
              // Modify fileUri format, may not always be necessary
              fileUri = 'file://' + fileUri;
              console.log('gallery .....' + fileUri);
              // return fileUri;
              return this.crop.crop(fileUri, { quality: 75, targetHeight: 100, targetWidth: 100 });

            } else {
              fileUri = 'data:image/jpeg;base64,' + fileUri;
              return this.crop.crop(fileUri, { quality: 75, targetHeight: 100, targetWidth: 100 });
            }
          }).then((fileUri) => {
            // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
            console.log('Cropped Image Path!: ' + fileUri);
            var filename = fileUri.substr(fileUri.lastIndexOf('/') + 1);
            // console.log('filename :' + filename);

            this.imageFile = {
              name: filename,
              url: fileUri
            }
            // console.log('android imageFile : ' + JSON.stringify(this.imageFile));
            this.selectedImages.push(fileUri);
            // this.selectedImages.push(this.imageFile);
            return fileUri;
          })
        })


    }
  }


  /******
   * can select multiple images from gallery
   */
  openImagePicker() {
    if (this.permission.checkCameraPermissions()) {
      let options = {
        maximumImagesCount: 1,// number of images ca select
        outputType: 1,
        quality: 25,
        correctOrientation: true
        // outputType: ImagePicker.outputType.BASE64_STRING
      }
      this.selectedImages = new Array<string>();
      this.imagePicker.getPictures(options)
        .then((results) => {
          // console.log('Image Picker : ', JSON.stringify(results));
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI android: ' + results[i]);

            // The above code to get the file name.
            var filename = results[i].substr(results[i].lastIndexOf('/') + 1);
            console.log('filename :' + filename);
            var fileExtension = filename.substr(filename.lastIndexOf('/') + 1);
            console.log('fileextension : ' + fileExtension);
            this.imageFile = {
              name: filename,
              url: results[i]
            }
            // console.log('android imageFile : ' + JSON.stringify(this.imageFile));

            // this will get the file extension.


            this.selectedImages.push(results[i]);
          }
          //   this.reduceImages(results).then(() => {
          //     console.log('all images cropped!!');
          //   });
        }, (err) => { console.log(err) });
    }
  }

  // read image data selected from the browser
  processWebImage(event) {
    this.selectedImages = null;

    this.filesToUpload = <Array<File>>event.target.files;
    this.imageFile = event.target.files[0];

    console.log('event.target.files ' + event.target.files[0].name + event.target.files[0].value)
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      // this.imageFile.name = event.target.files[0].name;
      this.imageFile.url = imageData;
      console.log('imagefile : ' + JSON.stringify(this.imageFile));
      // this.imageUrl = imageData;
      // console.log('processWebImage   :   ' + imageData);
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  cancelConversation() {
    this.selectedImages = null;
    // this.blobsToUpload = null;
    this.filesToUpload = null;
    this.formData = null;
    this.imageFile = null;
  }

  showPush(message, back_g_color) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'top',
      'cssClass': back_g_color
    });
    toast.present();
  }

  showLoadingController(msg: string) {
    this.loading = this.loadingController.create({
      content: msg + '...',
    });
    this.loading.present();
  }
  dismissLoadingController() {
    this.loading.dismissAll()
  }

  private prepareImageFilesToReplyConversation() {
    // this.showLoadingController('Uploading the conversation');
    this.formData = new FormData();
    this.formData.append('message', this.reply);
    this.formData.append('conversation', this.code);

    console.log('prepareImageFilesToReplyConversation ' + this.reply + this.code + this.selectedImages[0]);
    if (this.selectedImages != null && this.selectedImages.length > 0) {
      
      var filePaths = this.selectedImages[0];
      if (!filePaths.startsWith('file://')) {
        filePaths = 'file://' + filePaths;
      }
      this.file.resolveLocalFilesystemUrl(filePaths).then(entry => {
        (<FileEntry>entry).file(file => {
          let blob: Blob = <Blob>file;
          const reader = new FileReader();
          reader.onloadend = () => {
            const imgBlob = new Blob([reader.result], { type: blob.type });
            // this.blobsToUpload.push(new Blob([reader.result], { type: blob.type }))
            this.formData.append('image', imgBlob, (<any>blob).name);
            console.log('filePaths ' + filePaths + (<any>blob).name);
            this.OtherlyAPI.ReplyConversation(this.formData).then(data => {
              let response: any = data;
              // console.log('ReplyConversation '+ JSON.stringify(response));
              if (response.id) {
                response.time_created = moment(response.created).fromNow();
                this.replies.push(response);
              } else { }
              this.cancelConversation();
              this.dismissLoadingController();
            })
          };
          reader.onerror = (error: any) => {
            console.log('reader.onerror' + JSON.stringify(error));
          };
          reader.readAsArrayBuffer(blob);
        }, (error) => {
          console.log('File Entry Error: ' + JSON.stringify(error));
        })
      }, (error) => {
        console.log('Error resolving file:  ' + JSON.stringify(error));
      })
    }
    else {
      this.OtherlyAPI.ReplyConversation(this.formData).then(data => {
        let response: any = data;
        console.log('ReplyConversation ' + JSON.stringify(response));
        if (response.id) {
          response.time_created = moment(response.created).fromNow();
          this.replies.push(response);
        } else { }
        this.cancelConversation();
        this.dismissLoadingController();
      })
    }
  }
}
