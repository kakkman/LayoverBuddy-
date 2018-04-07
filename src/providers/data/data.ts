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



}
