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
    "1":{"wfFormName": "裸品流程卡", "Process":{"1":"釘卷","2":"含浸","3":"组立","4":"清洗","5":"自動老化","6":"手工老化","7":"串排","8":"测试分选","9":"外观"}},
    "2":{"wfFormName": "成品流程卡", "Process":{"1":"打印","2":"测试上带","3":"贴片外观","4":"终检"}},
    "3":{"wfFormName": "电容器流程卡", "Process":{"1":"素子钉卷","2":"烘干","3":"含浸","4":"組立","5":"清洗","6":"套管","7":"老化","8":"手工分选","9":"外观全检","10":"编带剪切"}} /* ,"11":"包装" */
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
      {title: "分单", method: 'select', type: 'text', model: 'wfFormSplit', scan: false, size: 5},
      {title: "台机号", method: 'input', type: 'text', model: 'wfOptMachineId', scan: true, size: 25},

      //{title: "总量(预设)", method: 'input', type: 'number', model: 'wfOrderTotalQty', scan: false, size: 10},

      // Prompt Screen alert to pick the workflow batch id
      // {title: "批次号", method: 'input', type: 'text', model: 'wfOrderBatchId', scan: false, size: 20},
      // {title: "总量(批次)", method: 'input', type: 'number', model: 'wfOrderBatchQty', scan: false, size: 10},

      {method: "break", size: 20},

      // Expand as buttons
      {title: "流程卡", method: 'buttons', options: [
        {value: '1', label: '裸品'},
        {value: '2', label: '贴片电容器'},
        {value: '3', label: '插件电容器'}
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

    if (form.value.wfFormId === "" || form.value.wfForm === "" || form.value.wfProcess === "" || form.value.wfOptMachineId === "") {
      //this.wfSvc.warningAlert(' name:' + form.value.wfFormName + ' id: ' + form.value.wfFormId + ' ' + form.value.wfProcess + ' form id' + form.value.wfForm, '嚫，请选择工单', '继續');
      let formMsgAlert = '';
      if(form.value.wfFormId === "") {
        formMsgAlert += '<br><br>1. 輸入流程卡号';
      }
      if(form.value.wfOptMachineId === "") {
        formMsgAlert += '<br><br>2. 輸入台机号';
      }
      if(form.value.wfForm === "") {
        formMsgAlert += '<br><br>3. 選擇流程卡';
      }
      if(form.value.wfProcess === "") {
        formMsgAlert += '<br><br>4. 選擇工序';
      }
      this.wfSvc.warningAlert('請提供或更正下列资料：', formMsgAlert + '<br><br>然後按 \" 確定\”', '继續');
    } 
    else {
      
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

      if(serverData[0] == "" || serverData[0] == [] || serverData[0] == null){
        this.wfSvc.erpQuery(form.value).subscribe( (serverData) => {

          if(serverData[0] == "" || serverData[0] == [] || serverData[0] == null){
            alert("查无此单号")
          } else {
            // alert(JSON.stringify(serverData[0]));
            console.log("Response from ERP server: " + JSON.stringify(serverData[0]));
            // The codes below replace the upper function, with below assumption
            // 1. All the input on the screen assume to be latest and correct before user proceed to next stage
            // 2. Through the barcode scan, which all the data will be called from the server
            // 3. Which user can then decide what is the phase of next step
            this.loadDataToForm(form, serverData[0]);
            // this.populateDataToForm(form, serverData[0]);

            // This function is for automatic workflow state change base on previous business rule
            // As the current app has lift up the limitation and let user choose the workflow,
            // then you can either comment out most of the code within this function
            // or simply re-write the nav push in a separate function

            this.workflowStateChange();

          }
        });

      } else {
        // alert(JSON.stringify(serverData[0]));
        console.log("Response from App server: " + JSON.stringify(serverData[0]));
        // The codes below replace the upper function, with below assumption
        // 1. All the input on the screen assume to be latest and correct before user proceed to next stage
        // 2. Through the barcode scan, which all the data will be called from the server
        // 3. Which user can then decide what is the phase of next step
        this.loadDataToForm(form, serverData[0]);
        // this.populateDataToForm(form, serverData[0]);

        // This function is for automatic workflow state change base on previous business rule
        // As the current app has lift up the limitation and let user choose the workflow,
        // then you can either comment out most of the code within this function
        // or simply re-write the nav push in a separate function

        this.workflowStateChange();

      }

      this.workflowStateChange();


    },(err)=>{
      // If there is any error or unsuccessful connection
      // Then throw alert to user about the network error
      // alert("Running ERP data");
      console.log(err);
      console.log("Trying to load data from storage");

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

        this.workflowStateChange();

      });

      // this.workflowStateChange();

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
    console.log(JSON.stringify(this.wfInputForm.value));

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
        // form.controls[key].setValue(data[key]);

        if (form.controls[key].value == null || form.controls[key].value == "" ) {
          console.log("populate form model " + key);
          console.log("populating model " + key + " " + data[key]);
          form.controls[key].setValue(data[key]);
          eval('console.log(form.value.' + key + ');');
          console.log(JSON.stringify(form.value));
        }

      }
      catch(err) {
        console.log(err.message);
        // Use eval to dynamically inject the value into the form
        // eval('form.value.' + key + '= "' + data[key] + '"; ');
        // eval('console.log("Retrying force input " + form.value.'+ key + ')');
        // eval('console.log(form.value.' + key + ');');
      }

    }
  }

  private formInit() {
    this.wfInputForm = this.formBuilder.group({
      wfProcess: [''],
      wfProcessName: [''],
      wfForm: [''],
      wfFormId: [''],
      wfFormSplit: [0],

      // wfOrderId: [''],
      // wfOrderBatchId: [''],
      // wfOrderBatchQty: [''],
      // wfOrderTotalQty: [''],
      wfOptMachineId: [''],

      wfSpecCap: [''],
      wfSpecDF: [''],
      wfSpecLC: [''],
      wfSpecZESR: [''],
      wfAgeVoltSet: [''],
      wfPriorWfFormId: [''],
      wfNakedProductSpec: [''],
      wfOrderId: [''],
      wfOrderSeries: [''],
      wfOrderBatchId: [''],
      wfOrderRMId: [''],
      wfOrderSpec: [''],
      wfOrderDim: [''],
      wfOrderBatchQty: [''],
      wfOrderTotalQty: [''],
      wfSalesOrderQty: [''],
      wfClientId: [''],
      wfOrderFormNote: [''],
      wfOrderNote: [''],
      wfOrderBOMNote: [''],
      wfSalesOrderNote: [''],
      wfOrderDate: [''],
      wfOrderStartDate: [''],
      wfOrderEstFinishDate: [''],
      wfOrderDeliveryDate: [''],
      wfOrderTK: [''],

      // RM part of the detail
      wfRMFoilPosName: [''],
      wfRMFoilPosCapFrom: [''],
      wfRMFoilPosCapTo: [''],
      wfRMFoilPosWidth: [''],
      wfRMFoilPosLength: [''],

      wfRMFoilNegName: [''],
      wfRMFoilNegCapFrom: [''],
      wfRMFoilNegCapTo: [''],
      wfRMFoilNegWidth: [''],
      wfRMFoilNegLength: [''],
      wfRMFoilNegQty: [''],

      wfRMPaperName: [''],
      wfRMPaperQty: [''],
      wfRMPinPosName: [''],
      wfRMPinNegName: [''],
      wfRMPinQty: [''],
      wfRMGlueName: [''],
      wfRMSolName: [''],
      wfRMSolQty: [''],
      wfRMShellName: [''],
      wfRMShellQty: [''],
      wfRMPlasticName: [''],
      wfRMPlasticQty: [''],
      wfRMCoverName: [''],
      wfRMCoverQty: [''],
      wfRMUpBeltName: [''],
      wfRMDownBeltName: [''],
      wfRMBaseName: [''],
      wfRMCircleName: [''],
      wfRMFoilPosSerial: [''],
      wfRMFoilNegSerial: [''],
      wfRMPaperSerial: [''],
      wfRMGlueSerial: [''],
      wfRMSolSerial: [''],
      wfRMPinPosSerial: [''],
      wfRMPinNegSerial: [''],
      wfRMPlasticSerial: [''],
      wfRMShellSerial: [''],
      wfRMCoverSerial: [''],

      // Status update part of the data
      wfOptStartQty: [''],
      wfBadTotal: [''],
      wfGoodTotal: [''],

      wfFormStatus: [''],
      wfProcessStatus: [''],
      created: ['']

    });
  }

}