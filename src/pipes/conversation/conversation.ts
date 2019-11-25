import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ConversationPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'filterconversation',
})
export class ConversationPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(conversation=[], searchConversation:any) {
    if (searchConversation == '' || searchConversation == null ) return conversation
      
      return conversation.filter(function(res){
      //   return res.post.title.toLowerCase().includes(searchConversation.toLowerCase());        
      //  });

         // return conversation.filter(function(res){
           //return res.post.title.toLowerCase().includes(searchConversation.toLowerCase());

           
            //   if (res.post.title.toLowerCase().indexOf(searchConversation.toLowerCase()) >0 ||  res.post.first_name.toLowerCase().indexOf(searchConversation.toLowerCase()) >0 || res.post.last_name.toLowerCase().indexOf(searchConversation.toLowerCase()) >0){
            //     return res.post.title.toLowerCase().includes(searchConversation.toLowerCase());
            //  }
             if (res.post.title.toLowerCase().indexOf(searchConversation.toLowerCase()) >-1 ){
              return res.post.title.toLowerCase().includes(searchConversation.toLowerCase());
           }
           if (res.post.first_name.toLowerCase().indexOf(searchConversation.toLowerCase()) >-1 ){
            return res.post.first_name.toLowerCase().includes(searchConversation.toLowerCase());
         }
         if (res.post.last_name.toLowerCase().indexOf(searchConversation.toLowerCase()) >-1 ){
          return res.post.last_name.toLowerCase().includes(searchConversation.toLowerCase());
       }

          });
      }
}

