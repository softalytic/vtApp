import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { WorkflowPage } from "../pages/workflow/workflow";
import { EditWorkflow2Page } from "../pages/edit-workflow2/edit-workflow2";



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = WorkflowPage;
  rootPage:any = EditWorkflow2Page;

  constructor(platform: Platform,
              statusBar: StatusBar,
              private screenOrientation: ScreenOrientation,
              splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // Uncomment below command for screenOrientation lock
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

  }

}

