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
  public from;
  public newUser;



  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider) {
  //  this.user = this.navParams.get('user');
    //this.name = this.e;
  //  this.user =
    this.convos = this.getConvos();
    //this.user = this.get

  }


  getConvos(){
    var conversations = [];
    var toUserList = [];
    var Message = Parse.Object.extend("Message");
    var messages = new Message();
    var query = new Parse.Query(Message);
    console.log(this.dataProvider.currentUser().id);
    query.equalTo("UserID" , { "__type": "Pointer", "className": "_User", "objectId": this.dataProvider.currentUser().id } );

    query.find({
      success: function(results){
        for (var i = 0; i < results.length; i++) {

          var message = results[i];
          console.log(message);
          console.log(message.get('toUserName'));
          //toUserList.push(message);

          if (!toUserList.includes(message)){
              toUserList.push(message);

          /*console.log(message.get('toUser'));
            var toUser = Parse.Object.extend('User');
            var queryTo = new Parse.Query(toUser);
            queryTo.equalTo("objectId" , message.get('toUser'));
            queryTo.limit(1);
            queryTo.find({
                success: function(toResults){
                  for (var i = 0; i < toResults.length; i++) {
                    console.log(toResults[0]);
                   toUserList.push(toResults[0]);
                 }
                 },error: (error) => {
                   alert("Error: " + error.code + " " + error.message);
                 }



        });*/
        console.log(toUserList);
        //return toUserList;


            //conversations.push(message);
          }

        }

      },
      error: (error) => {
        alert("Error: " + error.code + " " + error.message);
        }
    });
  //  return conversations;
  return toUserList;
  }

/*  getToUsers(from){
    var toUserList
    var toUser = Parse.Object.extend('User');
    var queryTo = new Parse.Query(toUser);
    queryTo.equalTo("objectId" , from.objectId);
  //  queryTo.limit(1);
    queryTo.find({
        success: function(toResults){
          for (var i = 0; i < toResults.length; i++) {
           toUserList.push(toResults[0]);
         },error: (error) => {
           alert("Error: " + error.code + " " + error.message);
           }
       };


});
return toUserList;
}*/
}
