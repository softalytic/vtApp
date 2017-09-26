webpackJsonp([0],{

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WorkflowPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_barcode_scanner__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__edit_workflow_edit_workflow__ = __webpack_require__(196);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






// import { EditWorkflow1Page } from "../edit-workflow1/edit-workflow1";
// import { EditWorkflow2Page } from "../edit-workflow2/edit-workflow2";
var WorkflowPage = (function () {
    function WorkflowPage(storage, 
        // private nativeStorage: NativeStorage,
        formBuilder, navCtrl, alertCtrl, barcodeScanner) {
        this.storage = storage;
        this.formBuilder = formBuilder;
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.barcodeScanner = barcodeScanner;
        // Other variables to be named
        this.staffIdBarcode = null;
        this.orderIdBarcode = null;
        this.wfForms = [];
        this.wfProcesses = [];
        this.wfMachineProcess = [];
        this.wfStages = [];
        this.wfInputs = [];
        this.wfMachineData = [];
        this.testRadioOpen = false;
        storage.ready().then(function () { });
        this.wfForms = [1, 2];
        this.wfMachineProcess = [{
                "1": '钉卷',
                "2": '含浸',
                "3": '组立',
                "4": '清洗',
                "5a0": '手工老化',
                "5a1": '手工老化 - 串排',
                "5a2": '手工老化 - 測試分选',
                "5a3": '手工老化 - 外观',
                "5b0": '自動老化',
                "5b1": '自動老化 - 測試分选',
                "5b2": '自動老化 - 外观'
            }];
        // this.wfMachineData = this.wfProcesses[0];
        //
        // console.log(this.wfMachineData);
        this.wfProcesses = [
            { title: '钉卷', process: 1, show: true },
            { title: '含浸', process: 2, show: true },
            { title: '组立', process: 3, show: true },
            { title: '清洗', process: 4, show: true },
            { title: '手工老化', process: '5a0', show: true },
            // {title: '手工老化 - 串排', process: '5a1', show: false},
            // {title: '手工老化 - 測試分选', process: '5a2', show: false},
            // {title: '手工老化 - 外观', process: '5a3', show: false},
            { title: '自動老化', process: '5b0', show: true },
        ];
        this.wfStages = [
            { title: '钉卷', process: '1', show: true },
            { title: '含浸', process: '2', show: true },
            { title: '组立', process: '3', show: true },
            { title: '清洗', process: '4', show: true },
            { title: '手工老化', process: '5a0', show: true },
            { title: '手工老化 - 串排', process: '5a1', show: false },
            { title: '手工老化 - 測試分选', process: '5a2', show: false },
            { title: '手工老化 - 外观', process: '5a3', show: false },
            { title: '自動老化', process: '5b0', show: true },
            { title: '自動老化 - 測試分选', process: '5b1', show: false },
            { title: '自動老化 - 外观', process: '5b2', show: false }
        ];
        this.wfInputs = [
            { title: "流程卡号", method: 'input', type: 'text', model: 'wfFormId', scan: true, size: 30 },
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
            { title: "工单号", method: 'input', type: 'text', model: 'WfOrderId', scan: false, size: 20 },
            { title: "总量(预设)", method: 'input', type: 'number', model: 'wfOrderTotalQty', scan: false, size: 10 },
            // Prompt Screen alert to pick the workflow batch id
            { title: "批次号", method: 'input', type: 'text', model: 'wfOrderBatchId', scan: false, size: 20 },
            { title: "总量(批次)", method: 'input', type: 'number', model: 'wfOrderBatchQty', scan: false, size: 10 },
            { method: "break", size: 20 },
            // Expand as buttons
            { title: "流程卡", method: 'buttons', options: [
                    { value: 1, label: '裸品' },
                    { value: 2, label: '成品' },
                    { value: 3, label: '电容器' }
                ], model: 'wfForm', scan: false, size: 100 }
        ];
        this.pushPage = __WEBPACK_IMPORTED_MODULE_5__edit_workflow_edit_workflow__["a" /* EditWorkflowPage */];
    }
    WorkflowPage.prototype.ngOnInit = function () {
        this.formInit();
    };
    ;
    WorkflowPage.prototype.onAddWf = function () {
        var form = this.wfInputForm;
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
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__edit_workflow_edit_workflow__["a" /* EditWorkflowPage */], form);
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
    };
    WorkflowPage.prototype.scanBarcode = function (model) {
        var _this = this;
        var form = this.wfInputForm;
        console.log("scanning Barcode");
        // console.log(form.value);
        //
        // form.controls['wfProcess'].setValue(1);
        // form.controls['wfProcessName'].setValue('钉卷');
        // form.controls["wfForm"].setValue(1);
        //
        // console.log(form.value);
        this.barcodeScanner.scan().then(function (barcodeData) {
            // Success! Barcode data is here
            // Limiter to assume the Barcode is default used in this orderID
            if (barcodeData.format && barcodeData.format != "QR_CODE") {
                console.log("this is barcode");
                var data_1 = barcodeData.text;
                form.controls[model].setValue(data_1);
                switch (model) {
                    case 'wfMachineId':
                        console.log("this barcode is for wfMachineID");
                        // clean up prior wfMachineData record
                        // Housing keeping to erase the prior data in the form
                        _this.wfMachineData = [];
                        form.controls['wfProcess'].setValue("");
                        form.controls['wfProcessName'].setValue("");
                        // end of house keeping
                        // look up the wfProcess from wfMachineId
                        _this.storage.get('machineData').then(function (values) {
                            console.log("This is the data from storage");
                            console.log(values[data_1]);
                            var _data = values[data_1];
                            if (_data.length > 1) {
                                _this.wfMachineData.push.apply(_this.wfMachineData, values[data_1]);
                                console.log("This is the data from wfMachineData Array");
                                console.log(_this.wfMachineData);
                                alert("嚫，该机器有多种工序! 请选择工序 :D");
                            }
                            else {
                                _this.wfMachineData.push(values[data_1]);
                                // form.controls['wfProcess'].setValue(this.wfMachineData);
                                console.log("This is the data from wfProcess Form");
                                _this.setWfStage(values[data_1]);
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
            }
            else if (barcodeData.format == "QR_CODE") {
                // alert('嚫，请确定你所扫描的条码是正确的');
                // Try if it is QR code
                console.log("This is QR Code");
                _this.qrCodePopulate(barcodeData.text);
            }
            else {
                alert('嚫，请确定你所扫描的条码是正确的');
            }
        }, function (err) {
            // An error occurred
            alert(err);
        });
    };
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
    WorkflowPage.prototype.setFormValue = function (model, value) {
        var form = this.wfInputForm;
        form.controls[model].setValue(value);
    };
    WorkflowPage.prototype.setWfProcess = function (process, title, storage) {
        var _this = this;
        var form = this.wfInputForm;
        console.log(form.value);
        // Update the value of the Form on the Process steps and Process Name on the form
        form.controls['wfProcess'].setValue(process);
        form.controls['wfProcessName'].setValue(title);
        // Create additional alerts to let the user to choose the right subprocesses from the Ageing process
        if (typeof process === 'string') {
            var alert_1 = this.alertCtrl.create();
            alert_1.setTitle('请选择老化工序');
            if (process == '5a') {
                // This subprocess is unique to Manual Ageing
                alert_1.addInput({
                    type: 'radio',
                    label: '串排',
                    value: '串排',
                });
                var processTitle = '手工老化';
            }
            else {
                var processTitle = '自动老化';
            }
            alert_1.addInput({
                type: 'radio',
                label: processTitle,
                value: processTitle
            });
            alert_1.addInput({
                type: 'radio',
                label: '測試分选',
                value: '測試分选'
            });
            alert_1.addInput({
                type: 'radio',
                label: '外观',
                value: '外观'
            });
            alert_1.addButton('取消');
            alert_1.addButton({
                text: '確定',
                handler: function (data) {
                    // Once selected the subprocess, update the form and then submit the form to next process stage
                    form.controls['wfProcessName'].setValue(data);
                    _this.onAddWf();
                }
            });
            alert_1.present();
        }
        else {
            // Simply submit the form and send over to next process
            this.onAddWf();
        }
        // console.log('After');
        // console.log(form.value);
    };
    WorkflowPage.prototype.setWfStage = function (process) {
        var form = this.wfInputForm;
        // console.log( form.value );
        // console.log(this.wfProcesses[process].title);
        console.log("This is the process from the ion-select");
        console.log(process);
        // This is temp fix for the array value to process value
        // *TO BE FIXED*
        var _wfStage = this.wfStages[process - 1];
        // there is a bug to load this method when the view is first init,
        // So i have added a try here to cancel the error msg
        try {
            // console.log( _wfStage.title );
            form.controls['wfProcess'].setValue(_wfStage.process);
            form.controls['wfProcessName'].setValue(_wfStage.title);
            console.log("This is the form value");
            console.log(JSON.stringify(form.value));
        }
        catch (err) { }
        // console.log(_wfProcess.title);
        // console.log(_wfProcess.process);
        // Update the value of the Form on the Process steps and Process Name on the form
        // form.controls['wfProcess'].setValue(_wfProcess.process);
        // form.controls['wfProcessName'].setValue(_wfProcess.title);
    };
    WorkflowPage.prototype.presentAlertFuck = function () {
        var alert = this.alertCtrl.create({
            title: 'Low battery',
            subTitle: '10% of battery remaining',
            buttons: ['Dismiss']
        });
        alert.present();
    };
    WorkflowPage.prototype.presentConfirm = function () {
        var alert = this.alertCtrl.create({
            title: 'Confirm purchase',
            message: 'Do you want to buy this book?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Buy',
                    handler: function () {
                        console.log('Buy clicked');
                    }
                }
            ]
        });
        alert.present();
    };
    WorkflowPage.prototype.qrCodePopulate = function (barcodeData) {
        // This function takes the barcode data and then process the JSON object
        // Assume each barcode data is a JSON object and it has a headers and bodies component
        // Loop through the headers
        // for each header,
        //    check if the length is > 0, which is a sub JSON array object for data table
        //    else loop through the keys inside that header JSON object
        var _this = this;
        var data = JSON.parse(barcodeData);
        var headers = data.headers;
        var bodies = data.bodies;
        var form = this.wfInputForm;
        var _loop_1 = function (key) {
            // console.log(key + " : " + headers[key])
            switch (headers[key]) {
                case "ngForm":
                    // console.log(key + " is a form")
                    var formBodies_1 = bodies[key];
                    for (var formKey in formBodies_1) {
                        console.log("populate form model " + formKey);
                        console.log("populating model " + formKey + " " + formBodies_1[formKey]);
                        try {
                            // Dynamically set form value from the scanned code data
                            // try and catch here is to protect if some of the fields are missing or failed,
                            // then it will skip onto the next key
                            // backup code for assigning the value into form
                            // ngForm.controls[formKey].setValue(form[formKey]);
                            // This line no longer works
                            // eval('form.value.' + formKey + " = " + formBodies[formKey]);
                            this_1.setFormValue(formKey, formBodies_1[formKey]);
                            //  form.value.
                        }
                        catch (err) {
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
                    this_1.storage.get(formBodies_1['wfFormId']).then(function (dataTmp) {
                        if (dataTmp) {
                            //alert("exists"); 
                        }
                        else {
                            //alert("nothing"); empty 
                            _this.storage.set(formBodies_1['wfFormId'], formBodies_1);
                        }
                    });
                    break;
                case "ngStorage":
                    console.log(key + " is a storage");
                    this_1.storage.set(key, bodies[key]);
                    console.log(bodies[key]);
                    // Testing the storage has been set
                    this_1.storage.get(key).then(function (values) {
                        for (var valKey in values) {
                            console.log(values[valKey]);
                        }
                        console.log(key);
                        console.log(JSON.stringify(values));
                    });
                    break;
                case "ngInput":
                    console.log(key + " is for input");
                    console.log(bodies[key]);
                    var inputBodies = bodies[key];
                    for (var inputKey in inputBodies) {
                        console.log("populate form model" + inputKey);
                        try {
                            // Dynamically set form value from the scanned code data
                            // try and catch here is to protect if some of the fields are missing or failed,
                            // then it will skip onto the next key
                            // backup code for assigning the value into form
                            // ngForm.controls[formKey].setValue(form[formKey]);
                            // This line no longer works
                            // eval('this.' + inputKey + " = " + inputBodies[inputKey]);
                            this_1.setFormValue(inputKey, inputBodies[inputKey]);
                            //  form.value.
                        }
                        catch (err) {
                            console.log(err.message);
                        }
                    }
                    break;
                default:
                    console.log(key + " is error");
            }
        };
        var this_1 = this;
        for (var key in headers) {
            _loop_1(key);
        }
    };
    WorkflowPage.prototype.formInit = function () {
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
    };
    return WorkflowPage;
}());
WorkflowPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-workflow',template:/*ion-inline-start:"/Users/thomasq/Downloads/vtApp v3/src/pages/workflow/workflow.html"*/'<ion-header>\n    <ion-navbar>\n        <div style="align-items: center; display: inline;">\n            <img src="./assets/img/vt_icon.png" class="icon">\n            <ion-title>工序流程卡纪录系统</ion-title>\n        </div>\n    </ion-navbar>\n</ion-header>\n<ion-content padding>\n    <form [formGroup]="wfInputForm" (ngSubmit)="onAddWf()">\n\n        <!-- First section for the input field -->\n        <div>\n            <ion-grid>\n                <ion-row wrap justify-content-left align-items-center>\n                    <!-- Main loop of the Form Module -->\n                    <ion-col *ngFor="let wfInput of wfInputs">\n                        <!-- Non Buttons input fields of wfForms -->\n                        <ion-row align-items-center>\n                            <div class="label">{{wfInput.title}}</div>\n\n                            <!-- Form Normal Input Module-->\n                            <ion-input *ngIf="wfInput.method === \'input\'" [ngStyle]="{\'width.em\':wfInput.size}" type={{wfInput.type}} formControlName={{wfInput.model}} no-padding class="gridborder"></ion-input>\n\n                            <button *ngIf="wfInput.scan" (click)="scanBarcode(wfInput.model)" item-end ion-button class="barcodeButton" type="button">\n                                <!--<ion-icon name="barcode"></ion-icon>-->\n                                扫一扫\n                            </button>\n\n                            <!-- Form Selector Module -->\n                            <ion-select *ngIf="wfInput.method === \'select\'" [ngStyle]="{\'width.em\':wfInput.size}" interface="popover" style="height: 34px !important;" (ionChange)="setWfStage($event)" formControlName={{wfInput.model}} class="gridborder" okText="确定" cancelText="取消">\n                                <ion-option *ngFor="let key of wfMachineData" value={{key}}>\n                                    {{wfMachineProcess[0][key]}}\n                                </ion-option>\n                            </ion-select>\n\n                            <!-- Buttons input fields of wfForms -->\n                            <div *ngIf="wfInput.method === \'buttons\'" [ngStyle]="{\'width.em\':wfInput.size}">\n                                <ion-buttons>\n                                    <!-- Button for Form submission -->\n                                    <button *ngFor="let option of wfInput.options" [ngClass]="{\'buttonsSelected\': wfInputForm.value.wfForm == option.value }" (click)="setFormValue(wfInput.model,option.value)" item-right ion-button outline type="button" round>\n                                        <ion-icon name="clipboard"></ion-icon>\n                                        &nbsp; {{option.label}}\n                                    </button>\n                                </ion-buttons>\n\n                                <button style="width: 25%; margin: 0 auto;" ion-button type="submit" block>\n                                    确定\n                                </button>\n                            </div>\n\n                            <div *ngIf="wfInput.method === \'break\'" [ngStyle]="{\'width.em\':wfInput.size}"></div>\n\n                        </ion-row>\n\n                    </ion-col>\n                </ion-row>\n            </ion-grid>\n        </div>\n\n        <div>\n\n        </div>\n\n        <!-- Display the workflow process with img -->\n        <div>\n            <ion-grid style="padding-left: 50px; padding-right: 50px;">\n                <ion-row wrap class="card-background-page">\n                    <ion-col *ngFor="let wfProcess of wfProcesses" col-3>\n                        <div (click)="setWfProcess(wfProcess.process, wfProcess.title)" class="imgButton">\n                            <img src="{{\'./assets/img/f1p\' + wfProcess.process + \'.jpeg\'}}">\n                            <div class="card-title">\n                                {{wfProcess.title}}\n                            </div>\n                        </div>\n                        <!-- For original design -->\n                        <!--<div [navPush]="pushPage" [navParams]=wfProcess>-->\n                    </ion-col>\n                </ion-row>\n            </ion-grid>\n        </div>\n\n        <!-- manual ageing will have an action sheet to prompt the sub process -->\n        <!-- 規格 Need attention highlight -->\n        <!-- 料號 = 產品編號 -->\n\n    </form>\n</ion-content>'/*ion-inline-end:"/Users/thomasq/Downloads/vtApp v3/src/pages/workflow/workflow.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_barcode_scanner__["a" /* BarcodeScanner */]])
], WorkflowPage);

//# sourceMappingURL=workflow.js.map

/***/ }),

/***/ 111:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 111;

/***/ }),

/***/ 152:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 152;

/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditWorkflowPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_barcode_scanner__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__ = __webpack_require__(103);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var EditWorkflowPage = (function () {
    function EditWorkflowPage(storage, formBuilder, barcodeScanner, alertCtrl, camera, navParams) {
        this.storage = storage;
        this.formBuilder = formBuilder;
        this.barcodeScanner = barcodeScanner;
        this.alertCtrl = alertCtrl;
        this.camera = camera;
        this.navParams = navParams;
        this.form = __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* NgForm */];
        this.wfOrderDetails = [];
        this.wfRMDetails = [];
        this.wfAgeingDetails = [];
        this.wfAutoAgeingDetails = [];
        this.wfAutoAgeingSubDetails = [];
        this.wfOpsInputs = [];
        this.wfPplInputs = [];
        this.images = [];
        // For calculating the time value
        this.tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        this.appDate = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);
        /*
        // this.pushPage = EditWorkflow1Page;
        */
        this.wfNavParams = this.navParams.data.value;
        // Assume all are ion-input except the one specificed as textarea
        this.wfOrderDetails = [
            /*
            // {model: "wfFormId", title: "流程卡号", type: "text", highlight: false},
            */
            { method: "input", model: "WfOrderId", title: "工单号", type: "text", size: 20, highlight: false },
            /*
            // {model: "wfOrderBatchId", title: "批次号", type: "text", highlight: false},
            // {model: "wfOrderQty", title: "总量(批次)", type: "text", highlight: false},
            */
            { method: "input", model: "wfOrderRMId", title: "料号", type: "text", size: 20, highlight: false },
            { method: "input", model: "wfOrderSeries", title: "系列", type: "text", size: 10, highlight: false },
            { method: "input", model: "wfOrderSpec", title: "规格", type: "text", size: 8, highlight: false },
            { method: "input", model: "wfOrderDim", title: "尺寸", type: "text", size: 8, highlight: false },
            // {method: "break", size: 10},
            { method: "input", model: "wfOrderBOMNote", title: "BOM备注", type: "textarea", size: 30, highlight: false },
            { method: "input", model: "wfOrderNote", title: "工单备注", type: "textarea", size: 30, highlight: false },
            { method: "input", model: "wfOrderTotalQty", title: "预设总量", type: "number", size: 5, highlight: false },
            { method: "input", model: "wfOrderTotalGoodQty", title: "良品數總和", type: "number", size: 5, highlight: false },
        ];
        this.wfRMDetails = [
            { modelName: "wfRMFoilPosName", title: "正箔", type: "text", modelSerial: 'wfRMFoilPosSerial', highlight: false },
            { modelName: "wfRMFoilPosLName", title: "正箔 - L", type: "text", modelSerial: 'wfRMFoilPosLSerial', highlight: false },
            { modelName: "wfRMFoilNegName", title: "負箔", type: "text", modelSerial: 'wfRMFoilNegSerial', highlight: false },
            { modelName: "wfRMFoilNegLName", title: "負箔 - L", type: "text", modelSerial: 'wfRMFoilNegLSerial', highlight: false },
            { modelName: "wfRMPaperName", title: "电解纸", type: "text", modelSerial: 'wfRMPaperSerial', highlight: false },
            { modelName: "wfRMGlueName", title: "胶水/胶带", type: "text", modelSerial: 'wfRMGlueSerial', highlight: false },
            { modelName: "wfRMSolName", title: "电解液", type: "text", modelSerial: 'wfRMSolSerial', highlight: false },
            { modelName: "wfRMPinPosName", title: "正导针", type: "text", modelSerial: 'wfRMPinPosSerial', highlight: false },
            { modelName: "wfRMPinNegName", title: "负导针", type: "text", modelSerial: 'wfRMPinNegSerial', highlight: false },
            { modelName: "wfRMPlasticName", title: "胶粒", type: "textarea", modelSerial: 'wfRMPlasticSerial', highlight: false },
            { modelName: "wfRMShellName", title: "铝壳", type: "text", modelSerial: 'wfRMShellSerial', highlight: false },
            { modelName: "wfRMCoverName", title: "套管", type: "text", modelSerial: 'wfRMCoverSerial', highlight: false },
        ];
        this.wfOpsInputs = [
            { title: "流程卡号", method: "input", model: "wfOrderFormId", type: "text", icon: 'ios-copy-outline', scan: false, size: 9 },
            { title: "机台", method: "input", model: "wfOptMachineId", type: "text", icon: 'cog', scan: false, size: 6 },
            { title: "批次号", method: "input", model: "wfOrderBatchId", type: "text", icon: 'ios-basket-outline', scan: false, size: 11 },
            { title: "批次量", method: "input", model: "wfOrderBatchQty", type: "text", icon: 'ios-basket-outline', scan: false, size: 5 },
            { method: "break", title: "" },
            { method: "inputs", options: [
                    { title: "正箔 - L", model: "wfRMFoilPosLName", type: "number", icon: 'ios-add-circle-outline', scan: false, size: 8 },
                    { title: "負箔 - L", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8 }
                ] },
            { method: "inputs2", header: "素子烘烤", options: [
                    { title: "时间 H", model: "wfRMWindingTime", type: "number", icon: 'ios-add-circle-outline', scan: false, size: 8 },
                    { title: "温度 ℃", model: "wfRMWindingDeg", type: "number", icon: 'md-remove-circle', scan: false, size: 8 }
                ] },
            { method: 'inputs', options: [
                    { title: "日期", model: "wfOptInputDate", type: "date", icon: "calender", scan: false, size: 8 },
                    { title: "开始", model: "wfOptStartTime", type: "text", icon: "time", scan: false, size: 8 },
                    { title: "完成", model: "wfOptFinishTime", type: "text", icon: "md-alarm", scan: false, size: 8 }
                ] },
            { method: "inputs", options: [
                    { title: "不良数", model: "wfOptBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8 },
                    { title: "良品数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8 }
                ] }
        ];
        this.wfAgeingDetails = [
            { title: "电压 DC/V", icon: 'md-flash', method: "table", size: 7, cols: [
                    { model: "wfAgeVoltSet", type: "number", auto: false },
                    { model: "wfAgeVoltAct", type: "number", auto: false },
                    { model: "wfAutoAgeVoltAct1", type: "number", auto: true },
                    { model: "wfAutoAgeVoltAct2", type: "number", auto: true },
                    { model: "wfAutoAgeVoltAct3", type: "number", auto: true },
                    { model: "wfAutoAgeVoltAct4", type: "number", auto: true },
                    { model: "wfAutoAgeVoltAct5", type: "number", auto: true },
                ] },
            { title: "时间 H", icon: 'timer', method: "table", size: 7, cols: [
                    { model: "wfAgeTimeSet", type: "number", auto: false },
                    { model: "wfAgeTimeAct", type: "number", auto: false }
                ] },
            { title: "温度 ℃", icon: 'ios-thermometer-outline', method: "table", size: 7, cols: [
                    { model: "wfAgeDegSet", type: "number", auto: false },
                    { model: "wfAgeDegAct", type: "number", auto: false }
                ] },
            { title: "电流 µA", icon: 'md-pulse', method: "table", size: 7, cols: [
                    { model: "wfAgeCurrentSet", type: "number", auto: false },
                    { model: "wfAgeCurrentAct", type: "number", auto: false }
                ] },
        ];
        this.wfAutoAgeingDetails = [
            { title: "开路电压", method: "input", size: 8, model: "wfAutoAgeOpenVolt", type: "number" },
            { title: "高容", method: "input", size: 8, model: "wfAutoAgeHighCapacity", type: "number" },
            { title: "短路电压", method: "input", size: 8, model: "wfAutoAgeShortVolt", type: "number" },
            { title: "低容", method: "input", size: 8, model: "wfAutoAgeLowCapacity", type: "number" },
            { title: "开路", method: "input", size: 8, model: "wfAutoAgeOpen", type: "number" },
            { title: "损耗", method: "input", size: 8, model: "wfAutoAgeWear", type: "number" },
            { title: "短路", method: "input", size: 8, model: "wfAutoAgeShort", type: "number" },
            { title: "漏电", method: "input", size: 8, model: "wfAutoAgeVoltLeak", type: "number" },
            { title: "外观", method: "input", size: 8, model: "wfAutoAgeLook", type: "number" }
        ];
        this.wfPplInputs = [
            { title: "作业員", method: "input", model: "wfStaffOptId", type: "text", icon: 'person', scan: 1, size: 20 },
            { title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, size: 5 },
            { title: "技術員", method: "input", model: "wfStaffTechId", type: "text", icon: 'construct', scan: 2, size: 20 },
            { title: "X-RAY确认", method: "input", model: "wfStaffXrayId", type: "text", icon: 'construct', scan: 3, size: 20 },
            { method: "break", size: 15 },
            { title: "终检", method: "buttons", model: "wfQCPass", icon: "md-checkmark-circle-outline", buttons: [
                    { label: "通过", value: 1, icon: 'checkmark' },
                    { label: "失败", value: 2, icon: 'close' }
                ] },
            { title: "品检备注", method: "textarea", model: "wfQCInputNote", type: "text", icon: 'chatbubbles', scan: false, size: 30 },
            { title: "品检員", method: "input", model: "wfQCSignOff", type: "text", icon: 'search', scan: 4, size: 20 },
        ];
    }
    EditWorkflowPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad EditWorkflowPage');
        console.log(this.wfNavParams);
        console.log(this.appDate);
        alert(JSON.stringify(this.wfNavParams));
    };
    EditWorkflowPage.prototype.ngOnInit = function () {
        var form = this.wfInputForm;
        this.wfNavParams.wfFormName = '裸品流程卡';
        //this.wfNavParams.wfProcessName = '裸品流程卡';
        this.formInit();
        // alert(this.wfRMDetails[1].modelName)
    };
    EditWorkflowPage.prototype.checkBeforeScan = function (form) {
        if (form.value.wfOptBadQty === '') {
            alert("input good items is missing!");
            return false;
        }
        else if (form.value.wfOptGoodQty === '') {
            alert("input good items is missing!");
            return false;
        }
    };
    EditWorkflowPage.prototype.scanBarcode = function (model) {
        var _this = this;
        console.log("scanning Barcode");
        /*
        // console.log(form.value);
        //
        // form.controls['wfProcess'].setValue(1);
        // form.controls['wfProcessName'].setValue('钉卷');
        // form.controls["wfForm"].setValue(1);
        //
        // console.log(form.value);
        */
        var form = this.wfInputForm;
        this.barcodeScanner.scan().then(function (barcodeData) {
            // Success! Barcode data is here
            // Limiter to assume the Barcode is default used in this orderID
            form.controls[model].setValue(barcodeData.text);
            if (barcodeData.format && barcodeData.format != "QR_CODE" && model == "wfSignOff") {
                switch (barcodeData.text) {
                    case 'QC0001':
                        form.controls['wfSignOff'].setValue(barcodeData.text);
                        _this.promptAlert();
                        break;
                    case 'QC0002':
                        form.controls['wfSignOff'].setValue(barcodeData.text);
                        _this.promptAlert();
                        break;
                    case 'QC0003':
                        form.controls['wfSignOff'].setValue(barcodeData.text);
                        _this.promptAlert();
                        break;
                    default:
                        alert('嚫，请确定你所扫描的条码是正确的');
                }
            }
            else {
                alert('嚫，请确定你所扫描的条码是正确的');
            }
        }, function (err) {
            // An error occurred
            alert(err);
        });
    };
    EditWorkflowPage.prototype.inputWf = function () {
        console.log('inputWf activated');
    };
    EditWorkflowPage.prototype.setWfPass = function () {
        console.log('checked');
        /*
        // this.wfPass = result;
        */
    };
    EditWorkflowPage.prototype.onSubmit = function () {
        console.log(this.wfInputForm);
    };
    EditWorkflowPage.prototype.updateForm = function (model, value) {
        var form = this.wfInputForm;
        console.log(form);
        form.controls[model].setValue(value);
        console.log(form.controls[model].value);
    };
    EditWorkflowPage.prototype.promptAlert = function () {
        var alertCtl = this.alertCtrl.create();
        alertCtl.setTitle("确定完成和上传");
        alertCtl.addButton('取消');
        alertCtl.addButton({
            text: '確定',
            handler: function (data) {
                // Once selected the subprocess, update the form and then submit the form to next process stage
                alert("上传成功");
            }
        });
        alertCtl.present();
    };
    EditWorkflowPage.prototype.formInit = function () {
        var form = this.wfInputForm;
        this.wfInputForm = this.formBuilder.group({
            wfProcess: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["b" /* FormControl */](this.wfNavParams.wfProcess),
            wfProcessName: new __WEBPACK_IMPORTED_MODULE_3__angular_forms__["b" /* FormControl */](this.wfNavParams.wfProcessName),
            // Order Inputs detail
            wfOrderFormId: [this.wfNavParams.wfFormId],
            WfOrderId: [this.wfNavParams.wfOrderId],
            wfOrderBatchId: [this.wfNavParams.wfBatchId],
            wfOrderBatchQty: [this.wfNavParams.wfBatchQty],
            wfOrderBOMNote: [this.wfNavParams.wfOrderBOMNote],
            wfOrderNote: [this.wfNavParams.wfOrderNote],
            wfOrderTotalQty: [this.wfNavParams.wfOrderTotalQty],
            wfOrderTotalGoodQty: [this.wfNavParams.wfOrderTotalGoodQty],
            wfOrderRMId: [this.wfNavParams.wfOrderRMId],
            wfOrderSeries: [this.wfNavParams.wfOrderSeries],
            wfOrderSpec: [this.wfNavParams.wfOrderSpec],
            // wfOrderQty: [''],
            wfOrderDim: [this.wfNavParams.wfOrderDim],
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
            // Operational Input
            wfOptMachineId: '',
            wfOptInputDate: [this.appDate],
            wfOptStartTime: ['00:00'],
            wfOptFinishTime: ['00:00'],
            wfOptBadQty: [''],
            wfOptGoodQty: [''],
            // Ageing Part1
            wfAgeDegSet: [''],
            wfAgeDegAct: [''],
            wfAgeVoltSet: [''],
            wfAgeVoltAct: [''],
            wfAgeCurrentSet: [''],
            wfAgeCurrentAct: [''],
            wfAgeTimeSet: [''],
            wfAgeTimeAct: [''],
            wfAgeNote: [''],
            // Additional volt for Ageing
            wfAutoAgeVoltAct1: [''],
            wfAutoAgeVoltAct2: [''],
            wfAutoAgeVoltAct3: [''],
            wfAutoAgeVoltAct4: [''],
            wfAutoAgeVoltAct5: [''],
            wfAutoAgeVoltAct6: [''],
            wfAutoAgeVoltAct7: [''],
            // Auto ageing part2
            wfAutoAgeOpenVolt: [''],
            wfAutoAgeShortVolt: [''],
            wfAutoAgeOpen: [''],
            wfAutoAgeShort: [''],
            wfAutoAgeHighCapacity: [''],
            wfAutoAgeLowCapacity: [''],
            wfAutoAgeWear: [''],
            wfAutoAgeVoltLeak: [''],
            wfAutoAgeLook: [''],
            //Staff Input section
            wfStaffOptId: [''],
            wfStaffOptShift: [''],
            wfStaffTechId: [''],
            wfStaffXrayId: [''],
            wfQCPass: [''],
            wfQCSignOff: [''],
            wfQCInputNote: [''],
        });
        /*
        this.storage.forEach( (value, key, index) => {
          this.wfInputForm[key] = value;
          alert(key + ' ' + value + ' ');
        });
        */
        var storageDataTmp;
        this.storage.get(this.wfNavParams.wfFormId).then(function (dataTmp) {
            if (dataTmp) {
                //alert("exists"); 
                storageDataTmp = dataTmp;
            }
            else {
                alert("data issue");
            }
        });
    };
    EditWorkflowPage.prototype.keyPress = function (keycode) {
        if (keycode == 13) {
            alert('next');
        }
    };
    EditWorkflowPage.prototype.showWfOpsInputsAlert = function (wfOptBadQtyValue, wfOptGoodQtyValue) {
        if (wfOptBadQtyValue == '' || wfOptGoodQtyValue == '') {
            var alert_1 = this.alertCtrl.create({
                title: 'Please Check!',
                subTitle: 'Please fill out the following: 日期，开始，完成，良品数，不良数 ',
                buttons: ['OK']
            });
            alert_1.present();
        }
    };
    EditWorkflowPage.prototype.showWfQCPassAlert = function (wfQCPassValue) {
        if (!(wfQCPassValue == 2 || wfQCPassValue == 1)) {
            var alert_2 = this.alertCtrl.create({
                title: 'Please Check!',
                subTitle: 'Please select 终检!',
                buttons: ['OK']
            });
            alert_2.present();
        }
    };
    EditWorkflowPage.prototype.takePhoto = function () {
        // alert("taking photos");
        var _this = this;
        var options = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            saveToPhotoAlbum: true
        };
        this.camera.getPicture(options).then(function (imageData) {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            var imgUrl = 'data:image/jpeg;base64,' + imageData;
            _this.images.push(imgUrl);
            _this.storage.set('images', _this.images);
            // console.log(this.images);
        }, function (err) {
            // Handle error
        });
    };
    return EditWorkflowPage;
}());
EditWorkflowPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-edit-workflow',template:/*ion-inline-start:"/Users/thomasq/Downloads/vtApp v3/src/pages/edit-workflow/edit-workflow.html"*/'<ion-header style="margin-top: 0px !important;margin-left: 0px !important;">\n    <ion-navbar>\n        <div style="align-items: center; display: inline;">\n            <img src="./assets/img/vt_icon.png" class="icon">\n            <ion-title>\n                &nbsp; ( {{wfNavParams.wfFormName}} )&nbsp; 工序:&nbsp; {{wfNavParams.wfProcessName}}\n            </ion-title>\n        </div>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n    <form [formGroup]="wfInputForm" (ngSubmit)="onSubmit()">\n        <ion-grid>\n            <!-- header bar -->\n            <ion-row wrap class="main headbar">\n                <ion-col *ngFor="let wfOrderDetail of wfOrderDetails">\n                    <ion-row justify-content-center wrap>\n                        <ion-col *ngIf="wfOrderDetail.method === \'input\'" no-padding>\n                            <ion-row align-items-center>\n                                <div class="inputLabel" no-padding>\n                                    {{wfOrderDetail.title}}\n                                </div>\n                                <ion-input *ngIf="wfOrderDetail.type != \'textarea\'" class="gridborder" disabled type={{wfOrderDetail.type}} [ngStyle]="{\'width.em\':wfOrderDetail.size}" formControlName={{wfOrderDetail.model}}></ion-input>\n\n                                <ion-textarea *ngIf="wfOrderDetail.type === \'textarea\'" formControlName={{wfOrderDetail.model}} [ngStyle]="{\'width.em\':wfOrderDetail.size}" class="textarea gridborder"></ion-textarea>\n                            </ion-row>\n                        </ion-col>\n\n                        <ion-col *ngIf="wfOrderDetail.method === \'break\'" no-padding [ngStyle]="{\'width.em\':wfOrderDetail.size}"></ion-col>\n\n                    </ion-row>\n                </ion-col>\n            </ion-row>\n\n            <!-- Content Section -->\n            <ion-row>\n                <!-- Material Info and Serial # -->\n                <ion-col class="main" col-5 no-padding>\n                    <!-- Header -->\n                    <ion-row>\n                        <ion-col col-1></ion-col>\n                        <ion-col text-center col-7>\n                            <h4 class="inputHeader">材料</h4>\n                        </ion-col>\n                        <ion-col text-center>\n                            <h4 class="inputHeader">批号</h4>\n                        </ion-col>\n                    </ion-row>\n\n                    <!-- Body -->\n                    <ion-row *ngFor="let wfRMDetail of wfRMDetails" justify-content-center align-items-center>\n                        <ion-col wrap col-auto>\n                            <div class="inputLabel">\n                                {{wfRMDetail.title}}\n                            </div>\n                        </ion-col>\n                        <ion-col col-6>\n                            <ion-input class="gridborder" disabled value={{wfInputForm.controls[wfRMDetail.modelName].value}}></ion-input>\n                        </ion-col>\n                        <ion-col>\n                            <ion-input class="gridborder" value={{wfInputForm.controls[wfRMDetail.modelSerial].value}}></ion-input>\n                        </ion-col>\n                    </ion-row>\n                </ion-col>\n\n                <!-- Production Record + Ageing + Staff input -->\n                <ion-col col-7>\n\n                    <!-- Production input field -->\n                    <ion-row class="sec" align-self-stretch justify-content-left>\n\n                        <!-- Input field header -->\n                        <ion-col col-12>\n                            <h4 class="inputHeader">\n                                <ion-icon name="clipboard"></ion-icon>\n                                &nbsp; 生產记录\n                            </h4>\n                        </ion-col>\n\n                        <!-- Input field form -->\n                        <ion-col *ngFor="let wfInput of wfOpsInputs" col-auto>\n\n                            <!-- Simple Input field -->\n                            <ion-row *ngIf="wfInput.method == \'input\'" align-items-center justify-content-center>\n\n                                <div style="margin-left: 5px;margin-right: 5px;">\n                                    <!--<ion-icon name="{{wfInput.icon}}"></ion-icon>-->\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-input type={{wfInput.type}} formControlName={{wfInput.model}} [ngStyle]="{\'width.em\':wfInput.size}" class="gridborder"></ion-input>\n\n                                <button *ngIf="wfInput.scan" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(wfInput.model)">\n                  扫一扫\n                </button>\n                            </ion-row>\n\n                            <ion-row *ngIf="wfInput.method == \'buttons\'" justify-content-left align-items-center>\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-buttons>\n                                    <button ion-button round outline type="button" style="width: auto;" *ngFor="let button of wfInput.buttons" (click)="updateForm(wfInput.model, button.value)" [ngClass]="{\'buttonsSelected\': wfInputForm.controls[wfInput.model].value === button.value}">\n                    &nbsp; {{button.label}}\n                  </button>\n                                </ion-buttons>\n                            </ion-row>\n\n                            <ion-col *ngIf="wfInput.method == \'inputs\'">\n                                <ion-row *ngIf="wfInput.header" align-items-center justify-content-center>\n                                    <div style="width: 45px;"></div>\n                                    <div style="text-align: center;">\n                                        {{wfInput.header}}\n                                    </div>\n                                </ion-row>\n\n                                <ion-row *ngFor="let option of wfInput.options" align-items-center justify-content-center>\n\n                                    <div class="inputLabel">\n                                        {{option.title}}\n                                    </div>\n                                    <!-- datetime -->\n                                    <div *ngIf="option.type == \'date\'" [ngStyle]="{\'width.em\':option.size}" class="gridborder">\n                                        <ion-datetime formControlName={{option.model}} displayFormat="DD/MM/YYYY" pickerFormat="DD MM YYYY"></ion-datetime>\n                                    </div>\n\n                                    <ion-input *ngIf="option.type != \'date\'" formControlName={{option.model}} type={{option.type}} [ngStyle]="{\'width.em\':option.size}" class="gridborder"></ion-input>\n\n                                    <button *ngIf="option.scan" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(option.model)">\n                    扫一扫\n                  </button>\n                                </ion-row>\n\n                            </ion-col>\n\n                            <ion-col *ngIf="wfInput.method == \'breaks\'" col-3>\n                            </ion-col>\n\n                            <ion-row *ngIf="wfInput.method == \'textarea\'" align-items-center>\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n                                <ion-textarea formControlName={{wfInput.model}} style="min-width: auto;" class="gridborder">\n                                </ion-textarea>\n                            </ion-row>\n\n                            <ion-col *ngIf="wfInput.method == \'inputs\' + wfNavParams.wfProcess">\n                                <ion-row *ngIf="wfInput.header" align-items-center justify-content-center>\n                                    <div style="width: 45px;"></div>\n                                    <div style="text-align: center;">\n                                        {{wfInput.header}}\n                                    </div>\n                                </ion-row>\n\n                                <ion-row *ngFor="let option of wfInput.options" align-items-center justify-content-center>\n\n                                    <div class="inputLabel">\n                                        {{option.title}}\n                                    </div>\n\n                                    <div *ngIf="option.type == \'date\'" [ngStyle]="{\'width.em\':option.size}" class="gridborder">\n                                        <ion-datetime formControlName={{option.model}} displayFormat="DD/MM/YYYY" pickerFormat="DD MM YYYY"></ion-datetime>\n                                    </div>\n\n                                    <ion-input *ngIf="option.type != \'date\'" formControlName={{option.model}} type={{option.type}} [ngStyle]="{\'width.em\':option.size}" class="gridborder"></ion-input>\n\n                                    <button *ngIf="option.scan" item-end ion-button class="barcodeButton" type="button" (click)="checkBeforeScan()">\n                    扫一扫\n                  </button>\n                                </ion-row>\n\n                            </ion-col>\n\n                        </ion-col>\n\n                    </ion-row>\n\n                    <!-- Ageing Input field -->\n                    <ion-row *ngIf=" wfNavParams.wfProcess== \'5a0\' || wfNavParams.wfProcess == \'5b0\'" class="sec" align-items-center justify-content-start>\n\n                        <!-- Ageing field Title -->\n                        <ion-col col-12>\n                            <div *ngIf="wfNavParams.wfProcess== \'5a0\'" class="inputHeader">\n                                <ion-icon name="md-hand"></ion-icon>\n                                &nbsp; 手工老化\n                            </div>\n                            <div *ngIf="wfNavParams.wfProcess== \'5b0\'" class="inputHeader">\n                                <ion-icon name="ios-color-wand-outline"></ion-icon>\n                                &nbsp; 自动老化\n                            </div>\n                        </ion-col>\n\n                        <!-- Auto老化 Input field form -->\n                        <ion-col col-auto>\n                            <ion-row>\n\n                                <!-- Ageing Header -->\n                                <ion-col col-12>\n                                    <ion-row>\n                                        <div style="width: 45px">\n                                            &nbsp; &nbsp;\n                                        </div>\n\n                                        <div style="width: 8em; text-align: center;">\n                                            &nbsp; 规格\n                                        </div>\n\n                                        <div style="width: 8em; text-align: center;">\n                                            &nbsp; 实际\n                                        </div>\n                                    </ion-row>\n                                </ion-col>\n\n                                <!-- Ageing Input -->\n                                <ion-col>\n                                    <ion-row *ngFor="let wfInput of wfAgeingDetails" align-items-center>\n\n                                        <!-- Simple Input field -->\n                                        <div class="inputLabel">\n                                            {{wfInput.title}}\n                                        </div>\n\n                                        <div *ngFor="let col of wfInput.cols">\n                                            <div *ngIf="col.auto === false" [ngStyle]="{\'width.em\':wfInput.size}">\n                                                <ion-input formControlName={{col.model}} type={{col.type}} class="gridborder"></ion-input>\n                                            </div>\n\n                                            <div *ngIf="col.auto === true && wfNavParams.wfProcess == \'5b0\'" [ngStyle]="{\'width.em\':wfInput.size}">\n                                                <ion-input formControlName={{col.model}} type={{col.type}} class="gridborder"></ion-input>\n                                            </div>\n                                        </div>\n                                    </ion-row>\n                                </ion-col>\n                                <ion-col *ngIf="wfNavParams.wfProcess== \'5a0\'" padding-horizontal>\n                                    <ion-row>\n                                        <div class="inputLabel">\n                                            特殊说明\n                                        </div>\n                                    </ion-row>\n                                    <ion-textarea name="wfAgeingNote" style="min-height: 20em; width: auto" class="gridborder">\n                                    </ion-textarea>\n                                </ion-col>\n\n                                <!-- Auto Ageing 2nd part -->\n                                <ion-row *ngIf="wfNavParams.wfProcess== \'5b0\'" class="ageingSubPart">\n\n                                    <ion-col col-6>\n                                        <ion-row wrap align-items-center>\n                                            <ion-col *ngFor="let wfInput of wfAutoAgeingDetails" no-padding col-6>\n\n                                                <ion-row align-items-center>\n                                                    <div class="inputLabel">\n                                                        {{wfInput.title}}\n                                                    </div>\n\n                                                    <div [ngStyle]="{\'width.em\':wfInput.size}">\n                                                        <ion-input formControlName={{wfInput.model}} type={{wfInput.type}} no-padding class="gridborder"></ion-input>\n                                                    </div>\n\n                                                </ion-row>\n                                            </ion-col>\n                                        </ion-row>\n                                    </ion-col>\n\n                                    <!-- Note -->\n                                    <ion-col padding-horizontal>\n                                        <ion-row>\n                                            <div class="inputLabel">\n                                                特殊说明\n                                            </div>\n                                        </ion-row>\n                                        <ion-textarea name="wfAgeingNote" style="min-height: 20em; width: auto" class="gridborder">\n                                        </ion-textarea>\n                                    </ion-col>\n\n                                </ion-row>\n\n\n                            </ion-row>\n                        </ion-col>\n\n                    </ion-row>\n\n                    <!-- Workflow People input field -->\n                    <ion-row class="sec staff" align-items-center justify-content-left>\n\n                        <!-- Input field header -->\n                        <ion-col text-left col-12>\n                            <h4 class="inputHeader">\n                                <ion-icon name="md-contacts"></ion-icon>\n                                &nbsp; 员工信息\n                            </h4>\n                        </ion-col>\n\n\n                        <!-- Input field form -->\n                        <ion-col *ngFor="let wfInput of wfPplInputs" col-auto align-items-left justify-content-center>\n\n                            <!-- Simple Input field -->\n                            <ion-row align-items-center justify-content-center *ngIf="wfInput.method == \'input\'">\n\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-input formControlName={{wfInput.model}} type={{wfInput.type}} value={{wfInputForm.controls[wfInput.model].value}} [ngStyle]="{\'width.em\':wfInput.size}" class="gridborder"></ion-input>\n                                <div on-mouseover="showWfOpsInputsAlert(wfInputForm.value.wfOptBadQty, wfInputForm.value.wfOptGoodQty)">\n                                    <button [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')" *ngIf="wfInput.scan == 1" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(wfInput.model)">\n                                    扫一扫\n                                </button>\n\n                                    <button [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')" *ngIf="wfInput.scan == 2" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(wfInput.model)">\n                                    扫一扫\n                                </button>\n                                    <button [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')" *ngIf="wfInput.scan == 3" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(wfInput.model)">\n                                    扫一扫\n                                </button>\n                                </div>\n                                <div on-mouseover="showWfQCPassAlert(wfInputForm.value.wfQCPass)">\n                                    <button [disabled]="!(wfInputForm.value.wfQCPass == 2 || wfInputForm.value.wfQCPass == 1)" *ngIf="wfInput.scan == 4" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(wfInput.model)">\n                                    扫一扫\n                                </button>\n                                </div>\n                            </ion-row>\n\n\n                            <ion-row *ngIf="wfInput.method == \'textarea\'" align-items-center>\n                                <div class="inputLabel">\n                                    备注\n                                </div>\n                                <ion-textarea formControlName={{wfInput.model}} [ngStyle]="{\'width.em\':wfInput.size}" class="textarea gridborder"></ion-textarea>\n                            </ion-row>\n\n                            <!-- Select Buttons -->\n                            <ion-row *ngIf="wfInput.method == \'buttons\'" align-items-center>\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-input formControlName={{wfInput.model}} hidden></ion-input>\n\n\n                                <ion-buttons>\n                                    <button ion-button round outline type="button" style="width: auto;" *ngFor="let button of wfInput.buttons" (click)="updateForm(wfInput.model,button.value)" [ngClass]="{\'buttonsSelected\': wfInputForm.controls[wfInput.model].value === button.value}">\n                    <ion-icon name="{{button.icon}}"></ion-icon>\n                    &nbsp; {{button.label}}\n                  </button>\n                                </ion-buttons>\n                            </ion-row>\n\n                            <!-- Break -->\n                            <div *ngIf="wfInput.method == \'break\'" [ngStyle]="{\'width.em\':wfInput.size}">\n                            </div>\n\n                        </ion-col>\n\n                    </ion-row>\n\n                    <ion-row justify-content-end>\n                        <button [disabled]="!(wfInputForm.value.wfQCPass == 2 || wfInputForm.value.wfQCPass == 1)" type="submit" ion-button>\n                            <ion-icon ios="ios-checkbox-outline" md="md-checkbox-outline">\n                                &nbsp; 批次完成\n                            </ion-icon>\n                        </button>\n                        <button ion-button type="button" (click)="takePhoto()">\n                            <ion-icon ios="ios-camera" md="md-camera"></ion-icon>\n                            &nbsp; 拍照\n                        </button>\n\n                    </ion-row>\n\n                </ion-col>\n\n                <ion-col>\n                    <ion-row *ngFor="let image of images">\n                        <img src="{{image}}" class="img">\n                        <ion-img src="{{image}}"></ion-img>\n                    </ion-row>\n                </ion-col>\n\n            </ion-row>\n        </ion-grid>\n    </form>\n</ion-content>'/*ion-inline-end:"/Users/thomasq/Downloads/vtApp v3/src/pages/edit-workflow/edit-workflow.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__["a" /* Camera */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* NavParams */]])
], EditWorkflowPage);

//# sourceMappingURL=edit-workflow.js.map

/***/ }),

/***/ 197:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditWorkflow2Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_barcode_scanner__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__ = __webpack_require__(103);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var EditWorkflow2Page = (function () {
    function EditWorkflow2Page(storage, formBuilder, barcodeScanner, alertCtrl, camera, navParams) {
        /*
         // this.pushPage = EditWorkflow1Page;
         */
        // this.wfNavParams = this.navParams.data.value;
        this.storage = storage;
        this.formBuilder = formBuilder;
        this.barcodeScanner = barcodeScanner;
        this.alertCtrl = alertCtrl;
        this.camera = camera;
        this.navParams = navParams;
        this.form = __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* NgForm */];
        this.wfOrderDetails = [];
        this.wfRMDetails = [];
        this.wfAgeingDetails = [];
        this.wfAutoAgeingDetails = [];
        this.wfAutoAgeingSubDetails = [];
        this.wfOpsInputs = [];
        this.wfPplInputs = [];
        this.images = [];
        // For calculating the time value
        this.tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        this.appDate = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);
        // Assume all are ion-input except the one specificed as textarea
        this.wfOrderDetails = [
            { method: "input", model: "wfOrderBatchId", title: "批次号", type: "text", size: 25, highlight: false },
            { method: "input", model: "WfOrderId", title: "工单号", type: "text", size: 25, highlight: false },
            { method: "input", model: "wfOrderFormId", title: "流程卡号", type: "text", size: 25, highlight: false },
            { method: "input", model: "wfOrderNote", title: "工单备注", type: "text", size: 100, highlight: false },
            { method: "input", model: "wfOrderBOMNote", title: "流程卡备注", type: "text", size: 100, highlight: false },
            // {model: "wfOrderQty", title: "总量(批次)", type: "text", highlight: false},
            { method: "input", model: "wfOrderRMId", title: "料号", type: "text", size: 20, highlight: false },
            { method: "input", model: "wfOrderSeries", title: "系列", type: "text", size: 10, highlight: false },
            { method: "input", model: "wfOrderSpec", title: "规格", type: "text", size: 8, highlight: false },
            { method: "input", model: "wfOrderTotalQty", title: "数量", type: "number", size: 5, highlight: false },
            { method: "input", model: "wfOrderDim", title: "尺寸", type: "text", size: 8, highlight: false },
            { method: "input", model: "wfOrderFormNote", title: "BOM备注", type: "text", size: 100, highlight: false },
        ];
        this.wfRMDetails = [
            { modelName: "wfRMUpBeltName", title: "上带:", type: "text", modelSerial: 'wfRMUpBeltSerial', highlight: false },
            { modelName: "wfRMDownBeltName", title: "下带:", type: "text", modelSerial: 'wfRMDownBeltSerial', highlight: false },
            { modelName: "wfRMBaseName", title: "底座:", type: "text", modelSerial: 'wfRMBaseSerial', highlight: false },
            { modelName: "wfRMCircleName", title: "纸圆卡:", type: "text", modelSerial: 'wfRMCricleSerial', highlight: false },
            { modelName: "wfRMPrintName", title: "油墨:", type: "text", modelSerial: 'wfRMPrintSerial', highlight: false },
        ];
        this.wfOpsInputs = [
            { title: "CAP: μF", method: "input", model: "wfSpecCap", type: "text", scan: false, size: 9 },
            { title: "DF: %", method: "input", model: "wfSpecDF", type: "text", scan: false, size: 9 },
            { title: "LC: μA", method: "input", model: "wfSpecLC", type: "text", scan: false, size: 9 },
            { title: "Z/ESR(Ω):", method: "input", model: "wfSpecZESR", type: "text", scan: false, size: 9 },
            { title: "备注:", method: "input", model: "wfSpecNote", type: "textarea", scan: false, size: 50 },
            // {method: "break", title: ""},
            { title: "客户代码:", method: "input", model: "wfClientId", type: "text", scan: false, size: 15 },
            { title: "销售订单号:", method: "input", model: "wfSalesOrderId", type: "text", scan: false, size: 15 },
            { method: "break" },
            { title: "台机号:", method: "input", model: "wfOptMachineId", type: "text", scan: false, size: 9 },
            { method: 'inputs', options: [
                    { title: "日期", model: "wfOptInputDate", type: "date", scan: false, size: 8 },
                    { title: "开始", model: "wfOptStartTime", type: "time", scan: false, size: 8 },
                    { title: "完成", model: "wfOptFinishTime", type: "time", scan: false, size: 8 }
                ] },
            { method: "inputs", options: [
                    { title: "不良数", model: "wfOptBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8 },
                    { title: "良品数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8 },
                    { title: "抽查数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8 }
                ] }
        ];
        this.wfPplInputs = [
            { title: "作业員", method: "input", model: "wfStaffOptId", type: "text", icon: 'person', scan: 1, size: 20 },
            // {title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, size: 5},
            { title: "技術員", method: "input", model: "wfStaffTechId", type: "text", icon: 'construct', scan: 2, size: 20 },
            // {title: "X-RAY确认", method: "input", model: "wfStaffXrayId", type: "text", icon: 'construct', scan: 3, size: 20},
            { method: "break", size: 15 },
            { title: "电性", method: "buttons", model: "wfElecPass", icon: "md-checkmark-circle-outline", buttons: [
                    { label: "通过", value: 1, },
                    { label: "失败", value: 2 }
                ] },
            { method: "break", size: 15 },
            { title: "外观", method: "buttons", model: "wfLookPass", icon: "md-checkmark-circle-outline", buttons: [
                    { label: "通过", value: 1 },
                    { label: "失败", value: 2 }
                ] },
            { method: "break", size: 15 },
            // {title: "品检备注", method: "textarea", model: "wfQCInputNote", type: "text", icon: 'chatbubbles', scan: false, size: 30},
            { title: "品检員", method: "input", model: "wfQCSignOff", type: "text", icon: 'search', scan: 4, size: 20 },
        ];
    }
    EditWorkflow2Page.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad EditWorkflowPage2');
        console.log(this.wfNavParams);
        console.log(this.appDate);
        // alert(JSON.stringify(this.wfNavParams));
    };
    EditWorkflow2Page.prototype.ngOnInit = function () {
        var form = this.wfInputForm;
        // this.wfNavParams.wfFormName = '裸品流程卡';
        //this.wfNavParams.wfProcessName = '裸品流程卡';
        this.formInit();
        // alert(this.wfRMDetails[1].modelName)
    };
    EditWorkflow2Page.prototype.checkBeforeScan = function (form) {
        if (form.value.wfOptBadQty === '') {
            alert("input good items is missing!");
            return false;
        }
        else if (form.value.wfOptGoodQty === '') {
            alert("input good items is missing!");
            return false;
        }
    };
    EditWorkflow2Page.prototype.scanBarcode = function (model) {
        var _this = this;
        console.log("scanning Barcode");
        /*
         // console.log(form.value);
         //
         // form.controls['wfProcess'].setValue(1);
         // form.controls['wfProcessName'].setValue('钉卷');
         // form.controls["wfForm"].setValue(1);
         //
         // console.log(form.value);
         */
        var form = this.wfInputForm;
        this.barcodeScanner.scan().then(function (barcodeData) {
            // Success! Barcode data is here
            // Limiter to assume the Barcode is default used in this orderID
            form.controls[model].setValue(barcodeData.text);
            if (barcodeData.format && barcodeData.format != "QR_CODE" && model == "wfSignOff") {
                switch (barcodeData.text) {
                    case 'QC0001':
                        form.controls['wfSignOff'].setValue(barcodeData.text);
                        _this.promptAlert();
                        break;
                    case 'QC0002':
                        form.controls['wfSignOff'].setValue(barcodeData.text);
                        _this.promptAlert();
                        break;
                    case 'QC0003':
                        form.controls['wfSignOff'].setValue(barcodeData.text);
                        _this.promptAlert();
                        break;
                    default:
                        alert('嚫，请确定你所扫描的条码是正确的');
                }
            }
            else {
                alert('嚫，请确定你所扫描的条码是正确的');
            }
        }, function (err) {
            // An error occurred
            alert(err);
        });
    };
    EditWorkflow2Page.prototype.inputWf = function () {
        console.log('inputWf activated');
    };
    EditWorkflow2Page.prototype.setWfPass = function () {
        console.log('checked');
        /*
         // this.wfPass = result;
         */
    };
    EditWorkflow2Page.prototype.onSubmit = function () {
        console.log(this.wfInputForm);
    };
    EditWorkflow2Page.prototype.updateForm = function (model, value) {
        var form = this.wfInputForm;
        console.log(form);
        form.controls[model].setValue(value);
        console.log(form.controls[model].value);
    };
    EditWorkflow2Page.prototype.promptAlert = function () {
        var alertCtl = this.alertCtrl.create();
        alertCtl.setTitle("确定完成和上传");
        alertCtl.addButton('取消');
        alertCtl.addButton({
            text: '確定',
            handler: function (data) {
                // Once selected the subprocess, update the form and then submit the form to next process stage
                alert("上传成功");
            }
        });
        alertCtl.present();
    };
    EditWorkflow2Page.prototype.formInit = function () {
        var form = this.wfInputForm;
        this.wfInputForm = this.formBuilder.group({
            wfProcess: [''],
            wfProcessName: [''],
            // Order Inputs detail
            wfOrderFormId: [''],
            WfOrderId: [''],
            wfOrderBatchId: [''],
            wfOrderBatchQty: [''],
            wfOrderFormNote: [''],
            wfOrderBOMNote: [''],
            wfOrderNote: [''],
            wfOrderTotalQty: [''],
            wfOrderTotalGoodQty: [''],
            wfOrderRMId: [''],
            wfOrderSeries: [''],
            wfOrderSpec: [''],
            // wfOrderQty: [''],
            wfOrderDim: [''],
            wfSpecCap: [''],
            wfSpecDF: [''],
            wfSpecLC: [''],
            wfSpecZESR: [''],
            wfSpecNote: [''],
            // Raw Material Inputs
            wfRMUpBeltName: [''],
            wfRMUpBeltSerial: [''],
            wfRMDownBeltName: [''],
            wfRMDownBeltSerial: [''],
            wfRMBaseName: [''],
            wfRMBaseSerial: [''],
            wfRMCircleName: [''],
            wfRMCricleSerial: [''],
            wfRMPrintName: [''],
            wfRMPrintSerial: [''],
            // Operational Input
            wfOptMachineId: '',
            wfOptInputDate: [this.appDate],
            wfOptStartTime: ['00:00'],
            wfOptFinishTime: ['00:00'],
            wfOptBadQty: [''],
            wfOptGoodQty: [''],
            wfClientId: [''],
            wfSalesOrderId: [''],
            //Staff Input section
            wfStaffOptId: [''],
            wfStaffOptShift: [''],
            wfStaffTechId: [''],
            wfElecPass: [''],
            wfLookPass: [''],
            wfQCSignOff: [''],
        });
        /*
         this.storage.forEach( (value, key, index) => {
         this.wfInputForm[key] = value;
         alert(key + ' ' + value + ' ');
         });
         */
        var storageDataTmp;
        // this.storage.get(this.wfNavParams.wfFormId).then(dataTmp=> {
        //   if(dataTmp) {
        //     //alert("exists");
        //     storageDataTmp = dataTmp;
        //   }
        //   else {
        //     alert("data issue");
        //   }
        // });
    };
    EditWorkflow2Page.prototype.keyPress = function (keycode) {
        if (keycode == 13) {
            alert('next');
        }
    };
    EditWorkflow2Page.prototype.showWfOpsInputsAlert = function (wfOptBadQtyValue, wfOptGoodQtyValue) {
        if (wfOptBadQtyValue == '' || wfOptGoodQtyValue == '') {
            var alert_1 = this.alertCtrl.create({
                title: 'Please Check!',
                subTitle: 'Please fill out the following: 日期，开始，完成，良品数，不良数 ',
                buttons: ['OK']
            });
            alert_1.present();
        }
    };
    EditWorkflow2Page.prototype.showWfQCPassAlert = function (wfQCPassValue) {
        if (!(wfQCPassValue == 2 || wfQCPassValue == 1)) {
            var alert_2 = this.alertCtrl.create({
                title: 'Please Check!',
                subTitle: 'Please select 终检!',
                buttons: ['OK']
            });
            alert_2.present();
        }
    };
    EditWorkflow2Page.prototype.takePhoto = function () {
        // alert("taking photos");
        var _this = this;
        var options = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            saveToPhotoAlbum: true
        };
        this.camera.getPicture(options).then(function (imageData) {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            var imgUrl = 'data:image/jpeg;base64,' + imageData;
            _this.images.push(imgUrl);
            _this.storage.set('images', _this.images);
            // console.log(this.images);
        }, function (err) {
            // Handle error
        });
    };
    return EditWorkflow2Page;
}());
EditWorkflow2Page = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-edit-workflow',template:/*ion-inline-start:"/Users/thomasq/Downloads/vtApp v3/src/pages/edit-workflow2/edit-workflow2.html"*/'<ion-header style="margin-top: 0px !important;margin-left: 0px !important;">\n    <ion-navbar>\n        <div style="align-items: center; display: inline;">\n            <img src="./assets/img/vt_icon.png" class="icon">\n            <ion-title>\n                <!--&nbsp; ( {{wfNavParams.wfFormName}} )&nbsp; 工序:&nbsp; {{wfNavParams.wfProcessName}}-->\n            </ion-title>\n        </div>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n    <form [formGroup]="wfInputForm" (ngSubmit)="onSubmit()">\n        <ion-grid>\n            <!-- header bar -->\n            <ion-row wrap class="main headbar">\n                <ion-col *ngFor="let wfOrderDetail of wfOrderDetails">\n                    <ion-row justify-content-center wrap>\n                        <ion-col *ngIf="wfOrderDetail.method === \'input\'" no-padding>\n                            <ion-row align-items-center>\n                                <div class="inputLabel" no-padding>\n                                    {{wfOrderDetail.title}}\n                                </div>\n                                <ion-input *ngIf="wfOrderDetail.type != \'textarea\'" class="gridborder" disabled type={{wfOrderDetail.type}} [ngStyle]="{\'width.em\':wfOrderDetail.size}" formControlName={{wfOrderDetail.model}}></ion-input>\n\n                                <ion-textarea *ngIf="wfOrderDetail.type === \'textarea\'" formControlName={{wfOrderDetail.model}} [ngStyle]="{\'width.em\':wfOrderDetail.size}" class="textarea gridborder"></ion-textarea>\n                            </ion-row>\n                        </ion-col>\n\n                        <ion-col *ngIf="wfOrderDetail.method === \'break\'" no-padding [ngStyle]="{\'width.em\':wfOrderDetail.size}"></ion-col>\n\n                    </ion-row>\n                </ion-col>\n            </ion-row>\n\n            <!-- Content Section -->\n            <ion-row>\n                <!-- Material Info and Serial # -->\n                <ion-col class="main" col-5 no-padding>\n                    <!-- Header -->\n                    <ion-row>\n                        <ion-col col-1></ion-col>\n                        <ion-col text-center col-7>\n                            <h4 class="inputHeader">材料</h4>\n                        </ion-col>\n                        <ion-col text-center>\n                            <h4 class="inputHeader">批号</h4>\n                        </ion-col>\n                    </ion-row>\n\n                    <!-- Body -->\n                    <ion-row *ngFor="let wfRMDetail of wfRMDetails"\n                             justify-content-center\n                             align-items-center>\n                        <ion-col wrap col-auto>\n                            <div class="inputLabel">\n                                {{wfRMDetail.title}}\n                            </div>\n                        </ion-col>\n                        <ion-col col-6>\n                            <ion-input class="gridborder"\n                                       disabled\n                                       value={{wfInputForm.controls[wfRMDetail.modelName].value}}></ion-input>\n                        </ion-col>\n                        <ion-col>\n                            <ion-input class="gridborder"\n                                       value={{wfInputForm.controls[wfRMDetail.modelSerial].value}}></ion-input>\n                        </ion-col>\n                    </ion-row>\n                </ion-col>\n\n                <!-- Production Record + Ageing + Staff input -->\n                <ion-col col-7>\n\n                    <!-- Production input field -->\n                    <ion-row class="sec"\n                             align-self-stretch\n                             justify-content-left>\n\n                        <!-- Input field header -->\n                        <ion-col col-12>\n                            <h4 class="inputHeader">\n                                <ion-icon name="clipboard"></ion-icon>\n                                &nbsp; 生產记录\n                            </h4>\n                        </ion-col>\n\n                        <!-- Input field form -->\n                        <ion-col *ngFor="let wfInput of wfOpsInputs" col-auto>\n\n                            <!-- Simple Input field -->\n                            <ion-row *ngIf="wfInput.method == \'input\'"\n                                     align-items-center\n                                     justify-content-center>\n\n                                <div style="margin-left: 5px;margin-right: 5px;">\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-input type={{wfInput.type}}\n                                           formControlName={{wfInput.model}}\n                                           [ngStyle]="{\'width.em\':wfInput.size}"\n                                           class="gridborder"></ion-input>\n\n                                <button *ngIf="wfInput.scan"\n                                        item-end\n                                        ion-button\n                                        class="barcodeButton"\n                                        type="button"\n                                        (click)="scanBarcode(wfInput.model)">\n                                    扫一扫\n                                </button>\n                            </ion-row>\n\n                            <ion-row *ngIf="wfInput.method == \'buttons\'"\n                                     justify-content-left\n                                     align-items-center>\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-buttons>\n                                    <button *ngFor="let button of wfInput.buttons"\n                                            (click)="updateForm(wfInput.model, button.value)"\n                                            [ngClass]="{\'buttonsSelected\': wfInputForm.controls[wfInput.model].value === button.value}"\n                                            ion-button\n                                            round\n                                            outline\n                                            type="button"\n                                            style="width: auto;">\n                                        &nbsp; {{button.label}}\n                                    </button>\n                                </ion-buttons>\n                            </ion-row>\n\n                            <ion-col *ngIf="wfInput.method == \'inputs\'">\n                                <ion-row *ngIf="wfInput.header" align-items-center justify-content-center>\n                                    <div style="width: 45px;"></div>\n                                    <div style="text-align: center;">\n                                        {{wfInput.header}}\n                                    </div>\n                                </ion-row>\n\n                                <ion-row *ngFor="let option of wfInput.options" align-items-center justify-content-center>\n\n                                    <div class="inputLabel">\n                                        {{option.title}}\n                                    </div>\n                                    <!-- datetime -->\n                                    <div *ngIf="option.type == \'date\'" [ngStyle]="{\'width.em\':option.size}" class="gridborder">\n                                        <ion-datetime formControlName={{option.model}} displayFormat="DD/MM/YYYY" pickerFormat="DD MM YYYY"></ion-datetime>\n                                    </div>\n\n                                    <ion-input *ngIf="option.type != \'date\'" formControlName={{option.model}} type={{option.type}} [ngStyle]="{\'width.em\':option.size}" class="gridborder"></ion-input>\n\n                                    <button *ngIf="option.scan" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(option.model)">\n                                        扫一扫\n                                    </button>\n                                </ion-row>\n\n                            </ion-col>\n\n                            <ion-col *ngIf="wfInput.method == \'breaks\'" col-3>\n                            </ion-col>\n\n                            <ion-row *ngIf="wfInput.method == \'textarea\'" align-items-center>\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n                                <ion-textarea\n                                        formControlName={{wfInput.model}}\n                                        style="min-width: auto;"\n                                        class="gridborder">\n                                </ion-textarea>\n                            </ion-row>\n\n                            <!--<ion-col *ngIf="wfInput.method == \'inputs\' + wfNavParams.wfProcess">-->\n                                <!--<ion-row *ngIf="wfInput.header" align-items-center justify-content-center>-->\n                                    <!--<div style="width: 45px;"></div>-->\n                                    <!--<div style="text-align: center;">-->\n                                        <!--{{wfInput.header}}-->\n                                    <!--</div>-->\n                                <!--</ion-row>-->\n\n                                <!--<ion-row *ngFor="let option of wfInput.options" align-items-center justify-content-center>-->\n\n                                    <!--<div class="inputLabel">-->\n                                        <!--{{option.title}}-->\n                                    <!--</div>-->\n\n                                    <!--<div *ngIf="option.type == \'date\'" [ngStyle]="{\'width.em\':option.size}" class="gridborder">-->\n                                        <!--<ion-datetime formControlName={{option.model}} displayFormat="DD/MM/YYYY" pickerFormat="DD MM YYYY"></ion-datetime>-->\n                                    <!--</div>-->\n\n                                    <!--<ion-input *ngIf="option.type != \'date\'" formControlName={{option.model}} type={{option.type}} [ngStyle]="{\'width.em\':option.size}" class="gridborder"></ion-input>-->\n\n                                    <!--<button *ngIf="option.scan" item-end ion-button class="barcodeButton" type="button" (click)="checkBeforeScan()">-->\n                                        <!--扫一扫-->\n                                    <!--</button>-->\n                                <!--</ion-row>-->\n\n                            <!--</ion-col>-->\n\n                        </ion-col>\n\n                    </ion-row>\n\n                    <!-- Ageing Input field -->\n                    <!--<ion-row *ngIf=" wfNavParams.wfProcess== \'5a0\' || wfNavParams.wfProcess == \'5b0\'" class="sec" align-items-center justify-content-start>-->\n\n                        <!--&lt;!&ndash; Ageing field Title &ndash;&gt;-->\n                        <!--<ion-col col-12>-->\n                            <!--<div *ngIf="wfNavParams.wfProcess== \'5a0\'" class="inputHeader">-->\n                                <!--<ion-icon name="md-hand"></ion-icon>-->\n                                <!--&nbsp; 手工老化-->\n                            <!--</div>-->\n                            <!--<div *ngIf="wfNavParams.wfProcess== \'5b0\'" class="inputHeader">-->\n                                <!--<ion-icon name="ios-color-wand-outline"></ion-icon>-->\n                                <!--&nbsp; 自动老化-->\n                            <!--</div>-->\n                        <!--</ion-col>-->\n\n                        <!--&lt;!&ndash; Auto老化 Input field form &ndash;&gt;-->\n                        <!--<ion-col col-auto>-->\n                            <!--<ion-row>-->\n\n                                <!--&lt;!&ndash; Ageing Header &ndash;&gt;-->\n                                <!--<ion-col col-12>-->\n                                    <!--<ion-row>-->\n                                        <!--<div style="width: 45px">-->\n                                            <!--&nbsp; &nbsp;-->\n                                        <!--</div>-->\n\n                                        <!--<div style="width: 8em; text-align: center;">-->\n                                            <!--&nbsp; 规格-->\n                                        <!--</div>-->\n\n                                        <!--<div style="width: 8em; text-align: center;">-->\n                                            <!--&nbsp; 实际-->\n                                        <!--</div>-->\n                                    <!--</ion-row>-->\n                                <!--</ion-col>-->\n\n                                <!--&lt;!&ndash; Ageing Input &ndash;&gt;-->\n                                <!--<ion-col>-->\n                                    <!--<ion-row *ngFor="let wfInput of wfAgeingDetails" align-items-center>-->\n\n                                        <!--&lt;!&ndash; Simple Input field &ndash;&gt;-->\n                                        <!--<div class="inputLabel">-->\n                                            <!--{{wfInput.title}}-->\n                                        <!--</div>-->\n\n                                        <!--<div *ngFor="let col of wfInput.cols">-->\n                                            <!--<div *ngIf="col.auto === false" [ngStyle]="{\'width.em\':wfInput.size}">-->\n                                                <!--<ion-input formControlName={{col.model}} type={{col.type}} class="gridborder"></ion-input>-->\n                                            <!--</div>-->\n\n                                            <!--<div *ngIf="col.auto === true && wfNavParams.wfProcess == \'5b0\'" [ngStyle]="{\'width.em\':wfInput.size}">-->\n                                                <!--<ion-input formControlName={{col.model}} type={{col.type}} class="gridborder"></ion-input>-->\n                                            <!--</div>-->\n                                        <!--</div>-->\n                                    <!--</ion-row>-->\n                                <!--</ion-col>-->\n                                <!--<ion-col *ngIf="wfNavParams.wfProcess== \'5a0\'" padding-horizontal>-->\n                                    <!--<ion-row>-->\n                                        <!--<div class="inputLabel">-->\n                                            <!--特殊说明-->\n                                        <!--</div>-->\n                                    <!--</ion-row>-->\n                                    <!--<ion-textarea name="wfAgeingNote" style="min-height: 20em; width: auto" class="gridborder">-->\n                                    <!--</ion-textarea>-->\n                                <!--</ion-col>-->\n\n                                <!--&lt;!&ndash; Auto Ageing 2nd part &ndash;&gt;-->\n                                <!--<ion-row *ngIf="wfNavParams.wfProcess== \'5b0\'" class="ageingSubPart">-->\n\n                                    <!--<ion-col col-6>-->\n                                        <!--<ion-row wrap align-items-center>-->\n                                            <!--<ion-col *ngFor="let wfInput of wfAutoAgeingDetails" no-padding col-6>-->\n\n                                                <!--<ion-row align-items-center>-->\n                                                    <!--<div class="inputLabel">-->\n                                                        <!--{{wfInput.title}}-->\n                                                    <!--</div>-->\n\n                                                    <!--<div [ngStyle]="{\'width.em\':wfInput.size}">-->\n                                                        <!--<ion-input formControlName={{wfInput.model}} type={{wfInput.type}} no-padding class="gridborder"></ion-input>-->\n                                                    <!--</div>-->\n\n                                                <!--</ion-row>-->\n                                            <!--</ion-col>-->\n                                        <!--</ion-row>-->\n                                    <!--</ion-col>-->\n\n                                    <!--&lt;!&ndash; Note &ndash;&gt;-->\n                                    <!--<ion-col padding-horizontal>-->\n                                        <!--<ion-row>-->\n                                            <!--<div class="inputLabel">-->\n                                                <!--特殊说明-->\n                                            <!--</div>-->\n                                        <!--</ion-row>-->\n                                        <!--<ion-textarea name="wfAgeingNote" style="min-height: 20em; width: auto" class="gridborder">-->\n                                        <!--</ion-textarea>-->\n                                    <!--</ion-col>-->\n\n                                <!--</ion-row>-->\n\n\n                            <!--</ion-row>-->\n                        <!--</ion-col>-->\n\n                    <!--</ion-row>-->\n\n                    <!-- Workflow People input field -->\n                    <ion-row class="sec staff" align-items-center justify-content-left>\n\n                        <!-- Input field header -->\n                        <ion-col text-left col-12>\n                            <h4 class="inputHeader">\n                                <ion-icon name="md-contacts"></ion-icon>\n                                &nbsp; 员工信息\n                            </h4>\n                        </ion-col>\n\n\n                        <!-- Input field form -->\n                        <ion-col *ngFor="let wfInput of wfPplInputs" col-auto align-items-left justify-content-center>\n\n                            <!-- Simple Input field -->\n                            <ion-row align-items-center justify-content-center *ngIf="wfInput.method == \'input\'">\n\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-input formControlName={{wfInput.model}} type={{wfInput.type}} value={{wfInputForm.controls[wfInput.model].value}} [ngStyle]="{\'width.em\':wfInput.size}" class="gridborder"></ion-input>\n                                <div on-mouseover="showWfOpsInputsAlert(wfInputForm.value.wfOptBadQty, wfInputForm.value.wfOptGoodQty)">\n                                    <button [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')" *ngIf="wfInput.scan == 1" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(wfInput.model)">\n                                        扫一扫\n                                    </button>\n\n                                    <button [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')" *ngIf="wfInput.scan == 2" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(wfInput.model)">\n                                        扫一扫\n                                    </button>\n                                    <button [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')" *ngIf="wfInput.scan == 3" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(wfInput.model)">\n                                        扫一扫\n                                    </button>\n                                </div>\n                                <div on-mouseover="showWfQCPassAlert(wfInputForm.value.wfQCPass)">\n                                    <button [disabled]="!(wfInputForm.value.wfQCPass == 2 || wfInputForm.value.wfQCPass == 1)" *ngIf="wfInput.scan == 4" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(wfInput.model)">\n                                        扫一扫\n                                    </button>\n                                </div>\n                            </ion-row>\n\n\n                            <ion-row *ngIf="wfInput.method == \'textarea\'" align-items-center>\n                                <div class="inputLabel">\n                                    备注\n                                </div>\n                                <ion-textarea formControlName={{wfInput.model}} [ngStyle]="{\'width.em\':wfInput.size}" class="textarea gridborder"></ion-textarea>\n                            </ion-row>\n\n                            <!-- Select Buttons -->\n                            <ion-row *ngIf="wfInput.method == \'buttons\'" align-items-center>\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-input formControlName={{wfInput.model}} hidden></ion-input>\n\n\n                                <ion-buttons>\n                                    <button ion-button round outline type="button" style="width: auto;" *ngFor="let button of wfInput.buttons" (click)="updateForm(wfInput.model,button.value)" [ngClass]="{\'buttonsSelected\': wfInputForm.controls[wfInput.model].value === button.value}">\n                                        <ion-icon name="{{button.icon}}"></ion-icon>\n                                        &nbsp; {{button.label}}\n                                    </button>\n                                </ion-buttons>\n                            </ion-row>\n\n                            <!-- Break -->\n                            <div *ngIf="wfInput.method == \'break\'" [ngStyle]="{\'width.em\':wfInput.size}">\n                            </div>\n\n                        </ion-col>\n\n                    </ion-row>\n\n                    <ion-row justify-content-end>\n                        <button [disabled]="!(wfInputForm.value.wfQCPass == 2 || wfInputForm.value.wfQCPass == 1)" type="submit" ion-button>\n                            <ion-icon ios="ios-checkbox-outline" md="md-checkbox-outline">\n                                &nbsp; 批次完成\n                            </ion-icon>\n                        </button>\n                        <button ion-button type="button" (click)="takePhoto()">\n                            <ion-icon ios="ios-camera" md="md-camera"></ion-icon>\n                            &nbsp; 拍照\n                        </button>\n\n                    </ion-row>\n\n                </ion-col>\n\n                <ion-col>\n                    <ion-row *ngFor="let image of images">\n                        <img src="{{image}}" class="img">\n                        <ion-img src="{{image}}"></ion-img>\n                    </ion-row>\n                </ion-col>\n\n            </ion-row>\n        </ion-grid>\n    </form>\n</ion-content>'/*ion-inline-end:"/Users/thomasq/Downloads/vtApp v3/src/pages/edit-workflow2/edit-workflow2.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__["a" /* Camera */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* NavParams */]])
], EditWorkflow2Page);

//# sourceMappingURL=edit-workflow2.js.map

/***/ }),

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(217);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 217:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_home_home__ = __webpack_require__(270);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_workflow_workflow__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_workflows_workflows__ = __webpack_require__(271);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_edit_workflow_edit_workflow__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_barcode_scanner__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_screen_orientation__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_edit_workflow1_edit_workflow1__ = __webpack_require__(272);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_camera__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_edit_workflow2_edit_workflow2__ = __webpack_require__(197);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
















var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_workflow_workflow__["a" /* WorkflowPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_workflows_workflows__["a" /* WorkflowsPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_edit_workflow_edit_workflow__["a" /* EditWorkflowPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_edit_workflow1_edit_workflow1__["a" /* EditWorkflow1Page */],
            __WEBPACK_IMPORTED_MODULE_15__pages_edit_workflow2_edit_workflow2__["a" /* EditWorkflow2Page */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */]),
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["a" /* IonicStorageModule */].forRoot({
                name: '__mydbtest',
                driverOrder: ['indexeddb', 'sqlite', 'websql']
            })
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_7__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_workflow_workflow__["a" /* WorkflowPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_workflows_workflows__["a" /* WorkflowsPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_edit_workflow_edit_workflow__["a" /* EditWorkflowPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_edit_workflow1_edit_workflow1__["a" /* EditWorkflow1Page */],
            __WEBPACK_IMPORTED_MODULE_15__pages_edit_workflow2_edit_workflow2__["a" /* EditWorkflow2Page */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_14__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["a" /* IonicStorageModule */],
            __WEBPACK_IMPORTED_MODULE_12__ionic_native_screen_orientation__["a" /* ScreenOrientation */],
            { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 269:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_screen_orientation__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_workflow_workflow__ = __webpack_require__(102);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MyApp = (function () {
    // rootPage:any = EditWorkflow2Page;
    function MyApp(platform, statusBar, screenOrientation, splashScreen) {
        this.screenOrientation = screenOrientation;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_5__pages_workflow_workflow__["a" /* WorkflowPage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
        // Uncomment below command for screenOrientation lock
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    }
    return MyApp;
}());
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/thomasq/Downloads/vtApp v3/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/thomasq/Downloads/vtApp v3/src/app/app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_screen_orientation__["a" /* ScreenOrientation */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 270:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__workflow_workflow__ = __webpack_require__(102);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var HomePage = (function () {
    function HomePage(alertCtrl, navCtrl) {
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
    }
    HomePage.prototype.onNewWorkflow = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__workflow_workflow__["a" /* WorkflowPage */]);
    };
    return HomePage;
}());
HomePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-home',template:/*ion-inline-start:"/Users/thomasq/Downloads/vtApp v3/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-buttons left>\n      <button ion-button icon-only menuToggle>\n        <ion-icon name="menu"></ion-icon>\n      </button>\n    </ion-buttons>\n    <ion-buttons end>\n      <button ion-button icon-only (click)="onNewWorkflow()">\n        <ion-icon name="add"></ion-icon>\n      </button>\n    </ion-buttons>\n    <ion-title>工作清单</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content padding>\n\n</ion-content>\n'/*ion-inline-end:"/Users/thomasq/Downloads/vtApp v3/src/pages/home/home.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */]])
], HomePage);

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 271:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WorkflowsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the WorkflowsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var WorkflowsPage = (function () {
    function WorkflowsPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    WorkflowsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad WorkflowsPage');
    };
    return WorkflowsPage;
}());
WorkflowsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-workflows',template:/*ion-inline-start:"/Users/thomasq/Downloads/vtApp v3/src/pages/workflows/workflows.html"*/'<!--\n  Generated template for the WorkflowsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>workflows</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n</ion-content>\n'/*ion-inline-end:"/Users/thomasq/Downloads/vtApp v3/src/pages/workflows/workflows.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavParams */]])
], WorkflowsPage);

//# sourceMappingURL=workflows.js.map

/***/ }),

/***/ 272:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditWorkflow1Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__edit_workflow2_edit_workflow2__ = __webpack_require__(197);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the EditWorkflow1Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var EditWorkflow1Page = (function () {
    function EditWorkflow1Page(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.pushPage = __WEBPACK_IMPORTED_MODULE_2__edit_workflow2_edit_workflow2__["a" /* EditWorkflow2Page */];
    }
    EditWorkflow1Page.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad EditWorkflow1Page');
    };
    return EditWorkflow1Page;
}());
EditWorkflow1Page = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-edit-workflow1',template:/*ion-inline-start:"/Users/thomasq/Downloads/vtApp v3/src/pages/edit-workflow1/edit-workflow1.html"*/'<ion-header style="margin-top: 0px !important;margin-left: 0px !important;">\n  <ion-navbar>\n    <div style="align-items: center; display: inline;">\n      <img src="./assets/img/vt_icon.png" class="icon">\n      <ion-title>\n        &nbsp; 工序:&nbsp; {{wfNavParams.wfProcessName}}\n      </ion-title>\n    </div>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <form [formGroup]="wfInputForm" (ngSubmit)="onSubmit()">\n    <ion-grid>\n      <!-- header bar -->\n      <ion-row wrap class="main headbar">\n        <ion-col *ngFor="let wfOrderDetail of wfOrderDetails">\n          <ion-row  justify-content-center wrap>\n            <ion-col *ngIf="wfOrderDetail.method === \'input\'">\n              <ion-row align-items-center>\n                <div class="label">{{wfOrderDetail.title}}</div>\n                <ion-input *ngIf="wfOrderDetail.type != \'textarea\'"\n                           class="gridborder"\n                           disabled\n                           type={{wfOrderDetail.type}}\n                           [ngStyle]="{\'width.em\':wfOrderDetail.size}"\n                           formControlName={{wfOrderDetail.model}}></ion-input>\n\n                <ion-textarea *ngIf="wfOrderDetail.type === \'textarea\'"\n                              formControlName={{wfOrderDetail.model}}\n                              [ngStyle]="{\'width.em\':wfOrderDetail.size}"\n                              class="textarea gridborder"></ion-textarea>\n              </ion-row>\n            </ion-col>\n\n            <ion-col *ngIf="wfOrderDetail.method === \'break\'"\n                     [ngStyle]="{\'width.em\':wfOrderDetail.size}"></ion-col>\n\n          </ion-row>\n        </ion-col>\n      </ion-row>\n\n      <!-- Content Section -->\n      <ion-row>\n        <!-- Material Info and Serial # -->\n        <ion-col class="main" col-5 no-padding>\n          <!-- Header -->\n          <ion-row>\n            <ion-col col-1></ion-col>\n            <ion-col text-center col-7>\n              <h4 class="header">材料</h4>\n            </ion-col>\n            <ion-col text-center>\n              <h4 class="header">批号</h4>\n            </ion-col>\n          </ion-row>\n\n          <!-- Body -->\n          <ion-row *ngFor="let wfRMDetail of wfRMDetails"\n                   justify-content-center\n                   align-items-center>\n            <ion-col wrap col-auto>\n              <div class="label">\n                {{wfRMDetail.title}}\n              </div>\n            </ion-col>\n            <ion-col col-6>\n              <ion-input class="gridborder"\n                         disabled\n                         formControlName={{wfRMDetail.modelName}}\n                         value={{wfRMDetail.valueName}}></ion-input>\n            </ion-col>\n            <ion-col>\n              <ion-input class="gridborder"\n                         disabled\n                         formControlName={{wfRMDetail.modelSerial}}\n                         value={{wfRMDetail.valueSerial}}></ion-input>\n            </ion-col>\n          </ion-row>\n        </ion-col>\n\n        <!-- Production Record + Ageing + Staff input -->\n        <ion-col col-7>\n\n          <!-- Production input field -->\n          <ion-row class="sec"\n                   align-self-stretch\n                   justify-content-left>\n\n            <!-- Input field header -->\n            <ion-col col-12>\n              <h4 class="header">\n                <ion-icon name="clipboard"></ion-icon>\n                &nbsp; 生產记录\n              </h4>\n            </ion-col>\n\n            <!-- Input field form -->\n            <ion-col *ngFor="let wfInput of wfOpsInputs" col-auto>\n\n              <!-- Simple Input field -->\n              <ion-row *ngIf="wfInput.method == \'input\'"\n                       align-items-center\n                       justify-content-center>\n\n                <div style="margin-left: 5px;margin-right: 5px;">\n                  <!--<ion-icon name="{{wfInput.icon}}"></ion-icon>-->\n                  {{wfInput.title}}\n                </div>\n\n                <ion-input type="{{wfInput.type}}"\n                           formControlName="{{wfInput.model}}"\n                           [ngStyle]="{\'width.em\':wfInput.size}"\n                           class="gridborder"></ion-input>\n\n                <button *ngIf="wfInput.scan"\n                        item-end\n                        ion-button\n                        class="barcodeButton"\n                        type="button"\n                        (click)="scanBarcode(wfInput.model)">\n                  扫一扫\n                </button>\n              </ion-row>\n\n              <ion-row *ngIf="wfInput.method == \'buttons\'"\n                       justify-content-left\n                       align-items-center>\n                <div class="label">\n                  <!--<ion-icon name="{{wfInput.icon}}"></ion-icon>-->\n                  {{wfInput.title}}\n                </div>\n\n                <ion-buttons>\n                  <button ion-button\n                          round\n                          outline\n                          type="button"\n                          style="width: auto;"\n                          *ngFor="let button of wfInput.buttons"\n                          (click)="updateForm(wfInput.model,button.value)"\n                          [ngClass]="{\'buttonsSelected\': wfInputForm.controls[wfInput.model].value === button.value}">\n                    <!--<ion-icon name="{{button.icon}}"></ion-icon>-->\n                    &nbsp; {{button.label}}\n                  </button>\n                </ion-buttons>\n              </ion-row>\n\n              <ion-col *ngIf="wfInput.method == \'inputs\'">\n                <ion-row *ngIf="wfInput.header"\n                         align-items-center\n                         justify-content-center>\n                  <div style="width: 45px;"></div>\n                  <div style="text-align: center;">\n                    {{wfInput.header}}\n                  </div>\n                </ion-row>\n\n                <ion-row *ngFor="let option of wfInput.options"\n                         align-items-center\n                         justify-content-center>\n\n                  <div class="label">\n                    <!--<ion-icon name="{{option.icon}}"></ion-icon>-->\n                    {{option.title}}\n                  </div>\n\n                  <div *ngIf="option.type == \'date\'"\n                       [ngStyle]="{\'width.em\':option.size}"\n                       class="gridborder">\n                    <ion-datetime formControlName="{{option.model}}"\n                                  displayFormat="YYYY/MM/DD"\n                                  pickerFormat="YYYY MM DD"></ion-datetime>\n                  </div>\n\n\n                  <ion-input *ngIf="option.type != \'date\'"\n                             formControlName="{{option.model}}"\n                             type="{{option.type}}"\n                             [ngStyle]="{\'width.em\':option.size}"\n                             class="gridborder"></ion-input>\n\n                  <button *ngIf="option.scan"\n                          item-end\n                          ion-button\n                          class="barcodeButton"\n                          type="button"\n                          (click)="scanBarcode(option.model)">\n                    <!--<ion-icon name="barcode"></ion-icon>-->\n                    扫一扫\n                  </button>\n                </ion-row>\n\n              </ion-col>\n\n              <ion-col *ngIf="wfInput.method == \'breaks\'" col-3>\n\n              </ion-col>\n\n              <ion-row *ngIf="wfInput.method == \'textarea\'"\n                       align-items-center>\n                <div class="label">\n                  <!--<ion-icon name="chatbubbles"></ion-icon>-->\n                  {{wfInput.title}}\n                </div>\n                <ion-textarea formControlName="{{wfInput.model}}"\n                              style="min-width: auto;"\n                              class="gridborder">\n                </ion-textarea>\n              </ion-row>\n\n\n              <ion-col *ngIf="wfInput.method == \'inputs\' + wfNavParams.wfProcess">\n                <ion-row *ngIf="wfInput.header"\n                         align-items-center\n                         justify-content-center>\n                  <div style="width: 45px;"></div>\n                  <div style="text-align: center;">\n                    {{wfInput.header}}\n                  </div>\n                </ion-row>\n\n                <ion-row *ngFor="let option of wfInput.options"\n                         align-items-center\n                         justify-content-center>\n\n                  <div class="label">\n                    <!--<ion-icon name="{{option.icon}}"></ion-icon>-->\n                    {{option.title}}\n                  </div>\n\n                  <div *ngIf="option.type == \'date\'"\n                       [ngStyle]="{\'width.em\':option.size}"\n                       class="gridborder">\n                    <ion-datetime formControlName="{{option.model}}"\n                                  displayFormat="YYYY/MM/DD"\n                                  pickerFormat="YYYY MM DD"></ion-datetime>\n                  </div>\n\n\n                  <ion-input *ngIf="option.type != \'date\'"\n                             formControlName="{{option.model}}"\n                             type="{{option.type}}"\n                             [ngStyle]="{\'width.em\':option.size}"\n                             class="gridborder"></ion-input>\n\n                  <button *ngIf="option.scan"\n                          item-end\n                          ion-button\n                          class="barcodeButton"\n                          type="button"\n                          (click)="scanBarcode(option.model)">\n                    <!--<ion-icon name="barcode"></ion-icon>-->\n                    扫一扫\n                  </button>\n                </ion-row>\n\n              </ion-col>\n\n            </ion-col>\n\n          </ion-row>\n\n          <!-- Ageing Input field -->\n          <ion-row *ngIf=" wfNavParams.wfProcess== \'5a0\' || wfNavParams.wfProcess == \'5b0\'"\n                   class="sec"\n                   align-items-center\n                   justify-content-start>\n\n            <!-- Ageing field Title -->\n            <ion-col col-12>\n              <div *ngIf="wfNavParams.wfProcess== \'5a0\'"\n                   class="header">\n                <ion-icon name="md-hand"></ion-icon>\n                &nbsp; 手工老化\n              </div>\n              <div *ngIf="wfNavParams.wfProcess== \'5b0\'"\n                   class="header">\n                <ion-icon name="ios-color-wand-outline"></ion-icon>\n                &nbsp; 自动老化\n              </div>\n            </ion-col>\n\n            <!-- Auto老化 Input field form -->\n            <ion-col col-auto>\n              <ion-row>\n\n                <!-- Ageing Header -->\n                <ion-col col-12>\n                  <ion-row>\n                    <div style="width: 45px">\n                      &nbsp; &nbsp;\n                    </div>\n\n                    <div style="width: 8em; text-align: center;">\n                      <!--<ion-icon name="clipboard"></ion-icon>-->\n                      &nbsp; 规格\n                    </div>\n\n                    <div style="width: 8em; text-align: center;">\n                      <!--<ion-icon name="clipboard"></ion-icon>-->\n                      &nbsp; 实际\n                    </div>\n                  </ion-row>\n                </ion-col>\n\n                <!-- Ageing Input -->\n                <ion-col>\n                  <ion-row *ngFor="let wfInput of wfAgeingDetails"\n                           align-items-center>\n\n                    <!-- Simple Input field -->\n                    <div class="label">\n                      {{wfInput.title}}\n                    </div>\n\n                    <div *ngFor="let col of wfInput.cols">\n                      <div *ngIf="col.auto === false"\n                           [ngStyle]="{\'width.em\':wfInput.size}">\n                        <ion-input formControlName="{{col.model}}"\n                                   type="{{col.type}}"\n                                   class="gridborder"></ion-input>\n                      </div>\n\n                      <div *ngIf="col.auto === true && wfNavParams.wfProcess == \'5b0\'"\n                           [ngStyle]="{\'width.em\':wfInput.size}">\n                        <ion-input formControlName="{{col.model}}"\n                                   type="{{col.type}}"\n                                   class="gridborder"></ion-input>\n                      </div>\n                    </div>\n                  </ion-row>\n                </ion-col>\n                <ion-col *ngIf="wfNavParams.wfProcess== \'5a0\'"\n                         padding-horizontal>\n                  <ion-row>\n                    <div class="label">\n                      特殊说明\n                    </div>\n                  </ion-row>\n                  <ion-textarea formControlName="wfAgeingNote"\n                                style="min-height: 20em; width: auto"\n                                class="gridborder">\n                  </ion-textarea>\n                </ion-col>\n\n                <!-- Auto Ageing 2nd part -->\n                <ion-row *ngIf="wfNavParams.wfProcess== \'5b0\'"\n                         class="ageingSubPart">\n\n                  <ion-col col-6>\n                    <ion-row wrap align-items-center>\n                      <ion-col *ngFor="let wfInput of wfAutoAgeingDetails"\n                               no-padding col-6>\n\n                        <ion-row align-items-center>\n                          <div class="label">\n                            {{wfInput.title}}\n                          </div>\n\n                          <div [ngStyle]="{\'width.em\':wfInput.size}">\n                            <ion-input formControlName="{{wfInput.model}}"\n                                       type="{{wfInput.type}}"\n                                       no-padding\n                                       class="gridborder"></ion-input>\n                          </div>\n\n                        </ion-row>\n                      </ion-col>\n                    </ion-row>\n                  </ion-col>\n\n                  <!-- Note -->\n                  <ion-col padding-horizontal>\n                    <ion-row>\n                      <div class="label">\n                        <!--<ion-icon name="chatbubbles"></ion-icon>-->\n                        特殊说明\n                      </div>\n                    </ion-row>\n                    <ion-textarea formControlName="wfAgeingNote"\n                                  style="min-height: 20em; width: auto"\n                                  class="gridborder">\n                    </ion-textarea>\n                  </ion-col>\n\n                </ion-row>\n\n\n              </ion-row>\n            </ion-col>\n\n          </ion-row>\n\n          <!-- Workflow People input field -->\n          <ion-row class="sec staff"\n                   align-items-center\n                   justify-content-left>\n\n            <!-- Input field header -->\n            <ion-col text-left col-12>\n              <h4 class="header">\n                <ion-icon name="md-contacts"></ion-icon>\n                &nbsp; 员工信息\n              </h4>\n            </ion-col>\n\n\n            <!-- Input field form -->\n            <ion-col *ngFor="let wfInput of wfPplInputs"\n                     col-auto\n                     align-items-left\n                     justify-content-center>\n\n              <!-- Simple Input field -->\n              <ion-row align-items-center\n                       justify-content-center\n                       *ngIf="wfInput.method == \'input\'">\n\n                <div class="label">\n                  <!--<ion-icon name="{{wfInput.icon}}"></ion-icon>-->\n                  {{wfInput.title}}\n                </div>\n\n                <ion-input formControlName="{{wfInput.model}}"\n                           type="{{wfInput.type}}"\n                           [ngStyle]="{\'width.em\':wfInput.size}"\n                           class="gridborder"></ion-input>\n\n                <button *ngIf="wfInput.scan"\n                        item-end\n                        ion-button\n                        class="barcodeButton"\n                        type="button"\n                        (click)="scanBarcode(wfInput.model)">\n                  <!--<ion-icon name="barcode"></ion-icon>-->\n                  扫一扫\n                </button>\n\n              </ion-row>\n\n\n              <ion-row *ngIf="wfInput.method == \'textarea\'"\n                       align-items-center >\n                <div class="label">\n                  <!--<ion-icon name="{{wfInput.icon}}"></ion-icon>-->\n                  备注\n                </div>\n                <ion-textarea formControlName={{wfInput.model}}\n                              [ngStyle]="{\'width.em\':wfInput.size}"\n                              class="textarea gridborder"></ion-textarea>\n              </ion-row>\n\n              <!-- Select Buttons -->\n              <ion-row *ngIf="wfInput.method == \'buttons\'"\n                       align-items-center>\n                <div class="label">\n                  <!--<ion-icon name="{{wfInput.icon}}"></ion-icon>-->\n                  {{wfInput.title}}\n                </div>\n\n                <ion-buttons>\n                  <button ion-button\n                          round\n                          outline\n                          type="button"\n                          style="width: auto;"\n                          *ngFor="let button of wfInput.buttons"\n                          (click)="updateForm(wfInput.model,button.value)"\n                          [ngClass]="{\'buttonsSelected\': wfInputForm.controls[wfInput.model].value === button.value}">\n                    <ion-icon name="{{button.icon}}"></ion-icon>\n                    &nbsp; {{button.label}}\n                  </button>\n                </ion-buttons>\n              </ion-row>\n\n              <!-- Break -->\n              <div *ngIf="wfInput.method == \'break\'"\n                   [ngStyle]="{\'width.em\':wfInput.size}">\n              </div>\n\n            </ion-col>\n\n          </ion-row>\n\n          <ion-row justify-content-end>\n            <button type="submit"\n                    ion-button>批次完成</button>\n          </ion-row>\n\n        </ion-col>\n\n      </ion-row>\n    </ion-grid>\n  </form>\n</ion-content>'/*ion-inline-end:"/Users/thomasq/Downloads/vtApp v3/src/pages/edit-workflow1/edit-workflow1.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavParams */]])
], EditWorkflow1Page);

//# sourceMappingURL=edit-workflow1.js.map

/***/ })

},[198]);
//# sourceMappingURL=main.js.map