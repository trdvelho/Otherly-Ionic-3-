import { Directive, Input, ElementRef,  Renderer, ViewChild } from '@angular/core';


@Directive({
  selector: '[create-post-area]', // Attribute selector
  host:{
  '(ionScroll)':'onScrollContentScroll($event)'
  }
})
export class CreatePostAreaDirective {

	@Input("create-post") createpost: HTMLElement;


	HeaderHeight;
	scrollContent;
	Header;

  constructor(public Element : ElementRef, public Renderer: Renderer) {
    //console.log('Hello CreatePostAreaDirective Directive');
  }

  onScrollContentScroll(event){
  	//console.log("Scrolling", event);
  	if(event.directionY == 'down'){
  		this.Renderer.setElementStyle(this.createpost , 'top','-170px');
  		this.Renderer.setElementStyle(this.scrollContent , 'margin-top','30px');

  	}
  	else {

  		this.Renderer.setElementStyle(this.createpost , 'top','0');
  		if(event.scrollTop < 170)
  			this.Renderer.setElementStyle(this.scrollContent , 'margin-top','165px');
  	}
  }

  ngOnInit(){

  	this.HeaderHeight = this.createpost.clientHeight;
  	this.Renderer.setElementStyle(this.createpost , 'transition','top 700ms');
  	this.scrollContent = this.Element.nativeElement.getElementsByClassName("scroll-content")[0];
  	
  	this.Renderer.setElementStyle(this.scrollContent , 'transition','top 1000ms');
  	this.Renderer.setElementStyle(this.scrollContent , 'transition','margin-top 1000ms');

  }

}
