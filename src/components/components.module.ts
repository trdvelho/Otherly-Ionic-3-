import { NgModule } from '@angular/core';
import { SharePopoverComponent } from './share-popover/share-popover';
import { ConversationPopoverComponent } from './conversation-popover/conversation-popover';
import { MoreButtonPostPopoverComponent } from './more-popover/more-button-post-popover';
import { CreatePostComponent } from './create-post/create-post';
import { SelectLocationComponent } from './select-location/select-location';
import { MoreOptionButtonComponent } from './more-option-button/more-option-button';
import { RelationshipStatusComponent } from './relationship-status/relationship-status';
import { WhatIDoComponent } from './what-i-do/what-i-do';
import { MediaPopoverComponent } from './media-popover/media-popover';
@NgModule({
	declarations: [SharePopoverComponent,
    MoreButtonPostPopoverComponent,
    ConversationPopoverComponent,
    CreatePostComponent,
    MediaPopoverComponent,
    SelectLocationComponent,
    MoreOptionButtonComponent,
    RelationshipStatusComponent,
    WhatIDoComponent],
	imports: [],
	exports: [SharePopoverComponent,
    MoreButtonPostPopoverComponent, 
    ConversationPopoverComponent,
    CreatePostComponent,
    MediaPopoverComponent,
    SelectLocationComponent,
    MoreOptionButtonComponent,
    RelationshipStatusComponent,
    WhatIDoComponent]
})
export class ComponentsModule {}
