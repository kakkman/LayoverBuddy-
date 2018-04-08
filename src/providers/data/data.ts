import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Parse } from 'parse';
import { ENV } from '../../app/app.constant';


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

  constructor() {
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
          // If the user inputs the email instead of the username
          var userQuery = new Parse.Query(Parse.User);

          userQuery.equalTo('email', username);
          userQuery.first().then(function (success) {
            var username = success.toJSON().username; 
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
          }, function (error) {
            observer.error(error);
            observer.complete();
          });
          
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

  public authenticated(): boolean {
    return this.currentUser() !== null;
  }

  public signOut(): Observable<boolean> {
    return new Observable((observer) => {
      Parse.User.logOut().then(() => observer.next(true));
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
            iata_code: object.get("iata_code")
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
    var latitudeHigh = latitude +5;
    var latitudeLow = latitude -5;
    var longitudeHigh = longitude +5; 
    var longitudeLow = longitude -5;

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
            id: object.id
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
    var airportDB = Parse.Object.extend('Airports');
    var query = new Parse.Query(airportDB).get(airport.id, {
      success: function (airport) {
        if (airport) {
          Parse.User.current().set("current_airport", airport);
          Parse.User.current().save(null, {
            success: (response) => {

            }, error: (error) => {

            }
          });
        }
      }
    });
  }

  //TODO: remove users when no longer in range. track users entire time to tell. 

  removeUserFromAirport()
  {
    this.addUserToAirport(null);
  }

  populateActiveUsersAtAirport(airport)
  {
    var users = [];
    var userDB = Parse.Object.extend('Users');
    var userQuery = new Parse.Query(userDB).equalTo("current_airport", airport);
    userQuery = userQuery.equalTo("hide_location", false);

    userQuery.find({
      success: (results) => {
        for (var i = 0; i < results.length; i++) {
          var object = results[i];

          let user = {
            name: object.get("name")
          };
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
