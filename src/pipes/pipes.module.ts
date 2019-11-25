import { NgModule } from '@angular/core';
import { FilterFriendsPipe } from './filter-friends/filter-friends';
import { FilterCommunityPipe } from './filter-community/filter-community';
import { SearchFriendsConvPipe } from './search-friends-conv/search-friends-conv';
import  { ConversationPipe } from './conversation/conversation';
@NgModule({
	declarations: [FilterFriendsPipe,
    FilterCommunityPipe],
	imports: [],
	exports: [FilterFriendsPipe,
    FilterCommunityPipe,ConversationPipe, SearchFriendsConvPipe]
})
export class PipesModule {}
