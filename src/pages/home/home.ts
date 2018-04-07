import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


	public airport;
	public iata_code;
	public name;
  constructor(public navCtrl: NavController,
   public navParams: NavParams) {

  	this.airport = this.navParams.get('airport');
  	this.iata_code = this.airport.iata_code;
  	this.name = this.airport.name;
  }

}
