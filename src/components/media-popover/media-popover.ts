import { Component, ViewChild, ElementRef } from '@angular/core';
import { App, NavParams, NavController, ToastController, ViewController } from 'ionic-angular';

@Component({
    selector: 'media-popover',
    templateUrl: 'media-popover.html'
})

export class MediaPopoverComponent {
    @ViewChild('fileInput') fileInput: ElementRef
    isCore: boolean = false;

    constructor(private ViewCtrl: ViewController,
        private navParams: NavParams) {
        this.isCore = this.navParams.get('isCore');
    }

    OpenWith(open_with) {
        // if (open_with == 'friends') {
        this.ViewCtrl.dismiss(open_with);
        // }
    }
    cancelPopup() {
        this.ViewCtrl.dismiss();
    }

    ionViewCanLeave() {
        //this.ViewCtrl.dismiss();
    }

    OpenDesktopGallery(open_with: string) {
        // desktop-gallery
        this.fileInput.nativeElement.click();
    }

    processWebImage(event) {
        this.OpenWith(event);
    }
}