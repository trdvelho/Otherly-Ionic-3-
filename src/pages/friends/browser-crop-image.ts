import { Component } from '@angular/core';
import { File, Entry, FileEntry } from '@ionic-native/file';

@Component({
    selector: 'page-crop-image',
    templateUrl: 'browser-crop-image.html',

})

export class CropImagePage {
    constructor(private readonly file: File){}
    imageChangedEvent: any = '';
    croppedImage: any = '';
    cropperReady = false;

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(image: string) {
        this.croppedImage = image;
    }
    imageLoaded() {
        this.cropperReady = true;
    }
    imageLoadFailed() {
        console.log('Load failed');
    }
    setSelectedImage(image: string) {
        console.log('image data ' + image);
        this.convertBase64ToBlob(image);
    }

    convertBase64ToBlob(imageData:string){
        this.file.resolveLocalFilesystemUrl(imageData).then(entry => {
            (<FileEntry>entry).file(file => {
              let blob: Blob = <Blob>file;
              const reader = new FileReader();
              reader.onloadend = () => {
                const imgBlob = new Blob([reader.result], { type: blob.type });
                // this.blobsToUpload.push(new Blob([reader.result], { type: blob.type }))
                
                console.log('filePaths ' + (<any>blob).name);
               
              };
              reader.onerror = (error: any) => {
                console.log('reader.onerror' + JSON.stringify(error));
              };
              reader.readAsArrayBuffer(blob);
            }, (error) => {
              alert('File Entry Error: ' + JSON.stringify(error));
            })
          }, (error) => {
            alert('Error resolving file:  ' + JSON.stringify(error));
          })
    }
}