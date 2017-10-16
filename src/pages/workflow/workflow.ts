import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { WorkflowService } from "../../services/workflow";

// import { EditWorkflowPage } from "../edit-workflow/edit-workflow";
import { EditWorkflow1Page } from "../edit-workflow1/edit-workflow1";
import { EditWorkflow2Page } from "../edit-workflow2/edit-workflow2";


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

  testRadioOpen = false;

  constructor(public storage: Storage,
              private wfSvc: WorkflowService,
              private formBuilder: FormBuilder,
              private navCtrl: NavController,
              private alertCtrl: AlertController,
              private barcodeScanner: BarcodeScanner){

    storage.ready().then(() => { });

    this.wfForms = [1,2];

    this.wfProcesses = [
      {title: '钉卷', process: 1, show: true},
      {title: '含浸', process: 2, show: true},
      {title: '组立', process: 3, show: true},
      {title: '清洗', process: 4, show: true},
      {title: '手工老化', process: '5a0', show: true},
      {title: '自動老化', process: '5b0', show: true},
    ];

    this.wfInputs = [
      {title: "流程卡号", method: 'input', type: 'text', model: 'wfFormId', scan: true, size: 30},
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

  }

  ngOnInit() {
    this.formInit();
    /*
    this.storage.get('VT00001').then((resultStorageItemX) => {
      if(resultStorageItemX){ alert(JSON.stringify(resultStorageItemX)); }
    });
    */

    // Testing code for Server connection
    /*
    this.wfSvc.query({wfFormId: "VT00001"})
      .subscribe((data)=> {
          console.log("success");
          console.log(data[0]);
        },
        error => {
          console.log(error);
        }
      );
    */

    // This this for dev env
    this.storage.clear();
  };

  onAddWf(){
    
    console.log("onAddWF is triggered!");

    let form = this.wfInputForm;

    // this.wfSvc.upload(form)
    //   .subscribe((data)=> {
    //       console.log("success");
    //       console.log(data[0]);
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );

    // let storageItemX = this.storage.get(form.value.wfFormId);
    // alert(JSON.stringify(storageItemX) + ' ' + form.value.wfFormId);

    // Testing code for storage for demonstration purpose
    // Check if there is any result from the storage
    this.storage.get(form.value.wfFormId).then((resultStorageItemX) => {
      if(resultStorageItemX){
        let dataXTmp = { "headers": { "erpData": "ngForm"},
          "bodies": { "erpData": resultStorageItemX}};

        let dataX = JSON.stringify(dataXTmp);
        this.qrCodePopulate(dataX);
<<<<<<< HEAD
        //alert('have items: ' + JSON.stringify(resultStorageItemX));
      } else {
        let data = JSON.stringify({ "headers":
        { "erpData": "ngForm"},
       "bodies":
        { "erpData":
           {"wfProcess": "1",
            "wfProcessName": "釘卷",
            "wfForm": "1",
            "wfFormId": "VT00001",
            "wfOrderFormId": "VTOF00001",
            "WfOrderId": "VTO00001",
            "wfOrderBatchId": "VTOB0001",
            "wfOrderBatchQty": "100",
            "wfOrderTotalQty": "1000",
            "wfOrderTotalGoodQty": "100",
            "wfOrderRMId": "VT原材料",
            "wfOrderSeries": "VT系列",
            "wfOrderSpec": "VT規格",
            "wfOrderDim": "VT尺寸",
            "wfRMFoilPosName": "100LG04B-33VF-48UF 5.5mm",
            "wfRMFoilPosSerial": "17074049",
            "wfRMFoilPosLName": "184",
            "wfRMFoilNegName": "F-545M-450UF-5.5MM",
            "wfRMFoilNegSerial": "0619A04A06",
            "wfRMFoilNegLName": "184",
            "wfRMPaperName": "SM250-50 6.5mm",
            "wfRMPaperSerial": "17032519A1-B47",
            "wfRMGlueName": "",
            "wfRMGlueSerial": "17.7.22",
            "wfRMSolName": "KVP-1B",
            "wfRMSolSerial": "富凱2017.7119",
            "wfRMPinPosName": "15080(+)",
            "wfRMPinPosSerial": "1706241163",
            "wfRMPinNegName": "15080(-)",
            "wfRMPinNegSerial": "1707201194",
            "wfRMPlasticName": "9.3x2.8x1.4 Φ 10x10.5/12.5 (材质IVR-50)",
            "wfRMPlasticSerial": "17704310121",
            "wfRMCoverName": "10x10.6 3004材质(防爆)",
            "wfRMCoverSerial": "1670722-053842"
            }
        }
    });
    this.qrCodePopulate(data);
    //alert('no items!' + JSON.stringify(form.value));
    this.storage.set(form.value.wfFormId, form.value);
=======
        alert('have items: ' + JSON.stringify(resultStorageItemX));

      } else {

        // Prepopulate the data into form if not given
        let data = JSON.stringify({
          "headers": { "erpData": "ngForm"},
          "bodies":
            { "erpData":
              {"wfProcess": "3",
                "wfProcessName": "釘卷",
                "wfForm": "1",
                "wfFormId": "VT00001",
                "wfOrderFormId": "VTOF00001",
                "WfOrderId": "VTO00001",
                "wfOrderBatchId": "VTOB0001",
                "wfOrderBatchQty": "100",
                "wfOrderTotalQty": "1000",
                "wfOrderTotalGoodQty": "100",
                "wfOrderRMId": "VT原材料",
                "wfOrderSeries": "VT系列",
                "wfOrderSpec": "VT規格",
                "wfOrderDim": "VT尺寸",
                "wfRMFoilPosName": "100LG04B-33VF-48UF 5.5mm",
                "wfRMFoilPosSerial": "17074049",
                "wfRMFoilPosLName": "184",
                "wfRMFoilNegName": "F-545M-450UF-5.5MM",
                "wfRMFoilNegSerial": "0619A04A06",
                "wfRMFoilNegLName": "184",
                "wfRMPaperName": "SM250-50 6.5mm",
                "wfRMPaperSerial": "17032519A1-B47",
                "wfRMGlueName": "",
                "wfRMGlueSerial": "17.7.22",
                "wfRMSolName": "KVP-1B",
                "wfRMSolSerial": "富凱2017.7119",
                "wfRMPinPosName": "15080(+)",
                "wfRMPinPosSerial": "1706241163",
                "wfRMPinNegName": "15080(-)",
                "wfRMPinNegSerial": "1707201194",
                "wfRMPlasticName": "9.3x2.8x1.4 Φ 10x10.5/12.5 (材质IVR-50)",
                "wfRMPlasticSerial": "17704310121",
                "wfRMCoverName": "10x10.6 3004材质(防爆)",
                "wfRMCoverSerial": "1670722-053842",
                "wfStaffTechId": "技術員A",
                "wfStaffOptShift": "A",
                "wfQCSignOff": "品检員X"}
            }
        });
        this.qrCodePopulate(data);
        alert('no items!' + JSON.stringify(form.value));
        this.storage.set(form.value.wfFormId, form.value);
>>>>>>> b46b0187a4f59e15baeea59707841dc3361f7425
      }
    });

    let datawfProcess = JSON.stringify({
      "1" : {"wfFormName": "裸品流程卡","wfFormID": "1", "Process":{"1": "釘卷", "2": "含浸","3":"组立","4":"清洗"}},
      "2" : {"wfFormName": "成品流程卡","wfFormID": "2", "Process":{"1": "釘卷", "2": "含浸","3":"组立","4":"清洗"}}
    });

    this.storage.set('wfProcess', datawfProcess);

    let dataMachine = JSON.stringify({
      "AA01" : {"staffID": "0001","staffName": "用户01", "techID": "0001","techName": "用户01", "xrayID": "","xrayName": "", "shift": "A"},
      "AB001" : {"staffID": "0001","staffName": "用户01", "techID": "0001","techName": "用户01", "xrayID": "","xrayName": "", "shift": "A"}
    });

    this.storage.set('wfMachine', dataMachine);

    // Form submission to pass the form value onto next stage

    console.log("Checking the wfFormId.value");
    console.log(form.value.wfFormId);

    //this.storage.set(form.value.wfFormId, form.value);
    console.log("storage load:" + JSON.stringify(this.storage.get(form.value.wfFormId)));

    if(form.controls["wfFormId"].value == ''){
      alert('請輸入流程卡号');
    } else if(form.value.wfForm == 1) {
      // console.log('裸品流程卡');
      form.value.wfFormName = '裸品流程卡';

      console.log("Will enter 裸品流程卡 edit page now");
      console.log(form.value.wfFormId);

      this.navCtrl.push(EditWorkflow1Page, form.value.wfFormId);

    } else if(form.value.wfForm == 2) {
      console.log('成品流程卡');
      form.value.wfFormName = '成品流程卡';
      this.navCtrl.push(EditWorkflow2Page, form);

    } else if(form.value.wfForm == 3) {
      console.log('电容器流程卡');
      form.value.wfFormName = '电容器流程卡';

    } else {
      alert('請輸入流程卡');
    }
  }

  scanBarcode(model: string){

    let form = this.wfInputForm;

    console.log("scanning Barcode");

    this.barcodeScanner.scan().then((barcodeData) => {
      // Success! Barcode data is here
      // Limiter to assume the Barcode is default used in this orderID

      if ( barcodeData.format && barcodeData.format != "QR_CODE" ) {
        console.log("this is barcode");

        let data = barcodeData.text;

        form.controls[model].setValue(data);

      } else if (barcodeData.format == "QR_CODE") {
        // alert('嚫，请确定你所扫描的条码是正确的');
        // Try if it is QR code
        console.log(barcodeData.text);
        //alert(barcodeData.text);
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

  setFormValue(model: string, value: any){

    let form = this.wfInputForm;

    form.controls[model].setValue(value);
  }

  /*
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

*/

  qrCodePopulate(barcodeData: string) {

    // This function takes the barcode data and then process the JSON object
    // Assume each barcode data is a JSON object and it has a headers and bodies component
    // Loop through the headers
    // for each header,
    //    check if the length is > 0, which is a sub JSON array object for data table
    //    else loop through the keys inside that header JSON object

    console.log("running qrCodePop");
    console.log(barcodeData);

    let data = JSON.parse(barcodeData);
    let headers = data.headers;
    let bodies = data.bodies;
    let form = this.wfInputForm;

    console.log(data);

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

              // eval('form.value.' + formKey + " = '" + formBodies[formKey] + "'");

              // This use form control for the value setting
              this.setFormValue(formKey, formBodies[formKey]);

              // No idea what it is far
              // if(form.value.wfFormId == formBodies[formKey]) {
              //   //alert(formBodies[formKey] + ' ' +JSON.stringify(formBodies));
              //   this.storage.set(formBodies[formKey],  JSON.stringify(formBodies));
              // }
                  
              //  form.value.
            }
            catch(err) {
              console.log(err.message);
              eval('form.value.' + formKey + '= "' + formBodies[formKey] + '"; ');

              eval('console.log("Retrying force input " + form.value.'+ formKey + ')');
              eval('console.log(form.value.' + formKey + ');');
              console.log("barcode loaded in form:" + JSON.stringify(form.value));
            }

          }

          console.log("barcode loaded in form:" + JSON.stringify(form.value));

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
              eval('this.' + inputKey + " = " + inputBodies[inputKey]);

              // this.setFormValue(inputKey, inputBodies[inputKey]);

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
      wfOrderTotalQty: ['']

    });

  }


}
