import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Parse } from 'parse';
/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  name;
  age;
  bio;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider, public view: ViewController, public events: Events) {
  	console.log(this.navParams.get('id'));
  }

  saveProfile() {

  // this.dataService.setMenuItem(this.itemName, this.price, this.description, this.category, this.url, this.quantity ); 
    var userId = this.navParams.get('id');
    var newName = this.name;
    var newBio = this.bio;
    var newAge = this.age;

    var User = Parse.Object.extend("User");
    var query = new Parse.Query(User);
    query.get(userId, {
      success: function(editItem) {
        // The object was retrieved successfully.
        console.log(newName);
        editItem.set("name", newName);
        editItem.set("age", newAge);
        editItem.set("bio", newBio);
        editItem.save();
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      }
    });
    let newP = {
    	name: newName,
    	age: newAge,
    	bio: newBio
    }
    this.events.publish("editted", newP);
    this.view.dismiss();
  }
}
