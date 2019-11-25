import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the MoreOptionButtonComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'more-option-button',
  templateUrl: 'more-option-button.html'
})
export class MoreOptionButtonComponent {

  

  constructor(	public ViewCtrl: ViewController) {
    console.log('Hello MoreOptionButtonComponent');
  }



  GoTo(Section:string){

  	this.ViewCtrl.dismiss({section: Section})
  // 	switch (Section) {
  // 		case "a_bit_about_me":
  			
  // 			break;

		// case "asks_offers":
		// // code...
		// 	break;

		// case "what_i_do":
		// // code...
		// 	break;

		// case "goot_at":
		// // code...
		// 	break;

		// case "say_about_me":
		// // code...
		// 	break;
  // 	}

  }

}
