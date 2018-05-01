import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { Chat } from '../chat/chat';

import { EditProfilePage } from '../edit-profile/edit-profile';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public user;
  public username;
  public name;
  public email = "";
  public bio = "Test bio";
  public age = "21";
  private id;
  private isCurrentUser = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider, public events: Events) {
  	this.user = this.navParams.data;
  	this.name = this.user.name;
  	this.bio = this.user.bio;
  	this.age = this.user.age;
  	this.id = this.user.id;
  	try {
  		this.name = this.navParams.get('user').name;
		this.age = this.navParams.get('user').age;
		this.bio = this.navParams.get('user').bio;
		this.username = this.navParams.get('user').username;
		this.id = this.navParams.get('user').id;
  	}
  	catch(e) {  		
  	}
  	if (this.id == this.dataProvider.getCurrentUser().id) {
  		this.isCurrentUser = true;	
  	}
  	console.log(this.isCurrentUser);
  	events.subscribe('editted', (info) => {
  		this.name = info.name;
  		this.age = info.age;
  		this.bio = info.bio;
  	});
  }

  sendMessage(){

    this.navCtrl.push(Chat);
  }

  editProfile() {
  	var id = this.id;
  	this.navCtrl.push(EditProfilePage, {
  		id: id
  	});
  }
}
