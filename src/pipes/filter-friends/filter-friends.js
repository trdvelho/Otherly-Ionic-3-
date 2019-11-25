var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
/**
 * Generated class for the FilterFriendsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
var FilterFriendsPipe = /** @class */ (function () {
    function FilterFriendsPipe() {
    }
    /**
     * Takes a value and makes it lowercase.
     */
    FilterFriendsPipe.prototype.transform = function (friends, search_friends) {
        if (friends === void 0) { friends = []; }
        if (search_friends === undefined)
            return friends;
        return friends.filter(function (friend) {
            return friend.instance.full_name.toLowerCase().includes(search_friends.toLowerCase());
        });
    };
    FilterFriendsPipe = __decorate([
        Pipe({
            name: 'filterFriends',
        })
    ], FilterFriendsPipe);
    return FilterFriendsPipe;
}());
export { FilterFriendsPipe };
//# sourceMappingURL=filter-friends.js.map