import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { WorkflowService } from "../../services/workflow";

// import { EditWorkflowPage } from "../edit-workflow/edit-workflow";
import { EditWorkflow1Page } from "../edit-workflow1/edit-workflow1";
import { EditWorkflow2Page } from "../edit-workflow2/edit-workflow2";
import { QRCodeService } from "../../services/qrCode";


@Component({
  selector: 'page-workflow',
  templateUrl: 'workflow.html',
})

export class WorkflowPage implements OnInit {

  /* Variable Definition */
  // Form body
  wfInputForm: FormGroup;

  // Other variables to be named
  staffIdBarcode = null;
  orderIdBarcode = null;

  wfProcessStorage: any;
  wfMachineStorage: any;

  // For Dev model
  wfDev = true;

  wfForms = [1,2];
  wfProcesses = [];
  wfMachineProcess = [];
  wfStages = [];
  wfInputs = [];
  wfMachineData = [];
  wfForm1Process = {};
  wfForm2Process = {
    1:"打印",
    2:"测试上带",
    3:"贴片外观",
    4:"终检"
  };

  testRadioOpen = false;

  dataWfProcess = {
    "1":{"wfFormName": "裸品流程卡", "Process":{"1":"釘卷","2":"含浸","3":"组立","4":"清洗"}},
    "2":{"wfFormName": "成品流程卡", "Process":{"1":"打印","2":"测试上带","3":"贴片外观","4":"终检"}}
  };

  dataMachine = {
    "AA01":{"wfStaffOptId":"S0001","wfStaffOptName":"員工01","wfStaffTechId":"T0001","wfStaffTechName":"技術員工01","wfStaffXrayId":"X0001","wfStaffXrayName":"Xray員工01","wfStaffOptShift":"A"},
    "AB001":{"wfStaffOptId":"S0002","wfStaffOptName":"員工02","wfStaffTechId":"T0002","wfStaffTechName":"技術員工01","wfStaffXrayId":"X0002","wfStaffXrayName":"Xray員工02","wfStaffOptShift":"B"}
  };

  constructor(private storage: Storage,
              private QRCode: QRCodeService,
              private wfSvc: WorkflowService,
              private formBuilder: FormBuilder,
              private navCtrl: NavController,
              private alertCtrl: AlertController){

    storage.ready().then(() => { });

    this.wfProcesses = [
      {title: '钉卷', process: "1", show: true},
      {title: '含浸', process: "2", show: true},
      {title: '组立', process: "3", show: true},
      {title: '清洗', process: "4", show: true},
      {title: '手工老化', process: '5a0', show: true},
      {title: '自動老化', process: '5b0', show: true},
    ];

    this.wfInputs = [
      {title: "流程卡号", method: 'input', type: 'text', model: 'wfFormId', scan: true, size: 30},
      {title: "工单号", method: 'input', type: 'text', model: 'wfOrderId', scan: false, size: 20},
      //{title: "总量(预设)", method: 'input', type: 'number', model: 'wfOrderTotalQty', scan: false, size: 10},

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
    this.storage.set("wfProcess", this.dataWfProcess);
    this.storage.set("wfMachine", this.dataMachine);
    this.storage.get("wfProcess");
    this.storage.get("wfMachine");

  };

  onAddWf(){

    // Testing code for storage for demonstration purpose
    // Check if there is any result from the storage
    // 3 degrees of checking, 1. Check Server, Check Local Storage, Else it is a new order
    
    console.log("onAddWF is triggered!");

    let form = this.wfInputForm;

    if (form.value.wfFormId === "") {
      let alertTest = this.alertCtrl.create({
        title: '确认工单',
        message: '嚫，请选择工单',
        buttons: [
          {
            text: '取消',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: '裸品流程卡',
            handler: () => {
              console.log("nothing in the form");

              // workflow 1
              let data = JSON.stringify({ "headers":
                { "erpData": "ngForm"},
                "bodies":
                  { "erpData":
                    {"wfProcess": "1",
                      "wfProcessName": "釘卷",
                      "wfForm": "1",
                      "wfFormId": "VT00001",
                      "wfOrderFormId": "VTOF00001",
                      "wfOrderId": "VTO00001",
                      "wfOrderBatchId": "VTOB0001",
                      "wfOrderBatchQty": "100",
                      "wfOrderTotalQty": "1000",
                      "wfOrderTotalGoodQty": "100",
                      "wfOrderTotalBadQty": "0",
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
                      "wfProcessStatus": "0",
                      "wfFormStatus": "0"
                    }
                  }
              });
              this.testDataPopulate(data,form);
              console.log("裸品流程卡 Alert Controller has been clicked");
            }
          },
          {
            text: '成品流程卡',
            handler: () => {
              console.log("nothing in the form");

              // workflow 2
              let data = JSON.stringify({ "headers":
                { "erpData": "ngForm"},
                "bodies":
                  { "erpData":
                    {"wfForm":"2",
                      "wfProcess": "1",
                      "wfProcessName": "打印",
                      "wfFormId": "VT0002",
                      "wfOrderId": "VTO0002",
                      "wfOrderBatchId": "VTB0002",
                      "wfOrderBatchQty": "100",
                      "wfOrderFormNote": "嚫，這是測試FORM",
                      "wfOrderBOMNote": "嚫，這是測試BOM",
                      "wfOrderNote": "嚫，這是測試Note",
                      "wfOrderTotalQty":"10000",
                      "wfOrderTotalGoodQty":"1000",
                      "wfOrderTotalBadQty": "0",
                      "wfOrderRMId":"VTRM0001",
                      "wfOrderSeries": "VTRM 10x10x20",
                      "wfOrderSpec": "20x20x10",
                      "wfOrderDim": "10cm",
                      "wfRMUpBeltName": "上帶RM001",
                      "wfRMDownBeltName": "下帶RM001",
                      "wfRMBaseName": "底座 001",
                      "wfRMCircleName": "圓卡 0001",
                      "wfRMPrintName": "Ink2001",
                      "wfOptMachineId": "AAA01",
                      "wfClientId": "SA0001",
                      "wfFormName":"成品流程卡",
                      "wfSalesOrderId": "VTSO001",
                      "wfProcessStatus": "0",
                      "wfFormStatus": "0"
                    }
                  }
              });
              this.testDataPopulate(data,form);
              console.log("成品流程卡 Alert Controller has been clicked");
            }
          }

        ]
      });
      alertTest.present();
    }

    this.dataSubmission(form);

    console.log('onAddWf has completed!');

  }

  // scanBarcode(model: string){
  //
  //   let form = this.wfInputForm;
  //
  //   console.log("scanning Barcode");
  //   console.log(model);
  //
  //   this.barcodeScanner.scan().then((barcodeData) => {
  //     // Success! Barcode data is here
  //     // Limiter to assume the Barcode is default used in this orderID
  //
  //     if ( barcodeData.format && barcodeData.format != "QR_CODE" ) {
  //       console.log("this is barcode");
  //
  //       let data = barcodeData.text;
  //
  //       form.controls[model].setValue(data);
  //
  //     } else if (barcodeData.format == "QR_CODE") {
  //       // alert('嚫，请确定你所扫描的条码是正确的');
  //       // Try if it is QR code
  //       console.log(barcodeData.text);
  //       //alert(barcodeData.text);
  //       console.log("This is QR Code");
  //       this.qrCodePopulate(barcodeData.text);
  //
  //     } else {
  //
  //       alert('嚫，请确定你所扫描的条码是正确的');
  //     }
  //   }, (err) => {
  //     // An error occurred
  //     alert(err);
  //   });
  // }

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

  // qrCodePopulate(barcodeData: string) {
  //
  //   // This function takes the barcode data and then process the JSON object
  //   // Assume each barcode data is a JSON object and it has a headers and bodies component
  //   // Loop through the headers
  //   // for each header,
  //   //    check if the length is > 0, which is a sub JSON array object for data table
  //   //    else loop through the keys inside that header JSON object
  //
  //   console.log("running qrCodePop");
  //   console.log(barcodeData);
  //
  //   let data = JSON.parse(barcodeData);
  //   let headers = data.headers;
  //   let bodies = data.bodies;
  //   let form = this.wfInputForm;
  //
  //   // console.log(data);
  //
  //   for (let key in headers) {
  //     // console.log(key + " : " + headers[key])
  //     switch(headers[key]) {
  //       case "ngForm":
  //         // console.log(key + " is a form")
  //
  //         let formBodies = bodies[key];
  //         for (let formKey in formBodies) {
  //           // console.log("populate form model " + formKey);
  //           // console.log("populating model " + formKey + " " + formBodies[formKey]);
  //
  //           try {
  //             // Dynamically set form value from the scanned code data
  //             // try and catch here is to protect if some of the fields are missing or failed,
  //             // then it will skip onto the next key
  //
  //             // This use form control for the value setting
  //             // console.log("formKey : " + formKey);
  //             // console.log("Form " + form[formKey]);
  //
  //             this.setFormValue(formKey, formBodies[formKey]);
  //
  //           }
  //           catch(err) {
  //             console.log(err.message);
  //             eval('form.value.' + formKey + '= "' + formBodies[formKey] + '"; ');
  //             eval('console.log("Retrying force input " + form.value.'+ formKey + ')');
  //             eval('console.log(form.value.' + formKey + ');');
  //             // console.log("barcode loaded in form:" + JSON.stringify(form.value));
  //           }
  //
  //         }
  //
  //         console.log("barcode loaded in form:" + JSON.stringify(form.value));
  //         break;
  //
  //       case "ngStorage":
  //         console.log(key + " is a storage");
  //
  //         this.storage.set(key, bodies[key]);
  //
  //         console.log(bodies[key]);
  //
  //         // Testing the storage has been set
  //         this.storage.get(key).then((values) => {
  //           for (let valKey in values) {
  //             console.log(values[valKey]);
  //           }
  //           console.log(key);
  //           console.log(JSON.stringify(values));
  //         });
  //
  //         break;
  //
  //       case "ngInput":
  //         console.log(key + " is for input");
  //
  //         console.log(bodies[key]);
  //
  //         let inputBodies = bodies[key];
  //         for (let inputKey in inputBodies) {
  //           // console.log("populate form model" + inputKey);
  //
  //           try {
  //             // Dynamically set form value from the scanned code data
  //             // try and catch here is to protect if some of the fields are missing or failed,
  //             // then it will skip onto the next key
  //
  //             // This line no longer works
  //             eval('this.' + inputKey + " = " + inputBodies[inputKey]);
  //
  //           }
  //           catch(err) {
  //             console.log(err.message);
  //           }
  //         }
  //
  //         break;
  //
  //       case "wfMachine":
  //
  //         let wfMachineId = bodies[key];
  //
  //         this.storage.get(wfMachineId).then((values) => {
  //           let staffData = values[wfMachineId];
  //
  //         });
  //
  //         console.log("barcode loaded in form:" + JSON.stringify(form.value));
  //
  //
  //         break;
  //
  //       case "wfQC":
  //
  //         break;
  //
  //
  //       default:
  //         console.log(key + " is error");
  //     }
  //   }
  // }

  testDataPopulate(data:any, form:any) {
    this.QRCode.qrCodePopulate(data,form);
    this.storage.set(form.value.wfFormId, form.value);
    this.workflowStateChange();
  }

  dataSubmission(form: any) {
    this.wfSvc.query(form.value, form.value.wfForm).subscribe( (serverData) => {
      console.log("Response from server: " + JSON.stringify(serverData[0]));
      this.populateDataToForm(form, serverData[0]);
      this.workflowStateChange();

    },(err)=>{
      alert("嚫,网路不给力");
      console.log(err);
      this.storage.get(form.value.wfFormId).then(storageData => {
        if(storageData){
          console.log("Result found:" + form.value.wfFormId);
          this.populateDataToForm(form, storageData);
        } else {
          alert("嚫，查木记录")
        }

        // Execute workflowStateChange for New Form or continue existing form
        this.workflowStateChange();
      });
    });
  }

  workflowStateChange() {
    // If the form is mark completed, then trigger the process
    // Check the type of wfForm,
    // Then increment the wfProcess if it is mark completed
    console.log("In the func of workflowStateChange");

    let form = this.wfInputForm;
    let wfPOldState: any;
    let wfPNewState: any;

    this.storage.get("wfProcess").then(storageData => {

      let wfStorage = storageData;
      console.log(wfStorage);
      console.log("Loading the form from stateChange");

      console.log('form.value.wfFormStatus ' + form.value.wfFormStatus);
      console.log('form.value.wfProcessStatus ' + form.value.wfProcessStatus);

      if (form.value.wfFormStatus === "" || form.value.wfFormStatus == null) {
        form.value.wfFormStatus = '0';
      }

      if (form.value.wfProcessStatus === "" || form.value.wfProcessStatus == null) {
        form.value.wfProcessStatus = "1";
        wfPNewState = "1";
        form.value.wfFormName = wfStorage[form.value.wfForm].wfFormName;
      }

      if (form.value.wfFormStatus == '0' && form.value.wfProcessStatus == '1') {
        // load the process from storage
        console.log("Loading wfProcess from storage");
        console.log("wfForm is: " + form.value.wfFormId);
        console.log("Printing wfProcess: " + JSON.stringify(wfStorage[form.value.wfForm].Process));
        console.log("form.value.wfProcess " + form.value.wfProcess.toString() + " " + typeof(form.value.wfProcess.toString()));

        // load the next state of the change
        // Change all to String for safety
        if (form.value.wfProcess.toString() == "" || form.value.wfProcess.toString() == null ) {
          wfPNewState = "1";
        } else {
          wfPOldState = Object.keys(wfStorage[form.value.wfForm].Process).indexOf(form.value.wfProcess.toString());
          wfPNewState = Object.keys(wfStorage[form.value.wfForm].Process)[wfPOldState+1];

          // If there is no more process, then break the process
          if (wfPNewState == null) {
            return alert("嚫，此工單的所有工序己完成!");
          }
        }

        console.log("wfPOldState: " + wfPOldState);
        console.log("wfPNewState: " + wfPNewState);

        // Assign new value into the form
        form.value.wfFormName = wfStorage[form.value.wfForm].wfFormName;
        form.value.wfProcess = wfPNewState;
        form.value.wfProcessName = wfStorage[form.value.wfForm].Process[wfPNewState];

        console.log("New state is " + form.value.wfProcess + " " + form.value.wfProcessName);
        console.log(form.value);

        this.storage.set(form.value.wfFormId, form.value);

      } else if (form.value.wfProcessStatus == '0') {
        console.log("Previous process has not completed and will resume now");
        form.value.wfFormName = wfStorage[form.value.wfForm].wfFormName;

      } else if (form.value.wfFormStatus == '1') {
        return alert("This wfForm has been marked complete");
      }

      console.log("This is the form after the state change");
      console.log(form.value);

      // The following part will trigger the next stage wfPage
      console.log("Will enter " + form.value.wfFormName + " edit page now");
      console.log("流程卡" + form.value.wfFormId);

      switch (form.value.wfForm.toString()) {
        case '1':
          this.navCtrl.push(EditWorkflow1Page, form.value.wfFormId);
          break;

        case '2':
          this.navCtrl.push(EditWorkflow2Page, form.value.wfFormId);
          break;

        case '3':
          console.log("Form 3 is not ready");
          // this.navCtrl.push(EditWorkflow3Page);
          break;

        default:
          console.log("Requesting form beyond 3");
      }


    });


  }

  populateDataToForm(form: any, data: any){
    let qrCode = { "headers": { "erpData": "ngForm"},
      "bodies": { "erpData": data}};

    let _data = JSON.stringify(qrCode);
    this.QRCode.qrCodePopulate(_data, form);
  }

  private formInit() {
    this.wfInputForm = this.formBuilder.group({
      wfProcess: [''],
      wfProcessName: [''],
      wfForm: [''],
      wfFormId: [''],
      wfOrderId: [''],
      wfOrderBatchId: [''],
      wfOrderBatchQty: [''],
      wfOrderTotalQty: ['']

    });
  }

}
