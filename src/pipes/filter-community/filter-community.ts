import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FilterCommunityPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filterCommunity',
})
export class FilterCommunityPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(community=[], search_friends: any) {

  	
  	if (search_friends == null) return community

    return community.filter(function(item){
    	return item.title.toLowerCase().includes(search_friends.toLowerCase());
    });
  }
}
