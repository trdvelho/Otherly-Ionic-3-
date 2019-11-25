import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, PopoverController, ActionSheetController, ViewController }
  from 'ionic-angular';
import { Content } from 'ionic-angular/index';

//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';

//Components
import { SharePopoverComponent } from '../../components/share-popover/share-popover';
import { MoreButtonPostPopoverComponent } from '../../components/more-popover/more-button-post-popover';

//PAGES
import { CreateConversationPage } from '../../pages/conversations/create-conversation';

import moment from 'moment';
import { TabsPage } from '../tabs/tabs';
// import { CreatePostPage } from './create-post';


/**
 * Generated class for the PostDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  // {segment: 'post-detail/:code'
  // segment: 'posts/:code'}
)
@Component({
  selector: 'page-post-detail',
  templateUrl: 'post-detail.html'
})
export class PostDetailPage {
  @ViewChild(Content) content: Content;
  @ViewChild('chatbox') chatbox: ElementRef;

  comment_color: string = "#00A0DF";
  send_color: string;
  textArea: any;

  user_commented: string = "no";
  UserData: any;
  PostInfos: any;
  PostDetails: any;
  postCode: string;

  post_reply: any;

  Details = [];



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public Lds: LocaldataProvider,
    public OtherlyAPI: OtherlyApiProvider,
    private ToastCtrl: ToastController,
    private PopOverCtrl: PopoverController,
    public actionSheetCtrl: ActionSheetController,
    public ViewCtrl: ViewController) {

    // console.log("PostInfos post_code!!!" + this.navParams.get('code'));
    // console.log("PostInfos post_code!!!" + this.navParams.get('Postdetails'));
    if (this.navParams.get('Postdetails') != undefined) {
      console.log("PostInfos inside postdetails!!!");
      this.PostInfos = this.navParams.get('Postdetails');
      this.postCode = this.PostInfos.code;
      // if (this.PostInfos.text.length > 120) { this.PostInfos.ellipsis = 3; }
      console.log("PostInfos !!!" + JSON.stringify(this.PostInfos));
    }
    else {
      this.postCode = this.navParams.get('code');
      console.log("PostInfos post_code!!!" + this.navParams.get('code'));
    }



    // this.PostInfos = this.navParams.get('Postdetails');
    // if (this.PostInfos.text.length > 120)
    //   this.PostInfos.ellipsis = 3;

    this.Lds.getUser().then(data => {
      this.UserData = data;
      console.log("USER POST DETAIL" + JSON.stringify(this.UserData));
    });

    this.OtherlyAPI.GetPostDetails('', this.postCode).then(data => {
      console.log("PostInfos post_code !!!" + JSON.stringify(this.postCode));
      this.PostDetails = data;
      console.log("PostInfos data !!!" + JSON.stringify(data));

      for (let item of this.PostDetails) {
        let item_date = moment(item.created);
        item.created = item_date.format("MMMM DD, YYYY");

        if (item.text.length > 120)
          item.ellipsis = 3;

        //console.log("Replied is", item.user_replied);
        if (item.user_replied)
          item.user_replied_color = '#00B0E6';
      }

      console.log("PostInfos !!!" + JSON.stringify(this.PostDetails));

      for (let item in this.PostDetails) {
        for (let reply in this.PostDetails[item].replies) {
          //this.Details.push(this.PostDetails[item].replies[reply]);

          if (this.PostDetails[item].replies[reply].user_voted == "up") {
            this.Details.push({
              Reply: this.PostDetails[item].replies[reply],
              vote_up: "#00A0DF",
              vote_down: "lightgray"
            });
          }
          else if (this.PostDetails[item].replies[reply].user_voted == "down") {
            this.Details.push({
              Reply: this.PostDetails[item].replies[reply],
              vote_up: "lightgray",
              vote_down: "#00A0DF"
            });
          }
          else {
            this.Details.push({
              Reply: this.PostDetails[item].replies[reply],
              vote_up: "lightgray",
              vote_down: "lightgray"
            });
          }

        }


        for (let item of this.Details) {
          let item_date = moment(item.Reply.created);
          item.Reply.created = item_date.format("MMMM DD, YYYY");
        }

        if (this.navParams.get('code') != undefined) {
          this.PostInfos = this.PostDetails[item];

          console.log("PostInfos after call !!!" + JSON.stringify(this.PostInfos));
          console.log("PostInfos post details length!!!" + JSON.stringify(this.PostDetails.length));
        }

      }

      this.Details.reverse();

    });

  }

  StartIntro(Post_user: any) {
    this.navCtrl.push(CreateConversationPage, { introductions: Post_user });
  }

  GoBack() {
    if (this.navCtrl.canGoBack()) {
      this.Lds.TempVariable = { commented: this.user_commented, post_code: this.PostInfos.code };
      this.navCtrl.pop();
    }
    else {
      this.navCtrl.setRoot(TabsPage);
    }

    //this.ViewCtrl.dismiss(this.user_commented);
  }

  Vote(vote, id) {
    console.log("VOTE ID ", id)
    this.OtherlyAPI.VotePost(id, vote, '').then((res) => {
      console.log("VOTED ", JSON.stringify(res));
      let response: any = res;

      Object.keys(this.Details).forEach((key) => {

        if (this.Details[key].Reply.id == id) {

          this.Details[key].Reply.vote_score = response.vote_score;

          if (response.vote == "up") {
            this.Details[key].vote_up = "#00A0DF";
            this.Details[key].vote_down = "lightgray";
          }
          else if (response.vote == "down") {
            this.Details[key].vote_up = "lightgray";
            this.Details[key].vote_down = "#00A0DF";
          }
          else {
            this.Details[key].vote_up = "lightgray";
            this.Details[key].vote_down = "lightgray";
          }
        }



      });
      if (response.vote == 'up') {

      }
    });
  }




  FlagPost(post) {

    let MorePopover = this.PopOverCtrl.create(MoreButtonPostPopoverComponent, { PostDetail: post });
    MorePopover.onDidDismiss(data => {
      let response = data;
      console.log("DISMISSED ", data);

      //if(response.flag == 'true'){

      this.ViewCtrl.dismiss(data);
      //}

    });
    MorePopover.present();

  }


  ReplyPost() {
//    console.log("post " + JSON.stringify(this.post_reply));
    if (this.post_reply !== "") {
      let toast = this.ToastCtrl.create({
        message: 'Post Replied Successfully',
        duration: 3000,
        position: 'top'
      });
      //console.log("post "+ JSON.stringify(Post_detail));

      this.OtherlyAPI.ReplyPost(this.post_reply, this.PostInfos.code, this.UserData.otherly_token).then(res => {
        console.log("Post reply PROMISE: " + JSON.stringify(res));
        let response: any = res;
        if (response[0].error_status) {
          console.log("Reply comment error " + response[0].error_status);
          this.showPush("An error has happened while replying to the post.. try again later", 'post_created_error');
        }
        if (response[0].id) {
          console.log("Reply success " + response[0].id);
          this.user_commented = "yes";
          let created = moment(response[0].created);
          let time_created = created.format("MMMM DD, YYYY");
          console.log("CREATED ", created);


          this.Details.unshift({
            Reply: {
              creator: { first_name: this.UserData.first_name, last_name: this.UserData.last_name, username: this.UserData.user_name, photo_url: "https://front-end-dev-bucket.s3.amazonaws.com/media/userphotos/38d9046d601045cf91a10ab558064836.jpg" },
              created: time_created,
              id: response[0].id,
              text: this.post_reply,
              vote_score: 1,
              rating: 0
            },
            vote_up: "#00A0DF",
            vote_down: "lightgray"

          });
          this.post_reply = '';
          this.textArea.style.height = "30px";
          this.send_color = "lightgray";
          this.showPush("Post successfully replied", 'post_created_ok');
        }
      });
    }
  }

  onChange(ev) {
    console.log("Key + ev" + ev);
    console.log("input contains :" + this.post_reply);
    if (this.post_reply !== '')
      this.send_color = '#00A0DF';
    else
      this.send_color = 'lightgray';

  }

  resize() {

    this.textArea = this.chatbox['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    console.log("Size : ", )
    this.textArea.style.overflow = 'hidden';
    //textArea.style.height = ;
    this.textArea.style.height = (this.textArea.scrollHeight - 5) + "px";


  }

  ReadMore(code) {
    console.log("Elipsis code : ", code);


    this.PostInfos.ellipsis == 3 ? this.PostInfos.ellipsis = null : this.PostInfos.ellipsis = 3;
    this.PostInfos.read_more_text == 'READ MORE' ? this.PostInfos.read_more_text = 'READ LESS' : this.PostInfos.read_more_text = 'READ MORE';


  }

  showPush(message, back_g_color) {
    let toast = this.ToastCtrl.create({
      message: message,
      duration: 5000,
      position: 'top',
      'cssClass': back_g_color
    });
    toast.present();

  }

  SharePrompt(Post_detail) {
    console.log("SHARE FUNTION : details " + JSON.stringify(Post_detail));
    let Popover = this.PopOverCtrl.create(SharePopoverComponent, { post_details: Post_detail });
    Popover.present();
  }

  // createPost(){
  //   this.navCtrl.push(CreatePostPage, {postCode: this.postCode});
  // }
  

  ionViewWillLoad() {

    console.log('Is Loading PostDetailPage ');//+ this.postCode
  }

}
