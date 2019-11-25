import { Component } from '@angular/core';

import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';
import { NavParams, ToastController, ViewController } from 'ionic-angular';


@Component({
  selector: 'more-popover',
  templateUrl: 'more-popover.html'
})
export class MoreButtonPostPopoverComponent {
  Post: any;
  Flag_color:string = 'black';
  Watch_color: string;
  favorite_color: string;
  constructor(	private NavCtrl: NavParams,
  				private ToastCtrl: ToastController,
  				private OtherlyAPI: OtherlyApiProvider,
  				private viewCtrl: ViewController) {
    console.log('Hello MoreButtonPostPopoverComponent Component');
    this.Post = this.NavCtrl.get('PostDetail');
    console.log("FLAG POPOVER POST " + JSON.stringify(this.Post));
    
  }


  FlagPost(){

    // let data = {
    //       flag: 'true'
    //     }

    //     this.showPush("Post flagged as offensive!",'post_created_ok');
    //     this.viewCtrl.dismiss(data);


    this.OtherlyAPI.FlagPost(this.Post.code,'').then(res=>{
      console.log("Flagged " + JSON.stringify(res));
      let response: any = res;
   

      if(response){
        if(response.id){
          let data = {
            flag: 'true'
          }

        this.showPush("Post flagged as offensive!",'post_created_ok');
        this.Post.style = '#00B0E6';
        this.Flag_color = this.Post.style;
        this.viewCtrl.dismiss(data);
        }    
      }
      else if (response == null){
        let data = {
          flag: 'true'
        }
        this.showPush("Post flagged as offensive!",'post_created_ok');
        this.Post.style = '#00B0E6';
        this.Flag_color = this.Post.style;
        this.viewCtrl.dismiss(data);
      }
      else {
        let data = {
          flag: 'false'
        }
        this.showPush("An error has happened, try again later!","post_created_error");
        //this.viewCtrl.dismiss(data);
      }


   
     });


  }

  showPush(message, back_g_color){
    let toast = this.ToastCtrl.create({
          message: message,
          duration: 5000,
          position: 'top',
          'cssClass': back_g_color
    });
    toast.present();

  }

}
