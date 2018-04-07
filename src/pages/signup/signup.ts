import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { AirportsPage } from '../airports/airports';

import { DataProvider } from '../../providers/data/data';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

	password: string = '';
	username: string = '';
	verify: string = '';
	email: string = '';

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	public loadCtrl: LoadingController,
  	public dataProvider: DataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

    // TODO: form validation
  public doRegister() {
    let loader = this.loadCtrl.create({
      content: 'Signing up...'
    });
    loader.present();

    this.dataProvider.signUp(this.username, 
      this.password, 
      this.email).subscribe((success) => {
        this.navCtrl.setRoot(AirportsPage);
        loader.dismissAll();
    }, (error) => {
    	console.log(error);
      loader.dismissAll();
    });
  }

}
