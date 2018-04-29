import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';

import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';

import { DataProvider } from '../../providers/data/data';
import { TabsPage } from '../tabs/tabs';

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

  public currentSearchString = "";

//for hiding the tabs when navigating back to choose a new airport
  public tabBarElement: any;


  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	public dataProvider: DataProvider,
  	public geolocation: Geolocation,
    public events: Events) {

  	this.options = {
      enableHighAccuracy : false
    };
    this.airports = this.dataProvider.getAllAirports();
    this.queriedAirports = this.airports;
    this.loadAirportsInRange();
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar')


  }

  ionViewWillEnter() {
    if(this.tabBarElement != null)
    {
      this.tabBarElement.style.display = 'none';
    }
  }

  ionViewWillLeave() {
    if(this.tabBarElement != null)
    {
      this.tabBarElement.style.display = 'flex';
    }
    
  }

  loadAirportsInRange()
  {
  	console.log("attempting to get geolocation");
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
    	this.currentPos = pos; 
    	this.userlat = pos.coords.latitude;
      this.userlong = pos.coords.longitude;
      console.log("posoition");  
  
      console.log(pos);
      this.airportsInRange = this.dataProvider.getAirportsInRange(this.userlat, this.userlong);

      
    },(err : PositionError)=>{
      console.log("error : " + err.message);
    });
  }

	//search function for finding a particular airports feed
  searchAirports(searchbar) { 
		// Reset items back to all of the items
    var input = searchbar.srcElement.value;// set q to the value of the searchbar
    this.currentSearchString = searchbar.srcElement.value;// set q to the value of the searchbar

    if(this.currentSearchString != "" && this.currentSearchString != undefined)
    {
      console.log("this is the current search string");
      console.log(this.currentSearchString);
  		this.queriedAirports = this.airports;

  		if (!this.currentSearchString) { // if the value is an empty string don't filter the items
  		  return;
  			}
  		this.queriedAirports = this.queriedAirports.filter((result) => {
  			if(result.name && this.currentSearchString) {
  		    	if (result.name.toLowerCase().indexOf(this.currentSearchString.toLowerCase()) > -1) { //checks the string against the value of the name property
  		        	return true;
  		        }
  		        if (result.iata_code.toLowerCase().indexOf(this.currentSearchString.toLowerCase()) > -1){
  		        	return true;
  		      	}
  		      	return false;
  		    }
  			});
    }
	}

	//navigation to specific airport feed 

	goToAirportFeed(airport)
	{
		if(this.airportsInRange.indexOf(airport) > -1)
		{
			this.dataProvider.addUserToAirport(airport);
		}
		this.navCtrl.setRoot(TabsPage, {
			airport: airport,
      userInfo: this.dataProvider.currentUser()
		});
	}


  ionViewDidLoad() {
    console.log('ionViewDidLoad AirportsPage');
  }

}
