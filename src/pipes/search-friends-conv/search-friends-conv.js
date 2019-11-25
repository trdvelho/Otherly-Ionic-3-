var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
/**
 * Generated class for the SearchFriendsConvPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
var SearchFriendsConvPipe = /** @class */ (function () {
    function SearchFriendsConvPipe() {
    }
    /**
     * Takes a value and makes it lowercase.
     */
    SearchFriendsConvPipe.prototype.transform = function (friends, searchFriendConv) {
        if (friends === void 0) { friends = []; }
        // return value.toLowerCase();
        return friends.filter(function (res) {
            if (searchFriendConv == '' || searchFriendConv == null)
                return friends;
            return res.instance.full_name.toLowerCase().includes(searchFriendConv.toLowerCase());
        });
    };
    SearchFriendsConvPipe = __decorate([
        Pipe({
            // name: 'searchFriendsConv',
            name: 'filterFriendsConv',
        })
    ], SearchFriendsConvPipe);
    return SearchFriendsConvPipe;
}());
export { SearchFriendsConvPipe };
//# sourceMappingURL=search-friends-conv.js.map