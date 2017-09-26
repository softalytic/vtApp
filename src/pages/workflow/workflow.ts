import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { EditWorkflowPage } from "../edit-workflow/edit-workflow";
// import { EditWorkflow1Page } from "../edit-workflow1/edit-workflow1";
// import { EditWorkflow2Page } from "../edit-workflow2/edit-workflow2";

@Component({
  selector: 'page-workflow',
  templateUrl: 'workflow.html',
})

export class WorkflowPage implements OnInit {

  // Form body
  wfInputForm: FormGroup;

  // Other variables to be named
  staffIdBarcode = null;
  orderIdBarcode = null;

  wfForms = [];
  wfProcesses = [];
  wfMachineProcess = [];
  wfStages = [];
  wfInputs = [];
  wfMachineData = [];
  pushPage: any;

  testRadioOpen = false;

  constructor(public storage: Storage,
              // private nativeStorage: NativeStorage,
              private formBuilder: FormBuilder,
              private navCtrl: NavController,
              private alertCtrl: AlertController,
              private barcodeScanner: BarcodeScanner){

    storage.ready().then(() => { });

    this.wfForms = [1,2];

    this.wfMachineProcess = [{
      "1" : '钉卷',
      "2" : '含浸',
      "3" : '组立',
      "4" : '清洗',
      "5a0" :  '手工老化',
      "5a1" : '手工老化 - 串排',
      "5a2" : '手工老化 - 測試分选',
      "5a3" : '手工老化 - 外观',
      "5b0" : '自動老化',
      "5b1" : '自動老化 - 測試分选',
      "5b2" : '自動老化 - 外观'
    }];

    // this.wfMachineData = this.wfProcesses[0];
    //
    // console.log(this.wfMachineData);

    this.wfProcesses = [
      {title: '钉卷', process: 1, show: true},
      {title: '含浸', process: 2, show: true},
      {title: '组立', process: 3, show: true},
      {title: '清洗', process: 4, show: true},
      {title: '手工老化', process: '5a0', show: true},
      // {title: '手工老化 - 串排', process: '5a1', show: false},
      // {title: '手工老化 - 測試分选', process: '5a2', show: false},
      // {title: '手工老化 - 外观', process: '5a3', show: false},
      {title: '自動老化', process: '5b0', show: true},
      // {title: '自動老化 - 測試分选', process: '5b1', show: false},
      // {title: '自動老化 - 外观', process: '5b2', show: false}
    ];

    this.wfStages = [
      {title: '钉卷', process: '1', show: true},
      {title: '含浸', process: '2', show: true},
      {title: '组立', process: '3', show: true},
      {title: '清洗', process: '4', show: true},
      {title: '手工老化', process: '5a0', show: true},
      {title: '手工老化 - 串排', process: '5a1', show: false},
      {title: '手工老化 - 測試分选', process: '5a2', show: false},
      {title: '手工老化 - 外观', process: '5a3', show: false},
      {title: '自動老化', process: '5b0', show: true},
      {title: '自動老化 - 測試分选', process: '5b1', show: false},
      {title: '自動老化 - 外观', process: '5b2', show: false}
    ];

    this.wfInputs = [
      {title: "流程卡号", method: 'input', type: 'text', model: 'wfFormId', scan: true, size: 30},
      /*
      {title: "机台号", method: 'input', type: 'text', model: 'wfOptMachineId', scan: true, size: 30},
      {title: "工序", method: 'select', model: 'wfProcess', size: 30, options:[
        {label: '钉卷', value: 0},
        {label: '含浸', value: 1},
        {label: '组立', value: 2},
        {label: '清洗', value: 3},
        // {label: '手工老化', value: '5a'},
        {label: '手工老化', value: 4},
        // {label: '手工老化', value: {name: "test", value: "5a0"}},
        {label: '手工老化 - 串排', value: 5},
        {label: '手工老化 - 測試分选', value: 6},
        {label: '手工老化 - 外观', value: 7},
        {label: '自動老化', value: 8},
        {label: '自動老化 - 測試分选', value: 9},
        {label: '自動老化 - 外观', value: 10}
      ]},
      */
      // {method: "break", size: 20},

      {title: "工单号", method: 'input', type: 'text', model: 'WfOrderId', scan: false, size: 20},
      {title: "总量(预设)", method: 'input', type: 'number', model: 'wfOrderTotalQty', scan: false, size: 10},

      // Prompt Screen alert to pick the workflow batch id
      {title: "批次号", method: 'input', type: 'text', model: 'wfOrderBatchId', scan: false, size: 20},
      {title: "总量(批次)", method: 'input', type: 'number', model: 'wfOrderBatchQty', scan: false, size: 10},

      {method: "break", size: 20},

      // Expand as buttons
      {title: "流程卡", method: 'buttons', options: [
        {value: 1, label: '裸品'},
        {value: 2, label: '成品'},
        {value: 3, label: '电容器'}
      ], model: 'wfForm', scan: false, size: 100}
    ];

    this.pushPage = EditWorkflowPage;
  }

  ngOnInit() {
    this.formInit();
  };

  onAddWf(){

    let form = this.wfInputForm;

    // Form submission to pass the form value onto next stage
    console.log(form.value.wfForm);
    //this.storage.set('name', 'Captain America');

    /*
    this.storage.get('name').then((name) => {
      console.log('Me: Hey, ' + name + '! Good Day sir!');
      console.log(name);
      try {
        console.log("empty");
      } catch (name) {
        console.log("not empty");
      }
    });
    */
    console.log(form);
    this.navCtrl.push(EditWorkflowPage, form);
    /*
    switch (form.value.wfForm) {
      case 1:
        console.log('裸品流程卡');
        this.navCtrl.push(EditWorkflowPage, form);
        break;

      case 2:
        console.log('成品流程卡');
        this.navCtrl.push(EditWorkflow1Page, form);
        break;

      case 3:
        console.log('电容器流程卡');
        this.navCtrl.push(EditWorkflow2Page, form);
        break;

      default:
        console.log('請輸入流程卡号');
        if(form.controls["wfFormId"].value == ''){
          alert('請輸入流程卡号');
        } else if(form.controls["wfMachineId"].value == '') {
          alert('請輸入流机台号');
        }
        
    } */
    
    
    //storage.set('123', '123');

    /*
    if(form.controls["wfFormId"].value == ''){
      alert('請輸入流程卡号');
    } else if( form.value.wfForm != 1 && form.value.wfForm != 2 && form.value.wfForm != 3 ) {
      console.log('裸品流程卡');
      form.controls['wfProcess'].setValue(1);
      form.controls['wfProcessName'].setValue('钉卷');
      form.controls["wfForm"].setValue(1);
      form.value.wfFormName = '裸品流程卡';
      switch (form.value.wfFormId) {
        case '123':
          form.value.wfOrderId = 'A12300000';
          form.value.wfORMId = 'A1';
          form.value.wfOSeries = 'A2';
          form.value.wfOSpec = 'A3';
          form.value.wfODim = '23';
          form.value.wfOBOMNote = '12 XXX';
          form.value.wfONote = 'ABC XXX';
          form.value.wfOTotalQty = '3000';
          form.value.wfOTotalGoodQty = '2000';
          this.navCtrl.push(EditWorkflowPage, form);
          break;
  
        case '456':
          form.value.wfOrderId = 'A45600000';
          form.value.wfORMId = 'A5';
          form.value.wfOSeries = 'A6';
          form.value.wfOSpec = 'A4';
          form.value.wfODim = '56';
          form.value.wfOBOMNote = '45 XYZ';
          form.value.wfONote = 'DBA ABC';
          form.value.wfOTotalQty = '6000';
          form.value.wfOTotalGoodQty = '5000';
          this.navCtrl.push(EditWorkflowPage, form);
          break;
  
        case '789':
          form.value.wfOrderId = 'A78900000';
          form.value.wfORMId = 'A7';
          form.value.wfOSeries = 'A9';
          form.value.wfOSpec = 'A8';
          form.value.wfODim = '79';
          form.value.wfOBOMNote = '69 IJK';
          form.value.wfONote = 'EFG XYZ';
          form.value.wfOTotalQty = '7000';
          form.value.wfOTotalGoodQty = '8000';
          this.navCtrl.push(EditWorkflowPage, form);
          break;

          default: 
          //alert('流程卡 Order Id error');
          this.navCtrl.push(EditWorkflowPage, form);
          break;

      }
    } else if(form.value.wfForm == 1) {
      console.log('裸品流程卡');
      form.value.wfFormName = '裸品流程卡';
      switch (form.value.wfFormId) {
        case '123':
          form.value.wfOrderId = 'A12300000';
          form.value.wfORMId = 'A1';
          form.value.wfOSeries = 'A2';
          form.value.wfOSpec = 'A3';
          form.value.wfODim = '23';
          form.value.wfOBOMNote = '12 XXX';
          form.value.wfONote = 'ABC XXX';
          form.value.wfOTotalQty = '3000';
          form.value.wfOTotalGoodQty = '2000';
          this.navCtrl.push(EditWorkflowPage, form);
          break;
  
        case '456':
          form.value.wfOrderId = 'A45600000';
          form.value.wfORMId = 'A5';
          form.value.wfOSeries = 'A6';
          form.value.wfOSpec = 'A4';
          form.value.wfODim = '56';
          form.value.wfOBOMNote = '45 XYZ';
          form.value.wfONote = 'DBA ABC';
          form.value.wfOTotalQty = '6000';
          form.value.wfOTotalGoodQty = '5000';
          this.navCtrl.push(EditWorkflowPage, form);
          break;
  
        case '789':
          form.value.wfOrderId = 'A78900000';
          form.value.wfORMId = 'A7';
          form.value.wfOSeries = 'A9';
          form.value.wfOSpec = 'A8';
          form.value.wfODim = '79';
          form.value.wfOBOMNote = '69 IJK';
          form.value.wfONote = 'EFG XYZ';
          form.value.wfOTotalQty = '7000';
          form.value.wfOTotalGoodQty = '8000';
          this.navCtrl.push(EditWorkflowPage, form);
          break;

          default: 
          alert('流程卡 Order Id error');
          break;
      }
    } else if(form.value.wfForm == 2) {
      console.log('成品流程卡');
      form.value.wfFormName = '成品流程卡';
      switch (form.value.wfFormId) {
        case '123':
          form.value.wfOrderId = 'A12300000';
          form.value.wfORMId = 'A1';
          form.value.wfOSeries = 'A2';
          form.value.wfOSpec = 'A3';
          form.value.wfODim = '23';
          form.value.wfOBOMNote = '12 XXX';
          form.value.wfONote = 'ABC XXX';
          form.value.wfOTotalQty = '3000';
          form.value.wfOTotalGoodQty = '2000';
          this.navCtrl.push(EditWorkflowPage, form);
          break;
  
        case '456':
          form.value.wfOrderId = 'A45600000';
          form.value.wfORMId = 'A5';
          form.value.wfOSeries = 'A6';
          form.value.wfOSpec = 'A4';
          form.value.wfODim = '56';
          form.value.wfOBOMNote = '45 XYZ';
          form.value.wfONote = 'DBA ABC';
          form.value.wfOTotalQty = '6000';
          form.value.wfOTotalGoodQty = '5000';
          this.navCtrl.push(EditWorkflowPage, form);
          break;
  
        case '789':
          form.value.wfOrderId = 'A78900000';
          form.value.wfORMId = 'A7';
          form.value.wfOSeries = 'A9';
          form.value.wfOSpec = 'A8';
          form.value.wfODim = '79';
          form.value.wfOBOMNote = '69 IJK';
          form.value.wfONote = 'EFG XYZ';
          form.value.wfOTotalQty = '7000';
          form.value.wfOTotalGoodQty = '8000';
          this.navCtrl.push(EditWorkflowPage, form);
          break;

        default: 
          alert('流程卡 Order Id error');
          break;

      }
    } else if(form.value.wfForm == 3) {
      console.log('电容器流程卡');
      form.value.wfFormName = '电容器流程卡';
      switch (form.value.wfFormId) {
        case '123':
          form.value.wfOrderId = 'A12300000';
          form.value.wfORMId = 'A1';
          form.value.wfOSeries = 'A2';
          form.value.wfOSpec = 'A3';
          form.value.wfODim = '23';
          form.value.wfOBOMNote = '12 XXX';
          form.value.wfONote = 'ABC XXX';
          form.value.wfOTotalQty = '3000';
          form.value.wfOTotalGoodQty = '2000';
          this.navCtrl.push(EditWorkflowPage, form);
  
        case '456':
          form.value.wfOrderId = 'A45600000';
          form.value.wfORMId = 'A5';
          form.value.wfOSeries = 'A6';
          form.value.wfOSpec = 'A4';
          form.value.wfODim = '56';
          form.value.wfOBOMNote = '45 XYZ';
          form.value.wfONote = 'DBA ABC';
          form.value.wfOTotalQty = '6000';
          form.value.wfOTotalGoodQty = '5000';
          this.navCtrl.push(EditWorkflowPage, form);
  
        case '789':
          form.value.wfOrderId = 'A78900000';
          form.value.wfORMId = 'A7';
          form.value.wfOSeries = 'A9';
          form.value.wfOSpec = 'A8';
          form.value.wfODim = '79';
          form.value.wfOBOMNote = '69 IJK';
          form.value.wfONote = 'EFG XYZ';
          form.value.wfOTotalQty = '7000';
          form.value.wfOTotalGoodQty = '8000';
          this.navCtrl.push(EditWorkflowPage, form);
          break;

        default: 
          alert('流程卡 Order Id error');
          break;

      } 
    } else {
      alert('請輸入流程卡');
    }
    */
  }

  scanBarcode(model: string){

    let form = this.wfInputForm;

    console.log("scanning Barcode");
    // console.log(form.value);
    //
    // form.controls['wfProcess'].setValue(1);
    // form.controls['wfProcessName'].setValue('钉卷');
    // form.controls["wfForm"].setValue(1);
    //
    // console.log(form.value);

    this.barcodeScanner.scan().then((barcodeData) => {
      // Success! Barcode data is here
      // Limiter to assume the Barcode is default used in this orderID

      if ( barcodeData.format && barcodeData.format != "QR_CODE" ) {
        console.log("this is barcode");

        let data = barcodeData.text;

        form.controls[model].setValue(data);

        switch (model) {
          case 'wfMachineId':
            console.log("this barcode is for wfMachineID");
            // clean up prior wfMachineData record
            // Housing keeping to erase the prior data in the form
            this.wfMachineData = [];
            form.controls[ 'wfProcess' ].setValue("");
            form.controls[ 'wfProcessName' ].setValue("");
            // end of house keeping

            // look up the wfProcess from wfMachineId
            this.storage.get('machineData').then((values) => {
              console.log("This is the data from storage");
              console.log(values[data]);

              let _data = values[data];

              if (_data.length > 1) {
                this.wfMachineData.push.apply(this.wfMachineData, values[data]);
                console.log("This is the data from wfMachineData Array");
                console.log(this.wfMachineData);
                alert("嚫，该机器有多种工序! 请选择工序 :D")
              } else {
                this.wfMachineData.push(values[data]);
                // form.controls['wfProcess'].setValue(this.wfMachineData);
                console.log("This is the data from wfProcess Form");
                this.setWfStage(values[data]);
              }

            });

            break;
        }

        /*switch (barcodeData.text) {
          case 'VTM00001':
            form.controls['wfProcess'].setValue(1);
            form.controls['wfProcessName'].setValue('钉卷');
            form.controls["wfForm"].setValue(1);
            break;

          case 'VTM00002':
            form.controls['wfProcess'].setValue(2);
            form.controls['wfProcessName'].setValue('组立');
            form.controls["wfForm"].setValue(1);
            break;

          case 'VTM00003':
            form.controls['wfProcess'].setValue(3);
            form.controls['wfProcessName'].setValue('含浸');
            form.controls["wfForm"].setValue(1);
            break;

          case 'VTM00003':
            form.controls['wfProcess'].setValue(4);
            form.controls['wfProcessName'].setValue('清洗');
            form.controls["wfForm"].setValue(1);
            break;

          default:
            alert('嚫，请确定你所扫描的条码是正确的');
        };*/

      } else if (barcodeData.format == "QR_CODE") {
        // alert('嚫，请确定你所扫描的条码是正确的');
        // Try if it is QR code
        console.log("This is QR Code");
        this.qrCodePopulate(barcodeData.text);

      } else {

        alert('嚫，请确定你所扫描的条码是正确的');
      }
    }, (err) => {
      // An error occurred
      alert(err);
    });
  }

  /*scanQRcode(form: NgForm){
   console.log("scanning QRcode");
   this.barcodeScanner.scan().then((barcodeData) => {
   // Success! Barcode data is here
   // Limiter to assume the QR is default used in this staffID
   if (barcodeData.format == "QR_CODE") {
   this.qrCodePopulate(barcodeData.text, form);
   } else {
   alert('嚫，你扫描的是否QR条码');
   }
   }, (err) => {
   // An error occurred
   alert(err)
   });
   }*/

  setFormValue(model: string, value: any){

    let form = this.wfInputForm;

    form.controls[model].setValue(value);
  }

  setWfProcess( process: any, title: string, storage: Storage) {

    let form = this.wfInputForm;

    console.log(form.value);

    // Update the value of the Form on the Process steps and Process Name on the form
    form.controls['wfProcess'].setValue(process);
    form.controls['wfProcessName'].setValue(title);

    // Create additional alerts to let the user to choose the right subprocesses from the Ageing process
    if (typeof process  === 'string') {
      let alert = this.alertCtrl.create();
      alert.setTitle('请选择老化工序');

      if (process == '5a') {

        // This subprocess is unique to Manual Ageing
        alert.addInput({
          type: 'radio',
          label: '串排',
          value: '串排',
        });

        var processTitle = '手工老化'
      } else {
        var processTitle = '自动老化'
      }

      alert.addInput({
        type: 'radio',
        label: processTitle,
        value: processTitle
      });


      alert.addInput({
        type: 'radio',
        label: '測試分选',
        value: '測試分选'
      });

      alert.addInput({
        type: 'radio',
        label: '外观',
        value: '外观'
      });

      alert.addButton('取消');

      alert.addButton({
        text: '確定',
        handler: (data: any) => {
          // Once selected the subprocess, update the form and then submit the form to next process stage
          form.controls['wfProcessName'].setValue(data);
          this.onAddWf();
        }
      });

      alert.present();
    } else {
      // Simply submit the form and send over to next process
      this.onAddWf();
    }

    // console.log('After');
    // console.log(form.value);
  }

  setWfStage( process: number) {

    let form = this.wfInputForm;
    // console.log( form.value );
    // console.log(this.wfProcesses[process].title);
    console.log("This is the process from the ion-select");
    console.log(process);

    // This is temp fix for the array value to process value
    // *TO BE FIXED*
    let _wfStage = this.wfStages[ process-1 ];

    // there is a bug to load this method when the view is first init,
    // So i have added a try here to cancel the error msg
    try {
      // console.log( _wfStage.title );
      form.controls[ 'wfProcess' ].setValue( _wfStage.process );
      form.controls[ 'wfProcessName' ].setValue( _wfStage.title );
      console.log("This is the form value");
      console.log(JSON.stringify(form.value));
    } catch (err) {}


    // console.log(_wfProcess.title);
    // console.log(_wfProcess.process);

    // Update the value of the Form on the Process steps and Process Name on the form
    // form.controls['wfProcess'].setValue(_wfProcess.process);
    // form.controls['wfProcessName'].setValue(_wfProcess.title);
  }

  presentAlertFuck() {
    let alert = this.alertCtrl.create({
      title: 'Low battery',
      subTitle: '10% of battery remaining',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'Do you want to buy this book?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Buy',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  qrCodePopulate(barcodeData: string) {

    // This function takes the barcode data and then process the JSON object
    // Assume each barcode data is a JSON object and it has a headers and bodies component
    // Loop through the headers
    // for each header,
    //    check if the length is > 0, which is a sub JSON array object for data table
    //    else loop through the keys inside that header JSON object

    let data = JSON.parse( barcodeData );
    let headers = data.headers;
    let bodies = data.bodies;
    let form = this.wfInputForm;


    for (let key in headers) {
      // console.log(key + " : " + headers[key])
      switch(headers[key]) {
        case "ngForm":
          // console.log(key + " is a form")

          let formBodies = bodies[key];
          for (let formKey in formBodies) {
            console.log("populate form model " + formKey);
            console.log("populating model " + formKey + " " + formBodies[formKey]);

            try {
              // Dynamically set form value from the scanned code data
              // try and catch here is to protect if some of the fields are missing or failed,
              // then it will skip onto the next key

              // backup code for assigning the value into form
              // ngForm.controls[formKey].setValue(form[formKey]);

              // This line no longer works
              // eval('form.value.' + formKey + " = " + formBodies[formKey]);

              this.setFormValue(formKey, formBodies[formKey]);

              //  form.value.
            }
            catch(err) {
              console.log(err.message);
            }

          }
          /*
          this.storage.get('123').then(dataTmp=> { 
            if(dataTmp) { alert("exists"); } 
            else { alert("nothing"); }
          }
          */
          //this.storage.set('name', 'Captain America');
          //this.storage.set(key, bodies[key]);
          //alert(formBodies['wfFormId']);
          
          this.storage.get(formBodies['wfFormId']).then((dataTmp) => {
            if(dataTmp) { 
              //alert("exists"); 
            } 
            else { 
              //alert("nothing"); empty 
              this.storage.set(formBodies['wfFormId'], formBodies);
            }
          });

          break;

        case "ngStorage":
          console.log(key + " is a storage");

          this.storage.set(key, bodies[key]);

          console.log(bodies[key]);

          // Testing the storage has been set
          this.storage.get(key).then((values) => {
            for (let valKey in values) {
              console.log(values[valKey]);
            }
            console.log(key);
            console.log(JSON.stringify(values));
          });

          break;

        case "ngInput":
          console.log(key + " is for input");

          console.log(bodies[key]);

          let inputBodies = bodies[key];
          for (let inputKey in inputBodies) {
            console.log("populate form model" + inputKey);

            try {
              // Dynamically set form value from the scanned code data
              // try and catch here is to protect if some of the fields are missing or failed,
              // then it will skip onto the next key

              // backup code for assigning the value into form
              // ngForm.controls[formKey].setValue(form[formKey]);

              // This line no longer works
              // eval('this.' + inputKey + " = " + inputBodies[inputKey]);

              this.setFormValue(inputKey, inputBodies[inputKey]);

              //  form.value.
            }
            catch(err) {
              console.log(err.message);
            }

          }

          break;

        default:
          console.log(key + " is error");
      }
    }
  }

  private formInit() {
    this.wfInputForm = this.formBuilder.group({
      wfProcess: [''],
      wfProcessName: [''],
      wfForm: [''],
      wfFormId: [''],

      // Order Inputs detail
      wfOrderFormId: [''],
      WfOrderId: [''],
      wfOrderBatchId: [''],
      wfOrderBatchQty: [''],

      wfOrderBOMNote: [''],
      wfOrderNote: [''],
      wfOrderTotalQty: [''],
      wfOrderTotalGoodQty: [''],
      wfOrderRMId: [''],
      wfOrderSeries: [''],
      wfOrderSpec: [''],
      // wfOrderQty: [''],
      wfOrderDim: [''],

      wfOptMachineId: [''],

      // Raw Material Inputs
      wfRMFoilPosName: ['100LG04B-33VF-48UF 5.5mm'],
      wfRMFoilPosSerial: ['17074049'],
      wfRMFoilPosLName: ['184'],
      wfRMFoilPosLSerial: [''],
      wfRMFoilNegName: ['F-545M-450UF-5.5MM'],
      wfRMFoilNegSerial: ['0619A04A06'],
      wfRMFoilNegLName: ['184'],
      wfRMFoilNegLSerial: [''],
      wfRMPaperName: ['SM250-50 6.5mm'],
      wfRMPaperSerial: ['17032519A1-B47'],
      wfRMGlueName: [''],
      wfRMGlueSerial: ['17.7.22'],
      wfRMSolName: ['KVP-1B'],
      wfRMSolSerial: ['富凱2017.7119'],
      wfRMPinPosName: ['15080(+)'],
      wfRMPinPosSerial: ['1706241163'],
      wfRMPinNegName: ['15080(-)'],
      wfRMPinNegSerial: ['1707201194'],
      wfRMPlasticName: ['9.3x2.8x1.4 Φ 10x10.5/12.5 (材质IVR-50)'],
      wfRMPlasticSerial: ['17704310121'],
      wfRMShellName: [''],
      wfRMShellSerial: [''],
      wfRMCoverName: ['10x10.6 3004材质(防爆)'],
      wfRMCoverSerial: ['1670722-053842'],
      wfRMWindingTime: [''],
      wfRMWindingDeg: [''],

    });

  }


}
