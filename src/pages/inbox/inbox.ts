import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data/data';
import { Chat } from '../chat/chat'

import { Parse } from 'parse';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html'
})
export class InboxPage {

  public convos;
  public user;
  public name;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider) {
    this.user = this.navParams.get('user');
    this.name = this.user.name;
    this.convos = this.getConvos();

  }

  sendMessage(user){

    this.navCtrl.push(Chat, {
      toUser: this.user
    });
  }

  getConvos(){
    var conversations = [];
    var Message = Parse.Object.extend("Message");
    var messages = new Message();
    var query = new Parse.Query(Message);
    query.equalTo("UserID" , { "__type": "Pointer", "className": "_User", "objectId": this.dataProvider.currentUser().id } );

    query.find({
      success: function(results){
        for (var i = 0; i < results.length; i++) {
          var message = results[i];
          if (!conversations.includes(message.get('UserID'))){
            conversations.push(message);
          }

        }

      },
      error: (error) => {
        alert("Error: " + error.code + " " + error.message);
        }
    });
    return conversations;
  }


}
