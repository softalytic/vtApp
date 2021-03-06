import { Component, OnInit} from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { WorkflowService } from "../../services/wfServer";
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

  wfForms = [];
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

  wfLoad = false;

  testRadioOpen = false;

  dataWfProcess = {
    // "1":{"wfFormName": "裸品流程卡", "Process":{"1":"钉卷","2":"含浸","3":"组立","4":"清洗","5":"自动老化","6":"手工老化","7":"串排","8":"测试分选","9":"外观"}},
    // "2":{"wfFormName": "成品流程卡", "Process":{"1":"打印","2":"测试上带","3":"贴片外观","4":"终检"}},
    // "3":{"wfFormName": "电容器流程卡", "Process":{"1":"素子钉卷","2":"烘干","3":"含浸","4":"组立","5":"清洗","6":"套管","7":"老化","8":"手工分选","9":"外观全检","10":"编带剪切"}} /* ,"11":"包装" */

    "1":{"wfFormName": "裸品流程卡", "Process":{"1":"钉卷","3":"组立","5":"自动老化","6":"手工老化","8":"选别外观"}},
    "2":{"wfFormName": "成品流程卡", "Process":{"1":"打印","2":"测试上带","3":"成品外观"}},
    "3":{"wfFormName": "电容器流程卡", "Process":{"1":"钉卷","4":"组立","6":"套管","7":"老化","9":"选别外观","10":"编带","11":"成品外观"}} /* ,"11":"包装" */
  };

  dataMachine = {
    "AA001":{"wfStaffOptId":"S0001","wfStaffOptName":"员工01","wfStaffTechId":"T0001","wfStaffTechName":"技术员工01","wfStaffXrayId":"X0001","wfStaffXrayName":"Xray员工01","wfStaffOptShift":"A"},
    "AB002":{"wfStaffOptId":"S0002","wfStaffOptName":"员工02","wfStaffTechId":"T0002","wfStaffTechName":"技术员工01","wfStaffXrayId":"X0002","wfStaffXrayName":"Xray员工02","wfStaffOptShift":"B"},
    "AC003":{"wfStaffOptId":"S0003","wfStaffOptName":"员工03","wfStaffTechId":"T0003","wfStaffTechName":"技术员工03","wfStaffXrayId":"X0003","wfStaffXrayName":"Xray员工03","wfStaffOptShift":"A"}
  };

  storageData = [];

  constructor(private storage: Storage,
              private QRCode: QRCodeService,
              private wfSvc: WorkflowService,
              private formBuilder: FormBuilder,
              private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController){

    storage.ready().then(() => { });

    this.wfProcesses = [
      {title: '钉卷', process: "1", show: true},
      {title: '含浸', process: "2", show: true},
      {title: '组立', process: "3", show: true},
      {title: '清洗', process: "4", show: true},
      {title: '手工老化', process: '5a0', show: true},
      {title: '自动老化', process: '5b0', show: true},
    ];

    this.wfInputs = [
      {title: "流程卡号", method: 'input', type: 'text', model: 'wfFormId', scan: true, size: 25},
      {title: "台机号", method: 'input', type: 'text', model: 'wfOptMachineId', scan: true, size: 25},

      {method: "break", size: 10},

      {title: "分单", method: 'select', type: 'text', model: 'wfFormSplit', scan: false, size: 6},
      {title: "", method: 'button', label: "异常", model: 'wfFormExcept', scan: false, size: 8},
      {method: "break", size: 20},


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

  ngOnInit(){
    this.formInit();

    console.log("The beginning of the form " + JSON.stringify(this.wfInputForm.value));

    // This is to initialise the storage with core data tables for the app
    // this.storage.clear();
    this.storage.set("wfProcess", this.dataWfProcess);
    this.storage.set("wfMachine", this.dataMachine);

    this.wfLoad = false;

    this.wfInputForm.controls["wfFormExcept"].setValue(false);

    this.storage.get("backupForm").then((data) => {
      console.log("loading backupForm");
      if (typeof data == 'undefined'  || data == "" || data == null){
        this.storageData = [];

      } else {
        this.storageData = data;

      }

      console.log(this.storageData);

    }, error => {
      console.log("No Pending data is found" + error);
      this.storageData = [];
    })

  };

  resetForm(form:any, model:string){
    console.log("Evaluating if Form should be reset");

    var str = form.controls[model].value;
    form.controls[model].setValue(str.toUpperCase());

    if (model == "wfFormId" && form.value.wfFormId != "" && form.value.wfFormId != null) {
      console.log("There will be new input, resetting the form now");
      for (let key in form.value) {
        if( key != "wfFormId") {
          if (key == "wfFormSplit") {
            form.controls[key].setValue(0);
          } else {
            form.controls[key].setValue('');
          }
        }
      }
    }
  }

  formValidation(form:any){
    console.log("formValidation is being called");

    if (form.value.wfFormId === "" || form.value.wfForm === "" || form.value.wfProcess === "" || form.value.wfOptMachineId === "") {
      //this.wfSvc.warningAlert(' name:' + form.value.wfForm + ' id: ' + form.value.wfFormId + ' ' + form.value.wfProcess + ' form id' + form.value.wfForm, '嚫，请选择工单', '继续');

      let formMsgAlert = [];
      if(form.value.wfFormId === "") {
        formMsgAlert.push('输入流程卡号');
      }
      if(form.value.wfOptMachineId === "") {
        formMsgAlert.push('输入台机号');
      }
      if(form.value.wfForm === "") {
        formMsgAlert.push('选择流程卡');
      }
      if(form.value.wfProcess === "") {
        formMsgAlert.push('选择工序');
      }

      let formMsg = '';
      if(formMsgAlert.length){
        for(let key in formMsgAlert){
          formMsg += '<br>' + (this.wfSvc.toInt(key) + 1) +'.  '+formMsgAlert[key]
        }
      }

      this.wfSvc.warningAlert('请提供或更正下列资料：', formMsg + '<br><br>然后按 \" 确定\”', '继续');
      return false;

    } else {
      return true;

    }

  }

  onAddWf(){
    console.log("onAddWF is triggered!");

    let form = this.wfInputForm;

    if (this.formValidation(form)){
      console.log('form has been validated');
      this.dataSubmission(form);

    } else {
      console.log('form cannot be validated');

    }

  }

  setFormValue(model: string, value: any){
    // This function is being called from the html for form value setting
    // Do not delete
    let form = this.wfInputForm;

    form.controls[model].setValue(value);

  }

  dataSubmission(form: any) {
    // This function is to capture the data from the form and call the business logic
    // Steps of Checking
    //   1. Check Server with wfSvc, if this record exist on server for latest update
    //   2. Check if local storage has the record
    //   3. Else it is a new record on the app

    // Check Abnormal Status
    if (form.value.wfFormExcept) {
      this.wfSvc.erpQueryExcept(form).subscribe( (serverData) => {
        if(serverData[0] == "" || serverData[0] == [] || serverData[0] == null){
          alert("查无此异常单号记录");
        } else {
          // alert(JSON.stringify(serverData[0].wfFormId));
          if(form.value.wfFormId == serverData[0].wfFormId) {
            console.log(serverData[0].wfFormId + " confirmed as exceptional case");
            form.value.wfFormExcept = true;
            this.fillData(form,serverData[0]);
            this.serverQuery(form);

          }
        }
      },(err)=>{
        // If there is any error or unsuccessful connection
        // Then throw alert to user about the network error
        // Assume no offline mode for exceptional handling
        alert("亲,网路不给力 " + err);
        console.log(err);

      })

    } else {

      // Execute the Server Query directly
      this.serverQuery(form);

    }


  }

  serverQuery(form:any){
    console.log("serverQuery is being called");

    //Create loading screen
    let wfSvcLoading = this.loadingCtrl.create({
      content: "寻找上一个工序资料中。。。。"
    });

    // Loading screen will be there until loading.dismiss() is being called
    // Currently default it will timeout differently base on the type of the upload
    wfSvcLoading.present();

    this.wfSvc.query(form.value).subscribe( (serverData) => {
      wfSvcLoading.dismiss();

      if(serverData[0] == "" || serverData[0] == [] || serverData[0] == null){

        //Create loading screen
        let erpLoading = this.loadingCtrl.create({
          content: "寻找上ERP资料中。。。。"
        });

        // Loading screen will be there until loading.dismiss() is being called
        // Currently default it will timeout differently base on the type of the upload
        erpLoading.present();

        this.wfSvc.erpQuery(form.value).subscribe( (serverData) => {
          erpLoading.dismiss();

          if(serverData[0] == "" || serverData[0] == [] || serverData[0] == null){

            if(form.value.wfReadOnly){
              // If it is read only, then skip the remaining process
              alert("ERP查无此单号!");
              return

            } else {
              alert("ERP查无此单号,进入手工输入模式");
              if (!this.wfLoad){
                this.workflowStateChange();
              }

            }

          } else {
            // alert(JSON.stringify(serverData[0]));
            console.log("Response from ERP server: " + JSON.stringify(serverData[0]));
            // The codes below replace the upper function, with below assumption
            // 1. All the input on the screen assume to be latest and correct before user proceed to next stage
            // 2. Through the barcode scan, which all the data will be called from the server
            // 3. Which user can then decide what is the phase of next step

            if (!this.loadDataToForm(form, serverData[0])){return;}
            // this.populateDataToForm(form, serverData[0]);
            // This function is for automatic workflow state change base on previous business rule
            // As the current app has lift up the limitation and let user choose the workflow,
            // then you can either comment out most of the code within this function
            // or simply re-write the nav push in a separate function
            if (!this.wfLoad){
              this.workflowStateChange();
            }

          }
        }, err => {
          erpLoading.dismiss();
          if(form.value.wfReadOnly){
            // If it is read only, then skip the remaining process
            alert("ERP查无此单号!" + err);
            return

          } else {
            alert("亲,网路不给力" + err)
          }

        });

      } else {
        // alert(JSON.stringify(serverData[0]));
        console.log("Response from App server: " + JSON.stringify(serverData[0]));
        // The codes below replace the upper function, with below assumption
        // 1. All the input on the screen assume to be latest and correct before user proceed to next stage
        // 2. Through the barcode scan, which all the data will be called from the server
        // 3. Which user can then decide what is the phase of next step
        if (!this.loadDataToForm(form, serverData[0])){return;}
        // this.populateDataToForm(form, serverData[0]);
        // This function is for automatic workflow state change base on previous business rule
        // As the current app has lift up the limitation and let user choose the workflow,
        // then you can either comment out most of the code within this function
        // or simply re-write the nav push in a separate function
        if (!this.wfLoad){
          this.workflowStateChange();
        }

      }

      // this.workflowStateChange();

    },(err)=>{
      // If there is any error or unsuccessful connection
      // Then throw alert to user about the network error
      // alert("Running ERP data");
      wfSvcLoading.dismiss();

      // this.warningAlert("嚫!","网路不给力","知道了!");
      alert("亲,网路不给力 " + err);
      console.log("Trying to load data from storage");

      let tmpData: any;

      for (let key in this.storageData ) {
        let data = JSON.parse(this.storageData[key]);


        if(form.value.wfFormId == data.wfFormId && form.value.wfFormSplit == data.wfFormSplit){
          console.log("looping through wfFormId:" + data.wfFormId);
          console.log("looping through wfProcess:" + data.wfProcess);
          console.log("looping through wfProcessName:" + data.wfProcessName);
          console.log("looping through wfFormStatus:" + data.wfFormStatus);
          console.log("looping through wfProcessStatus:" + data.wfProcessStatus);
          console.log("looping through wfLastCompletedWf:" + data.wfLastCompletedWf);

          // Lookup of same wfForm ID + split ID
          if(typeof data["wfImg"] == 'undefined'){
            // Make sure it isnt images
            tmpData = data;

            if(this.wfSvc.toInt(data.wfProcess) == this.wfSvc.toInt(form.value.wfProcess) && form.value.wfStaffOptShift == data.wfStaffOptShift){
              // In readOnly mode, the form value for certain fields will be assigned and if the condition match, break the loop;
              console.log("data from storage" + key + JSON.stringify(data));

            } else if(tmpData == "" || tmpData == null || typeof tmpData == 'undefined'){
              // Initially assign value
              tmpData = data;
            } else if (this.wfSvc.toInt(data.wfProcess) > this.wfSvc.toInt(tmpData.wfProcess)) {
              // If the new data is more advance than tmpData
              tmpData = data;

            } else if (this.wfSvc.toInt(data.wfProcess) == this.wfSvc.toInt(tmpData.wfProcess)) {
              // If both process are equal
              if(tmpData.wfFormStatus) {
                // First assign if the wfFormStatus is completed
                tmpData = data;
              } else if (tmpData.wfProcessStatus) {
                // 2nd assign if wfProcessStatus is completed
                tmpData = data;
              }
            }
          }
        }
      };

      if (tmpData == "" || tmpData == null || typeof tmpData == 'undefined') {
        console.log("cant find record");

        // skip the process if read only is selected
        if(form.value.wfReadOnly){
          alert("查无此单号的工序");
          return;
        }

      } else {
        if (!this.loadDataToForm(form, tmpData)){
          // This func try to populate the data, if process is marked complete then
          // It will return and do nothing
          return;
        }

      }

      // Execute the nav for next steps
      if (!this.wfLoad){
        this.workflowStateChange();
      }

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
    // let wfPOldState: any;
    // let wfPNewState: any;
    this.wfLoad = true;

    this.storage.get("wfProcess").then(storageData => {

      let wfStorage = storageData;
      console.log("Loading the wfProcess from stateChange" + JSON.stringify(wfStorage));
      console.log('form.value.wfFormStatus ' + form.value.wfFormStatus);
      console.log('form.value.wfProcessStatus ' + form.value.wfProcessStatus);

      form.value.wfFormName = wfStorage[form.value.wfForm].wfFormName;

      // console.log("Saving the form into storage");
      // this.storage.set(form.value.wfFormId, form.value);

      // The following part will trigger the next stage wfPage
      console.log("Will enter " + form.value.wfFormName + " edit page now");
      console.log("流程卡 " + form.value.wfFormId);

      switch (form.value.wfForm.toString()) {
        case '1':
          this.navCtrl.push(EditWorkflow1Page, form.value);
          break;

        case '2':
          this.navCtrl.push(EditWorkflow2Page, form.value);
          break;

        case '3':
          this.navCtrl.push(EditWorkflow3Page, form.value);
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

    // First check if the user has selected the right wfForm
    if(form.value.wfForm == data["wfForm"]){

      // If the last process has been completed and then current chosen step is higher than received data wfProcess
      // Then reset the process status
      if(form.value.wfReadOnly) {
        console.log( "wfReadOnly has been selected" );
        if ( form.value.wfProcess != data.wfProcess ) {
          alert( "查无此单号的工序" );
          return;
        } else {
          this.fillData( form, data );
          form.controls[ "wfReadOnly" ].setValue( true );
          form.controls[ "wfErrorMsg" ].setValue( '只供浏览' );
        }

      } else if( !("wfProcess" in data) || (this.wfSvc.toInt(form.value.wfProcess) > this.wfSvc.toInt(data['wfLastCompletedWf']) && data['wfFormStatus'] ) ){
        // When selected process is ahead of last completed wf
        console.log("New Workflow is triggered");
        console.log(data);
        this.fillData(form,data);
        form.controls["wfProcessStatus"].setValue(false);
        form.controls["wfFormStatus"].setValue(false);
        form.controls["wfProcessNew"].setValue(true);
        form.controls["wfErrorMsg"].setValue(' ');
        // Preload below data
        this.qtyReset(form);
        this.dttmReset(form);

      } else if (this.wfSvc.toInt(form.value.wfProcess) > this.wfSvc.toInt(data['wfProcess']) && !data['wfFormStatus']) {
        console.log("提示: 上一个工序还没完成");
        alert("提示: 上一个工序还没完成");
        this.fillData(form,data);
        form.controls["wfErrorMsg"].setValue('上一个工序还没完成');

      } else if (this.wfSvc.toInt(form.value.wfProcess) <= this.wfSvc.toInt(data['wfLastCompletedWf'])) {
        console.log("提示: 这工序巳经完成");
        alert("提示: 这工序巳经完成");
        // Wilfred has requested not to continue the workflow,
        // Although this is not the original client request,
        // I just comment them out for now for the stake of mark complete
        return false;
        // this.fillData(form,data);
        // form.controls["wfErrorMsg"].setValue('这工序巳经完成');

      } else {
        console.log("Continue to fill data from last workflow");
        this.fillData(form,data);
        this.dttmReset(form);
        form.controls["wfOptGoodQty"].setValue(0);
        form.controls["wfOptGoodQty2"].setValue(0);
        form.controls["wfOptBadQty"].setValue(0);


      }


    } else {
      alert("流程卡选择错了!");
      // Exit the loop
      return false;
    }

    // Continue the scope
    return true;

  }

  fillData(form:any, data:any){
    for (let key in data) {
      if(key in form.controls) {
        try {
          // This use form control for the value setting
          // form.controls[key].setValue(data[key]);
          if (form.controls[key].value == null || form.controls[key].value == "" ) {
            // console.log("populate form model " + key);
            // console.log("populating key " + key + " " + data[key]);
            form.controls[key].setValue(data[key]);
            // console.log(form.value);

          }

        } catch (err) {
          console.log(err.message);
          // Use eval to dynamically inject the value into the form
          // eval('console.log("Retrying force input " + form.value.'+ key + ')');
          // eval('console.log(form.value.' + key + ');');
          // eval('form.value.' + key + '= "' + data[key] + '"; ');
        }
      } else {
        console.log("Key: " + key + " is not in the formGroup, please check!")

      }
    }

    console.log("after fillData");
    console.log(data);
    console.log(form.value);
  }

  qtyReset(form:any ){
    form.controls["wfOptGoodQty"].setValue(0);
    form.controls["wfOptGoodQty2"].setValue(0);
    form.controls["wfOptBadQty"].setValue(0);
    // form.controls["wfGoodTotal"].setValue(0);
    // form.controls["wfBadTotal"].setValue(0);
    form.controls["wfOptBadQtyItem"].setValue(0);
    // form.controls["wfBadItem1"].setValue(0);
    // form.controls["wfBadItem2"].setValue(0);
    // form.controls["wfBadItem3"].setValue(0);
    // form.controls["wfBadItem4"].setValue(0);
    // form.controls["wfBadItem5"].setValue(0);
    // form.controls["wfBadItem6"].setValue(0);
  }

  dttmReset(form:any){
    form.controls["wfOptInputDate"].setValue('');
    form.controls["wfOptInputEndDate"].setValue('');
    form.controls["wfOptStartTime"].setValue('');
    form.controls["wfOptFinishTime"].setValue('');
  }

  warningAlert(titleTxt: any, subTitleTxt: any, buttons: any) {
    let alert = this.alertCtrl.create({
      title: titleTxt,
      subTitle: subTitleTxt,
      buttons: [buttons]
    });
    alert.present();
  };

  storageClear(){
    let NavAlert = this.alertCtrl.create({
      title: "确定清除本地存储",
      buttons: [
        {
          text: '    确定    ',
          handler: () => {
            console.log('Clearing local storage');
            this.storage.clear();
            this.ngOnInit();
          }
        },
        {
          text: '    取消    ',
          handler: () => {
            console.log('Cancel clearing local storage');
          }
        }
      ]
    });
    NavAlert.present();
  }

  readOnly(){
    console.log("readOnly has been selected");

    let form = this.wfInputForm;
    form.value.wfReadOnly = true;

    if(this.formValidation(form)){
      console.log("form has been validated");
      let alertBox = this.alertCtrl.create({
        title: "亲,你己选择了浏览模式!",
        message: "请选择该流程卡的班别",
        buttons: [
          {
            text: "A班",
            handler: () => {
              console.log("A班 has been selected");
              form.value.wfStaffOptShift = "A";
              this.onAddWf();
            }
          },
          {
            text: "B班",
            handler: () => {
              console.log("B班 has been selected");
              form.value.wfStaffOptShift = "B";
              this.onAddWf();
            }
          }
        ]
      });
      alertBox.present();

    } else {
      console.log("form cannot be validated");

    }
  }

  private formInit() {
    this.wfInputForm = this.formBuilder.group({
      wfProcess: [''],
      wfProcessName: [''],
      wfForm: [''],
      wfFormId: [''],
      wfFormSplit: [0],
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
      wfSalesOrderId: [''],
      wfOrderDate: [''],
      wfOrderStartDate: [''],
      wfOrderEstFinishDate: [''],
      wfOrderDeliveryDate: [''],
      wfOrderTK: [''],
      wfRMFoilPosName: [''],
      wfRMFoilPosLName: [''],
      wfRMFoilPosCapFrom: [''],
      wfRMFoilPosCapTo: [''],
      wfRMFoilPosWidth: [''],
      wfRMFoilPosLength: [''],
      wfRMFoilNegName: [''],
      wfRMFoilNegLName: [''],
      wfRMFoilNegCapFrom: [''],
      wfRMFoilNegCapTo: [''],
      wfRMFoilNegWidth: [''],
      wfRMFoilNegLength: [''],
      wfRMFoilNegQty: [''],
      wfRMPaperName: [''],
      wfRMPaperQty: [''],
      wfRMPinPosName: [''],
      wfRMPinNegName: [''],
      wfRMPinPosQty: [''],
      wfRMPinNegQty: [''],
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
      wfRMFoilPosLSerial: [''],
      wfRMFoilNegLSerial: [''],
      wfRMPaperSerial: [''],
      wfRMGlueSerial: [''],
      wfRMSolSerial: [''],
      wfRMPinPosSerial: [''],
      wfRMPinNegSerial: [''],
      wfRMPlasticSerial: [''],
      wfRMShellSerial: [''],
      wfRMCoverSerial: [''],
      wfOrderTotalGoodQty: [''],
      wfRMFoilPosQty: [''],
      wfRMCoverCheck: [''],
      wfRMWindingTime: [''],
      wfRMWindingDeg: [''],
      wfDryWindingDeg: [''],
      wfWetEmptyAir: [''],
      wfWetAir: [''],
      wfWashWindingDeg: [''],
      wfWashDryWindingDeg: [''],
      wfWashDryTime: [''],
      wfQCCheck: [''],
      wfRandomCheckInfo: [''],
      wfSpecNote: [''],
      wfAgeDetailAG1: [''],
      wfAgeDetailAG2: [''],
      wfAgeDetailAG3: [''],
      wfAgeDetailAG4: [''],
      wfAgeDetailAG5: [''],
      wfAgeDetailAG6: [''],
      wfAgeDetailLCT: [''],
      wfAgeDetailLC: [''],
      wfAgeDetailCAP: [''],
      wfAgeDetailDF: [''],
      wfAgeDetailStaffConfirm: [''],
      wfOptInputDate: [''],
      wfOptInputEndDate: [''],
      wfOptWashMachine: [''],
      wfOptStartTime: [''],
      wfOptFinishTime: [''],
      wfOptBadQtyItem: [''],
      wfOptBadQty: [''],
      wfOptGoodQty: [''],
      wfOptGoodQty2: [''],
      wfBadItem1: [''],
      wfBadQty1: [''],
      wfBadItem2: [''],
      wfBadQty2: [''],
      wfBadItem3: [''],
      wfBadQty3: [''],
      wfBadItem4: [''],
      wfBadQty4: [''],
      wfBadItem5: [''],
      wfBadQty5: [''],
      wfBadItem6: [''],
      wfBadQty6: [''],
      wfBadItemTotal: [''],
      wfAgeDegSet: [''],
      wfAgeDegAct: [''],
      wfAgeVoltAct: [''],
      wfAgeCurrentSet: [''],
      wfAgeCurrentAct: [''],
      wfAgeTimeSet: [''],
      wfAgeTimeAct: [''],
      wfAgeNote: [''],
      wfAutoAgeVoltAct1: [''],
      wfAutoAgeVoltAct2: [''],
      wfAutoAgeVoltAct3: [''],
      wfAutoAgeVoltAct4: [''],
      wfStaffOptId: [''],
      wfStaffOptName: [''],
      wfStaffOptShift: [''],
      wfStaffLeadName: [''],
      wfStaffLeadId: [''],
      wfStaffTechId: [''],
      wfStaffTechName: [''],
      wfStaffXrayId: [''],
      wfStaffXrayName: [''],
      wfStaffQCId: [''],
      wfStaffQCName: [''],
      wfQCPass: [''],
      wfQCSignOff: [''],
      wfQCInputNote: [''],
      wfOrderSupNote: [''],
      wfNakedProductSerial: [''],
      wfRMUpBeltSerial: [''],
      wfRMDownBeltSerial: [''],
      wfRMBaseSerial: [''],
      wfRMCricleSerial: [''],
      wfRMPrintName: [''],
      wfRMPrintSerial: [''],
      wfFinalCheckInfo: [''],
      wfElecPass: [''],
      wfLookPass: [''],
      wfOptStartQty: [''],
      wfBadTotal: [''],
      wfGoodTotal: [''],
      wfFormStatus: [false],
      wfProcessStatus: [false],
      created: [''],
      appUpload: [''],
      wfFormExcept: [false],
      wfReadOnly: [false],
      wfProcessNew: [''],
      wfLastCompletedWf: [0],
      wfErrorMsg: ['']

    });
  }

}
