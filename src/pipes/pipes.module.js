var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { FilterFriendsPipe } from './filter-friends/filter-friends';
import { FilterCommunityPipe } from './filter-community/filter-community';
import { SearchFriendsConvPipe } from './search-friends-conv/search-friends-conv';
import { ConversationPipe } from './conversation/conversation';
var PipesModule = /** @class */ (function () {
    function PipesModule() {
    }
    PipesModule = __decorate([
        NgModule({
            declarations: [FilterFriendsPipe,
                FilterCommunityPipe],
            imports: [],
            exports: [FilterFriendsPipe,
                FilterCommunityPipe, ConversationPipe, SearchFriendsConvPipe]
        })
    ], PipesModule);
    return PipesModule;
}());
export { PipesModule };
//# sourceMappingURL=pipes.module.js.map