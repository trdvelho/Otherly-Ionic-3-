import { Component, ViewChild } from '@angular/core';


// PROVIDER
import { LocationProvider } from "../../providers/location/location";
/**
 * Generated class for the SelectLocationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'select-location',
  templateUrl: 'select-location.html'
})
export class SelectLocationComponent {

  @ViewChild ('region') RegionSelect;
  Country: any;
  contry_code: string;
  Region_name:string;
  Region:any;
  City:any;
  Selected_contry: any;

  constructor(	private LocationCtrl: LocationProvider) {
    console.log('Hello SelectLocationComponent Component');

    this.LocationCtrl.GetAllCountries().then((res) => {
    	this.Country = res;
    });
  }

  CountryWasSelected(country_code){
  	this.contry_code = country_code;
  	console.log("Selected ", country_code);
  	this.LocationCtrl.GetAllRegions(country_code).then((res)=>{
  		this.Region = res;
  		//this.RegionSelect.open();
  	});
  }

  RegionWasSelected(region){
  	this.Region_name = region;
  	this.LocationCtrl.GetAllCities(this.contry_code, region).then((res)=>{
  		this.City = res;
  	});
  }
}
