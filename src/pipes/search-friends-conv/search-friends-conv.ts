import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchFriendsConvPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  // name: 'searchFriendsConv',
  name: 'filterFriendsConv',
})
export class SearchFriendsConvPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(friends=[], searchFriendConv:any) {
    // return value.toLowerCase();
    return friends.filter(function(res){
      if (searchFriendConv == '' || searchFriendConv == null ) return friends;
        
         return res.instance.full_name.toLowerCase().includes(searchFriendConv.toLowerCase());
    });
  }
}
