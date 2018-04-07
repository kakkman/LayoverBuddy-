import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { AirportsPage } from '../airports/airports';

import { DataProvider } from '../../providers/data/data';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private username: string = '';
	private password: string = '';

  public signup;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadCtrl: LoadingController,
    public dataProvider: DataProvider) {
    this.signup = SignupPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  public doSignin() {
    let loader = this.loadCtrl.create({
      content: 'Signing in...',
      duration: 500

    });
    loader.present();

    this.dataProvider.signIn(this.username, this.password).subscribe((success) => {
      this.navCtrl.setRoot(AirportsPage);
    }, (error) => {
      alert('Invalid username or password');
    });
  }

}
