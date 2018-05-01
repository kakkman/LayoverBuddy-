import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { ProfilePage } from '../pages/profile/profile';
import { InboxPage } from '../pages/inbox/inbox';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { AirportsPage } from '../pages/airports/airports';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { Chat } from '../pages/chat/chat'

import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { HttpClientModule } from "@angular/common/http";


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataProvider } from '../providers/data/data';
import { Geolocation } from '@ionic-native/geolocation';
//import { EmojiProvider } from '../providers/emoji';
import { EmojiProvider } from '../providers/emoji/emoji';
import { ChatProvider } from '../providers/chat/chat';

import { Facebook } from '@ionic-native/facebook';


@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    InboxPage,
    HomePage,
    TabsPage,
    Chat,
    SignupPage,
    LoginPage,
    AirportsPage,
    EditProfilePage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    InboxPage,
    HomePage,
    TabsPage,
    Chat,
    SignupPage,
    LoginPage,
    AirportsPage,
    EditProfilePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    EmojiProvider,
    Geolocation,
    ChatProvider
  ]
})
export class AppModule {}
