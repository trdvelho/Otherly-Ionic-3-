import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, App, Platform , PopoverController, ViewController, ModalController} from 'ionic-angular';

// Modules
import {IonTagsInputModule} from "ionic-tags-input";

//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';

//NATIVE FEATURES
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts } from '@ionic-native/contacts';

//PAGES
import { PostShareWithFriendsPage } from '../../pages/share-with-friends/post-share-with-friends';


/**
 * Generated class for the CreateConversationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-share-with-friends',
  templateUrl: 'share-with-friends.html',
  providers:[Contacts]
})
export class ShareWithFriendsPage {

	avatar = 'assets/img/avatar_small.svg';

  List = [];
  list = [];
  Communities: any;
  next= true;

  API_List :any;
  items: any;
  contactlist: any;
  private UserData: any;
  private add_friends = false;
  private search_friend: any;
  private quantity : any;
  private search = -2;
  usersSelected=[];
  share_count = 0;
  Placeholder;

  //Receives with action to perform (friends, communities)
  action:string;

  //Variables for storing selected users
  usernames=[];

  //Variables for storing selected communities
  SelectedCommunities=[];
  Post:any;
 
  

  constructor(public navCtrl: NavController, 
  	private ModalCtrl: ModalController,
    public navParamsCtrl: NavParams,
    private inAppB: InAppBrowser,
    public ViewCtrl: ViewController,
    private OtherlyAPI: OtherlyApiProvider,
    private Lds: LocaldataProvider,
    public events: Events,
    public app: App) {
  	this.action = this.navParamsCtrl.get('action');
  	console.log("action " + this.action);

 	this.Post = this.navParamsCtrl.get('post_details');
 	this.Post.ellipsis = 3;
 	this.Post.read_more_text = 'READ MORE';
 	console.log("SHARE WITH FRIENDS PAGE " + JSON.stringify(this.Post));


 
     this.Lds.getUser().then(data => {
          this.UserData = data;
 
 
          //USER INFORMATIONS HAVE BEEN RECEIVED HERE
          

          if (this.action == 'friends'){
          this.Placeholder = 'Add friends...';
          this.OtherlyAPI.GetFriendsList(this.UserData.otherly_token,{})
          .then(data => {
            this.API_List = data;
            
             for (let item in this.API_List)
             	this.list.push(this.API_List[item]);

             this.List = this.list.sort(function(a, b){
               if ( a.instance.full_name < b.instance.full_name )
                   return -1;
               if ( a.instance.full_name > b.instance.full_name )
                   return 1;
               return 0;
 
             });
          
            this.quantity = this.List.length;
 			
          
          });
      	}
      	if (this.action == 'communities') {
      		this.Placeholder = 'Add communities...';
      		this.OtherlyAPI.GetCommunities('access_token', {}).then(data =>{
  	  			this.Communities = data;
  				console.log('COMMUNITIES ' + JSON.stringify(this.Communities));
  			});

      	}
 
      });

  }
  GoBack(){
  	this.navCtrl.pop();
  }

  ReadMore(code){
              
    this.Post.ellipsis == 3 ? this.Post.ellipsis = null : this.Post.ellipsis = 3;
    this.Post.read_more_text == 'READ MORE' ? this.Post.read_more_text='READ LESS' : this.Post.read_more_text = 'READ MORE';
    
  }

  verifyTag(str: string){
  	console.log("verify tag :" + str);
  }



  SetStyle(data) {

  	console.log('STYLE OF ... ' + data);

  	if (this.action == 'friends'){
	  	 Object.keys(this.List).forEach((key) => {
	          
	          if(this.List[key].instance.username == data){
	            if (this.List[key].instance.style == '#EEF4F8'){
	              this.List[key].instance.style = '';

	            }


	            else{
	              this.List[key].instance.style = '#EEF4F8';
	              
	            }
	          }
	    });
	  }

	 if (this.action == 'communities'){

	  	 Object.keys(this.Communities).forEach((key) => {
	          
	          if(this.Communities[key].slug == data){
	            if (this.Communities[key].style == '#EEF4F8'){
	              this.Communities[key].style = '';

	            }


	            else{
	              this.Communities[key].style = '#EEF4F8';
	              
	            }
	          }
	    });
	  }

  }



  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      for (let i = 0; i < 30; i++) {
        this.List.push( this.List.length );
      }

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }




  Search(){
  	this.search = -1;
  	console.log("Search field : " + this.search_friend);

  	
     for (let item in this.list){
       if( this.list[item].indexOf(this.search_friend) >= 0){
        console.log('Found: '+this.list[item].full_name);
        }
     }

  }


  selectUser(user:any){
	console.log(" Select User  ...................", JSON.stringify(user));
	
	this.SetStyle(user.username);

	let there_is=0;
	let len = this.usernames.length;
	if(this.usersSelected.length == 0){
		this.next = null;
		//this.Placeholder = '';
		this.usersSelected.push(user.full_name); 
		this.usernames.push({
			username:user.username,
			full_name:user.full_name,
			photo_url: user.photo_url,
			status: user.status,
			rating: user.rating,
			helps_given : user.helps_given,
			chip:false
		});
		this.share_count = this.usernames.length;
	}
	else{
	  for(let item in this.usernames){
	    if(len > 0){
	      if(this.usernames[item].username == user.username){
	        console.log("Found User already selected");
	        there_is = 1;
	        // this.usersSelected.slice(this.usersSelected.indexOf(item));
	        let index = this.usernames.indexOf(this.usernames[item]);
	        console.log(" index ", index);
	        if(index > -1 ){
	          this.usersSelected.splice(index, 1);
	          this.usernames.splice(index, 1);
	          this.share_count = this.usernames.length;

	          if (this.usernames.length == 0){
	          	  	//this.Placeholder = 'Add friends ...';
	          	  	this.next = true;
	          }
	        }
	      }
	      len = len -1;
	    }
	  }

	  if(there_is == 0){
	    this.usersSelected.push(user.full_name);
	    this.usernames.push({
	  	username:user.username,
	  	full_name:user.full_name,
	  	photo_url: user.photo_url,
	  	status: user.status,
	  	rating: user.rating,
	  	helps_given : user.helps_given,
	  	chip:false
	  });
	    this.share_count = this.usernames.length;
	  }
	  
	}
	console.log("usernames: " + JSON.stringify(this.usernames));


  }


  selectCommunity(community:any){
	
	this.SetStyle(community.slug);

	let there_is=0;
	let len = this.usersSelected.length;
	if(this.SelectedCommunities.length == 0){
		this.next = null;
		//this.Placeholder = '';
		this.usersSelected.push(community); 
		this.SelectedCommunities.push({
			code: community.code,
			slug: community.slug,
			title: community.title,
			logo_image: community.logo_image,
			chip:false
		});

		this.share_count = this.SelectedCommunities.length;
	}
	else{
	  for(let item in this.SelectedCommunities){
	    if(len > 0){
	      if(this.SelectedCommunities[item].slug == community.slug){
	        console.log("Found Community already selected");
	        there_is = 1;
	        
	        let index = this.SelectedCommunities.indexOf(this.SelectedCommunities[item]);
	        console.log(" index ", index);
	        if(index > -1 ){
	          this.usersSelected.splice(index, 1);
	          this.SelectedCommunities.splice(index, 1);
	          this.share_count = this.SelectedCommunities.length;

	          if (this.SelectedCommunities.length == 0){
	          		//this.Placeholder = 'Add communities...';
	          		this.next = true;
	          }
	        }
	      }
	      len = len -1;
	    }
	  }

	  if(there_is == 0){
	    this.usersSelected.push(community.title); 
	  	this.SelectedCommunities.push({
	  	code: community.code,
	  	slug: community.slug,
	  	title: community.title,
	  	logo_image: community.logo_image,
	  	chip:false
	  	});


	  	this.share_count = this.SelectedCommunities.length;
	  }
	  
	}
	console.log("usernames: " + JSON.stringify(this.usernames));


  }

  ShowDelete(data){
  	if (this.action == 'friends'){
	  	Object.keys(this.usernames).forEach((key) => {
		          
		          if(this.usernames[key].username == data){
		            this.usernames[key].chip = !this.usernames[key].chip;
		            console.log("Chip value for " + this.usernames[key].username + "is " + this.usernames[key].chip)
		        }
		    });
	  }


	  if (this.action == 'communities'){
	  	Object.keys(this.SelectedCommunities).forEach((key) => {
		          
		          if(this.SelectedCommunities[key].slug == data){
		            this.SelectedCommunities[key].chip = !this.SelectedCommunities[key].chip;
		            console.log("Chip value for " + this.SelectedCommunities[key].slug + "is " + this.SelectedCommunities[key].chip)
		        }
		    });
	  }
  }

  delete(chip: Element, username:any){
  	if (this.action == 'friends'){
	  	console.log("delete: " +chip);
	  	this.SetStyle(username);
	  	chip.remove();

	  	for(let item in this.usernames){
		   
		      if(this.usernames[item].username == username){
		       
		        // this.usersSelected.slice(this.usersSelected.indexOf(item));
		        let index = this.usernames.indexOf(this.usernames[item]);
		        console.log(" index ", index);
		        

		        if(index > -1 ){
		          this.usernames.splice(index, 1);
		          this.usersSelected.splice(index, 1);

		          if (this.usernames.length == 0){
		          		this.next = true;
		          }

		        };
		          
		      }
		      
		    
		  }


	  	console.log("Username array " + JSON.stringify(this.usernames));
	  	this.share_count = this.usernames.length;
  }
  if (this.action == 'communities'){


	  	this.SetStyle(username);
	  	chip.remove();

	  	for(let item in this.SelectedCommunities){
		   
		      if(this.SelectedCommunities[item].slug == username){
		       
		        // this.usersSelected.slice(this.usersSelected.indexOf(item));
		        let index = this.SelectedCommunities.indexOf(this.SelectedCommunities[item]);
		        console.log(" index ", index);
		        

		        if(index > -1 ){
		          this.SelectedCommunities.splice(index, 1);
		          //this.SelectedCommunities.splice(index, 1);

		          if (this.SelectedCommunities.length == 0){
		          		this.next = true;
		          }

		        };
		          
		      }
		      
		    
		  }


	  	console.log("Username array " + JSON.stringify(this.usernames));
	  	this.share_count = this.SelectedCommunities.length;
  }

}

 
  onChange(val){
    console.log("changed" + JSON.stringify(val));


    let temp=[];

    if(this.action == 'friends'){
	
	for(let item in this.usernames){
		temp.push(this.usernames[item].full_name)
	}
	console.log("TEMP " + JSON.stringify(temp));


	let missing = temp.filter(item => val.indexOf(item) < 0);
	console.log(JSON.stringify(missing));
	this.SetStyle(missing);

	for (let item of this.usernames){
		if(item.full_name == missing){
	        console.log("Found User already selected");
	       
	        // this.usersSelected.slice(this.usersSelected.indexOf(item));
	        let index = this.usernames.indexOf(item);
	        console.log(" index ", index);
	        if(index > -1 ){
	          this.usernames.splice(index, 1);

	          if (this.usersSelected.length == 0){
	          		this.next = null;
	          		//this.Placeholder = 'Add friends...';
	          }
	        }
	      }
	  }
	}



	
	else if(this.action == 'communities'){
	console.log("chage commu");
	for(let item in this.SelectedCommunities){
		temp.push(this.SelectedCommunities[item].title)
	}
	console.log("TEMP " + JSON.stringify(temp));


	let missing = temp.filter(item => val.indexOf(item) < 0);
	console.log(JSON.stringify(missing));
	this.SetStyle(missing);

	for (let item of this.SelectedCommunities){
		if(item.title == missing){
	        console.log("Found User already selected");
	       
	        // this.usersSelected.slice(this.usersSelected.indexOf(item));
	        let index = this.SelectedCommunities.indexOf(item);
	        console.log(" index ", index);
	        if(index > -1 ){
	          this.SelectedCommunities.splice(index, 1);

	          if (this.usersSelected.length == 0)
	          		this.next = null;
	          		//this.Placeholder = 'Add community...';
	        }
	      }
	  }

	}

	

  }

  nextConversation(){    
  	let screen:any;
  	if (this.action == 'friends'){
    	this.navCtrl.push(PostShareWithFriendsPage,{users:this.usernames, post:this.Post,  action: 'friends'});
    	//screen.present();
    	
  	}
    else{
    	this.navCtrl.push(PostShareWithFriendsPage,{communities:this.SelectedCommunities, post:this.Post,  action: 'communities'});
    	//screen.present();
    	
    }

	// screen.onDidDismiss(data=>{
	// 		console.log("SHARED DISMISS ", JSON.stringify(data));
	// 		if(data)
	// 			this.ViewCtrl.dismiss();
	// 	})
	// }
	}

}
