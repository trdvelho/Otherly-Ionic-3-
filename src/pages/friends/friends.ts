import { Component } from '@angular/core';
import { NavController, NavParams, Events, App, Platform} from 'ionic-angular';

//provider
import { LocaldataProvider } from '../../providers/localdata/localdata';
import { OtherlyApiProvider } from '../../providers/otherly-api/otherly-api';

//NATIVE FEATURES
import { Contacts } from '@ionic-native/contacts';

//PAGES
import { HomePageFriend } from '../../pages/home/home';
import { FilterFriendsPipe } from '../../pipes/filter-friends/filter-friends'


@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',  
  providers:[Contacts]
})




export class Friends {
	List = [];
  list = [];
  mobile_contact = [];
  API_List :any;
	items: any;
  contactlist: any;
  private UserData: any;
	private add_friends = false;
	private search_friend: any;
	private quantity : any;
	private search = -2;


	constructor(public navCtrl: NavController, 
  				public navParams: NavParams,
          public platform: Platform,
          private contact: Contacts,
  				private OtherlyAPI: OtherlyApiProvider,
          private Lds: LocaldataProvider,
  				public events: Events,
          public app: App) {

    this.platform.ready().then(() => {
       var opts = {   
          //filter : "M",                                
          multiple: true,        
          hasPhoneNumber:true,                             
          //fields:  [ 'displayName', 'name' ]
        };
        contact.find([ 'displayName', 'name' ],opts).then((contacts) => {
          this.contactlist=contacts;
          this.MobileContactsinArray();
          
        }, (error) => {
          console.log(error);
        })
    })


    this.Lds.getUser().then(data => {
         this.UserData = data;


         //USER INFORMATIONS HAVE BEEN RECEIVED HERE
         
         this.OtherlyAPI.GetFriendsList(this.UserData.otherly_token,{})
         .then(data => {
           this.API_List = data;
           

            for (let item in this.API_List)
              this.list.push(this.API_List[item])


            this.List = this.list.sort(function(a, b){
              if ( a.instance.full_name < b.instance.full_name )
                  return -1;
              if ( a.instance.full_name > b.instance.full_name )
                  return 1;
              return 0;

            });
          

           this.quantity = this.List.length;
           //console.log('LIST O & M: ' + JSON.stringify(this.List));

         
         });

     });
  }

  MobileContactsinArray(){
    for (let item in this.contactlist){
      this.list.push({
        instance: {
                     full_name : this.contactlist[item].displayName,
                     photo_url: '',
                     mobile_number: this.contactlist[item].phoneNumbers[0].value,
                     rating: '',
                     helps_given: '',
                     source: 'M'
                   }
      })

    }


  }


  ionSelected() {
    console.log("Friends has been selected");
    this.add_friends = false;
    console.log(this.add_friends);
  }

  ShowProfile(friend){
    console.log("show Friend Profile " + JSON.stringify(friend));
    this.navCtrl.push(HomePageFriend, {username: friend.username, first_name: friend.first_name, full_name:friend.full_name, photo_url: friend.photo_url, status: friend.status, helps_given: friend.helps_given, thanks_sent: friend.thanks_sent});

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

  changeRating(username:string, rating:number){
    console.log('Change '+ rating);
    let desired_rate = rating;
    let current_rate;


    Object.keys(this.List).forEach((key) => {
          
          if(this.List[key].instance.username == username){
            

            if (this.List[key].instance.rating == rating){
                          
                  current_rate = this.List[key].instance.rating;
                  this.List[key].instance.rating = -1; //SHOWS THE LOADING SPINNER IN FRONT END 
                  rating = 0;

                  this.OtherlyAPI.ChangeRating(username, rating, this.UserData.otherly_token).then(res =>{
                        let result:any;
                        result = res;

                        if(result.rating == rating){
                            this.List[key].instance.rating = 0;
                            console.log("RATE IS THE SAME -BACK TO 0 " + JSON.stringify(res));
                          }

                        else{
                            this.List[key].instance.rating = current_rate;
                            console.log("ERROR HAPPENED ")
                          }

                  });
             }

             

            else{

              current_rate = this.List[key].instance.rating;
              this.List[key].instance.rating = -1; //SHOWS THE LOADING SPINNER IN FRONT END 

              this.OtherlyAPI.ChangeRating(username, rating, this.UserData.otherly_token).then(res =>{
                  console.log("RATE CHANGED " + JSON.stringify(res));

                  this.List[key].instance.rating = rating; 
                });
            }
          }
    });

    for (let item of this.List){
      

      if( item.instance.username == username){
        console.log('Found: '+item.instance.username);
        }
      
    }

    
    
  }


  Search(){
  	this.search = -1;
  	console.log("Search field : " + this.search_friend);

  	/*this.OtherlyAPI.GetFriendsList('carlos',{search_str:this.search_friend})
       .then(data => {
       	this.API_List = data;

       	 //this.List = Object.keys(data);

       	this.search = this.List.length;

       	console.log("Quantity: " + this.search);

       	this.search = -2;

        //console.log("My Friends: " + JSON.stringify(this.List));
     });*/
     for (let item in this.list){
       if( this.list[item].indexOf(this.search_friend) >= 0){
        console.log('Found: '+this.list[item].full_name);
        }
     }

  }

  Show_Add_friends(){
  	this.add_friends = !this.add_friends;
  }

  
}
