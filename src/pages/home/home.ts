import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { WorkflowPage } from "../workflow/workflow";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private alertCtrl: AlertController, 
    public navCtrl: NavController,
        
      ) {

  }

  onNewWorkflow(){
    this.navCtrl.push(WorkflowPage);
  }
}
