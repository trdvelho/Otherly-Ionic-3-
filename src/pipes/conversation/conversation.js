var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
/**
 * Generated class for the ConversationPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
var ConversationPipe = /** @class */ (function () {
    function ConversationPipe() {
    }
    /**
     * Takes a value and makes it lowercase.
     */
    ConversationPipe.prototype.transform = function (conversation, searchConversation) {
        if (conversation === void 0) { conversation = []; }
        if (searchConversation == '' || searchConversation == null)
            return conversation;
        return conversation.filter(function (res) {
            //   return res.post.title.toLowerCase().includes(searchConversation.toLowerCase());        
            //  });
            // return conversation.filter(function(res){
            //return res.post.title.toLowerCase().includes(searchConversation.toLowerCase());
            //   if (res.post.title.toLowerCase().indexOf(searchConversation.toLowerCase()) >0 ||  res.post.first_name.toLowerCase().indexOf(searchConversation.toLowerCase()) >0 || res.post.last_name.toLowerCase().indexOf(searchConversation.toLowerCase()) >0){
            //     return res.post.title.toLowerCase().includes(searchConversation.toLowerCase());
            //  }
            if (res.post.title.toLowerCase().indexOf(searchConversation.toLowerCase()) > -1) {
                return res.post.title.toLowerCase().includes(searchConversation.toLowerCase());
            }
            if (res.post.first_name.toLowerCase().indexOf(searchConversation.toLowerCase()) > -1) {
                return res.post.first_name.toLowerCase().includes(searchConversation.toLowerCase());
            }
            if (res.post.last_name.toLowerCase().indexOf(searchConversation.toLowerCase()) > -1) {
                return res.post.last_name.toLowerCase().includes(searchConversation.toLowerCase());
            }
        });
    };
    ConversationPipe = __decorate([
        Pipe({
            name: 'filterconversation',
        })
    ], ConversationPipe);
    return ConversationPipe;
}());
export { ConversationPipe };
//# sourceMappingURL=conversation.js.map