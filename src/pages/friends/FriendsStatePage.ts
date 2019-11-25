import { Component, ViewChild, Input, ElementRef, Renderer, ChangeDetectorRef } from '@angular/core';
import { NavParams, NavController, PopoverController, Platform, Content, ModalController } from 'ionic-angular';

import { MediaPopoverComponent } from '../../components/media-popover/media-popover';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { PermissionsService } from '../../providers/permissions/permission-service';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

//COMPONENTS
import { SelectLocationComponent } from '../../components/select-location/select-location';
import { MoreOptionButtonComponent } from '../../components/more-option-button/more-option-button';
import { RelationshipStatusComponent } from '../../components/relationship-status/relationship-status';
import { WhatIDoComponent } from '../../components/what-i-do/what-i-do';





//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';
import { UserProfileProvider } from '../../providers/user-profile/user-profile';
import { ImageResizer } from '@ionic-native/image-resizer';
import { CropImagePage } from './browser-crop-image';




@Component({
  selector: 'page-friendsstate',
  templateUrl: 'friendsstate.html',

})


export class FriendsStatePage {
  @ViewChild("asks_and_offers") Asks_Offers: ElementRef;
  @ViewChild("a_bit_about_me") Bit_about_me: ElementRef;
  @ViewChild("about_me_textarea") about_me_textarea: ElementRef;
  @ViewChild("what_i_do") What_i_do: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild(Content) content: Content;

  @Input("range") createpost: HTMLElement;

  private fab_button_visibility = "hidden";
  private fab_button_opacity = 1;
  private User_photo_filter;
  private post_text: any;
  private header_lenght: number;
  Skill_Range;                       //Represents all ion-range

  position: any;
  About_me: any;                     //Will receive JSON from AboutMe API with complete information about the user
  About_me_header_text = new String("");         //
  About_me_five_years = new String("");
  myDate: any;
  AddBirthday_text_hide = "block";
  DateTime_hide = "none";
  textarea_disabled = true;
  UserData: any;
  location: any;
  location_size: number;
  private fab_button = "none";
  isCameraInstalled: boolean = false;
  isBrowser: boolean = false;
  isOpen: boolean = false;
  loading: any;
  response: any;
  isNotCordova: boolean = false;
  isCore: boolean = false;
  // oFReader = new FileReader();
  // rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

  public userBase64Image: string;
  constructor(public navParam: NavParams,
    public navCtrl: NavController,
    public platform: Platform,
    public Lds: LocaldataProvider,
    private OtherlyAPI: OtherlyApiProvider,
    public PopOverCtrl: PopoverController,
    public camera: Camera,
    public imageResizer: ImageResizer,
    private crop: Crop,
    private photoViewer: PhotoViewer,
    public permission: PermissionsService,
    public toastCtrl: ToastController,
    public loadingController: LoadingController,
    public cd: ChangeDetectorRef,
    public modalCtrl: ModalController,
    private UserProfileAPI: UserProfileProvider,
    public Element: ElementRef,
    public Renderer: Renderer
  ) {

    this.UserData = this.navParam.get('UserData');
    if (this.UserData)
      this.location = this.UserData.location;


    if (this.location.location !== null)
      this.location_size = 1;
    else
      this.location_size = 0;
    //console.log("User ", JSON.stringify(this.UserData));
    this.OtherlyAPI.AboutMe(this.UserData.username).then((res) => {
      this.About_me = res;
      let about = [];
      about.push(this.About_me.header_text);
      //this.About_me.header_text == "" || null ? this.About_me_header_text = "Write something about your self!" : this.About_me_header_text = this.About_me.header_text;
      this.About_me_header_text = this.About_me.header_text;
      this.About_me_five_years = this.About_me.five_years;
      this.header_lenght = about[0].length;
      if (this.About_me.birthday !== "" || null) {
        let splitted = this.About_me.birthday.split(" ", 3);
        this.myDate = new Date(splitted[0] + "-" + splitted[1] + "-" + splitted[2]).toISOString();
        //console.log("Date from API:", this.myDate);
        this.AddBirthday_text_hide = "none";
        this.DateTime_hide = "block";
      }
    });

    this.Skill_Range = this.Element.nativeElement.getElementsByClassName("range-knob")[0];
    this.Renderer.setElementStyle(this.Skill_Range, "display","none");

    
  }

  EditProfile() {
    if (this.fab_button_visibility == "hidden") {
      this.fab_button_visibility = "";
      this.fab_button_opacity = 1;
      //this.User_photo_filter = { 'filter': 'grayscale(70%) blur (2px)' };
      this.textarea_disabled = false;
    }
    else {
      this.fab_button_visibility = "hidden";
      this.fab_button_opacity = 0;
      //this.User_photo_filter = { 'filter': 'grayscale(0%) blur (0px)' };
      this.textarea_disabled = true;


      // this.Lds.getUser()
      //   .then(data => {
      //     this.UserData = data;
      //     console.log('Userdata : ' + JSON.stringify(this.UserData));
      //     this.OtherlyAPI.AboutMe(this.UserData.user_name).then((res) => {
      //       console.log(' About me res' + JSON.stringify(res));
      //       this.About_me = res;
      //       let about = [];
      //       about.push(this.About_me.header_text);
      //       console.log(' About me ' + JSON.stringify(about));
      //       this.header_lenght = about[0].length;
      //     });
      // });
    }
  }

  TextAreaKeyDown() {
    this.header_lenght = this.About_me_header_text.length;
    let textArea;
    textArea = this.about_me_textarea['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + "px";
  }
  EditABitAboutMe() {
    let header_FiveYears = { header: this.About_me_header_text, five_years: this.About_me_five_years };
    this.UserProfileAPI.Edit_Header_FiveYears(this.UserData.username, "header_text", header_FiveYears.header).then((res) => {
      let response: any = res;
      this.About_me.header_text = this.About_me_header_text;
      console.log("Edit res: ", JSON.stringify(response));
    });
    this.UserProfileAPI.Edit_Header_FiveYears(this.UserData.username, "five_years", header_FiveYears.five_years).then((res) => {
      let response: any = res;
      console.log("Edit res: ", JSON.stringify(response));
    });
    this.EditProfile();
  }
  SelectLocation() {
    let select = this.PopOverCtrl.create(SelectLocationComponent);
    select.present();
  }
  scrollTo(element: string) {
    let position = this.Asks_Offers.nativeElement.offsetTop;
    this.content.scrollTo(0, position, 1000);
  }


  createPost() {
    console.log("post text: " + this.post_text);

    if (this.post_text != "") {
      this.OtherlyAPI.CreatePost(this.post_text, this.UserData.username).then(res => {
        console.log(res);
      })

    }

  }

  openMediaWith(ev) {
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

    this.userBase64Image = this.UserData.photo_url;
    // if (Camera['installed']()) {
    // if (!this.isCore) {
    console.log('if camera is installed');
    let Popover = this.PopOverCtrl.create(MediaPopoverComponent, { isCore: this.isCore }, { cssClass: 'Share-Popover' });
    Popover.present({
      ev: ev
    });
    Popover.onDidDismiss((data) => {
      console.log("onDidDismiss " + data);

      if (data == "gallery") {
        console.log("Open media " + data);

        // if (this.isCore) {
        //   this.openImageFileFromBrowser();
        // } else {
        this.openWithGallery();
        // }

      }

      if (data == "camera") {
        console.log("Open media with " + data);
        this.openWithCamera();
      }

      if (data == "browser") {
        console.log("Open media with " + data);
        this.openWithGallery();
      }

      if (data == "remove-photo") {
        console.log("Open media with " + data);
        // this.UserData.picture = '';
        this.removeImage();
      }

      if (data == 'view-photo') {
        console.log('Photoviewer ' + PhotoViewer.installed);
        this.photoViewer.show(this.UserData.photo_url, this.UserData.user_name, { share: false });

        // if (this.platform._platforms.indexOf('cordova') > -1) {
        //   this.isNotCordova = false;
        //   this.photoViewer.show(this.UserData.photo_url, this.UserData.user_name, { share: false });
        // }
        // else {
        //   if (this.platform._platforms.indexOf('core') > -1 ||
        //     this.platform._platforms.indexOf('mobileweb') > -1) {
        //     this.isNotCordova = true;
        //     this.cd.detectChanges();
        //   }
        // }
      } else {
        this.processWebImage(data);
      }


    });
    // }
    // else {
    //   console.log('if camera is not installed');
    //   this.fileInput.nativeElement.click();
    // }

  }


  triggerFalseClick() {
    console.log('triggerFalseClick');
    let el: HTMLElement = this.fileInput.nativeElement as HTMLElement;
    el.click();
  }

  // Return a promise to catch errors while loading image
  openWithGallery(): Promise<any> {
    this.userBase64Image = this.UserData.photo_url;
    // if platform is cordova, then it will run on real devices and on browser
    // if (this.platform._platforms.indexOf('cordova') > -1) {
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
            // Crop Image, on android this returns something like, '/storage/emulated/0/Android/...'
            // Only giving an android example as ionic-native camera has built in cropping ability
            console.log('Cropped Image file uri Path!: ' + this.platform._platforms);
            if (this.platform.is('ios')) {
              // return fileUri
              return this.crop.crop(fileUri, { quality: 75, targetHeight: 100, targetWidth: 100 });
            } else if (this.platform.is('android')) {
              // Modify fileUri format, may not always be necessary
              fileUri = 'file://' + fileUri;

              /* Using cordova-plugin-crop starts here */
              // return this.crop.crop(fileUri, { quality: 100 });
              return this.crop.crop(fileUri, { quality: 75, targetHeight: 100, targetWidth: 100 });
            }
            else {
              fileUri = 'data:image/jpeg;base64,' + fileUri;
              return fileUri;
            }
          }).then((path) => {
            // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
            // console.log('Cropped Image Path!: ' + path);
            this.UserData.photo_url = path;
            this.uploadImage();
            return path;
          })

        })

    }

    // }
    // else {
    //   if (this.platform._platforms.indexOf('core') > -1 ||
    //     this.platform._platforms.indexOf('mobileweb') > -1) {
    //     console.log('core, mobileweb platform : ' + this.platform._platforms);
    //     this.openImageFileFromBrowser();
    //   }

    // }

  }

  DateSelected() {
    let splitted = this.myDate.split("-", 3);
    let day = splitted[2];
    day = day.slice(0, 2);
    this.AddBirthday_text_hide = "none";
    this.DateTime_hide = "block";
    this.UserProfileAPI.SetBirthDate(this.UserData.username, splitted[0], splitted[1], day).then((res) => {
      console.log("Birth date set ", res);
    });
  }
  Add_relationship(ev) {
    let relationship = this.PopOverCtrl.create(RelationshipStatusComponent, { popover: "relationship" }, { cssClass: "relationship_popover" });
    let status: number;
    relationship.present({
      ev: ev
    });
  }

  openWithCamera(): Promise<any> {
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
            // folderName: 'Otherly',
            quality: 60,
            width: 1280,
            height: 1280
          }).then(fileUri => {
            // Crop Image, on android this returns something like, '/storage/emulated/0/Android/...'
            // Only giving an android example as ionic-native camera has built in cropping ability
            // console.log('Cropped Image file uri Path!: ' + fileUri);
            if (this.platform.is('ios')) {
              return fileUri;
            } else if (this.platform.is('android')) {
              // Modify fileUri format, may not always be necessary
              fileUri = 'file://' + fileUri;

              /* Using cordova-plugin-crop starts here */
              // return this.crop.crop(fileUri, { quality: 100 });
              return this.crop.crop(fileUri, { quality: 75, targetHeight: 100, targetWidth: 100 });
            }
            else {
              fileUri = 'data:image/jpeg;base64,' + fileUri;
              return fileUri;
            }
          }).then((path) => {
            // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
            console.log('Cropped Image Path!: ' + path);
            this.UserData.photo_url = path;
            this.uploadImage();
            return path;
          })

        })

    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      console.log('processWebImage   :   ' + imageData);
      // this.form.patchValue({ 'profilePic': imageData });
      // this.userBase64Image = imageData;
      this.UserData.photo_url = imageData;

      this.cd.detectChanges();
      this.uploadImageWithoutCordova(event);
    };

    // console.log('event.target.files[0]' + event.target.files[0]);
    if (event.target.files[0] !== undefined)
      reader.readAsDataURL(event.target.files[0]);
  }

  uploadImageWithoutCordova(event) {
    this.showLoadingController('Uploading');
    this.OtherlyAPI.uploadImageWithoutCordova(this.UserData.photo_url, event).then((res) => {
      // console.log('upload image response : ' + JSON.stringify(res));
      this.dismissLoadingController();
      this.response = res;
      if (this.response.message.success == 'New picture uploaded') {
        this.showPush('Image uploaded succesfully.');
      }
      else {
        this.UserData.photo_url = this.userBase64Image;
        this.cd.detectChanges();
      }
    });
  }

  removeImage() {
    this.showLoadingController('Removing');

    this.OtherlyAPI.removeImage().then((res) => {

      console.log('remove image response : ' + JSON.stringify(res));
      this.dismissLoadingController();
      this.response = res;
      // {"message":{"success":"Picture is now empty"}}
      if (this.response.message.success == 'Picture is now empty') {
        this.UserData.picture = '';
        this.UserData.photo_url = null;
        this.showPush('Image removed succesfully.');
      }
      else {
        this.UserData.photo_url = this.userBase64Image;
      }
    });
  }


  showPush(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
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

  GoBack() {
    this.navCtrl.pop();
  }

  // presentProfileModal() {
  //   let profileModal = this.modalCtrl.create(CropImagePage, { userId: 8675309 });
  //   profileModal.present();
  // }

  AddProfessionalBG() {
    let PopOver = this.PopOverCtrl.create(WhatIDoComponent, { username: this.UserData.username }, { cssClass: "What_i_do_popover" });
    PopOver.present();
  }

  DeleteProfessionalBg(bg_id) {
    this.UserProfileAPI.Edit_delete(this.UserData.username, "what_i_do", bg_id, "").then((res) => {
      let response: any = res;
      console.log("Remove response ", response.user);
      if (response !== null) {
        for (let item in this.About_me.what_i_do) {
          console.log("Removed", this.About_me.what_i_do[item].id);
          if (this.About_me.what_i_do[item].id == bg_id) {
            let index = this.About_me.what_i_do.indexOf(this.About_me.what_i_do[item]);
            console.log(" index ", index);
            if (index > -1) {
              this.About_me.what_i_do.splice(index, 1);
            }
          }
        }
      }
    });
  }

  WorkStatus() {
    let WorkStatus = this.PopOverCtrl.create(RelationshipStatusComponent, { popover: "work_status" }, { cssClass: "relationship_popover work_status" });
    let status: number;
    WorkStatus.present();
    WorkStatus.onDidDismiss((data) => {
      switch (data.work_status) {
        case 1: // "Unemployed"
          this.About_me.employment_status = "Unemployed";
          this.UserProfileAPI.SetStatus(this.UserData.username, "employment_status", data.work_status).then((res) => {
            console.log("WorkStatus api response", res);
          });
          break;
        case 2: // "Unemployed and looking for work"
          this.About_me.employment_status = "Unemployed and looking for work";
          this.UserProfileAPI.SetStatus(this.UserData.username, "employment_status", data.work_status).then((res) => {
            console.log("WorkStatus api response", res);
          });
          break;
        case 3: // "Self-employed"
          this.About_me.employment_status = "Self-employed";
          this.UserProfileAPI.SetStatus(this.UserData.username, "employment_status", data.work_status).then((res) => {
            console.log("WorkStatus api response", res);
          });
          break;
        case 4: // "Employed but looking for more"
          this.About_me.employment_status = "Employed but looking for more";
          this.UserProfileAPI.SetStatus(this.UserData.username, "employment_status", data.work_status).then((res) => {
            console.log("WorkStatus api response", res);
          });
          break;
        case 5: // "Not looking for any work"
          this.About_me.employment_status = "Not looking for any work";
          this.UserProfileAPI.SetStatus(this.UserData.username, "employment_status", data.work_status).then((res) => {
            console.log("WorkStatus api response", res);
          });
          break;
      }
    });
  }








  uploadImage() {
    this.showLoadingController('Uploading');
    //   switch (data.relationship) {
    //     case 1: // "Single"
    //       this.About_me.relationship_status = "Single";
    //       this.UserProfileAPI.SetStatus(this.UserData.username,"relationship_status", data.relationship).then((res)=>{
    //         console.log("Relationship api response", res);
    //       });
    //       break;
    //     case 2: // "Married"
    //       this.About_me.relationship_status = "Married";
    //       this.UserProfileAPI.SetStatus(this.UserData.username,"relationship_status", data.relationship).then((res)=>{
    //         console.log("Relationship api response", res);
    //       });
    //       break;
    //     case 3: // "In a relationship"
    //       this.About_me.relationship_status = "In a relationship";
    //       //status = 3;
    //       this.UserProfileAPI.SetStatus(this.UserData.username,"relationship_status", data.relationship).then((res)=>{
    //         console.log("Relationship api response", res);
    //       });
    //       break;
    //     case 4: // "Engaged"
    //       this.About_me.relationship_status = "Engaged";
    //       //status = 3;
    //       this.UserProfileAPI.SetStatus(this.UserData.username,"relationship_status", data.relationship).then((res)=>{
    //         console.log("Relationship api response", res);
    //       });
    //       break;
    //     case 5: // "Civil union"
    //       this.About_me.relationship_status = "Civil union";
    //       //status = 3;
    //       this.UserProfileAPI.SetStatus(this.UserData.username,"relationship_status", data.relationship).then((res)=>{
    //         console.log("Relationship api response", res);
    //       });
    //       break;
    //     case 6: // "Divorced"
    //       this.About_me.relationship_status = "Divorced";
    //       //status = 3;
    //       this.UserProfileAPI.SetStatus(this.UserData.username,"relationship_status", data.relationship).then((res)=>{
    //         console.log("Relationship api response", res);
    //       });
    //       break;
    //     case 7: // "Separated"
    //       this.About_me.relationship_status = "Separated";
    //       //status = 3;
    //       this.UserProfileAPI.SetStatus(this.UserData.username,"relationship_status", data.relationship).then((res)=>{
    //         console.log("Relationship api response", res);
    //       });
    //       break;
    //     case 8: // "Widowed"
    //       this.About_me.relationship_status = "Widowed";
    //       //status = 3;
    //       this.UserProfileAPI.SetStatus(this.UserData.username,"relationship_status", data.relationship).then((res)=>{
    //         console.log("Relationship api response", res);
    //       });
    //       break;
    //     case 9: // "Open Relationship"
    //       this.About_me.relationship_status = "Open Relationship";
    //       //status = 3;
    //       this.UserProfileAPI.SetStatus(this.UserData.username,"relationship_status", data.relationship).then((res)=>{
    //         console.log("Relationship api response", res);
    //       });
    //       break;
    //     case 10: // "Domestic partnership"
    //       this.About_me.relationship_status = "Domestic partnership";
    //       //status = 3;
    //       this.UserProfileAPI.SetStatus(this.UserData.username,"relationship_status", data.relationship).then((res)=>{
    //         console.log("Relationship api response", res);
    //       });
    //       break;
    //     case 11:
    //       this.About_me.relationship_status = "Don't show";
    //       break;
    //     }
    // })

    this.OtherlyAPI.uploadImage(this.UserData.photo_url).then((res) => {

      // console.log('upload image response : ' + JSON.stringify(res));
      this.dismissLoadingController();
      this.response = res;
      if (this.response.responseCode == 202) {
        this.showPush('Image uploaded succesfully.');
      }
      else {
        this.UserData.photo_url = this.userBase64Image;
      }
    });
  }




}


