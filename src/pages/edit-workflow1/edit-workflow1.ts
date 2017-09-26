import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EditWorkflow2Page } from "../edit-workflow2/edit-workflow2";

/**
 * Generated class for the EditWorkflow1Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-workflow1',
  templateUrl: 'edit-workflow1.html',
})
export class EditWorkflow1Page {

  pushPage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pushPage = EditWorkflow2Page;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditWorkflow1Page');
  }

}
