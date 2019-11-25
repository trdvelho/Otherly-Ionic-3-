import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { LoadingController, ToastController } from 'ionic-angular';

//PROVIDER
import { LocaldataProvider } from '../localdata/localdata';
import { Observable } from 'rxjs/Observable';


/*
  Generated class for the OtherlyApiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.

*/

/*
OTHERLY-API

- Server with all endpoints:
    http://front-end-dev.us-west-2.elasticbeanstalk.com/

-Backend Server Endpoint 
http://ec2-54-213-166-93.us-west-2.compute.amazonaws.com:8025/
- Endpoints Documentation:
    https://otherly.atlassian.net/wiki/spaces/OtherlyIonic/pages/49119238/Endpoints

*/

@Injectable()
export class OtherlyApiProvider {

  API_KEY = "6976052b12d14ab5fa0b4b479e1caff0";

  private _Proxy
  private Use_proxy = 1;
  private DB_host_URL;
  private Backend_URL;
  private URL: string;
  public Otherly_data;
  private UserData;
  private Otherly_access_token: string = "m3x6pLLAz3xiKmMAKNfVQVrYzh1t1g";


  constructor(public http: Http, public Lds: LocaldataProvider,
    private transfer: FileTransfer,
    public loadingController: LoadingController,
    private toastCtrl: ToastController) {

    // let mobiletoken:string = localStorage.getItem("otherly-token");
    // console.log(" Mobilelogin Token", mobiletoken);
    // if(mobiletoken){
    //   this.Otherly_access_token = mobiletoken;
    //   console.log("if mobile login Token ", this.Otherly_access_token)
    // }else{
    this.Otherly_access_token = 'm3x6pLLAz3xiKmMAKNfVQVrYzh1t1g';
    //  this.Lds.getUser().then(res=>{
    //    let results:any=res;
    //    this.Otherly_access_token = results.otherly_token;
    //    console.log(" getUSER LDS ", res);
    //  })

    console.log('Hello OtherlyApiProvider Provider');

    this.DB_host_URL = 'http://front-end-dev.us-west-2.elasticbeanstalk.com/api';
    this.Backend_URL = 'http://ec2-54-213-166-93.us-west-2.compute.amazonaws.com:8025/api';
    this._Proxy = '/api';

    if (this.Use_proxy == 0)
      this.URL = this._Proxy;
    else {
      this.URL = this.DB_host_URL;
      // this.URL = this.Backend_URL;
    }
  }


  setToken() {
    let mobiletoken: string = localStorage.getItem("otherly-token");
    console.log(" Mobilelogin Token", mobiletoken);
    if (mobiletoken) {
      this.Otherly_access_token = mobiletoken;
      console.log("if mobile login Token ", this.Otherly_access_token)
    } else {
      this.Otherly_access_token = 'm3x6pLLAz3xiKmMAKNfVQVrYzh1t1g';
      console.log("Default Manual Token  ", this.Otherly_access_token);
    }

  }
  // =========================================================//
  // ABOUT ME - ALL INFOS ABOUT LOGGED IN USER (USER PROFILE) //
  //========================================================= //
  AboutMe(username) {
    let post_url = '/' + username + '/about-me/';
    console.log(username);
    let token_string = 'token ' + this.Otherly_access_token;
    let URL = this.URL + post_url;
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);

    let options = new RequestOptions({ headers: header });

    return new Promise(resolve => {
      this.http.get(URL, options)
        .map(res => res.json())
        .subscribe(res => {
          

          resolve(res);
        }, err => {
          resolve(err);
        });

    });


  }

  EditAboutMe(username: string, target_field: any, content: any) {
    let body = {};
    if (target_field == "birthday_day" || target_field == "birthday_month" || target_field == "birthday_year" || target_field == "birthday_year" || target_field == "privacy_change") {
      let body = {
        ["" + target_field + ""]: content
      };
    }
    else {

    }

    let post_url = '/' + username + '/about-me/';
    console.log(username);
    let token_string = 'token ' + this.Otherly_access_token;
    let URL = this.URL + post_url;
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);

    let options = new RequestOptions({ headers: header });

    // return new Promise(resolve => {  
    //   this.http.get(URL,options)
    //       .map(res => res.json())
    //       .subscribe(res => {

    //         resolve(res);
    //       }, err => {
    //         resolve(err);  
    //       });
    //   });

  }


  // =======================//
  // BASIC USER INFORMATIONS //
  //======================== //
  UserInfos(username) {
    let post_url = '/' + username + '/';
    console.log(username);
    let token_string = 'token ' + this.Otherly_access_token;
    let URL = this.URL + post_url;
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);

    let options = new RequestOptions({ headers: header });

    return new Promise(resolve => {
      this.http.get(URL, options)
        .map(res => res.json())
        .subscribe(res => {

          resolve(res);
        }, err => {
          resolve(err);
        });
    });
  }


  // RECEIVE ALL COMMUNITIES FROM /api/communities/ ENDPOINT
  GetCommunities(access_token, get_options) {

    let post_url = '/communities/';

    let URL = this.URL + post_url;

    if (get_options.search_str !== undefined) {
      console.log('URL');
      URL = URL + '&search_str=' + get_options.search_str;
    }
    let token_string = 'token ' + this.Otherly_access_token;

    console.log('OTHERLY token string:' + token_string);
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    console.log
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.get(URL, options)
        .map(res => res.json())
        .subscribe(res => {
          var result = [];

          console.log("Otherly API ALL COM :" + JSON.stringify(res));
          for (let item in res.results) {
            result.push({
              code: res.results[item].code,
              title: res.results[item].title,
              slug: res.results[item].slug,
              photo_url: res.results[item].logo_image,
              total_helps: res.results[item].total_helps,
              style: ''

            });
          }

          resolve(result);
        }, err => {
          resolve(err);
        });

    });
  }

  // CREATES A NEW POST FROM /api/posts/ ENDPOINT
  CreatePost(post_text, accessToken: string) {


    let body = {
      subject: 'From Ionic',
      body: post_text
    };


    let token_string = 'token ' + this.Otherly_access_token;
    console.log("Create post token: " + accessToken);
    let post_url = '/posts/';
    // let post_url = '/posts/reply/';
    let URL = this.URL + post_url;
    

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, err => {
          resolve(err);
        });

    });

  }


  // PASSES A POST FROM /api/decline/ ENDPOINT
  PassPost(post_code, accessToken: string) {


    let body = {
      target_post: post_code
    };

    let token_string = 'token ' + this.Otherly_access_token;
    console.log("Create post token: " + accessToken);
    let post_url = '/posts/decline/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {

          resolve(res);
        }, err => {
          resolve(err);
        });

    });

  }


  // FOR VOTING A COMMENT ON A POST FROM /posts/reply-vote/ ENDPOINT
  VotePost(reply_code, vote_up_down, access_token) {

    let body = {
      reply: reply_code,
      vote: vote_up_down
    };

    let token_string = 'token ' + this.Otherly_access_token;
    console.log("body: " + JSON.stringify(body));
    let post_url = '/posts/reply-vote/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          let response = [];
          console.log("Vote OTHERLY ", JSON.stringify(res));

          resolve(res);
        }, err => {
          resolve(err);
        });

    });

  }

  // FOR FLAGGING A POST FROM /posts/flag/ ENDPOINT - Default : innapropriate
  FlagPost(post_code, accessToken: string) {


    let body = {
      target_post: post_code
    };

    let token_string = 'token ' + this.Otherly_access_token;
    console.log("body: " + JSON.stringify(body));
    let post_url = '/posts/flag/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {

          resolve(res);
        }, err => {
          resolve(err);
        });

    });

  }

  // FOR SHARING SOMEONE'S POST ON LOGGEDIN USER'S PAGE (EQUALS TO IF US) /posts/import/ ENDPOINT
  ImportPost(post_code, accessToken: string) {
    let body = {
      target_post: post_code
    };
    console.log("BODY " + JSON.stringify(body));
    let token_string = 'token ' + this.Otherly_access_token;
    console.log("Create post token: " + accessToken);
    let post_url = '/posts/import/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          let response = [];

          console.log("return ", JSON.stringify(res));
          resolve(res);
        }, err => {
          resolve(err);
        });

    });

  }
  // FOR RECEIVING COMPLETE INFORMATION ABOUT A SPECIFIC POST /api/posts/+post-code/ ENDPOINT
  GetPostDetails(access_code, code: string) {
    let post_url = '/posts/' + code + '/';

    let token_string = 'token ' + this.Otherly_access_token;
    let URL = this.URL + post_url;
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);

    let options = new RequestOptions({ headers: header });

    return new Promise(resolve => {
      this.http.get(URL, options)
        .map(res => res.json())
        .subscribe(res => {
          console.log('GetPostDetails data : ' + JSON.stringify(res));
          var result = [];
          result.push({
            code: res.code,
            creator: res.creator,
            replies: res.replies,
            subject: res.subject,
            title: res.title,
            text: res.text,// to display content of the post

          });
          resolve(result);
        }, err => {
          console.log('GetPostDetails error : ' + JSON.stringify(err));
          resolve(err);
        });

    });

  }


  // FOR CREATING A COMMNET FOR SPECIFIC POST /api/posts/reply/ ENDPOINT
  ReplyPost(post_text: string, target: string, accessToken: string) {

    let body = {
      target_post: target,
      text: post_text

    };
    console.log('ReplyPost target :' + target)

    let token_string = 'token ' + this.Otherly_access_token;
    let post_url = '/posts/reply/';
    let URL = this.URL + post_url;
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {

          let response = [];

          response.push({
            id: res.id,
            created: res.created,
            error_status: res.error_message
          });

          resolve(response);
        }, err => {
          resolve(err);
        });

    });

  }

  // FOR SHARING A POST /api/posts/share/ ENDPOINT
  SharePost(post_code: string, dictionary: string, share_with: string, accessToken: string) {

    let dic: string;
    dic = JSON.parse(JSON.stringify(dictionary));

    let body: any;
    if (share_with == 'friends' || share_with == 'me') {
      body = {
        target_post: post_code,
        user_dictionary: dictionary

      };
    }
    else {
      body = {
        target_post: post_code,
        community_dictionary: dic

      };
    }

    let token_string = 'token ' + this.Otherly_access_token;
    let post_url = '/posts/share/' //?target_post=' + post_code + '&community_dictionary=' + dictionary;


    console.log("sharing with ", body);


    let URL = this.URL + post_url;
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {

          // let response=[];
          console.log("return ", JSON.stringify(res));
          // for (let item in res){
          //   response.push({
          //   id: res[item].id,
          //   error_status: res[item].error_message
          //   });
          // } 
          // resolve(response);
          resolve(res);
        }, err => {
          let response = [];

          resolve(err);
        });

    });

  }

  // FOR SHARING A DEEPLINK NOTIFICATION /api/deep-notifications/ ENDPOINTS
  ShareDeeplinkNotification(notification_type: string, post_code: string,
    recipient_list: string, access_token: string) {

    console.log("sharing with ", recipient_list);
    let body: any;
    body = {
      notification_type: notification_type,
      object: post_code,
      recipient_list: recipient_list
    };

    let token_string = 'token ' + this.Otherly_access_token;
    let post_url = '/deep-notifications/' //?notification_type=' + notification_type + object=' + post_code + '&recipient_list=' + recipient_list;

    console.log("sharing with ", body);

    let URL = this.URL + post_url;
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {

          let response = [];
          console.log("return ", JSON.stringify(res));

          for (let item in res) {
            response.push({
              id: res[item].success,
              username: res[item].username,
              error_status: res[item].error_message
            });
          }

          resolve(response);
        }, err => {
          let response = [];

          resolve(err);
        });

    });

  }

  // FOR SHARING A POST /api/posts/share/ ENDPOINT
  // SharePost(post_code: string, dictionary: string, share_with: string, accessToken: string) {

  //   let dic: string;
  //   dic = JSON.parse(JSON.stringify(dictionary));

  //   let body: any;
  //   if (share_with == 'friends' || share_with == 'me') {
  //     body = {
  //       target_post: post_code,
  //       user_dictionary: dictionary

  //     };
  //   }
  //   else {
  //     body = {
  //       target_post: post_code,
  //       community_dictionary: dic

  //     };
  //   }

  //   let token_string = 'token ' + this.Otherly_access_token;
  //   let post_url = '/posts/share/' //?target_post=' + post_code + '&community_dictionary=' + dictionary;


  //   console.log("sharing with ", body);


  //   let URL = this.URL + post_url;
  //   let header = new Headers;
  //   header.append("Accept", 'application/json');
  //   header.append('Content-Type', 'application/json;charset=UTF-8');
  //   header.set('Authorization', token_string);
  //   let options = new RequestOptions({ headers: header, withCredentials: true });

  //   return new Promise(resolve => {
  //     this.http.post(URL, body, options)
  //       .map(res => res.json())
  //       .subscribe(res => {

  //         let response = [];
  //         console.log("return ", JSON.stringify(res));
  //         for (let item in res) {
  //           response.push({
  //             id: res[item].id,
  //             error_status: res[item].error_message
  //           });
  //         }

  //         resolve(response);
  //       }, err => {
  //         let response = [];

  //         resolve(err);
  //       });

  //   });

  // }


  // FOR CHANGING THE RATE OF A FRIEND /api/friends/modify/ ENDPOINT
  ChangeRating(username, rating, accessToken: string, ) {

    let body = {
      target_user: username,
      action: "rate",
      value: rating

    };
    let token_string = 'token ' + this.Otherly_access_token;
    console.log("Create post token: " + 'HQpMPyiczsVxauytM32Qom2TA2G2fI');
    let post_url = '/friends/modify/';//?target_user='+username+'&action=rate&value=' + rating;
    let URL = this.URL + post_url;// '?target_user='+username+'&action=rate&value=' + rating;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.put(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, err => {
          resolve(err);
        });

    });

  }


  // FOR RECEIVING THE LIST OF FRIENDS /api/friends/ ENDPOINT
  GetFriendsList(access_token, get_options) {

    let post_url = '/friends/';
    let URL = this.URL + post_url;

    if (get_options.search_str !== undefined) {
      console.log('URL');
      URL = URL + '&search_str=' + get_options.search_str;
    }
    let token_string = 'token ' + this.Otherly_access_token;

    console.log('OTHERLY token string:' + token_string);
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    console.log
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.get(URL, options)
        .map(res => res.json())
        .subscribe(res => {
          console.log(" FRIENDS  ?????", res);

          var result = [];


          for (let item in res.results) {

            if (res.results[item].full_name != "") {
              result.push({
                instance: {
                  username: res.results[item].related_user.username,
                  full_name: res.results[item].full_name,
                  status: res.results[item].related_user.status,
                  photo_url: res.results[item].related_user.photo_url,
                  rating: res.results[item].rating,
                  helps_given: res.results[item].related_user.helps_given,
                  thanks_sent: res.results[item].related_user.thanks_sent,
                  style: '',
                  source: 'O'
                }
              });

            }

            else {
              result.push({
                instance: {
                  username: res.results[item].related_user.username,
                  full_name: res.results[item].related_user.first_name + ' ' + res.results[item].related_user.last_name,
                  status: res.results[item].related_user.status,
                  photo_url: res.results[item].related_user.photo_url,
                  rating: res.results[item].rating,
                  helps_given: res.results[item].related_user.helps_given,
                  thanks_sent: res.results[item].related_user.thanks_sent,
                  style: '',
                  source: 'O'
                }
              });

            }

          }


          resolve(result);
        }, err => {
          resolve(err);
        });

    });

  }

  // RECEIVES OTHERLY TOKEN /api/login/ ENDPOINT - (Otherlu Token is used in all EndPoints if information to be received requires Logged in user information or needs authorization)
  GetOtherlyAccessToken(accessToken: string) {

    let post_url = '/login/';
    let URL = this.URL + post_url;

    let body = {
      fb_access_token: accessToken,
      client_id: 'O1nR1EQwIQfCi3UkxRGAQQxu5KTeJaPGZPseJcdc',
      client_secret: '3TIyuiO6tlBK64Regr1aoodebN89gzywya0aQabnQkzHEsWm4EmqCWrIKr6BCcpz63AViAThGH8nm6tV5ImRpai7CIb3wBOQg6REko7JyZ0DLQAmNFRVla6ZJTNdarFb'
    }

    let header = new Headers;
    header.append('Content-Type', 'application/json;charset=UTF-8');
    let options = new RequestOptions({ headers: header });

    console.log('GET OTHERLY TOKEN');
    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {

          this.Otherly_data = res;

          resolve(this.Otherly_data);
        }, err => {
          resolve(err);
        });

    });


  }


  // FOR RECEIVING FEED LIST /api/posts/feed/ ENDPOINT (target_user is needed if Logged in user wants his own posts)
  GetFeedList(access_token, get_options) {

    let post_url = '/posts/feed/';
    let URL = this.URL + post_url;

    if (get_options.search_str !== undefined) {
      console.log('URL');
      URL = URL + '?target_user=' + get_options.search_str;
    }

    let token_string = 'token ' + this.Otherly_access_token;
    let header = new Headers;
    // header.set("Access-Control-Allow-Origin", "*");
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
   
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.get(URL, options)
        .map(res => res.json())
        .subscribe(res => {
          var result = [];
          if (res.count > 0) {

            for (let item in res.results) {
              result.push({
                code: res.results[item].post.code,
                subject: res.results[item].post.subject,
                text: res.results[item].post.text,
                creator: {
                  username: res.results[item].post.creator.username,
                  full_name: res.results[item].post.creator.first_name + res.results[item].post.creator.last_name,
                  photo_url: res.results[item].post.creator.photo_url
                },
                created: res.results[item].post.created,
                thanks_count: res.results[item].post.thanks_count,
                reply_count: res.results[item].post.reply_count,
                user_replied: res.results[item].post.user_replied,
                user_thanked: res.results[item].post.user_thanked,
                user_replied_color: 'lightgray',
                user_thanked_color: 'lightgray',
                font_style: '',
                style: 'black',
                ellipsis: 0,
                read_more_text: 'READ MORE'
              });
            }
          }


          resolve(result);
        }, err => {
          resolve(err);
        });

    });

  }



  // FOR RECEIVING LIST OF CONVERSATIONS /api/conversations/ ENDPOINT
  GetConversations(access_token, get_options) {

    let token_string = 'token ' + this.Otherly_access_token;
    let post_url = '/conversations/';
    let URL = this.URL + post_url;
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);

    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.get(URL, options)
        .map(res => res.json())
        .subscribe(res => {
          var result = [];

          if (res.count > 0) {

            for (let item in res.results) {
              console.log(" Look at this    res.results[item]", res.results[item]);

              if (res.results[item].creator) {
                result.push({
                  post: {
                    code:
                      res.results[item].code,
                    username: res.results[item].creator.username,
                    first_name: res.results[item].creator.first_name,
                    last_name: res.results[item].creator.last_name,
                    photo_url: res.results[item].creator.photo_url,
                    helps_given: res.results[item].creator.helps_given,
                    thanks_sent: res.results[item].creator.thanks_sent,
                    conversation_created: res.results[item].created,
                    title: res.results[item].title,
                    participants: res.results[item].participants,
                    self: res.results[item].self_participant,
                    last_conversation: res.results[item].latest_reply ? res.results[item].latest_reply.text : null
                  }
                });
              }
            }
          }

          resolve(result);
        }, err => {
          resolve(err);
        });

    });

  }

  // ===================================================== //
  // =  RECEIVES ALL REPLIES FROM A SPECIFIC CONVERSATION =//   
  // ======================================================//

  GetConversationReplyList(code: string, next: string) {


    let token_string = 'token ' + this.Otherly_access_token;
    console.log(" GetConversationReplyList ??? ", code + token_string);
    let post_url;
    let URL;
    if (next == null) {
      post_url = '/conversations/' + code + '/replies/';
      URL = this.URL + post_url;
    } else {
      // post_url = '/conversations/' + code + '/replies/?page=2';
      // URL = this.URL + post_url;
      URL = next;
    }

    // console.log(" GetConversationReplyList ??? ", code + ' ::: ' + URL);

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);

    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.get(URL, options)
        .map(res => res.json())
        .subscribe(res => {

          let result = [];
          result.push(res);
          resolve(result);

        }, err => {
          resolve(err);
        });


    })

  }

  // ============================================= //
  // =  RECEIVES ALL DETAILS ABOUT A CONVERSATION =//   
  // ==============================================//

  GetConversationDetails(code: string) {
    let token_string = 'token ' + this.Otherly_access_token;
    let post_url = '/conversations/' + code + '/';
    let URL = this.URL + post_url;


    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);

    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.get(URL, options)
        .map(res => res.json())
        .subscribe(res => {

          console.log(" Details Promise ", res);
          var result = [];
          result.push({
            code: res.code,
            replies: res.replies,
            title: res.title,
            creator: res.creator,
            participant: res.participants,
            self: res.self_participant
          });
          resolve(result);
        }, err => {
          resolve(err);
        });


    });

  }

  // ========================================= //
  // =  CREATES A NEW REPLY IN A CONVERSATION =//   
  // ==========================================//
  // ReplyConversation(reply: string, code: string, filesToUpload: any []) {
    ReplyConversation(formData: FormData) {
    // console.log('filesToUpload files[0]' + JSON.stringify(filesToUpload));
    
    // const files: Array<any> = filesToUpload;
    let token_string = 'token ' + this.Otherly_access_token;
    // let body = {
    //   message: reply,
    //   conversation: code,
    //   image: files[0]
    // };

    
  //   const formData: any = new FormData();
  //   formData.append('message', reply);
  //   formData.append('conversation', code);

  //   if(filesToUpload != undefined && filesToUpload.length > 0){
  //   const files: Array<File> = filesToUpload;
  //   formData.append('image', files[0], files[0].name);
  //   console.log('filesToUpload files[0]' +files.length +  JSON.stringify(files[0]));
  // }
    // formData.append('image', 'file:///storage/emulated/0/1523378098612.jpg');//files[0]

    console.log(" Body " + JSON.stringify(formData));
    let post_url = '/conversations/replies/';
    let URL = this.URL + post_url;

console.log('ReplyConversation URL ' + URL);
    let header = new Headers;
    // header.append("Accept", 'application/json');
    // header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);

    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, formData, options)
        .map(res => res.json())
        .subscribe(res => {
          console.log(" reply conversation Data "+ JSON.stringify(res));
          resolve(res.reply);
        }, err => {
          console.log(" reply conversation error Data " +JSON.stringify(err));
          resolve(err);
        });

    });
  }


  // ================================== //
  // =  CREATES A NEW CONVERSATION =//   
  // ===================================//

  CreateConversation(usersSelected, subject) {

    let users: string;
    let item_left: number;
    item_left = usersSelected.length;
    users = "{"
    for (let info of usersSelected) {

      users += '"' + info + '": true';
      item_left = item_left - 1;
      if (item_left != 0) {
        users += ",";
      }

    }
    users += "}";

    let body = {
      user_dictionary: users,
      subject: subject
    };

    let post_url = '/conversations/';
    let URL = this.URL + post_url;
    let token_string = 'token ' + this.Otherly_access_token;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);

    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          let results = [];
          results.push(res);

          console.log(" Reply!!!!", results);
          resolve(results);
        }, err => {
          resolve(err);
        });
    });

  }

  // ======================================== //
  // =  ADD PARTICIPANT(S) TO A CONVERSATION =//   
  // ========================================//
  AddParticipant(usersSelected, code) {

    let users: string;
    let item_left: number;
    item_left = usersSelected.length;
    users = "{"
    for (let info of usersSelected) {

      users += '"' + info + '": true';
      item_left = item_left - 1;
      if (item_left != 0) {
        users += ",";
      }

    }
    users += "}";

    console.log(" Users ... !!!! ", users);

    let body = {
      action: "participants",
      user_dictionary: users
    };

    let post_url = '/conversations/' + code + '/';
    let URL = this.URL + post_url;
    let token_string = 'token ' + this.Otherly_access_token;
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);

    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.put(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          console.log(" conversation AddParticipant  return ", res);

          let result = []
          // result.push({
          //   code: res.code,
          //   creator:res.creator,
          //   replies:res.replies,
          //   participant:res.participants,
          //   url:res.url,
          //   title:res.title,
          //   created:res.created
          // }); 
          result.push(res);

          console.log(" Reply!!!!", JSON.stringify(res));
          resolve(result);
        }, err => {
          resolve(err);
        });
    });

  }

  // ================================== //
  // =  LEAVE A CONVERSATION      =//   
  // ===================================//
  LeaveConversation(code: string, user: string) {

    let body = {
      action: 'remove',
      username: user,
      conversation: code
    }
    let token_string = 'token ' + this.Otherly_access_token;
    let post_url = '/conversations/participants/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.put(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {

          console.log(" Removed Participant  !!!!!", res);
          resolve(res);
        }, err => {
          resolve(err);
        })
    });
  }

  // ================================== //
  // =  RECEIVES ALL PARTICIPANTS LIST =//   
  // ===================================//

  RemoveFromConversation(code: string, user: string) {

    let body = {
      action: 'kick',
      username: user,
      conversation: code
    }
    let token_string = 'token ' + this.Otherly_access_token;
    let post_url = '/conversations/participants/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.put(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          let results = [];
          results.push(res);

          resolve(results);
        }, err => {
          resolve(err);
        })
    });


  }

  // ================================== //
  // =  EDITING CONVERSATION TITLE =//   
  // ===================================//

  EditConversationTitle(code: string, title: string) {

    let body = {
      action: 'title',
      title: title
    }
    let token_string = 'token ' + this.Otherly_access_token;
    let post_url = '/conversations/' + code + '/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });



    return new Promise(resolve => {
      this.http.put(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {

          console.log(" Edited and Updated the Title !!!!!", res);
          resolve(res);
        }, err => {
          resolve(err);
        })
    });


  }


  // ================================== //
  // =  RECEIVES ALL PARTICIPANTS LIST =//   
  // ===================================//

  ConversationParticipantList(code: string) {

    let token_string = 'token ' + this.Otherly_access_token;
    let post_url = '/conversations/' + code + '/participants/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });



    return new Promise(resolve => {
      this.http.get(URL, options)
        .map(res => res.json())
        .subscribe(res => {

          console.log(" Get PArticipants List !!!!!", res);
          resolve(res);
        }, err => {
          resolve(err);
        })
    });


  }

  // *****************************//
  // ** OLY Support conversation Detail //
  //***********************************/



  OlyConversationDetails(user: string, next: string) {

    let token_string = 'token ' + this.Otherly_access_token;

    let post_url;
    let URL;
    if (next == null) {
      post_url = '/' + user + '/support/';
      URL = this.URL + post_url;
    } else {
      // post_url = '/' + user + '/support/?page=2';
      // URL = this.URL + post_url;
      URL = next;
    }
    console.log(" OlyConversationDetails ??? " + user + ' ::: ' + URL);


    // let post_url = '/' + user + '/support/';
    // let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });



    return new Promise(resolve => {
      this.http.get(URL, options)
        .map(res => res.json())
        .subscribe(res => {

          let result = [];
          result.push(res);
          resolve(result);

          // console.log(" OLY !!!!!", res);

        }, err => {
          resolve(err);
        })
    });

  }
  OlyReplyCreate(user: string, text: string) {

    let body = {
      text: text
    };


    console.log(" Body ", body);
    let token_string = 'token ' + this.Otherly_access_token;
    // console.log("Create post token: " + accessToken);
    let post_url = '/' + user + '/support/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          console.log(" OLY reply Data ", res);
          resolve(res);
        }, err => {

          resolve(err);
        });

    });




  }

  NotificationToggle(code: string, user: string) {

    let body = {
      action: 'notifications',
      username: user,
      conversation: code
    }
    let token_string = 'token ' + this.Otherly_access_token;
    let post_url = '/conversations/participants/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });



    return new Promise(resolve => {
      this.http.put(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {

          resolve(res.notifications);
        }, err => {
          resolve(err);
        })
    });
  }




  //  Mobile Registration 
  //  ====================

  RegisterMobile(mobile) {
    console.log(" Otherly Mobile Info", mobile);

    let firstname = mobile.first_name,
      lastname = mobile.last_name,
      phone = parseInt(mobile.phone);
    console.log(" FirstNAme ", firstname, " Last NAme ", lastname);


    let body = {
      first_name: mobile.first_name,
      last_name: mobile.last_name,
      country_phone_code: mobile.country,
      phone_number: mobile.phone,
      password1: mobile.password,
      password2: mobile.verify_password,
    };


    console.log(" Body ", body);
    let token_string = 'token ' + this.Otherly_access_token;
    // console.log("Create post token: " + accessToken);
    let post_url = '/register/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          let result = [];
          result.push(res);
          resolve(res);
        }, err => {

          resolve(err);
        });

    });

  }
  // ====================== //
  // =  Verify Mobile Code =//   
  // =======================//

  VerifyMobile(mobile) {


    let body = {
      username: mobile.username,
      verify_code: mobile.verify_code,
      client_id: 'spk0y3nOlL7582EdiEUpO7nYu2ku4jQMukk2Blh3',
      client_secret: 'wjZAv6lsoaExI6E4MrYiMlrM0zkDV5Zqj3xzGTQcZpOczzMIBMhbz1MDUZNoFSrQCySvPUPXYtLr2nJ6yBuoHVz79ff9vxNJWjXfqPolnX3QqTz4kvlxGezTXijJWYjU',
    };


    console.log(" Body ", body);
    let token_string = 'token ' + this.Otherly_access_token;
    // console.log("Create post token: " + accessToken);
    let post_url = '/verify-phone/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          let result = [];
          result.push(result);
          resolve(res);
        }, err => {
          resolve(err);
        });

    });

  }
  mobileSignUp(mobile: any) {
    console.log(" Mobile login  ... ", mobile);

    let body = {
      phone_number: mobile.user,
      password: mobile.password,
      phone_country_code: 1,
      client_id: 'spk0y3nOlL7582EdiEUpO7nYu2ku4jQMukk2Blh3',
      client_secret: 'wjZAv6lsoaExI6E4MrYiMlrM0zkDV5Zqj3xzGTQcZpOczzMIBMhbz1MDUZNoFSrQCySvPUPXYtLr2nJ6yBuoHVz79ff9vxNJWjXfqPolnX3QqTz4kvlxGezTXijJWYjU',
    };


    console.log(" Body ", body);
    let token_string = 'token ' + this.Otherly_access_token;
    // console.log("Create post token: " + accessToken);
    let post_url = '/login/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          let result = [];
          result.push(result);
          resolve(res);
        }, err => {
          resolve(err);
        });

    });

  }


  resendCode(username: any) {
    console.log(" username ersend Cdoe", username);

    let body = {
      username: username
    };
    let token_string = 'token ' + this.Otherly_access_token;

    let post_url = '/resend-verify-code/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, err => {
          resolve(err);

        });

    });

  }

  forgotPassword(mobile: any) {
    console.log(" Mobile login  ... ", mobile);

    let body = {
      country_code: mobile.country,
      phone_number: mobile.phone
    };


    console.log(" Body ", body);
    let token_string = 'token ' + this.Otherly_access_token;
    // console.log("Create post token: " + accessToken);
    let post_url = '/reset-password/';
    let URL = this.URL + post_url;
    console.log(" URL ", URL);
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {

          resolve(res);
        }, err => {
          resolve(err);
        });

    });

  }

  verifyPassword(mobile: any, username: any) {

    let body = {
      username: username,
      password1: mobile.password1,
      password2: mobile.password2,
      verify_phone_code: mobile.verify_phone_code
    };
    let token_string = 'token ' + this.Otherly_access_token;

    let post_url = '/reset-password/';
    let URL = this.URL + post_url;

    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.put(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, err => {
          resolve(err);
        });

    });

  }

  
  postAttachment(code: string, imageData) {
    // postAttachment(code: string, formData: FormData, imageUriToUpload: Array<Blob>) {
    // let post_url = '/posts/' + '997LaZ3pmTChKKza8Sh4KH' + '/attachments/';
    let post_url = '/posts/' + code + '/attachments/';
    let URL = this.URL + post_url;
    let token_string = 'token ' + this.Otherly_access_token;
    let headers = new Headers()
    headers.set('Authorization', token_string);

    let options: FileUploadOptions = {
      fileKey: 'image',
      fileName: 'name.jpg',
      chunkedMode: false,
      // mimeType: "multipart/form-data",
      mimeType: "image/jpeg",
      headers: headers
    }

    // console.log('upload image: options : ' + JSON.stringify(options));
    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    return new Promise(resolve => {
      fileTransfer.upload(imageData, URL, options)
        .then(data => {
          console.log('upload image: Image succesful uploaded.' + JSON.stringify(data));

          resolve(data);
          // this.UserData.photo_url = data;
        }, err => {
          console.log('upload image: Error while uploading file.' + JSON.stringify(err));
          resolve(err);
        });
    });

    // return new Promise(resolve => {
    //   this.http.post(URL, formData, options)
    //     .map(res => res.json())
    //     .subscribe(res => {
    //       console.log('upload image: Image succesful uploaded.' + JSON.stringify(res));
    //       resolve(res);
    //     }, err => {
    //       console.log('upload image: error.' + JSON.stringify(err));
    //       resolve(err);
    //     });
    // });
  }

  /******
   * Conversation Attachment Create API
   * /api/conversations/<code of target conversation>/attachments/
   */

  createConversationAttachmentWithCore(id: string, filesToUpload) {
    let post_url = '/conversations/' + id + '/attachments/';
    let URL = this.URL + post_url;
    let token_string = 'token ' + this.Otherly_access_token;
    console.log('upload image: url : ' + URL);
    const formData: any = new FormData();

    if (filesToUpload != null && filesToUpload.length > 0) {
      const files: Array<File> = filesToUpload;
      console.log(files);
      if (files.length == 1) {
        formData.append('image', files[0], files[0].name);
      }
      else {
        formData.append('image_array', files, 'multiple_attachments');
      }
      let headers = new Headers()
      headers.set('Authorization', token_string);

      let options = new RequestOptions({ headers: headers });
      console.log('form data variable :   ' + formData.toString());

      return new Promise(resolve => {
        this.http.post(URL, formData, options)
          .map(res => res.json())
          .subscribe(res => {
            console.log('upload image: Image succesful uploaded.' + JSON.stringify(res));
            resolve(res);
          }, err => {
            console.log('upload image: error.' + JSON.stringify(err));
            resolve(err);
          });
      });
    }
  }

  conversationAttachment(id: string, imageData) {
    // conversationAttachment(id: string, formData: FormData, imageUriToUpload: Array<Blob>) {
    // let post_url = '/posts/' + '997LaZ3pmTChKKza8Sh4KH' + '/attachments/';
    let post_url = '/conversations/' + id + '/attachments/';
    let URL = this.URL + post_url;
    let token_string = 'token ' + this.Otherly_access_token;
    let headers = new Headers()
    headers.set('Authorization', token_string);

    let options: FileUploadOptions = {
      fileKey: 'image',
      fileName: 'name.jpg',
      chunkedMode: false,
      // mimeType: "multipart/form-data",
      mimeType: "image/jpeg",
      headers: headers
    }

    // console.log('upload image: options : ' + JSON.stringify(options));
    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    return new Promise(resolve => {
      fileTransfer.upload(imageData, URL, options)
        .then(data => {
          console.log('upload image: Image succesful uploaded.' + JSON.stringify(data));

          resolve(data);
          // this.UserData.photo_url = data;
        }, err => {
          console.log('upload image: Error while uploading file.' + JSON.stringify(err));
          resolve(err);
        });
    });
    
    // return new Promise(resolve => {
    //   this.http.post(URL, formData, options)
    //     .map(res => res.json())
    //     .subscribe(res => {
    //       console.log('upload image: Image succesful uploaded.' + JSON.stringify(res));
    //       resolve(res);
    //     }, err => {
    //       console.log('upload image: error.' + JSON.stringify(err));
    //       resolve(err);
    //     });
    // });
  }

  /****
   * Post Attachment Create API
   * /api/posts/<code of target post>/attachments/
   */

  createPostAttachmentWithCore(code: string, filesToUpload, imageUriToUpload: Array<Blob>) {
    let post_url = '/posts/' + code + '/attachments/';
    // let post_url = '/posts/' + 'wRTmqSBUven3hAnigMGuKK' + '/attachments/';
    let URL = this.URL + post_url;
    let token_string = 'token ' + this.Otherly_access_token;
    console.log('upload image: url : ' + URL);

    console.log('filesToUpload:' + filesToUpload + 'imageUriToUpload: ' + imageUriToUpload)
    const formData: any = new FormData();

    if (filesToUpload != null && filesToUpload.length > 0) {
      const files: Array<File> = filesToUpload;
      console.log(files);
      if (files.length == 1) {
        formData.append('image', files[0], files[0].name);
      }
      else {
        // for (let i = 0; i < files.length; i++) {
        // formData.append("uploads[]", files[i], files[i]['name']);
        formData.append('image_array', files, 'multiple_attachments');
        // }
      }
    }
    if (imageUriToUpload != null && imageUriToUpload.length > 0) {
      const blobs: Array<Blob> = imageUriToUpload;
      if (blobs.length == 1) {
        formData.append('image', blobs[0], 'single_attachment')
      }
      else {
        formData.append('image_array', blobs, 'multiple_attachments')
      }
    }

    let headers = new Headers()
    headers.set('Authorization', token_string);

    let options = new RequestOptions({ headers: headers });
    console.log('form data variable :   ' + formData.toString());

    return new Promise(resolve => {
      this.http.post(URL, formData, options)
        .map(res => res.json())
        .subscribe(res => {
          console.log('upload image: Image succesful uploaded.' + JSON.stringify(res));
          resolve(res);
        }, err => {
          console.log('upload image: error.' + JSON.stringify(err));
          resolve(err);
        });
    });
  }

  createAttachments(code, imageData) {
    // console.log('upload image: imageData : ' + imageData);
    let post_url = '/posts/' + code + '/attachments/';
    let URL = this.URL + post_url;
    let token_string = 'token ' + this.Otherly_access_token;
    console.log('upload image: url : ' + URL);

    let header = new Headers;
    // header.append("Accept", 'application/json');
    // header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);

    let options: FileUploadOptions = {
      fileKey: 'image',
      fileName: 'name.jpg',
      chunkedMode: false,
      // mimeType: "multipart/form-data",
      mimeType: "image/jpeg",
      headers: header
    }

    // console.log('upload image: options : ' + JSON.stringify(options));
    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    return new Promise(resolve => {
      fileTransfer.upload(imageData, URL, options)
        .then(data => {
          console.log('upload image: Image succesful uploaded.' + JSON.stringify(data));
          resolve(data);
        }, err => {
          console.log('upload image: Error while uploading file.' + JSON.stringify(err));
          resolve(err);
        });
    });
  }

  uploadImageWithoutCordova(imageData, event) {
    let post_url = '/settings/profile-picture/';
    let URL = this.URL + post_url;
    let token_string = 'token ' + this.Otherly_access_token;
    console.log('upload image: url : ' + URL);

    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      console.log('file data : ' + file.name);
      let formData: FormData = new FormData();
      formData.append('image', file, file.name);
      let headers = new Headers()
      headers.set('Authorization', token_string);
      //headers.append('Content-Type', 'json');  
      //headers.append('Accept', 'application/json');  
      let options = new RequestOptions({ headers: headers });
      // let apiUrl1 = "http://front-end-dev.us-west-2.elasticbeanstalk.com/api/settings/profile-picture/";


      return new Promise(resolve => {
        this.http.post(URL, formData, options)
          .map(res => res.json())
          .subscribe(res => {
            console.log('upload image: Image succesful uploaded.' + JSON.stringify(res));
            resolve(res);
          }, err => {
            console.log('upload image: error.' + JSON.stringify(err));
            resolve(err);
          });
      });
    }

  }

  uploadImage(imageData) {
    // console.log('upload image: imageData : ' + imageData);
    let post_url = '/settings/profile-picture/';
    let URL = this.URL + post_url;
    let token_string = 'token ' + this.Otherly_access_token;
    console.log('upload image: url : ' + URL);

    let header = new Headers;
    // header.append("Accept", 'application/json');
    // header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);

    let options: FileUploadOptions = {
      fileKey: 'image',
      fileName: 'name.jpg',
      chunkedMode: false,
      // mimeType: "multipart/form-data",
      mimeType: "image/jpeg",
      headers: header
    }

    // console.log('upload image: options : ' + JSON.stringify(options));
    const fileTransfer: FileTransferObject = this.transfer.create();

    // Use the FileTransfer to upload the image
    return new Promise(resolve => {
      fileTransfer.upload(imageData, URL, options)
        .then(data => {
          // console.log('upload image: Image succesful uploaded.' + JSON.stringify(data));

          resolve(data);
          // this.UserData.photo_url = data;
        }, err => {
          // console.log('upload image: Error while uploading file.' + JSON.stringify(err));
          resolve(err);
        });
    });



    // fileTransfer.upload(imageData, URL, options).then(data => {
    //   console.log('upload image: Image succesful uploaded.' + JSON.stringify(data));
    //   // this.UserData.photo_url = data;
    //   loading.dismissAll()
    //   this.presentToast('Image uploaded succesfully.');
    // }, err => {
    //   loading.dismissAll()
    //   console.log('upload image: Error while uploading file.' + JSON.stringify(err));
    // });
  }

  removeImage() {
    console.log(" removeImage  ... ");

    let body = {
      image: ''
    };


    console.log(" Body ", body);
    let token_string = 'token ' + this.Otherly_access_token;
    // console.log("Create post token: " + accessToken);
    let post_url = '/settings/profile-picture/';
    let URL = this.URL + post_url;
    console.log(" URL ", URL);
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.append('Content-Type', 'application/json;charset=UTF-8');
    header.set('Authorization', token_string);
    let options = new RequestOptions({ headers: header, withCredentials: true });

    return new Promise(resolve => {
      this.http.post(URL, body, options)
        .map(res => res.json())
        .subscribe(res => {
          console.log("Remove image response: " + JSON.stringify(res));
          resolve(res);
        }, err => {
          console.log("Remove image error: " + JSON.stringify(err));
          resolve(err);
        });

    });
  }

  presentToast(msg) {
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








}
