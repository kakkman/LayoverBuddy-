import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { ProfilePage } from '../../pages/profile/profile';

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
   public dataProvider: DataProvider,
   public events: Events) {
     this.dataProvider.getAirport().then((airport) => {
       if (airport) {
         this.airport = JSON.parse(airport);
         this.iata_code = this.airport.iata_code;
         this.name = this.airport.name;
         console.log(this.airport);
         this.activeUsers = this.dataProvider.getActiveUsersAtAirport(this.airport);

       }
     });
     this.events.subscribe('pass', (object) => {
       this.airport.parse_object = object;
     });
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

  ionViewDidLoad() {

  }
}
