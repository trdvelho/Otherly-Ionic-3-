import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FilterFriendsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filterFriends',
})
export class FilterFriendsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(friends=[], search_friends: any) {

  	if (search_friends === undefined) return friends

    return friends.filter(function(friend){
    	return friend.instance.full_name.toLowerCase().includes(search_friends.toLowerCase());
    });
  }
}
