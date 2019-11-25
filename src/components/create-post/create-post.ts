import { Component, Input, ElementRef, Renderer } from '@angular/core';
import { LocaldataProvider } from '../../providers/localdata/localdata';
import {Content} from 'ionic-angular/index';

/**
 * Generated class for the CreatePostComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'create-post',
  templateUrl: 'create-post.html'
})

export class CreatePostComponent {


	@Input('scrollArea') scrollArea: HTMLElement;
  @Input('headerHeight') headerHeight: number;
 
  newHeaderHeight: any;
  UserData:any;
  text: string;

  constructor(	public element: ElementRef, 
  				public renderer: Renderer,
  				private Lds: LocaldataProvider ) {
    console.log('Hello CreatePostComponent Component');
    this.text = 'Hello World';

    this.Lds.getUser().then(data => {
         this.UserData = data;
     });
  }




  ngAfterViewInit(){
 
    this.renderer.setElementStyle(this.element.nativeElement, 'height', this.headerHeight + 'px');
 
 
  }
 
  resizeHeader(ev){
 
    ev.domWrite(() => {
 
      this.newHeaderHeight = this.headerHeight - ev.scrollTop;
 
      if(this.newHeaderHeight < 0){
        this.newHeaderHeight = 0;
      }  
 
      this.renderer.setElementStyle(this.element.nativeElement, 'height', this.newHeaderHeight + 'px');
 
    });
 
  }

}
