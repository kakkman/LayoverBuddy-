import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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

    this.authPvdr.signin(this.username, this.password).subscribe((success) => {
      this.navCtrl.setRoot(TabsPage);
    }, (error) => {
      alert('Invalid username or password');
    });
  }

}
