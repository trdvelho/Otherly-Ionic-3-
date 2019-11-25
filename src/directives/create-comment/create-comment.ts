import { Directive, Input, ElementRef,  Renderer, ViewChild } from '@angular/core';


@Directive({
  selector: '[create-comment-area]', // Attribute selector
  host:{
  '(ionScroll)':'onScrollContentScroll($event)'
  }
})
export class CreateCommentDirective {

	@Input("create-comment") createcomment: HTMLElement;


	HeaderHeight;
	scrollContent
	Header;

  constructor(public Element : ElementRef, public Renderer: Renderer) {
    console.log('Hello CreateCommentDirective Directive');
  }

  onScrollContentScroll(event){
  	//console.log("Scrolling", event);
  	if(event.directionY == 'down'){
  		this.Renderer.setElementStyle(this.createcomment , 'top','-200px');
  		this.Renderer.setElementStyle(this.scrollContent , 'top','-200px');
  	}
  	else {
  		if(event.scrollTop < 100){
  			this.Renderer.setElementStyle(this.createcomment , 'top','0');
  			this.Renderer.setElementStyle(this.scrollContent , 'top','0px');
  		}
  	}
  }

  ngOnInit(){

  	this.HeaderHeight = this.createcomment.clientHeight;
  	this.Renderer.setElementStyle(this.createcomment , 'transition','top 700ms');
  	this.scrollContent = this.Element.nativeElement.getElementsByClassName("scroll-content")[0];
  	
  	this.Renderer.setElementStyle(this.scrollContent , 'transition','top 1000ms');


  	//this.Renderer.setElementStyle(this.Header , 'height','1px');
  	//this.Renderer.setElementStyle(this.creatpost , 'top','-150px');
  }

}
