import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the AirportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-airports',
  templateUrl: 'airports.html',
})
export class AirportsPage {

	public options : GeolocationOptions;
  public currentPos : Geoposition;

  public userlat: number;
  public userlong: number;

  public airportsInRange = [];
  public airports = [];

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	public dataProvider: DataProvider,
  	public geolocation: Geolocation) {

  	this.options = {
      enableHighAccuracy : false
    };
    this.airports = this.dataProvider.getAllAirports();
    //this.loadAirportsInRange();

  }

  loadAirportsInRange()
  {
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
    	this.currentPos = pos; 
    	this.userlat = pos.coords.latitude;
      this.userlong = pos.coords.longitude;    
      console.log(pos);
    },(err : PositionError)=>{
      console.log("error : " + err.message);
    });
    //this.airportsInRange = this.dataProvider.getAirportsInRange(this.userlat, this.userlong)
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AirportsPage');
  }

}
