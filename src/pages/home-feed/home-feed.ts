import { Component, ViewChild, ElementRef, Renderer, Input, OnInit } from '@angular/core';
import {
  IonicPage, NavController, NavParams, ToastController, AlertController, PopoverController,
  ViewController, ModalController, Loading, LoadingController, ActionSheetController, Platform
} from 'ionic-angular';
import { Content } from 'ionic-angular/index';
import { Observable } from 'rxjs/Observable';
import { ForkJoinObservable } from "rxjs/observable/ForkJoinObservable";
import { File, Entry, FileEntry } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';

//PAGES
import { PostDetailPage } from '../../pages/post-detail/post-detail';
import { CreateConversationPage } from '../../pages/conversations/create-conversation';
import { ShareWithFriendsPage } from '../../pages/share-with-friends/share-with-friends';
import { FriendsStatePage } from '../../pages/friends/FriendsStatePage';


//COMPONENTS
import { SharePopoverComponent } from '../../components/share-popover/share-popover';
import { MoreButtonPostPopoverComponent } from '../../components/more-popover/more-button-post-popover';

import moment from 'moment';
// import { CreatePostPage } from '../post-detail/create-post';
import { PermissionsService } from '../../providers/permissions/permission-service';



@IonicPage()
@Component({
  selector: 'page-home-feed',
  templateUrl: 'home-feed.html',
})
export class HomeFeedPage {
  @ViewChild(Content) content: Content;
  @ViewChild('chatbox') chatbox: ElementRef;

  @ViewChild("cc") cardContent: any;
  @Input('title') title: string;
  @ViewChild('fileInput') fileInput: ElementRef;
  private post_text: any;
  res:any;
  textArea: any;
  loading: Loading;
  input: string;
  list = [];
  //API_List:any;
  UserData: any;
  Feeds: any;
  send_color: string = 'lightgray';

  isCore: boolean = false;
  selectedImages = [];
  filesToUpload: Array<File> = [];
  blobsToUpload: Array<Blob> = [];
  formData: any;
  imageFile = null;

  constructor(
    public platform: Platform, public navCtrl: NavController,
    public navParams: NavParams,
    private OtherlyAPI: OtherlyApiProvider,
    private Lds: LocaldataProvider,
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
    public alertCtrl: AlertController,
    public PopOverCtrl: PopoverController,
    public actionSheetCtrl: ActionSheetController,
    private ViewCtrl: ViewController,
    private ModalCtrl: ModalController,
    private LoadingCrtl: LoadingController,
    public camera: Camera,
    private crop: Crop,
    public imagePicker: ImagePicker,
    public permission: PermissionsService,
    private readonly file: File,
    public imageResizer: ImageResizer) {
    let List: any;

    this.loading = this.LoadingCrtl.create({
      content: 'Loading. Please wait...',
      dismissOnPageChange: true // This attribute set to true is trying to dismiss a page which no longer exits set to false error stops
    });

    /***
     * check whether platform is browser or native
     * if 'core its browser'
     * */
    if (this.platform._platforms.indexOf('core') > -1) {
      this.isCore = true;
    }
    else {
      this.isCore = false;
    }


    //this.loading.present();
    this.Lds.getUser().then(data => {
      this.UserData = data;
      //console.log("MY INFOS: " + JSON.stringify(this.UserData));

      //USER INFORMATIONS HAVE BEEN RECEIVED HERE
      this.OtherlyAPI.UserInfos(this.UserData.username).then((data)=>{
           let user : any = data;
           console.log(JSON.stringify(user));
           this.Lds.setUser(user, "");
           this.UserData = data;
      });

      this.OtherlyAPI.GetFeedList(this.UserData.otherly_token, {})
        .then(data => {
          this.Feeds = data;
          //console.log("Feed ", this.Feeds);
          for (let item of this.Feeds) {
            let item_date = moment(item.created);
            item.created = item_date.format("MMMM DD, YYYY");
            if (item.text.length > 120)
              item.ellipsis = 3;

            //console.log("Replied is", item.user_replied);
            if (item.user_replied)
              item.user_replied_color = '#00B0E6';

          }
        });

      //this.loading.dismiss();
    });

  }

  UserProfile(){
    // this.navCtrl.push(FriendsStatePage, {UserData: this.UserData});
    this.navCtrl.push(FriendsStatePage,{UserData: this.UserData});

  }

  Thanks_color() {
    if (this.Feeds.user_thanked)
      return 'blue';
    else
      return 'lightgray';
  }

  // Reply_color(code): string {


  //   Object.keys(this.Feeds).forEach((key) => {

  //       if(this.Feeds[key].code == code){
  //         let test = "'"+this.Feeds[key].user_replied+"'";
  //         console.log("Replied is ", test);
  //           if(this.Feeds[key].user_replied == 'true'){

  //             return {'background-color':'#00B0E6'};
  //           }
  //           else{
  //             console.log("Replied is false");
  //             return 'lightgray';
  //           }
  //       }
  //   });


  // }



  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeFeedPage');
  }
  ionViewDidEnter() {
    console.log('HomeFeedPage->Entered');

    if (this.Lds.TempVariable) {
      let code = this.Lds.TempVariable;
      this.Lds.TempVariable = null;


      Object.keys(this.Feeds).forEach((key) => {

        if (this.Feeds[key].code == code.post_code) {
          //this.Feeds[key].user_replied_color = '#00B0E6';
          this.Feeds[key].reply_count = 1;


        }
      });
    }
  }

  ionViewWillEnter() {
    console.log('HomeFeedPage');

  }

  ReadMore(code) {
    console.log("Elipsis code : ", code);
    Object.keys(this.Feeds).forEach((key) => {
      if (this.Feeds[key].code == code) {
        this.Feeds[key].ellipsis == 3 ? this.Feeds[key].ellipsis = null : this.Feeds[key].ellipsis = 3;
        this.Feeds[key].read_more_text == 'READ MORE' ? this.Feeds[key].read_more_text = 'READ LESS' : this.Feeds[key].read_more_text = 'READ MORE';
      }
    });
  }

  onChange(ev) {
    console.log("Key + ev" + ev);
    console.log("input contains :" + this.post_text);
    if (this.post_text !== '')
      this.send_color = '#00A0DF';
    else
      this.send_color = 'lightgray';
  }


  PassPost(Post_code) {

    this.OtherlyAPI.PassPost(Post_code, '').then(res => {
      console.log("Post Passed " + JSON.stringify(res));
      let response: any = res;
      if (response.code) {
        this.showPush("You will no longer see this post", "shared_ok");
        for (let item in this.Feeds) {
          if (this.Feeds[item].code == Post_code) {

            let index = this.Feeds.indexOf(this.Feeds[item]);
            console.log(" index ", index);
            if (index > -1) {

              this.Feeds.splice(index, 1);

            }
          }
        }
      }
      else {
        this.showPush("An error has happened, try again later", "shared_error");
      }

    });
  }

  FlagPost(ev, post) {
    Object.keys(this.Feeds).forEach((key) => {

      if (this.Feeds[key].code == post.code) {
        if (this.Feeds[key].style == '#00B0E6') {
          this.Feeds[key].style = '';
        }
        else {
          this.Feeds[key].style = 'lightgray';

        }
      }
    });
    let MorePopover = this.PopOverCtrl.create(MoreButtonPostPopoverComponent, { PostDetail: post });
    MorePopover.onDidDismiss(data => {
      let response = data;
      console.log("DISMISSED ", data);

      if (response) {
        if (response.flag == "true")
          this.PassPost(post.code);
      }

    });
    MorePopover.present({
      ev: ev
    });

  }

  

  // hit Post Attachment Create API
  createPost() {

    console.log("post text: " + this.post_text);

    if (this.post_text != null && this.post_text != undefined && this.post_text != "") {
      this.showLoadingController('Uploading the post');
      this.OtherlyAPI.CreatePost(this.post_text, '').then((res) => {
        let response: any = res;
        console.log("Post created ", JSON.stringify(res));
        if (response.code) {
          // this.self_postcode = response.code;

          if (this.isCore) {
            if (this.filesToUpload != null && this.filesToUpload.length > 0) {
              this.OtherlyAPI.createPostAttachmentWithCore(response.code, this.filesToUpload,
                null).then(res => {
                  console.log('post core attachment response : ' + JSON.stringify(res));
                  response = res;
                  if (response.id != undefined) {
                    this.showPush("Post successfully created!", "post_created_ok");
                  }
                  else {
                    this.showPush("An error occured while attachment of images!", "post_created_error");
                  }
                  this.dismissLoadingController();
                });
            } else { this.showPush("Post successfully created!", "post_created_ok"); this.dismissLoadingController(); }
          }
          else {
            if (this.selectedImages != null && this.selectedImages.length > 0) {
              // this.uploadFile(response.code, this.selectedImages);
              this.OtherlyAPI.postAttachment(response.code, this.selectedImages[0]).then(res => {
                console.log('post attachment response : ' + JSON.stringify(res));
                response = res;
                console.log('post attachment response.response.id : ' + JSON.stringify(response.response.id));
                if (response.responseCode == 201) {
                  this.showPush("Post successfully created!", "post_created_ok");
                }
                else {
                  this.showPush("An error occured while attachment of images!", "post_created_error");
                }
                this.dismissLoadingController();
              });

            } else { this.showPush("Post successfully created!", "post_created_ok"); this.dismissLoadingController(); }

          }
        }
        //   this.showPush("Post successfully created!","post_created_ok");
        else {
          this.dismissLoadingController();
          this.showPush("An error has happened, try again later.", "post_created_error");

        }

        this.send_color = 'lightgray';
        this.post_text = "";
        // this.textArea.style.height = "30px";
        this.cancelPost();

      })

    }

  }

  OpenPost(Post_detail) {
    console.log('PUSH TO POST DETAIL ' + JSON.stringify(Post_detail));
    this.navCtrl.push(PostDetailPage, { Postdetails: Post_detail, code: Post_detail.code });
    //screen.present();



    // screen.onDidDismiss((data)=>{
    //   console.log("Home feed :", JSON.stringify(data));
    //   if(data){
    //     if(data.flag == "true"){
    //       this.PassPost(Post_detail.code);
    //     }
    //     if(data == "yes"){
    //       Object.keys(this.Feeds).forEach((key) => {

    //         if(this.Feeds[key].code == Post_detail.code){
    //           //this.Feeds[key].user_replied_color = '#00B0E6';
    //           this.Feeds[key].reply_count = 1 ;


    //         }
    //     });

    //     }
    //   }

    // });



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


  SharePrompt(ev, Post_detail) {
    //console.log("SHARE FUNTION : details "+ JSON.stringify(Post_detail));
    let Popover = this.PopOverCtrl.create(SharePopoverComponent, { post_details: Post_detail }, { cssClass: 'Share-Popover' });
    Popover.present({
      ev: ev
    });
    Popover.onDidDismiss((data) => {

      if (data == "friends")
        this.navCtrl.push(ShareWithFriendsPage, { post_details: Post_detail, action: 'friends' });

      if (data == "communities")
        this.navCtrl.push(ShareWithFriendsPage, { post_details: Post_detail, action: 'communities' });
    });

  }

  resize(){
    let textArea;
    textArea = this.chatbox['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + "px";
  }

  StartIntro(Post_user: any) {

    console.log("POST USER home-feed.ts", JSON.stringify(Post_user));

    this.navCtrl.push(CreateConversationPage, { introductions: Post_user }, { direction: 'forward' });
  }

  showLoading() {
    this.loading.present();
  }




  //   this.radio_array.push({
  //       name: 'code',
  //       type: 'text',
  //       value: Post_detail.code
  //     });

  //   this.input= "["+this.radio_array+"]";
  //   let toast = this.toastCtrl.create({
  //         message: 'Post Shared Successfully',
  //         duration: 3000,
  //         position: 'top'
  //   });


  //   let API_List: any;
  //   let List=[];





  //           console.log("Radio array " +JSON.stringify(this.radio_array));

  //           let prompt = this.alertCtrl.create({
  //           title: 'Sharing post',
  //           message: Post_detail.text,
  //           inputs: this.radio_array,




  //           buttons: [


  //             {
  //               text: 'Cancel',
  //               handler: data => {
  //                 console.log('Cancel clicked');

  //               }
  //             },
  //             {
  //               text: 'Share',
  //               handler: data => {

  //                 let users : string;
  //                 let item_left: number;
  //                 item_left = data.length;
  //                 users = "{"
  //                 for (let info of data){

  //                   users += '"'+info+'": true';
  //                   item_left = item_left - 1;
  //                   if(item_left != 0 ){
  //                     users += ",";
  //                   }

  //                 }
  //                 users += "}";
  //                 let post_code:string;

  //                 for(let code of this.radio_array){
  //                   if(code.name == 'code'){
  //                     post_code = code.value;
  //                   }
  //                 }

  //                 console.log('Save clicked ' + JSON.stringify(users));

  //                 this.OtherlyAPI.SharePost(post_code, users, this.UserData.otherly_token).then(res=>{
  //                    console.log("Shared post" + JSON.stringify(res));
  //                    toast.present();

  //                 });

  //               }
  //             }
  //           ]
  //         });

  //         prompt.present();







  // }



  // openImageAttachmentPostPage() {
  //   this.navCtrl.push(CreatePostPage, { post_text: this.post_text });
  // }
  ngOnInit() {

    console.log("INIT             !!!!!!!!!!!!!!!!!!!!!");
    this.OtherlyAPI.setToken();
  }

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
    if (this.permission.checkCameraPermissions()) {
      const options: CameraOptions = {
        // allowEdit: true,
        quality: 25,
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
            quality: 60,
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
            console.log('filename :' + filename);

            this.imageFile = {
              name: filename,
              url: fileUri
            }
            console.log('android imageFile : ' + JSON.stringify(this.imageFile));
            this.selectedImages.push(fileUri);
            return fileUri;
          })
        })
      // .then((fileUri) => {
      //   // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
      //   console.log('Cropped Image Path!: ' + fileUri);
      //   var filename = fileUri.substr(fileUri.lastIndexOf('/') + 1);
      //   console.log('filename :' + filename);

      //   this.imageFile = {
      //     name: filename,
      //     url: fileUri
      //   }
      //   console.log('android imageFile : ' + JSON.stringify(this.imageFile));
      //   this.selectedImages.push(fileUri);
      //   return fileUri;
      // })
    }
  }

  /*******select image from gallery
   * 
   */

  openWithGallery(): Promise<any> {

    // if platform is cordova, then it will run on real devices and on browser

    console.log('cordova platform : ' + this.platform._platforms);
    if (this.permission.checkCameraPermissions()) {
      const options: CameraOptions = {
        // allowEdit: true,
        quality: 25,
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        mediaType: this.camera.MediaType.ALLMEDIA,
        destinationType: this.camera.DestinationType.FILE_URI,
        correctOrientation: true
      }

      // Get Image from ionic-native's built in camera plugin
      return this.camera.getPicture(options)
        .then((fileUri) => {
          this.imageResizer.resize({
            uri: fileUri,
            quality: 60,
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
            console.log('filename :' + filename);

            this.imageFile = {
              name: filename,
              url: fileUri
            }
            console.log('android imageFile : ' + JSON.stringify(this.imageFile));
            this.selectedImages.push(fileUri);
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
            console.log('android imageFile : ' + JSON.stringify(this.imageFile));

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

  cancelPost() {
    this.selectedImages = null;
    this.blobsToUpload = null;
    this.filesToUpload = null;
    this.formData = null;
    this.imageFile = null;
  }

  // uploadFile(code: string, filePaths: Array<string>) {
  //   this.formData = new FormData();
  //   console.log('filePaths.length :' + filePaths.length);
  //   this.upload(filePaths).subscribe(data => {

  //     console.log('开始上传........');
  //     console.log('selectedImages.length : ' + this.selectedImages.length +
  //       '  this.blobsToUpload.length :  ' + this.blobsToUpload.length);

  //     if (filePaths.length == this.blobsToUpload.length) {
  //       let response;
  //       this.OtherlyAPI.postAttachment(code, this.formData, this.blobsToUpload).then(res => {
  //         console.log('post attachment response : ' + JSON.stringify(res));
  //         response = res;
  //         if (response.id != undefined) {
  //           this.showPush("Post successfully created!", "post_created_ok");
  //         }
  //         else {
  //           this.showPush("An error occured while attachment of images!", "post_created_error");
  //         }
  //         this.dismissLoadingController();
  //       });

  //     }
  //   }, error => {
  //     console.log('文件处理失败 error ' + JSON.stringify(error));
  //   });
  // }


  // private upload(filePaths: Array<string>): Observable<any> {
  //   //每个文件上传任务创建一个信号
  //   var observables: Array<any> = [];
  //   filePaths.forEach((value: string, i, array) => {
  //     if (!value.startsWith('file://')) {
  //       value = 'file://' + value;
  //     }

  //     console.log('这里应该执行了吧.........');

  //     var observable = new Observable((sub: any) => {
  //       this.file.resolveLocalFilesystemUrl(value).then(entry => {
  //         (<FileEntry>entry).file(file => {
  //           // this.readFile(<Blob>file);
  //           let blob: Blob = <Blob>file;
  //           const reader = new FileReader();
  //           reader.onloadend = () => {

  //             const imgBlob = new Blob([reader.result], { type: blob.type });
  //             this.blobsToUpload.push(new Blob([reader.result], { type: blob.type }))
  //             this.formData.append('image', imgBlob, (<any>blob).name);
  //             console.log('已经成功一半了.................' + + imgBlob);


  //             sub.next(null);
  //             sub.complete();
  //           };
  //           reader.readAsArrayBuffer(blob);
  //         });
  //       })
  //         .catch(error => console.log('报错了，日了狗----->' + JSON.stringify(error)));
  //     });

  //     observables.push(observable);
  //   });

  //   return ForkJoinObservable.create(observables);
  // }

  showLoadingController(msg: string) {
    this.loading = this.loadingController.create({
      content: msg + '...',
    });
    this.loading.present();
  }
  dismissLoadingController() {
    this.loading.dismissAll()
  }
}
