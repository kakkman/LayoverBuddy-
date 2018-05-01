import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { AirportsPage } from '../airports/airports';

import { DataProvider } from '../../providers/data/data';
import { Facebook } from '@ionic-native/facebook';
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
    public dataProvider: DataProvider,
    public alertCtrl: AlertController,
    public facebook: Facebook) {
    this.signup = SignupPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  public doSignin() {
    let loader = this.loadCtrl.create({
      content: 'Signing in...',
    });
    loader.present();

    this.dataProvider.signIn(this.username, this.password).subscribe((success) => {
      loader.dismiss().then(() => {
        this.navCtrl.setRoot(AirportsPage);
      });
      
      console.log(success);
    }, (error) => {
      loader.dismiss().then( () => {
        let alert = this.alertCtrl.create({
          message: error.message,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();
      });
      console.log(error);
    });
  }

  public facebookLogin(){

    this.facebook.login(['public_profile', 'email'])
      .then( (response) => {

        var exp = response.authResponse.expiresIn;
        var expDate = new Date(
            new Date().getTime() + exp * 1000
        ).toISOString();

        var facebookAuthData = {
                        "id": response.authResponse.userID,
                        "access_token": response.authResponse.accessToken,
                        "expiration_date": expDate
                    };
       this.facebook.api("/me?fields=id,email,name,picture,gender",["public_profile"]).then(info => {
         // alert(res.name + "\n" + res.email);

        this.dataProvider.facebookLogin(facebookAuthData).then((success) => {
                  this.navCtrl.setRoot(AirportsPage);

        }, (error) => {

        });   
    });
     });
    }
}
