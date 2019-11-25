import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationProvider {
	API_KEY = "6976052b12d14ab5fa0b4b479e1caff0";
	proxy = "/apiL";

  constructor(public http: Http) {
    console.log('LocationProvider');

  }

  GetAllCountries(){
    let URL = this.proxy + "/rest/v2/all";// + this.API_KEY;
    let header = new Headers;
    header.append("Accept", 'application/json');
    header.set("Access-Control-Allow-Origin","*");
    header.append('Content-Type', 'application/json;charset=UTF-8');
    let options = new RequestOptions({headers: header});
    
    return new Promise(resolve => {  
      this.http.get(URL,options)
          .map(res => res.json())
          .subscribe(res => {
             
            resolve(res);
          }, err => {
            resolve(err);  
          });
      });
  }

  GetAllRegions(country){
  	let URL = this.proxy + "/region/"+country+"/all/?key="+this.API_KEY;

  	return new Promise(resolve => {  
      this.http.get(URL)
          .map(res => res.json())
          .subscribe(res => {
            console.log(JSON.stringify(res));
            resolve(res);
          }, err => {
            resolve(err);  
          });
      });
  }

  GetAllCities(country:any, region:any){  	
  	let URL = this.proxy + "/city/"+ country +"/search/?region="+ region +"&key="+this.API_KEY;

  	return new Promise(resolve => {  
      this.http.get(URL)
          .map(res => res.json())
          .subscribe(res => {
            console.log(JSON.stringify(res));
            resolve(res);
          }, err => {
            resolve(err);  
          });
      });
  }

}
