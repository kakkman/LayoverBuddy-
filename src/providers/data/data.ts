import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { Parse } from 'parse';
import { ENV } from '../../app/app.constant';

import { Facebook } from '@ionic-native/facebook';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class User {
  public id: string;
  public name: string;
  public email: string;
  public phone: number;
}

@Injectable()
export class DataProvider {

	private parseAppId: string = ENV.parseAppId;
  private parseServerUrl: string = ENV.parseServerUrl;
  private parseJsId: string = ENV.parseJsId;

  constructor(public facebook: Facebook) {
  	this.parseInitialize();
    console.log('Hello AuthProvider Provider');
  }

  private parseInitialize() {
    Parse.initialize(this.parseAppId, this.parseJsId);
    Parse.serverURL = this.parseServerUrl;
  }


///////////////////////////////////////////////////////////////////////////
// user methods and information
//////////////////////////////////////////////////////////////////////////

  public signIn(username: string, password: string): Observable<boolean> {
    return new Observable((observer) => {
      Parse.User.logIn(username, password, {
        success: function (user) {
          observer.next(true);
          observer.complete();
        },
        error: function (user, error) {
            observer.error(error);
            observer.complete();
          }
        });
    });       
  }

  public signUp(username: string, 
    password: string, 
    email: string): Observable<boolean> {
    return new Observable((observer) => {
      var user = new Parse.User();
      user.set('username', username);
      user.set('password', password);
      user.set('email', email);

      user.signUp(null, {
        success: (user) => {
          observer.next(true);
          observer.complete();
        },
        error: (user, error) => {
          console.log("the error occurred here");
          observer.error(error);
          observer.complete();
        }
      });

    });
  }

  public currentUser(): User {
    let u = Parse.User.current();
    if (u) {
      var user = new User();
      user.id = u.id;
      user.name = u.get('username');
      user.email = u.get('email');
      user.phone = u.get('phone');

      return user;
    }
    return null
  }

  public getCurrentUser() {
    Parse.User.enableUnsafeCurrentUser();
    var u = Parse.User.current();
    var userCopy = {
      name: u.get("name"),
      username: u.get("username"),
      age: u.get("age"),
      bio: u.get("bio"),
      id: u.id
    }
    return userCopy;
  }

  public authenticated(): boolean {
    return this.currentUser() !== null;
  }

  public signOut(): Observable<boolean> {
    return new Observable((observer) => {
      Parse.User.logOut().then(() => observer.next(true));
    });
  }

  public isCurrentUser(user)
  {
    return (Parse.User.current() == user.parse_object);
  }

  public facebookLogin(authData)
  {
    /*return Parse.FacebookUtils.logIn(authData, {
        success: function(user) {
          console.log(user);
          if (!user.existed()) {
            return("User signed up and logged in through Facebook!");
          } else {
            return("User logged in through Facebook!");
          }
        },
        error: function(user, error) {
          return("User cancelled the Facebook login or did not fully authorize.");
        }
      }); */

    return Parse.FacebookUtils.logIn(authData, {

        success: function(user) {
            if (!user.existed()) {
                this.facebook.api("/me?fields=name,email",["public_profile", "email"]).then(info => {
                    user.save(null, {
                        success: function(user) {
                            user.set('name', info.name);
                            user.set('email', info.email);
                            user.save();

                            // You should redirect the user to another page after a successful login.
                        },
                        error: function(user, error) {
                            alert('Failed to save user to database with error: ' + error.message);
                        }
                    });
                });
            } else {
                alert("User logged in through Facebook!");
                
                // You should redirect the user to another page after a successful login.
            }
        },
        error: function(user, error) {
          alert(user +'\n' + error)
            console.log("User cancelled the Facebook login or did not fully authorize.");
        }
    });
  }
///////////////////////////////////////////////////////////////////////////
// airport methods and information
//////////////////////////////////////////////////////////////////////////

  getAllAirports()
  {
    var airports = [];
    var airportDB = Parse.Object.extend('Airports');
    var airportQuery = new Parse.Query(airportDB).ascending("iata_code");

    airportQuery.find({
      success: (results) => {
        for (var i = 0; i < results.length; i++) {
          var object = results[i];

          let airport = {
            name: object.get("name"),
            latitude: object.get("latitude_deg"),
            longitude: object.get("longitude_deg"),
            iata_code: object.get("iata_code"),
            parse_object: object
          };
          airports.push(airport);
        }
      },
      error: (error) => {
        alert("Error: " + error.code + " " + error.message);
      }
    });
    console.log(airports.length);
    return airports;
  }  

  getAirportsInRange(latitude: number, longitude:number)
  {
    //Each degree of latitude is approximately 69 miles (111 kilometers) apart.
    //TODO: Calculate proper distances based on latitude and longitude

    if(latitude == undefined || longitude == undefined)
    {
      return;
    }
    //TODO: Calculate distance properly. this proof of concept below works.
    var latitudeHigh = latitude + 0.5;
    var latitudeLow = latitude - 0.5;
    var longitudeHigh = longitude + 0.5; 
    var longitudeLow = longitude - 0.5;

    var airports = [];
    var airportDB = Parse.Object.extend('Airports');
    var airportQuery = new Parse.Query(airportDB).ascending("iata_code");

    airportQuery = airportQuery.greaterThanOrEqualTo("latitude_deg", latitudeLow);
    airportQuery = airportQuery.lessThanOrEqualTo("latitude_deg", latitudeHigh);
    airportQuery = airportQuery.greaterThanOrEqualTo("longitude_deg", longitudeLow);
    airportQuery = airportQuery.lessThanOrEqualTo("longitude_deg", longitudeHigh);

    airportQuery.find({
      success: (results) => {
        for (var i = 0; i < results.length; i++) {
          var object = results[i];

          let airport = {
            name: object.get("name"),
            latitude: object.get("latitude_deg"),
            longitude: object.get("longitude_deg"),
            iata_code: object.get("iata_code"),
            parse_object: object
          };
          airports.push(airport);
        }
      },
      error: (error) => {
        alert("Error: " + error.code + " " + error.message);
      }
    });
    return airports;
  }

  ///////////////////////////////////////////////////////////////////////////
  // loading users actively in airport vicinity
  //////////////////////////////////////////////////////////////////////////

  //hides or unhides user from airport lists
  public toggleHideUser() {
    var currentStatus = Parse.User.current().get("hide_location");
    Parse.User.current().set("hide_location", !currentStatus);
    Parse.User.current().save(null, {
      success: (response) => {

      }, error: (error) => {

      }
    });
  }

  //TODO: add users when within range above. live query
  //requires watching the user the entire time
  addUserToAirport(airport)
  {
    Parse.User.current().set("current_airport", airport.parse_object);
    console.log("Got here!");
    Parse.User.current().save(null, {
      success: (response) => {

      }, error: (error) => {
        console.log("Could not save");
      }
    });
  }

  //TODO: remove users when no longer in range. track users entire time to tell. 

  removeUserFromAirport()
  {
    this.addUserToAirport(null);
  }

  getActiveUsersAtAirport(airport)
  {
    var users = [];
    var userDB = Parse.Object.extend('User');
    console.log("getting airport from method");
    console.log(airport);
    //console.log(airport.parse_object);

    var userQuery = new Parse.Query(userDB).equalTo('current_airport', airport.parse_object);
    //userQuery = userQuery.equalTo("hide_location", false);

    userQuery.find({
      success: (results) => {
        console.log('success');
        console.log(results);
        for (var i = 0; i < results.length; i++) {
          var object = results[i];

          let user = {
            username: object.get("username"),
            name: object.get("name"),
            age: object.get("age"),
            bio: object.get("bio"),
            id: object.id,
            parse_object: object
          };
          console.log(user);
          users.push(user);
        }
      },
      error: (error) => {
        alert("Error: " + error.code + " " + error.message);
      }
    });
    return users;
  }

  ///////////////////////////////////////////////////////////////////////////
  // private messages between users
  //////////////////////////////////////////////////////////////////////////
}
