import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';

/*
	USER PROFILE PROVIDER
	- THIS PROVIDER IS SPECIFICALLY FOCUSED ON EVERYTHING RELATED TO USER PROFILE DATA AND EDITION.
*/
@Injectable()
export class UserProfileProvider {
	private Use_proxy = 1;
	Otherly_access_token : string= "";
	URL: string;
	DB_host_URL: string;
	Backend_URL: string;
	_Proxy: string;
	header = new Headers;
	options;

  constructor(public http: Http) {
    console.log('Hello UserProfileProvider Provider');

    this.Otherly_access_token = 'token ' + 'm3x6pLLAz3xiKmMAKNfVQVrYzh1t1g';

    this.DB_host_URL ='http://front-end-dev.us-west-2.elasticbeanstalk.com/api'; 
    this.Backend_URL = 'http://ec2-54-213-166-93.us-west-2.compute.amazonaws.com:8025/api';
    this._Proxy = '/apiFront';

    if (this.Use_proxy == 1)
      this.URL = this._Proxy;
    else{
      this.URL = this.DB_host_URL;
      // this.URL = this.Backend_URL;
    }

    this.header.append("Accept", 'application/json');
    this.header.append('Content-Type', 'application/json;charset=UTF-8');
    this.header.set('Authorization', this.Otherly_access_token );
    this.options = new RequestOptions ({ headers: this.header, withCredentials: true});
  }

  Edit_Header_FiveYears(username:string, target: any ,content:any){
    let body ={
    	target_field: target,
    	content: content,
    };
    let post_url = '/'+username+'/about-me/';
    let URL = this.URL + post_url;
    return new Promise(resolve => {  
      this.http.put(URL, body, this.options)
          .map(res => res.json())
          .subscribe(res => {
             
            resolve(res);
          }, err => {
            resolve(err);  
          });

      });
  }

  SetBirthDate(username, year, month, day){

  	let body ={
      target_field: "birthday",
    	birthday_day: day,
    	birthday_month: month,
    	birthday_year: year
    };
    let post_url = '/'+username+'/about-me/';
    let URL = this.URL + post_url;
    return new Promise(resolve => {  
      this.http.put(URL, body, this.options)
          .map(res => res.json())
          .subscribe(res => {
             
            resolve(res);
          }, err => {
            resolve(err);  
          });

      });
  }

  SetStatus(username, target, status:number){
    console.log(target, status);
    let body ={
      target_field: target,
      content: status
    };
    let post_url = '/'+username+'/about-me/';
    let URL = this.URL + post_url;
    return new Promise(resolve => {  
      this.http.put(URL, body, this.options)
          .map(res => res.json())
          .subscribe(res => {
             
            resolve(res);
          }, err => {
            resolve(err);  
          });

      });
  }

  Edit_delete(username, target, element_id, work_data){
    let body; 
    if (work_data == ""){
      body ={
        target_field: target,
        element_id: ""+element_id,
        remove: "true"
      };
    }

    console.log("Edit body", JSON.stringify(body));
    
    let post_url = '/'+username+'/about-me/';
    let URL = this.URL + post_url;
    return new Promise(resolve => {  
      this.http.put(URL, body, this.options)
          .map(res => res.json())
          .subscribe(res => {
             
            resolve(res);
          }, err => {
            resolve(err);  
          });

      });
  }

  NewBgPosition(username, profession, splited_Start_date, splited_End_date){
    console.log(splited_End_date);
    let workdata = {
      "name": profession.name,
      "where": profession.where,
      "description": profession.description,
      "start_day": splited_Start_date[2],
      "start_month":splited_Start_date[1],
      "start_year":splited_Start_date[0],
      "end_day": splited_End_date[2],
      "end_month":splited_End_date[1],
      "end_year":splited_End_date[0]
    }
    let body ={
      target_field: "what_i_do",
      work_data: JSON.stringify(workdata)
    };
    let post_url = '/'+username+'/about-me/';
    let URL = this.URL + post_url;

    return new Promise(resolve => {  
      this.http.put(URL, body, this.options)
          .map(res => res.json())
          .subscribe(res => {
             
            resolve(res);
          }, err => {
            resolve(err);  
          });

      });

  }

}
