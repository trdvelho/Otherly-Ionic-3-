import { NgModule } from '@angular/core';
import { CreatePostAreaDirective } from './create-post-area/create-post-area';
import { CreateCommentDirective } from './create-comment/create-comment';
@NgModule({
	declarations: [CreatePostAreaDirective,
    CreateCommentDirective],
	imports: [],
	exports: [CreatePostAreaDirective,
    CreateCommentDirective]
})
export class DirectivesModule {}
