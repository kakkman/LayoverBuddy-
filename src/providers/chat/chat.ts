import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { DataProvider } from '../data/data';
import { Parse } from 'parse';

export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  toUserId: string;
  time: number | string;
  message: string;
  status: string;
}

export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
}

@Injectable()
export class ChatProvider {
   msgNum = 0;

  constructor(private http: HttpClient,
              private events: Events, public dataProvider: DataProvider) {
  }


  mockNewMsg(msg) {
    const mockMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: '210000198410281948',
      userName: 'Hancock',
      userAvatar: '../assets/to-user.jpg',
      toUserId: '140000198202211138',
      time: Date.now(),
      message: msg.message,
      status: 'success'
    };

    setTimeout(() => {
      this.events.publish('chat:received', mockMsg, Date.now())
    }, Math.random() * 1800)
  }

  getMsgList(userId, toUserId):ChatMessage[] {
    var MessageList = [];
    const msgListUrl = '../assets/mock/msg-list.json';
    var Message = Parse.Object.extend("Message");
    var messages = new Message();
    var query1User = new Parse.Query(Message);
    var query1toUser = new Parse.Query(Message);
    var query2User = new Parse.Query(Message);
    var query2toUser = new Parse.Query(Message);
    console.log(userId);
    console.log(toUserId);

    var self=this;
    query1User.equalTo("UserID" , { "__type": "Pointer", "className": "_User", "objectId": userId.id } );
    query1toUser.equalTo("toUser" , { "__type": "Pointer", "className": "_User", "objectId": toUserId.id } );
    query2User.equalTo("UserID" , { "__type": "Pointer", "className": "_User", "objectId": toUserId.id } );
    query2toUser.equalTo("toUser" , { "__type": "Pointer", "className": "_User", "objectId": userId.id } );



    var mainQuery = Parse.Query.and(
      Parse.Query.or(query1User,query2User),
      Parse.Query.or(query1toUser, query2toUser));


    mainQuery.find({
      success: function(results){
        for (var i = 0; i < results.length; i++) {
        //  if(self.msgNum !== results.length){
          var message = results[i];
          MessageList.push(message);
      //  }
        }
        //console.log(MessageList);
        return MessageList;
        //return MessageList.pipe(map(response => response.array));
      },
      error: (error) => {
        alert("Error: " + error.code + " " + error.message);
        }
    });
      //console.log(MessageList);
      //console.log(  this.http.get<any>(msgListUrl));
    return MessageList;
    //.pipe(map(response => response.array));
    // Observable<ChatMessage[]>





  /*  return this.http.get<any>(msgListUrl)
    .pipe(map(response => response.array));*/
  }




  sendMsg(msg: ChatMessage) {
    var Message = Parse.Object.extend("Message");
    var message = new Message();
    var NewmessageId = Date.now().toString();

    var User = Parse.Object.extend('User');
    var query = new Parse.Query(User);

      var self=this;
    query.equalTo("objectId" , msg.userId);
    query.limit(1);
    query.find({
      success: function(results){
            message.set("UserID",results[0]);
            message.set("Message", msg.message);
            var toUser = Parse.Object.extend('User');
            var queryTo = new Parse.Query(toUser);
            queryTo.equalTo("objectId" , msg.toUserId);
            queryTo.limit(1);
            queryTo.find({
                success: function(toResults){
                  message.set("toUser", toResults[0]);

                  message.save(null, {
                    success: function(saveResults) {
                    //  msgList.push(msg);
                      console.log('New order created with objectId: ');

                    },
                    error: function(Msg, error) {
                      alert('Failed to create new object, with error code: ' + error.message);
                    }
                  });

                }
              });

      }
});

    return new Promise(resolve => setTimeout(() => resolve(msg), Math.random() * 1000))
    .then(() => msg);


  }


}
