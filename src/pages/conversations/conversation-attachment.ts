import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NavParams, NavController, Platform, ActionSheetController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { ForkJoinObservable } from "rxjs/observable/ForkJoinObservable";
import { File, Entry, FileEntry } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

// providers
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';
import { PermissionsService } from '../../providers/permissions/permission-service';


@Component({
    selector: 'page-conversation-attachment',
    templateUrl: 'conversation-attachment.html'
})
export class ConversationAttachmentPage {
    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('chatbox') chatbox: ElementRef;

    loading: any;
    isCore: boolean = false;
    selectedImages = [];
    private reply: string;
    private conv_code: string;
    textArea: any;
    send_color: string = 'lightgray';
    imageEvent: Event;
    filesToUpload: Array<File> = [];
    blobsToUpload: Array<Blob> = [];
    self_postcode: string;
    formData: any;
    constructor(public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        public actionSheetCtrl: ActionSheetController,
        public OtherlyAPI: OtherlyApiProvider,
        public camera: Camera,
        public imagePicker: ImagePicker,
        public toastCtrl: ToastController,
        public loadingController: LoadingController,
        public permission: PermissionsService,
        private readonly file: File) {
        this.reply = this.navParams.get('reply');
        this.conv_code = this.navParams.get('conv_code');

        if (this.platform._platforms.indexOf('core') > -1) {
            this.isCore = true;
        }
        else {
            this.isCore = false;
        }

    }

    GoBack() {
        this.navCtrl.pop();
    }

    processWebImage(event) {
        this.selectedImages = null;
        this.filesToUpload = <Array<File>>event.target.files;
        console.log('filesToUpload ' + this.filesToUpload.length)
        let reader = new FileReader();
        reader.onload = (readerEvent) => {
            let imageData = (readerEvent.target as any).result;
            // console.log('processWebImage   :   ' + imageData);
        };

        reader.readAsDataURL(event.target.files[0]);
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
                        this.openImagePicker();
                        // this.openWithGallery();
                        // this.selectPhoto();
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


    openImagePicker() {
        if (this.permission.checkCameraPermissions()) {
            let options = {
                maximumImagesCount: 1,
                outputType: 1,
                quality: 25,
                // outputType: ImagePicker.outputType.BASE64_STRING
            }
            this.selectedImages = new Array<string>();
            this.imagePicker.getPictures(options)
                .then((results) => {
                    // console.log('Image Picker : ', JSON.stringify(results));


                    for (var i = 0; i < results.length; i++) {
                        console.log('Image URI: ' + results[i]);
                        this.selectedImages.push(results[i]);
                    }
                    //   this.reduceImages(results).then(() => {
                    //     console.log('all images cropped!!');
                    //   });
                }, (err) => { console.log(err) });
        }
    }

    // reduceImages(selected_pictures: any) : any{
    //     return selected_pictures.reduce((promise:any, item:any) => {
    //       return promise.then((result) => {
    //         return this.cropService.crop(item, {quality: 75})
    //                 .then(cropped_image => this.photos.push(cropped_image));
    //       });
    //     }, Promise.resolve());
    //   }

    openWithGallery(): Promise<any> {

        // if platform is cordova, then it will run on real devices and on browser

        console.log('cordova platform : ' + this.platform._platforms);
        if (this.permission.checkCameraPermissions()) {
            const options: CameraOptions = {
                // allowEdit: true,
                sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
                mediaType: this.camera.MediaType.ALLMEDIA,
                destinationType: this.camera.DestinationType.FILE_URI
            }

            // Get Image from ionic-native's built in camera plugin
            return this.camera.getPicture(options)
                .then((fileUri) => {
                    if (this.platform.is('ios')) {
                        this.selectedImages.push(fileUri);
                        // this.uploadPhoto(fileUri);
                        return fileUri;
                    } else if (this.platform.is('android')) {
                        // Modify fileUri format, may not always be necessary
                        fileUri = 'file://' + fileUri;
                        console.log('gallery .....' + fileUri);
                        this.selectedImages.push(fileUri);
                        // this.uploadPhoto(fileUri);
                        return fileUri;
                    }
                    else {
                        fileUri = 'data:image/jpeg;base64,' + fileUri;
                        this.selectedImages.push(fileUri);
                        // this.uploadPhoto(fileUri);
                        return fileUri;
                    }
                });

        }
    }

    // capture picture from camera
    openWithCamera(): Promise<any> {
        this.filesToUpload = null;
        if (this.permission.checkCameraPermissions()) {
            const options: CameraOptions = {
                // allowEdit: true,
                quality: 25,
                sourceType: this.camera.PictureSourceType.CAMERA,
                mediaType: this.camera.MediaType.ALLMEDIA,
                destinationType: this.camera.DestinationType.FILE_URI
            }

            // Get Image from ionic-native's built in camera plugin
            return this.camera.getPicture(options)
                .then((fileUri) => {
                    if (this.platform.is('ios')) {
                        this.selectedImages.push(fileUri);
                        // this.uploadPhoto(fileUri);
                        return fileUri;
                    } else if (this.platform.is('android')) {
                        // Modify fileUri format, may not always be necessary
                        fileUri = 'file://' + fileUri;
                        this.selectedImages.push(fileUri);
                        // this.uploadPhoto(fileUri);
                        return fileUri;
                    }
                    else {
                        fileUri = 'data:image/jpeg;base64,' + fileUri;
                        this.selectedImages.push(fileUri);
                        // this.uploadPhoto(fileUri);
                        return fileUri;
                    }
                });
            // .then((path) => {
            //   // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
            //   console.log('Cropped Image Path!: ' + path);

            //   return path;
            // })
        }
    }

    resize() {

        this.textArea = this.chatbox['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
        this.textArea.style.overflow = 'hidden';
        this.textArea.style.height = 'auto';
        this.textArea.style.height = this.textArea.scrollHeight + "px";


    }

    onChange(ev) {
        // console.log("Key + ev"+ ev);
        // console.log("input contains :" + this.post_text);
        if (this.reply !== '')
            this.send_color = '#00A0DF';
        else
            this.send_color = 'lightgray';
    }


    // hit Post Attachment Create API
    replyConversation() {

        console.log("reply text: " + this.reply);

        if (this.reply != null && this.reply != undefined && this.reply != "") {
            this.showLoadingController('Uploading the post');

            if (this.conv_code === 'oly') {
                let user = this.navParams.get('user');
                this.OtherlyAPI.OlyReplyCreate(user, this.reply).then((res: any) => {
                    let response: any = res;
                    console.log(" OLY Reply ", JSON.stringify(res));
                    if (response.id) {
                        this.self_postcode = response.id;
                        if (this.isCore) {
                            if (this.filesToUpload.length > 0) {
                                this.OtherlyAPI.createConversationAttachmentWithCore(response.id, this.filesToUpload)
                                    .then(res => {
                                        console.log('post attachment response : ' + JSON.stringify(res));
                                        response = res;
                                        if (response.id != undefined) {
                                            this.showPush("Post successfully created!");
                                        }
                                        else {
                                            this.showPush("An error occured while attachment of images!");
                                        }
                                        this.dismissLoadingController();
                                    });
                            }else{this.dismissLoadingController();}
                        } else {
                            if (this.selectedImages.length > 0) {
                                this.uploadFile(response.id, this.selectedImages);
                            }else{this.dismissLoadingController();}
                        }
                    }
                    else {
                        this.dismissLoadingController();
                        this.showPush("An error has happened, try again later.");
                    }

                });
            }
            else {
                // this.OtherlyAPI.ReplyConversation(this.reply, this.conv_code, null).then(data => {
                    this.OtherlyAPI.ReplyConversation(null).then(data => {
                    let response: any = data;
                    console.log(" ReplyConversation Reply ", JSON.stringify(data));
                    if (response.conversation) {
                        this.self_postcode = response.conversation;
                        if (this.isCore) {
                            if (this.filesToUpload.length > 0) {
                                this.OtherlyAPI.createConversationAttachmentWithCore(response.conversation, this.filesToUpload)
                                    .then(res => {
                                        console.log('post attachment response : ' + JSON.stringify(res));
                                        response = res;
                                        if (response.conversation != undefined) {
                                            this.showPush("Post successfully created!");
                                        }
                                        else {
                                            this.showPush("An error occured while attachment of images!");
                                        }
                                        this.dismissLoadingController();
                                    });
                            }else{this.dismissLoadingController();}
                        } else {
                            if (this.selectedImages.length > 0) {
                                this.uploadFile(response.conversation, this.selectedImages);
                            }else{this.dismissLoadingController();}
                        }
                    }
                    else {
                        this.dismissLoadingController();
                        this.showPush("An error has happened, try again later.");
                    }
                });
            }


            // this.OtherlyAPI.CreatePost(this.reply, '').then((res) => {
            //     let response: any = res;
            //     console.log("Post created ", JSON.stringify(res));
            //     if (response.code) {
            //         this.self_postcode = response.code;

            //         if (this.isCore) {
            //             this.OtherlyAPI.createPostAttachmentWithCore(response.code, this.filesToUpload,
            //                 null).then(res => {
            //                     console.log('post attachment response : ' + JSON.stringify(res));
            //                     response = res;
            //                     if (response.id != undefined) {
            //                         this.showPush("Post successfully created!");
            //                     }
            //                     else {
            //                         this.showPush("An error occured while attachment of images!");
            //                     }
            //                     this.dismissLoadingController();
            //                 });
            //         }
            //         else {

            //             this.uploadFile(response.code, this.selectedImages);

            //         }
            //     }
            //     //   this.showPush("Post successfully created!","post_created_ok");
            //     else {
            //         this.dismissLoadingController();
            //         this.showPush("An error has happened, try again later.");

            //     }

                this.send_color = 'lightgray';
                this.reply = "";
                this.textArea.style.height = "30px";

            // })

        }

    }

    cancelPost() {
        this.selectedImages = null;
        this.blobsToUpload = null;
        this.filesToUpload = null;
        this.formData = null;
        this.reply = null;
    }


    uploadFile(code: string, filePaths: Array<string>) {
        this.formData = new FormData();
        console.log('filePaths.length :' + filePaths.length);
        this.upload(filePaths).subscribe(data => {

            console.log('开始上传........');
            console.log('selectedImages.length : ' + this.selectedImages.length +
                '  this.blobsToUpload.length :  ' + this.blobsToUpload.length);

            if (filePaths.length == this.blobsToUpload.length) {
                let response;
                // this.OtherlyAPI.conversationAttachment(code, this.formData, this.blobsToUpload).then(res => {
                //     console.log('post attachment response : ' + JSON.stringify(res));
                //     response = res;
                //     if (response.id != undefined) {
                //         this.showPush("Post successfully created!");
                //     }
                //     else {
                //         this.showPush("An error occured while attachment of images!");
                //     }
                //     this.dismissLoadingController();
                // });

            }
        }, error => {
            console.log('文件处理失败 error ' + JSON.stringify(error));
        });
    }


    private upload(filePaths: Array<string>): Observable<any> {
        //每个文件上传任务创建一个信号
        var observables: Array<any> = [];
        filePaths.forEach((value: string, i, array) => {
            console.log('filePaths : ' + value);
            if (!value.startsWith('file://')) {
                value = 'file://' + value;
            }

            console.log('这里应该执行了吧.........');

            var observable = new Observable((sub: any) => {
                this.file.resolveLocalFilesystemUrl(value).then(entry => {
                    (<FileEntry>entry).file(file => {
                        // this.readFile(<Blob>file);
                        let blob: Blob = <Blob>file;
                        const reader = new FileReader();
                        reader.onloadend = () => {

                            const imgBlob = new Blob([reader.result], { type: blob.type });
                            this.blobsToUpload.push(new Blob([reader.result], { type: blob.type }))
                            this.formData.append('image', imgBlob, (<any>blob).name);
                            console.log('已经成功一半了.................' + + imgBlob);


                            sub.next(null);
                            sub.complete();
                        };
                        reader.readAsArrayBuffer(blob);
                    });
                })
                    .catch(error => console.log('error 报错了，日了狗----->' + JSON.stringify(error)));
            });

            observables.push(observable);
        });

        return ForkJoinObservable.create(observables);
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
}