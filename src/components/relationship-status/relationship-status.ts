import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RelationshipStatusComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'relationship-status',
  templateUrl: 'relationship-status.html'
})
export class RelationshipStatusComponent {
  relationship = false;
  work_status = false;

  constructor(	private ViewCtrl: ViewController,
                private NavParamCtrl: NavParams) {
    console.log('Hello RelationshipStatusComponent Component');
    let popover = this.NavParamCtrl.get("popover");
    if (popover == "relationship"){
      this.relationship = true;
      this.work_status = false;
    }
    else{
      this.relationship = false;
      this.work_status = true;
    }
  }

  SelectRelationship(selected){
  	this.ViewCtrl.dismiss({from: "relationship", relationship: selected});
  }

  SelectWorkStatus(selected){
    this.ViewCtrl.dismiss({from: "work_status", work_status: selected});
  }

}
