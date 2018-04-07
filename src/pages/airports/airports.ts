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

  public queriedAirports = [];

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	public dataProvider: DataProvider,
  	public geolocation: Geolocation) {

  	this.options = {
      enableHighAccuracy : false
    };
    this.airports = this.dataProvider.getAllAirports();
    this.queriedAirports = this.airports;
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

//search function for finding a particular airports feed
  searchAirports(searchbar) { 
		// Reset items back to all of the items
		this.queriedAirports = this.airports;

		var query = searchbar.srcElement.value;// set q to the value of the searchbar
		if (!query) { // if the value is an empty string don't filter the items
		  return;
			}
		this.queriedAirports = this.queriedAirports.filter((result) => {
			if(result.name && query) {
		    	if (result.name.toLowerCase().indexOf(query.toLowerCase()) > -1) { //checks the string against the value of the name property
		        	return true;
		        }
		        if (result.iata_code.toLowerCase().indexOf(query.toLowerCase()) > -1){
		        	return true;
		      	}
		      	return false;
		    }
			});
		}


  ionViewDidLoad() {
    console.log('ionViewDidLoad AirportsPage');
  }

}
