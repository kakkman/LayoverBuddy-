import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AirportsPage } from './airports';

@NgModule({
  declarations: [
    AirportsPage,
  ],
  imports: [
    IonicPageModule.forChild(AirportsPage),
  ],
})
export class AirportsPageModule {}
