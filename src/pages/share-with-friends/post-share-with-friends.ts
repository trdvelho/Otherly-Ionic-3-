import { Component, ViewChild, ElementRef, } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Content } from 'ionic-angular/index';

//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';


/**
 * Generated class for the CreateConversationNewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-post-share-with-friends',
  templateUrl: 'post-share-with-friends.html',
})
export class PostShareWithFriendsPage {
  @ViewChild(Content) content: Content;
  @ViewChild('chatbox') chatbox: ElementRef;

  ShareMessage = 'Hi, I think you may find this interesting.';
  share_count = 0;
  usersSelected = [];
  Communities: any;

  users: string;
  Post: any;

  action: string;

  constructor(private OtherlyAPI: OtherlyApiProvider,
    private Lds: LocaldataProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ToastCtrl: ToastController,
    public ViewCtrl: ViewController) {


    this.Post = this.navParams.get('post');
    this.action = this.navParams.get('action');

    //console.log("POST SHARE LAST PAGE " + this.Post.code);

    if (this.action == 'friends') {
      this.usersSelected = this.navParams.get('users');
      this.share_count = this.usersSelected.length;
      console.log("POST USERS " + JSON.stringify(this.usersSelected));
    }
    if (this.action == 'communities') {
      this.Communities = this.navParams.get('communities');
      console.log("Communities " + JSON.stringify(this.Communities));
    }


  }

  resize() {

    let textArea = this.chatbox['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + "px";


  }

  GoBack() {
    this.navCtrl.pop();
  }

  SharePost() {

    let users: string;
    let communities: string;
    let item_left: number;



    if (this.action == 'friends') {
      item_left = this.usersSelected.length;
      users = "{";
      for (let info of this.usersSelected) {

        users += '"' + info.username + '": true';
        item_left = item_left - 1;
        if (item_left != 0) {
          users += ",";
        }

      }
      users += "}";

      this.OtherlyAPI.SharePost(this.Post.code, users, 'friends', '').then((res) => {
        let data: any = res;
        console.log("Shared post" + JSON.stringify(res) + '  length is : ' + data.recipient_list.length);

        if (data.recipient_list.length > 0) {
          this.ShareDeeplinkNotification(res);
        }

      });
    }

    if (this.action == 'communities') {
      item_left = this.Communities.length;
      communities = "{";
      for (let info of this.Communities) {

        communities += '"' + info.code + '": true';
        item_left = item_left - 1;
        if (item_left != 0) {
          communities += ",";
        }

      }
      communities += "}";

      this.OtherlyAPI.SharePost(this.Post.code, communities, 'communities', '').then((res) => {
        let data: any = res;

        let message_ok, message_error: string = '';
        message_ok = 'Successfully shared with';
        message_error = 'Already shared this post with';


        if (data.recipient_list == null) {
          if (data.shared_posts.length > 0) {
            for (let item in data.shared_posts) {
              if (data.shared_posts[item].error_status == 403) {
                message_error += ', ' + this.Communities[item].title;
                console.log("Error: already shared with ", this.Communities[item].title);
              }
            }
          }
        }



        //  for(let item in data){
        //    if(data[item].id){
        //      message_ok += ', '+ this.Communities[item].title;

        //      console.log("Post Shared with ", this.Communities[item].title);
        //    }
        //    if(data[item].error_status){
        //      message_error += ', '+ this.Communities[item].title;
        //       console.log("Error: already shared with ", this.Communities[item].title);
        //    }

        //  }

        if (message_ok !== 'Successfully shared with') {
          this.showNotification(message_ok, 'shared_ok', 'top');
        }

        if (message_error !== 'Already shared this post with') {
          this.showNotification(message_error, 'shared_error', 'bottom');
        }

        let result = {
          shared: 'yes'
        }
        this.navCtrl.popToRoot();

      });
    }

  }

  ShareDeeplinkNotification(res) {
    let usersList = [];
    let users: string;
    let item_left: number;

    console.log('Notification recipient list from server :' + JSON.stringify(res.recipient_list));

    for (let info of res.recipient_list) {
      usersList.push({
        username: info.username,
        hyperlink: this.Lds.deeplinkUrl + 'posts/' + this.Post.code,
        shared_post_id: info.shared_post_id
      });
    }
    console.log('Notification recipient list :' + JSON.stringify(usersList));
    this.OtherlyAPI.ShareDeeplinkNotification('post-shared', this.Post.code, JSON.stringify(usersList), '').then((res) => {
      console.log("Deeplink Shared post" + JSON.stringify(res));

      let data: any = res;
      let message_ok, message_error: string = '';
      message_ok = 'Successfully shared with';
      message_error = 'Already shared this post with';

      for (let item in data) {
        if (data[item].id) {
          message_ok += ', ' + data[item].username;
          //this.usersSelected[item].full_name;

          console.log("Post Shared with ", data[item].username);
        }
        if (data[item].error_status) {
          message_error += ', ' + data[item].username;
          console.log("Error: already shared with ", data[item].username);
        }

      }

      if (message_ok !== 'Successfully shared with') {
        this.showNotification(message_ok, 'shared_ok', 'top');
      }

      if (message_error !== 'Already shared this post with') {
        this.showNotification(message_error, 'shared_error', 'bottom');
      }

      let result = {
        shared: 'yes'
      }
      this.navCtrl.popToRoot();
    });

  }

  displayShareResult() {

  }
  showNotification(message, back_g_color, position) {
    console.log(position);
    let toast = this.ToastCtrl.create({
      message: message,
      duration: 7000,
      position: position,
      'cssClass': back_g_color
    });
    toast.present();

  }


  AddFriends() {
    this.navCtrl.pop();
  }


}
