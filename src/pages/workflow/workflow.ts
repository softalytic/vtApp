import { Component, OnInit} from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { WorkflowService } from "../../services/workflow";
import { QRCodeService } from "../../services/qrCode";

import { EditWorkflow1Page } from "../edit-workflow1/edit-workflow1";
import { EditWorkflow2Page } from "../edit-workflow2/edit-workflow2";
import { EditWorkflow3Page } from "../edit-workflow3/edit-workflow3";


@Component({
  selector: 'page-workflow',
  templateUrl: 'workflow.html'
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
    "1":{"wfFormName": "裸品流程卡", "Process":{"1":"釘卷","2":"含浸","3":"组立","4":"清洗","5":"自動/手工老化","6":"串排","7":"测试分选","8":"外观"}},
    "2":{"wfFormName": "成品流程卡", "Process":{"1":"打印","2":"测试上带","3":"贴片外观","4":"终检"}},
    "3":{"wfFormName": "电容器流程卡", "Process":{"1":"素子钉卷","2":"組立","3":"套管","4":"老化","5":"手工分选","6":"外观全检","7":"编带剪切","8":"包装"}}
  };

  dataMachine = {
    "AA001":{"wfStaffOptId":"S0001","wfStaffOptName":"員工01","wfStaffTechId":"T0001","wfStaffTechName":"技術員工01","wfStaffXrayId":"X0001","wfStaffXrayName":"Xray員工01","wfStaffOptShift":"A"},
    "AB002":{"wfStaffOptId":"S0002","wfStaffOptName":"員工02","wfStaffTechId":"T0002","wfStaffTechName":"技術員工01","wfStaffXrayId":"X0002","wfStaffXrayName":"Xray員工02","wfStaffOptShift":"B"},
    "AC003":{"wfStaffOptId":"S0003","wfStaffOptName":"員工03","wfStaffTechId":"T0003","wfStaffTechName":"技術員工03","wfStaffXrayId":"X0003","wfStaffXrayName":"Xray員工03","wfStaffOptShift":"A"}
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
      {title: "流程卡号", method: 'input', type: 'text', model: 'wfFormId', scan: true, size: 25},
      {title: "台机号", method: 'input', type: 'text', model: 'wfOptMachineId', scan: true, size: 25},
      // {title: "工单号", method: 'input', type: 'text', model: 'wfOrderId', scan: false, size: 20},
      //{title: "总量(预设)", method: 'input', type: 'number', model: 'wfOrderTotalQty', scan: false, size: 10},

      // Prompt Screen alert to pick the workflow batch id
      // {title: "批次号", method: 'input', type: 'text', model: 'wfOrderBatchId', scan: false, size: 20},
      // {title: "总量(批次)", method: 'input', type: 'number', model: 'wfOrderBatchQty', scan: false, size: 10},

      {method: "break", size: 20},

      // Expand as buttons
      {title: "流程卡", method: 'buttons', options: [
        {value: '1', label: '裸品'},
        {value: '2', label: '成品'},
        {value: '3', label: '电容器'}
      ], model: 'wfForm', scan: false, size: 100}
    ];

  }

  ngOnInit() {
    this.formInit();

    // This is to initialise the storage with core data tables for the app
    this.storage.clear();
    this.storage.set("wfProcess", this.dataWfProcess);
    this.storage.set("wfMachine", this.dataMachine);

  };

  onAddWf(){
    // Main form submission function
    // Form validation steps
    // if the form.value.wfFormId is null or not being entered, then
    //    current the alert is set to pre-fill the testing data
    //    alert the users
    // else
    //    submission the form
    
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
                    {
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
          }, {
            text: '电容器流程卡',
            handler: () => {
              console.log("nothing in the form");

              // workflow 3
              let data = JSON.stringify({ "headers":
                { "erpData": "ngForm"},
                "bodies":
                  { "erpData":
                    {
                      "wfForm": "3",
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
          }

        ]
      });
      alertTest.present();

    } else {
      this.dataSubmission(form);

    }

    console.log('onAddWf has completed!');

  }

  setFormValue(model: string, value: any){
    // This function is being called from the html for form value setting
    // Do not delete

    let form = this.wfInputForm;

    form.controls[model].setValue(value);

  }

  testDataPopulate(data:any, form:any) {
    // This function is temp for onAddWf testing data pre-filled
    // It is used to submit the data into storage and call workflowStateChange
    // QRCode service is being used

    this.QRCode.qrCodePopulate(data,form);
    this.storage.set(form.value.wfFormId, form.value);
    this.workflowStateChange();
  }

  dataSubmission(form: any) {
    // This function is to capture the data from the form and call the business logic
    // Steps of Checking
    //   1. Check Server with wfSvc, if this record exist on server for latest update
    //   2. Check if local storage has the record
    //   3. Else it is a new record on the app

    this.wfSvc.query(form.value, form.value.wfForm).subscribe( (serverData) => {
      console.log("Response from server: " + JSON.stringify(serverData[0]));
      // this.populateDataToForm(form, serverData[0]);

      // The codes below replace the upper function, with below assumption
      // 1. All the input on the screen assume to be latest and correct before user proceed to next stage
      // 2. Through the barcode scan, which all the data will be called from the server
      // 3. Which user can then decide what is the phase of next step
      this.loadDataToForm(form, serverData[0]);

      // This function is for automatic workflow state change base on previous business rule
      // As the current app has lift up the limitation and let user choose the workflow,
      // then you can either comment out most of the code within this function
      // or simply re-write the nav push in a separate function
      this.workflowStateChange();

    },(err)=>{
      // If there is any error or unsuccessful connection
      // Then throw alert to user about the network error
      alert("嚫,网路不给力");
      console.log(err);
      console.log("Trying to load data from storage");

      // Proceed to checking with storage, in event of offline mode
      this.storage.get(form.value.wfFormId).then(storageData => {
        // If there is record from the storage,
        //    proceed to load data to form
        // Else
        //    treat it as new record
        if(storageData){
          console.log("Result found:" + form.value.wfFormId);
          // this.populateDataToForm(form, storageData);

          // This code below replace the upper function,
          // this is to assume the latest input from user is always correct
          // Only will override if there is no input at all
          this.loadDataToForm(form, storageData);

        }

        // Execute workflowStateChange for New Form or continue existing form
        // This function is for automatic workflow state change base on previous business rule
        // As the current app has lift up the limitation and let user choose the workflow,
        // then you can either comment out most of the code within this function
        // or simply re-write the nav push in a separate function
        this.workflowStateChange();

      }, err => {
        console.log("cant find record");

      });
    });
  }

  workflowStateChange() {
    // Original business logic in this function
    // 1. Get the wfProcess from the storage for the wf state processing
    // 2. Assign wfForm name, because it is needed regardless
    // 3. If wfFormStatus is null or empty, default it with 0
    // 4. If wfProcessStatus is null or empty, default it with 0
    // 5. If the form is not completed and current process is marked complete then
    //    Look up the index position of the current wfProcess
    //    Increment index position and return the result to form
    // 6. Save into storage
    // 7. Push to next Nav page

    // Follow up issue:
    // Since the user can individually select the workflow as they desire.
    // There is no need to automatically set the workflow status.
    // Then you can either comment out or delete the function below
    console.log("In the func of workflowStateChange");

    let form = this.wfInputForm;
    let wfPOldState: any;
    let wfPNewState: any;

    this.storage.get("wfProcess").then(storageData => {

      let wfStorage = storageData;
      console.log("Loading the wfProcess from stateChange" + JSON.stringify(wfStorage));
      console.log('form.value.wfFormStatus ' + form.value.wfFormStatus);
      console.log('form.value.wfProcessStatus ' + form.value.wfProcessStatus);


      form.value.wfFormName = wfStorage[form.value.wfForm].wfFormName;

      if (form.value.wfFormStatus == "" || form.value.wfFormStatus == null) {
        form.value.wfFormStatus = '0';
      }

      if (form.value.wfProcessStatus == "" || form.value.wfProcessStatus == null) {
        form.value.wfProcessStatus = "0";
        // wfPNewState = "1";
      }

      if (form.value.wfFormStatus.toString() == '0' && form.value.wfProcessStatus.toString() == '1') {
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
            // Need to fine tune this alert if have time
            return alert("嚫，此工單的所有工序己完成!");
          }
        }

        console.log("wfPOldState: " + wfPOldState);
        console.log("wfPNewState: " + wfPNewState);

        // Assign new value into the form
        form.value.wfProcess = wfPNewState;
        form.value.wfProcessName = wfStorage[form.value.wfForm].Process[wfPNewState];

        console.log("New state is " + form.value.wfProcess + " " + form.value.wfProcessName);
        console.log( "New state form : " + JSON.stringify(form.value));

      } else if (form.value.wfProcessStatus == '0') {
        console.log("Previous process has not completed and will resume now");

      } else if (form.value.wfFormStatus == '1') {
        return alert("This wfForm has been marked complete");

      }

      console.log("Saving the form into storage");
      this.storage.set(form.value.wfFormId, form.value);
      console.log("This is the form after the state change " + JSON.stringify(form.value));

      // The following part will trigger the next stage wfPage
      console.log("Will enter " + form.value.wfFormName + " edit page now");
      console.log("流程卡 " + form.value.wfFormId);

      switch (form.value.wfForm.toString()) {
        case '1':
          this.navCtrl.push(EditWorkflow1Page, form.value.wfFormId);
          break;

        case '2':
          this.navCtrl.push(EditWorkflow2Page, form.value.wfFormId);
          break;

        case '3':
          this.navCtrl.push(EditWorkflow3Page, form.value.wfFormId);
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

  loadDataToForm(form:any, data:any) {
    // This function populate the data to form in the main page workflow because
    // it will not overwrite existing data field on the form.
    //
    // For each key field in the data to be filled
    //    Check If form control field being filled then
    //      Skip it with assumption that current user input is always correct
    //    Else
    //      Fill it
    // If form.control populate has filled, then
    // Try to fill it by force
    // Note: The sequence is important, must first execute all the form.control filling
    //       Then proceed to fill the non form control fields.
    //       Otherwise, the form control will clear all the inputs

    console.log("Loading data to form, data are " + JSON.stringify(data));

    for (let key in data) {
      try {
        // This use form control for the value setting
        if (form.controls[key].value == null || form.controls[key].value == "" ) {
          console.log("populate form model " + key);
          console.log("populating model " + key + " " + data[key]);
          form.controls[key].setValue(data[key]);
        }

      }
      catch(err) {
        console.log(err.message);
        // Use eval to dynamically inject the value into the form
        eval('form.value.' + key + '= "' + data[key] + '"; ');
        eval('console.log("Retrying force input " + form.value.'+ key + ')');
        eval('console.log(form.value.' + key + ');');
      }

    }
  }

  private formInit() {
    this.wfInputForm = this.formBuilder.group({
      wfProcess: [''],
      wfProcessName: [''],
      wfForm: [''],
      wfFormId: [''],

      // wfOrderId: [''],
      // wfOrderBatchId: [''],
      // wfOrderBatchQty: [''],
      // wfOrderTotalQty: [''],
      wfOptMachineId: [''],

    });
  }

}