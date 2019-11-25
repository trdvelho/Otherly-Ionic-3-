import { Injectable } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Camera } from '@ionic-native/camera';

@Injectable()
export class PermissionsService {

    constructor(
        public _platform: Platform,
        public _Diagnostic: Diagnostic,
        // public _photoLibrary: PhotoLibrary,
        public toastCtrl: ToastController
    ) {
    }

    isAndroid() {
        return this._platform.is('android')
    }

    isiOS() {
        return this._platform.is('ios');
    }

    isUndefined(type) {
        return typeof type === "undefined";
    }

    pluginsAreAvailable() {
        if (this._Diagnostic.isCameraPresent) {
            return true;
        }
        else { return false; }
        //    return this._Diagnostic.isCameraPresent;
        // return !this.isUndefined(window['plugins']);
    }

    checkIsCameraAvailable() {
        return Camera.installed();
    }

    // checkMediaAccessPermission(): Promise<boolean> {
    //     return new Promise(resolve => {

    //         this._photoLibrary.requestAuthorization({ read: true })
    //             .then(() => {
    //                 console.log('Media permission true');
    //                 resolve(true);
    //             })
    //             .catch((err) => {
    //                 console.log('Media permission false');
    //                 let toast = this.toastCtrl.create({
    //                     message: `requestAuthorization error: ${err}`,
    //                     duration: 6000,
    //                 });
    //                 toast.present();
    //                 resolve(false);
    //             });

    //     });
    // }
    checkCameraPermissions(): Promise<boolean> {
        return new Promise(resolve => {
            if (!this.pluginsAreAvailable()) {
                alert('Dev: Camera plugin unavailable.');
                resolve(false);
            }
            else if (this.isiOS()) {
                this._Diagnostic.getCameraAuthorizationStatus().then(status => {
                    if (status == this._Diagnostic.permissionStatus.GRANTED) {
                        resolve(true);
                    }
                    else if (status == this._Diagnostic.permissionStatus.DENIED) {
                        resolve(false);
                    }
                    else if (status == this._Diagnostic.permissionStatus.NOT_REQUESTED || status.toLowerCase() == 'not_determined') {
                        this._Diagnostic.requestCameraAuthorization().then(authorisation => {
                            resolve(authorisation == this._Diagnostic.permissionStatus.GRANTED);
                        });
                    }
                });
            }
            else if (this.isAndroid()) {
                this._Diagnostic.isCameraAuthorized().then(authorised => {
                    if (authorised) {
                        // alert('Dev: Camera plugin authorired.');
                        resolve(true);
                    }
                    else {
                        this._Diagnostic.requestCameraAuthorization().then(authorisation => {
                            // alert('Dev: Camera plugin requestCameraAuthorization.');
                            resolve(authorisation == this._Diagnostic.permissionStatus.GRANTED);
                        });
                    }
                });
            }
        });
    }

}