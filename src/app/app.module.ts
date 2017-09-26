import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { WorkflowPage } from "../pages/workflow/workflow";
import { WorkflowsPage } from "../pages/workflows/workflows";
import { EditWorkflowPage } from "../pages/edit-workflow/edit-workflow";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { EditWorkflow1Page } from "../pages/edit-workflow1/edit-workflow1";

import { Camera } from "@ionic-native/camera";
import { EditWorkflow2Page } from "../pages/edit-workflow2/edit-workflow2";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    WorkflowPage,
    WorkflowsPage,
    EditWorkflowPage,
    EditWorkflow1Page,
    EditWorkflow2Page
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydbtest',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    WorkflowPage,
    WorkflowsPage,
    EditWorkflowPage,
    EditWorkflow1Page,
    EditWorkflow2Page
  ],
  providers: [
    StatusBar,
    Camera,
    SplashScreen,
    BarcodeScanner,
    IonicStorageModule,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
