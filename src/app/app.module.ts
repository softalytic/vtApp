import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { WorkflowPage } from "../pages/workflow/workflow";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { EditWorkflow1Page } from "../pages/edit-workflow1/edit-workflow1";
import { EditWorkflow2Page } from "../pages/edit-workflow2/edit-workflow2";
import { Camera } from "@ionic-native/camera";
import { WorkflowService } from "../services/workflow";
// import { HTTP } from "@ionic-native/http";
import { HttpModule } from "@angular/http";
import { QrCodeService } from "../services/qrCode";

@NgModule({
  declarations: [
    MyApp,
    WorkflowPage,
    EditWorkflow1Page,
    EditWorkflow2Page
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydbtest',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WorkflowPage,
    EditWorkflow1Page,
    EditWorkflow2Page
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StatusBar,
    SplashScreen,
    Camera,
    BarcodeScanner,
    IonicStorageModule,
    ScreenOrientation,
    WorkflowService,
    QrCodeService
  ]
})
export class AppModule {}
