var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
/**
 * Generated class for the FilterCommunityPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
var FilterCommunityPipe = /** @class */ (function () {
    function FilterCommunityPipe() {
    }
    /**
     * Takes a value and makes it lowercase.
     */
    FilterCommunityPipe.prototype.transform = function (community, search_friends) {
        if (community === void 0) { community = []; }
        if (search_friends == null)
            return community;
        return community.filter(function (item) {
            return item.title.toLowerCase().includes(search_friends.toLowerCase());
        });
    };
    FilterCommunityPipe = __decorate([
        Pipe({
            name: 'filterCommunity',
        })
    ], FilterCommunityPipe);
    return FilterCommunityPipe;
}());
export { FilterCommunityPipe };
//# sourceMappingURL=filter-community.js.map