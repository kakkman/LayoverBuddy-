import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { ProfilePage } from '../../pages/profile/profile';
import { AirportsPage } from '../../pages/airports/airports';

import { DataProvider } from '../../providers/data/data';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


	public airport;
	public iata_code;
	public name;
	public activeUsers;
  constructor(public navCtrl: NavController,
   public navParams: NavParams,
   public dataProvider: DataProvider) {

    console.log("printing passed airport information");
    console.log(this.navParams.data);
  	this.airport = this.navParams.data;
  	this.iata_code = this.airport.iata_code;
  	this.name = this.airport.name;
  	this.activeUsers = this.dataProvider.getActiveUsersAtAirport(this.airport);
  }

  public viewUser(user)
  {
  	this.navCtrl.push(ProfilePage, {
			user: user
		});
  }

  public createGroup()
  {

  }

<<<<<<< HEAD
  ionViewDidLoad() {

  }
=======
  public chooseNewAirport()
  {
        this.navCtrl.setRoot(AirportsPage, {
    });
  }

>>>>>>> updated-navigation
}
