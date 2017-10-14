webpackJsonp([0],{

/***/ 110:
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
webpackEmptyAsyncContext.id = 110;

/***/ }),

/***/ 151:
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
webpackEmptyAsyncContext.id = 151;

/***/ }),

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WorkflowPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_barcode_scanner__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__edit_workflow1_edit_workflow1__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__edit_workflow2_edit_workflow2__ = __webpack_require__(197);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





// import { EditWorkflowPage } from "../edit-workflow/edit-workflow";


var WorkflowPage = (function () {
    function WorkflowPage(storage, formBuilder, navCtrl, alertCtrl, barcodeScanner) {
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
        this.wfProcesses = [
            { title: '钉卷', process: 1, show: true },
            { title: '含浸', process: 2, show: true },
            { title: '组立', process: 3, show: true },
            { title: '清洗', process: 4, show: true },
            { title: '手工老化', process: '5a0', show: true },
            { title: '自動老化', process: '5b0', show: true },
        ];
        this.wfInputs = [
            { title: "流程卡号", method: 'input', type: 'text', model: 'wfFormId', scan: true, size: 30 },
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
    }
    WorkflowPage.prototype.ngOnInit = function () {
        this.formInit();
        /*
        this.storage.get('VT00001').then((resultStorageItemX) => {
          if(resultStorageItemX){ alert(JSON.stringify(resultStorageItemX)); }
        });
        */
        this.storage.clear();
    };
    ;
    WorkflowPage.prototype.onAddWf = function (model) {
        var _this = this;
        console.log("onAddWF is triggered!");
        var form = this.wfInputForm;
        var storageItemX = this.storage.get(form.value.wfFormId);
        //alert(JSON.stringify(storageItemX) + ' ' + form.value.wfFormId);
        this.storage.get(form.value.wfFormId).then(function (resultStorageItemX) {
            if (resultStorageItemX) {
                var dataXTmp = { "headers": { "erpData": "ngForm" },
                    "bodies": { "erpData": resultStorageItemX } };
                var dataX = JSON.stringify(dataXTmp);
                _this.qrCodePopulate(dataX);
                alert('have items: ' + JSON.stringify(resultStorageItemX));
            }
            else {
                var data = JSON.stringify({ "headers": { "erpData": "ngForm" },
                    "bodies": { "erpData": { "wfProcess": "3",
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
                            "wfQCSignOff": "品检員X" }
                    }
                });
                _this.qrCodePopulate(data);
                alert('no items!' + JSON.stringify(form.value));
                _this.storage.set(form.value.wfFormId, form.value);
            }
        });
        // Form submission to pass the form value onto next stage
        console.log("Checking the wfFormId.value");
        console.log(form.value.wfFormId);
        //this.storage.set(form.value.wfFormId, form.value);
        console.log("storage load:" + JSON.stringify(this.storage.get(form.value.wfFormId)));
        if (form.controls["wfFormId"].value == '') {
            alert('請輸入流程卡号');
        }
        else if (form.value.wfForm == 1) {
            // console.log('裸品流程卡');
            form.value.wfFormName = '裸品流程卡';
            console.log("Will enter 裸品流程卡 edit page now");
            console.log(form.value.wfFormId);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__edit_workflow1_edit_workflow1__["a" /* EditWorkflow1Page */], form.value.wfFormId);
        }
        else if (form.value.wfForm == 2) {
            console.log('成品流程卡');
            form.value.wfFormName = '成品流程卡';
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__edit_workflow2_edit_workflow2__["a" /* EditWorkflow2Page */], form);
        }
        else if (form.value.wfForm == 3) {
            console.log('电容器流程卡');
            form.value.wfFormName = '电容器流程卡';
        }
        else {
            alert('請輸入流程卡');
        }
    };
    WorkflowPage.prototype.scanBarcode = function (model) {
        var _this = this;
        var form = this.wfInputForm;
        console.log("scanning Barcode");
        this.barcodeScanner.scan().then(function (barcodeData) {
            // Success! Barcode data is here
            // Limiter to assume the Barcode is default used in this orderID
            if (barcodeData.format && barcodeData.format != "QR_CODE") {
                console.log("this is barcode");
                var data = barcodeData.text;
                form.controls[model].setValue(data);
                /*
        
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
        
                */
            }
            else if (barcodeData.format == "QR_CODE") {
                // alert('嚫，请确定你所扫描的条码是正确的');
                // Try if it is QR code
                console.log(barcodeData.text);
                //alert(barcodeData.text);
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
    WorkflowPage.prototype.setFormValue = function (model, value) {
        var form = this.wfInputForm;
        form.controls[model].setValue(value);
    };
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
    WorkflowPage.prototype.qrCodePopulate = function (barcodeData) {
        // This function takes the barcode data and then process the JSON object
        // Assume each barcode data is a JSON object and it has a headers and bodies component
        // Loop through the headers
        // for each header,
        //    check if the length is > 0, which is a sub JSON array object for data table
        //    else loop through the keys inside that header JSON object
        console.log("running qrCodePop");
        console.log(barcodeData);
        var data = JSON.parse(barcodeData);
        var headers = data.headers;
        var bodies = data.bodies;
        var form = this.wfInputForm;
        console.log(data);
        var _loop_1 = function (key) {
            // console.log(key + " : " + headers[key])
            switch (headers[key]) {
                case "ngForm":
                    // console.log(key + " is a form")
                    var formBodies = bodies[key];
                    for (var formKey in formBodies) {
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
                            this_1.setFormValue(formKey, formBodies[formKey]);
                            // No idea what it is far
                            // if(form.value.wfFormId == formBodies[formKey]) {
                            //   //alert(formBodies[formKey] + ' ' +JSON.stringify(formBodies));
                            //   this.storage.set(formBodies[formKey],  JSON.stringify(formBodies));
                            // }
                            //  form.value.
                        }
                        catch (err) {
                            console.log(err.message);
                            eval('form.value.' + formKey + '= "' + formBodies[formKey] + '"; ');
                            eval('console.log("Retrying force input " + form.value.' + formKey + ')');
                            eval('console.log(form.value.' + formKey + ');');
                            console.log("barcode loaded in form:" + JSON.stringify(form.value));
                        }
                    }
                    console.log("barcode loaded in form:" + JSON.stringify(form.value));
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
                            eval('this.' + inputKey + " = " + inputBodies[inputKey]);
                            // this.setFormValue(inputKey, inputBodies[inputKey]);
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
            wfOrderTotalQty: ['']
        });
    };
    return WorkflowPage;
}());
WorkflowPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-workflow',template:/*ion-inline-start:"/Users/thomasq/Sites/vtApp/src/pages/workflow/workflow.html"*/'<ion-header>\n    <ion-navbar>\n        <div style="align-items: center; display: inline;">\n            <img src="./assets/img/vt_icon.png" class="icon">\n            <ion-title>工序流程卡纪录系统</ion-title>\n        </div>\n    </ion-navbar>\n</ion-header>\n<ion-content padding>\n    <form [formGroup]="wfInputForm" (ngSubmit)="onAddWf()">\n\n        <!-- First section for the input field -->\n        <div>\n            <ion-grid>\n                <ion-row wrap justify-content-left align-items-center>\n                    <!-- Main loop of the Form Module -->\n                    <ion-col *ngFor="let wfInput of wfInputs">\n                        <!-- Non Buttons input fields of wfForms -->\n                        <ion-row align-items-center>\n                            <div class="label">{{wfInput.title}}</div>\n\n                            <!-- Form Normal Input Module-->\n                            <ion-input *ngIf="wfInput.method === \'input\'"\n                                       [ngStyle]="{\'width.em\':wfInput.size}"\n                                       type={{wfInput.type}}\n                                       formControlName={{wfInput.model}}\n                                       no-padding\n                                       class="gridborder"\n                                       required></ion-input>\n\n                            <button *ngIf="wfInput.scan"\n                                    (click)="scanBarcode(wfInput.model)"\n                                    item-end\n                                    ion-button\n                                    class="barcodeButton"\n                                    type="button">\n                                <!--<ion-icon name="barcode"></ion-icon>-->\n                                扫一扫\n                            </button>\n\n                            <!-- Form Selector Module -->\n                            <ion-select *ngIf="wfInput.method === \'select\'"\n                                        [ngStyle]="{\'width.em\':wfInput.size}"\n                                        interface="popover" style="height: 34px !important;"\n                                        (ionChange)="setWfStage($event)"\n                                        formControlName={{wfInput.model}}\n                                        class="gridborder"\n                                        okText="确定"\n                                        cancelText="取消">\n                                <ion-option *ngFor="let key of wfMachineData"\n                                            value={{key}}>\n                                    {{wfMachineProcess[0][key]}}\n                                </ion-option>\n                            </ion-select>\n\n                            <!-- Buttons input fields of wfForms -->\n                            <div *ngIf="wfInput.method === \'buttons\'"\n                                 [ngStyle]="{\'width.em\':wfInput.size}">\n                                <ion-buttons>\n                                <!-- Button for Form submission -->\n                                    <button *ngFor="let option of wfInput.options"\n                                            [ngClass]="{\'buttonsSelected\': wfInputForm.value.wfForm == option.value }"\n                                            (click)="setFormValue(wfInput.model,option.value)"\n                                            item-right\n                                            ion-button\n                                            outline\n                                            type="button"\n                                            round>\n                                        <ion-icon name="clipboard"></ion-icon>\n                                        &nbsp; {{option.label}}\n                                    </button>\n                                </ion-buttons>\n\n                                <button style="width: 25%; margin: 0 auto;"\n                                        ion-button\n                                        type="submit"\n                                        block>\n                                    确定\n                                </button>\n                            </div>\n\n                            <div *ngIf="wfInput.method === \'break\'" [ngStyle]="{\'width.em\':wfInput.size}"></div>\n\n                        </ion-row>\n\n                    </ion-col>\n                </ion-row>\n            </ion-grid>\n        </div>\n\n        <div>\n\n\n        </div>\n\n        <!-- Display the workflow process with img -->\n        <div>\n            <ion-grid style="padding-left: 50px; padding-right: 50px;">\n                <ion-row wrap class="card-background-page">\n                    <ion-col *ngFor="let wfProcess of wfProcesses" col-3>\n                        <div (click)="setWfProcess(wfProcess.process, wfProcess.title)" class="imgButton">\n                            <img src="{{\'./assets/img/f1p\' + wfProcess.process + \'.jpeg\'}}">\n                            <div class="card-title">\n                                {{wfProcess.title}}\n                            </div>\n                        </div>\n                        <!-- For original design -->\n                        <!--<div [navPush]="pushPage" [navParams]=wfProcess>-->\n                    </ion-col>\n                </ion-row>\n            </ion-grid>\n        </div>\n\n        <!-- manual ageing will have an action sheet to prompt the sub process -->\n        <!-- 規格 Need attention highlight -->\n        <!-- 料號 = 產品編號 -->\n\n    </form>\n</ion-content>'/*ion-inline-end:"/Users/thomasq/Sites/vtApp/src/pages/workflow/workflow.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_barcode_scanner__["a" /* BarcodeScanner */]])
], WorkflowPage);

//# sourceMappingURL=workflow.js.map

/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditWorkflow1Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_barcode_scanner__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__ = __webpack_require__(102);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var EditWorkflow1Page = (function () {
    function EditWorkflow1Page(storage, formBuilder, barcodeScanner, alertCtrl, camera, navParams) {
        /*
         this.pushPage = EditWorkflow1Page;
         */
        this.storage = storage;
        this.formBuilder = formBuilder;
        this.barcodeScanner = barcodeScanner;
        this.alertCtrl = alertCtrl;
        this.camera = camera;
        this.navParams = navParams;
        this.form = __WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* NgForm */];
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
        storage.ready().then(function () { });
        this.wfNavParams = this.navParams.data;
        // Assume all are ion-input except the one specificed as textarea
        this.wfOrderDetails = [
            { method: "input", model: "wfFormId", title: "流程卡号", type: "text", size: 20, highlight: false },
            { method: "input", model: "WfOrderId", title: "工单号", type: "text", size: 20, highlight: false },
            /*
             {model: "wfOrderBatchId", title: "批次号", type: "text", highlight: false},
             {model: "wfOrderQty", title: "总量(批次)", type: "text", highlight: false},
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
            { title: "作业員", method: "input", model: "wfStaffOptId", type: "text", icon: 'person', scan: false, wfPplI: 1, size: 7 },
            { title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, wfPplI: 2, size: 3 },
            { title: "技術員", method: "input", model: "wfStaffTechId", type: "text", icon: 'construct', scan: false, wfPplI: 3, size: 7 },
            { title: "X-RAY确认", method: "input", model: "wfStaffXrayId", type: "text", icon: 'construct', scan: false, wfPplI: 4, size: 7 },
            { title: "完威", method: "buttons", model: "wfStageStatus", icon: "md-checkmark-circle-outline", buttons: [
                    { label: "是", value: 1, icon: 'checkmark' }
                ] },
            { title: "分單", method: "buttons", model: "wfFormSplit", icon: "md-checkmark-circle-outline", buttons: [
                    { label: "是", value: 1, icon: 'checkmark' }
                ] },
            { title: "终检", method: "buttons", model: "wfQCPass", icon: "md-checkmark-circle-outline", buttons: [
                    { label: "通过", value: 1, icon: 'checkmark' },
                    { label: "失败", value: 2, icon: 'close' }
                ] },
            { title: "品检員", method: "input", model: "wfQCSignOff", type: "text", icon: 'search', scan: 5, wfPplI: 5, size: 11 },
            { title: "品检备注", method: "textarea", model: "wfQCInputNote", type: "text", icon: 'chatbubbles', scan: false, size: 27 },
        ];
    }
    EditWorkflow1Page.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad EditWorkflowPage');
        console.log(this.wfNavParams);
        console.log(this.appDate);
    };
    EditWorkflow1Page.prototype.ngOnInit = function () {
        var _this = this;
        console.log("Initialise the page");
        this.formInit();
        var form = this.wfInputForm;
        var storageData;
        console.log("loading from storage");
        this.storage.get(this.wfNavParams).then(function (dataDumpJsonXTmp) {
            console.log("this is storage");
            console.log("storage:" + dataDumpJsonXTmp);
            storageData = dataDumpJsonXTmp;
            // for (let key in storageData) {
            //   console.log(key + " : " +storageData[key]);
            // };
            //alert(storageData['wfForm']);
            /*
            if(storageData['wfForm'] == 1)
            {
              form.controls['wfFormName'].setValue('裸品流程卡');
            }
            */
            for (var key in form.value) {
                console.log("Loading " + key + " Storage:" + storageData[key]);
                try {
                    if (key == 'wfStaffTechId') {
                        _this.wfStaffTechIdTmp = storageData[key];
                        //alert('staff 1:' + StaffArr.wfStaffTechIda);
                        form.controls[key].setValue('');
                        console.log('storage test 1: ' + _this.wfStaffTechIdTmp);
                    }
                    else if (key == 'wfStaffOptShift') {
                        _this.wfStaffOptShiftTmp = storageData[key];
                        form.controls[key].setValue('');
                        //alert('staff 2:' + this.wfStaffOptShiftTmp);
                        console.log('storage test 1: ' + _this.wfStaffOptShiftTmp);
                    }
                    else if (key == 'wfQCSignOff') {
                        _this.wfQCSignOffTmp = storageData[key];
                        form.controls[key].setValue('');
                        //alert('staff 3:' + this.wfQCSignOffTmp);
                        console.log('storage test 1: ' + _this.wfQCSignOffTmp);
                    }
                    else {
                        form.controls[key].setValue(storageData[key]);
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
        // alert(this.wfRMDetails[1].modelName)
    };
    EditWorkflow1Page.prototype.checkBeforeScan = function (form) {
        if (form.value.wfOptBadQty === '') {
            alert("请输入良品数!");
            return false;
        }
        else if (form.value.wfOptGoodQty === '') {
            alert("请输入良品数!");
            return false;
        }
    };
    EditWorkflow1Page.prototype.scanBarcode = function (model) {
        var _this = this;
        console.log("scanning Barcode");
        /*
         console.log(form.value);
    
         form.controls['wfProcess'].setValue(1);
         form.controls['wfProcessName'].setValue('钉卷');
         form.controls["wfForm"].setValue(1);
    
         console.log(form.value);
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
    EditWorkflow1Page.prototype.inputWf = function () {
        console.log('inputWf activated');
    };
    EditWorkflow1Page.prototype.setWfPass = function () {
        console.log('checked');
        /*
         // this.wfPass = result;
         */
    };
    EditWorkflow1Page.prototype.onSubmit = function () {
        var form = this.wfInputForm;
        var storageData;
        alert(" < " + form.value + " > !");
        console.log(this.wfInputForm);
    };
    EditWorkflow1Page.prototype.updateForm = function (model, value) {
        var form = this.wfInputForm;
        console.log(form);
        form.controls[model].setValue(value);
        console.log(form.controls[model].value);
    };
    EditWorkflow1Page.prototype.promptAlert = function () {
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
    EditWorkflow1Page.prototype.formInit = function () {
        this.wfInputForm = this.formBuilder.group({
            wfProcess: [''],
            wfProcessName: [''],
            wfFormName: [''],
            // Order Inputs detail
            wfFormId: [''],
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
            // Raw Material Inputs
            wfRMFoilPosName: [''],
            wfRMFoilPosSerial: [''],
            wfRMFoilPosLName: [''],
            wfRMFoilPosLSerial: [''],
            wfRMFoilNegName: [''],
            wfRMFoilNegSerial: [''],
            wfRMFoilNegLName: [''],
            wfRMFoilNegLSerial: [''],
            wfRMPaperName: [''],
            wfRMPaperSerial: [''],
            wfRMGlueName: [''],
            wfRMGlueSerial: [''],
            wfRMSolName: [''],
            wfRMSolSerial: [''],
            wfRMPinPosName: [''],
            wfRMPinPosSerial: [''],
            wfRMPinNegName: [''],
            wfRMPinNegSerial: [''],
            wfRMPlasticName: [''],
            wfRMPlasticSerial: [''],
            wfRMShellName: [''],
            wfRMShellSerial: [''],
            wfRMCoverName: [''],
            wfRMCoverSerial: [''],
            wfRMWindingTime: [''],
            wfRMWindingDeg: [''],
            // Operational Input
            wfOptMachineId: [''],
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
            wfStageStatus: [''],
            wfFormSplit: [''],
            wfQCPass: [''],
            wfQCPassCode: [''],
            wfQCSignOff: [''],
            wfQCInputNote: [''],
        });
    };
    EditWorkflow1Page.prototype.keyPress = function (keycode) {
        if (keycode == 13) {
            alert('next');
        }
    };
    EditWorkflow1Page.prototype.updateTextChg = function () {
        this.wfOrderTotalGoodQtyTmp = parseFloat(this.wfInputForm.value.wfOrderTotalGoodQty) + parseFloat(this.wfInputForm.value.wfOptGoodQty);
        this.wfInputForm.patchValue({ wfStaffOptShift: this.wfStaffOptShiftTmp, wfOrderTotalGoodQty: this.wfOrderTotalGoodQtyTmp,
            wfStaffTechId: this.wfStaffTechIdTmp, wfQCSignOff: this.wfQCSignOffTmp, });
        //alert(StaffArr.wfStaffTechId + ' staff 2: ' + StaffArr.wfStaffOptShift  + ' staff 3: ' + StaffArr.wfQCSignOff );
    };
    EditWorkflow1Page.prototype.updateTotalGoodQty = function (wfOptGoodQtyValue) {
        var goodQtyTmp = this.wfNavParams.wfOrderTotalGoodQty + wfOptGoodQtyValue;
        this.wfInputForm.patchValue({ wfOrderTotalGoodQty: goodQtyTmp, });
    };
    EditWorkflow1Page.prototype.showWfOpsInputsAlert = function (wfOptBadQtyValue, wfOptGoodQtyValue) {
        if (wfOptBadQtyValue == '' || wfOptGoodQtyValue == '') {
            var alert_1 = this.alertCtrl.create({
                title: '',
                subTitle: '请确定内容: 日期，开始，完成，良品数，不良数 ',
                buttons: ['確定']
            });
            alert_1.present();
        }
    };
    EditWorkflow1Page.prototype.showWfOpsFinalInputsAlert = function (wfOrderTotalQty, wfOrderTotalGoodQty, wfOptBadQtyValue, wfOptGoodQtyValue) {
        var _this = this;
        if (wfOrderTotalQty > wfOptGoodQtyValue) {
            var alert_2 = this.alertCtrl.create({
                title: '',
                subTitle: '预设总量 (' + wfOptGoodQtyValue + ') 小於 批次量 (' + wfOrderTotalQty + ')!',
                buttons: ['確定']
            });
            alert_2.present();
        }
        else {
            var form_1 = this.wfInputForm;
            var alert_3 = this.alertCtrl.create({
                title: '',
                subTitle: '确定完成和上传',
                buttons: [{
                        text: '取消',
                        role: 'cancel',
                        handler: function () {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: '確定',
                        handler: function () {
                            console.log('Buy clicked');
                            console.log(form_1.value);
                            var dataXYZ = { "wfProcess": form_1.value.wfProcess,
                                "wfProcessName": form_1.value.wfProcessName,
                                "wfForm": form_1.value.wfForm,
                                "wfFormId": form_1.value.wfFormId,
                                "wfOrderFormId": form_1.value.wfOrderFormId,
                                "WfOrderId": form_1.value.WfOrderId,
                                "wfOrderBatchId": form_1.value.wfOrderBatchId,
                                "wfOrderBatchQty": form_1.value.wfOrderBatchQty,
                                "wfOrderTotalQty": form_1.value.wfOrderTotalQty,
                                "wfOrderTotalGoodQty": form_1.value.wfOrderTotalGoodQty,
                                "wfOrderRMId": form_1.value.wfOrderRMId,
                                "wfOrderSeries": form_1.value.wfOrderSeries,
                                "wfOrderSpec": form_1.value.wfOrderSpec,
                                "wfOrderDim": form_1.value.wfOrderDim,
                                "wfRMFoilPosName": form_1.value.wfRMFoilPosName,
                                "wfRMFoilPosSerial": form_1.value.wfRMFoilPosSerial,
                                "wfRMFoilPosLName": form_1.value.wfRMFoilPosLName,
                                "wfRMFoilNegName": form_1.value.wfRMFoilNegName,
                                "wfRMFoilNegSerial": form_1.value.wfRMFoilNegSerial,
                                "wfRMFoilNegLName": form_1.value.wfRMFoilNegLName,
                                "wfRMPaperName": form_1.value.wfRMPaperName,
                                "wfRMPaperSerial": form_1.value.wfRMPaperSerial,
                                "wfRMGlueName": "",
                                "wfRMGlueSerial": form_1.value.wfRMGlueSerial,
                                "wfRMSolName": form_1.value.wfRMSolName,
                                "wfRMSolSerial": form_1.value.wfRMSolSerial,
                                "wfRMPinPosName": form_1.value.wfRMPinPosName,
                                "wfRMPinPosSerial": form_1.value.wfRMPinPosSerial,
                                "wfRMPinNegName": form_1.value.wfRMPinNegName,
                                "wfRMPinNegSerial": form_1.value.wfRMPinNegSerial,
                                "wfRMPlasticName": form_1.value.wfRMPlasticName,
                                "wfRMPlasticSerial": form_1.value.wfRMPlasticSerial,
                                "wfRMCoverName": form_1.value.wfRMCoverName,
                                "wfRMCoverSerial": form_1.value.wfRMCoverSerial,
                                "wfStaffTechId": form_1.value.wfStaffTechId,
                                "wfStaffOptShift": form_1.value.wfStaffOptShift,
                                "wfQCSignOff": form_1.value.wfQCSignOff };
                            if (form_1.value.wfProcess == 3) {
                                dataXYZ.wfProcess = 4;
                                dataXYZ.wfProcessName = '组立';
                                _this.storage.set(form_1.value.wfFormId, dataXYZ);
                            }
                            else if (form_1.value.wfProcess == 4) {
                                dataXYZ.wfProcess = 5;
                                dataXYZ.wfProcessName = '含浸';
                                _this.storage.set(form_1.value.wfFormId, dataXYZ);
                            }
                            else if (form_1.value.wfProcess == 5) {
                                dataXYZ.wfProcess = 6;
                                dataXYZ.wfProcessName = '清洗';
                                _this.storage.set(form_1.value.wfFormId, dataXYZ);
                            }
                            _this.storage.get(form_1.value.wfFormId).then(function (resultStorageItemX) {
                                if (resultStorageItemX) {
                                    var alert_4 = _this.alertCtrl.create({
                                        title: 'Please Check!',
                                        subTitle: 'Please select 终检!' + dataXYZ.wfProcess + ' ' + dataXYZ.wfProcessName + ' ' + form_1.value.wfFormId + ' ' + JSON.stringify(resultStorageItemX),
                                        buttons: ['OK']
                                    });
                                    alert_4.present();
                                }
                            });
                        }
                    }]
            });
            alert_3.present();
        }
    };
    EditWorkflow1Page.prototype.showWfQCPassAlert = function (wfQCPassValue) {
        if (!(wfQCPassValue == 2 || wfQCPassValue == 1)) {
            var alert_5 = this.alertCtrl.create({
                title: 'Please Check!',
                subTitle: 'Please select 终检!',
                buttons: ['OK']
            });
            alert_5.present();
        }
    };
    EditWorkflow1Page.prototype.presentPrompt = function () {
        var alert = this.alertCtrl.create({
            title: '嚫，请轻描淡写照片内容',
            inputs: [
                {
                    name: 'imgDes',
                    placeholder: '木有问题'
                }
            ],
            buttons: [
                {
                    text: '取消',
                    role: 'cancel',
                    handler: function (data) {
                        console.log('User has clicked Cancel');
                    }
                },
                {
                    text: '确定',
                    handler: function (data) {
                        console.log("User has saved the description");
                    }
                }
            ]
        });
        alert.present();
    };
    EditWorkflow1Page.prototype.takePhoto = function () {
        // alert("taking photos");
        var _this = this;
        this.presentPrompt();
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
            // Photo attribute: wfForm, time, date, process or description
            var imgUrl = 'data:image/jpeg;base64,' + imageData;
            _this.images.push(imgUrl);
            _this.storage.set('images', _this.images);
            // console.log(this.images);
        }, function (err) {
            // Handle error
        });
    };
    return EditWorkflow1Page;
}());
EditWorkflow1Page = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-edit-workflow1',template:/*ion-inline-start:"/Users/thomasq/Sites/vtApp/src/pages/edit-workflow1/edit-workflow1.html"*/'<ion-header style="margin-top: 0px !important;margin-left: 0px !important;">\n    <ion-navbar>\n        <div style="align-items: center; display: inline;">\n            <img src="./assets/img/vt_icon.png" class="icon">\n            <ion-title>\n                &nbsp; ( {{this.wfInputForm.value.wfFormName}}裸品流程卡 )&nbsp; 工序:&nbsp; {{this.wfInputForm.value.wfProcessName}}\n            </ion-title>\n        </div>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n    <form [formGroup]="wfInputForm" (ngSubmit)="onSubmit()">\n        <ion-grid>\n            <!-- header bar -->\n            <ion-row wrap class="main headbar">\n                <ion-col *ngFor="let wfOrderDetail of wfOrderDetails">\n                    <ion-row justify-content-center wrap>\n                        <ion-col *ngIf="wfOrderDetail.method === \'input\'" no-padding>\n                            <ion-row align-items-center>\n                                <div class="inputLabel" no-padding>\n                                    {{wfOrderDetail.title}}\n                                </div>\n                                <ion-input *ngIf="wfOrderDetail.type != \'textarea\'" class="gridborder" disabled type={{wfOrderDetail.type}} [ngStyle]="{\'width.em\':wfOrderDetail.size}" formControlName={{wfOrderDetail.model}}></ion-input>\n\n                                <ion-textarea *ngIf="wfOrderDetail.type === \'textarea\'" formControlName={{wfOrderDetail.model}} [ngStyle]="{\'width.em\':wfOrderDetail.size}" class="textarea gridborder"></ion-textarea>\n                            </ion-row>\n                        </ion-col>\n\n                        <ion-col *ngIf="wfOrderDetail.method === \'break\'" no-padding [ngStyle]="{\'width.em\':wfOrderDetail.size}"></ion-col>\n\n                    </ion-row>\n                </ion-col>\n            </ion-row>\n\n            <!-- Content Section -->\n            <ion-row>\n                <!-- Material Info and Serial # -->\n                <ion-col class="main" col-5 no-padding>\n                    <!-- Header -->\n                    <ion-row>\n                        <ion-col col-1></ion-col>\n                        <ion-col text-center col-7>\n                            <h4 class="inputHeader">材料</h4>\n                        </ion-col>\n                        <ion-col text-center>\n                            <h4 class="inputHeader">批号</h4>\n                        </ion-col>\n                    </ion-row>\n\n                    <!-- Body -->\n                    <ion-row *ngFor="let wfRMDetail of wfRMDetails" justify-content-center align-items-center>\n                        <ion-col wrap col-auto>\n                            <div class="inputLabel">\n                                {{wfRMDetail.title}}\n                            </div>\n                        </ion-col>\n                        <ion-col col-6>\n                            <ion-input class="gridborder" disabled value={{wfInputForm.controls[wfRMDetail.modelName].value}}></ion-input>\n                        </ion-col>\n                        <ion-col>\n                            <ion-input class="gridborder" value={{wfInputForm.controls[wfRMDetail.modelSerial].value}}></ion-input>\n                        </ion-col>\n                    </ion-row>\n                </ion-col>\n\n                <!-- Production Record + Ageing + Staff input -->\n                <ion-col col-7>\n\n                    <!-- Production input field -->\n                    <ion-row class="sec" align-self-stretch justify-content-left>\n\n                        <!-- Input field header -->\n                        <ion-col col-12>\n                            <h4 class="inputHeader">\n                                <ion-icon name="clipboard"></ion-icon>\n                                &nbsp; 生產记录\n                            </h4>\n                        </ion-col>\n\n                        <!-- Input field form -->\n                        <ion-col *ngFor="let wfInput of wfOpsInputs" col-auto>\n\n                            <!-- Simple Input field -->\n                            <ion-row *ngIf="wfInput.method == \'input\'" align-items-center justify-content-center>\n\n                                <div style="margin-left: 5px;margin-right: 5px;">\n                                    <!--<ion-icon name="{{wfInput.icon}}"></ion-icon>-->\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-input type={{wfInput.type}} formControlName={{wfInput.model}} [ngStyle]="{\'width.em\':wfInput.size}" class="gridborder"></ion-input>\n\n                                <button *ngIf="wfInput.scan" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(wfInput.model)">\n                  扫一扫\n                </button>\n                            </ion-row>\n\n                            <ion-row *ngIf="wfInput.method == \'buttons\'" justify-content-left align-items-center>\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-buttons>\n                                    <button ion-button round outline type="button" style="width: auto;" *ngFor="let button of wfInput.buttons" (click)="updateForm(wfInput.model, button.value)" [ngClass]="{\'buttonsSelected\': wfInputForm.controls[wfInput.model].value === button.value}">\n                    &nbsp; {{button.label}}\n                  </button>\n                                </ion-buttons>\n                            </ion-row>\n\n                            <ion-col *ngIf="wfInput.method == \'inputs\'">\n                                <ion-row *ngIf="wfInput.header" align-items-center justify-content-center>\n                                    <div style="width: 45px;"></div>\n                                    <div style="text-align: center;">\n                                        {{wfInput.header}}\n                                    </div>\n                                </ion-row>\n\n                                <ion-row *ngFor="let option of wfInput.options" align-items-center justify-content-center>\n\n                                    <div class="inputLabel">\n                                        {{option.title}}\n                                    </div>\n                                    <!-- datetime -->\n                                    <div *ngIf="option.type == \'date\'" [ngStyle]="{\'width.em\':option.size}" class="gridborder">\n                                        <ion-datetime formControlName={{option.model}} displayFormat="DD/MM/YYYY" pickerFormat="DD MM YYYY"></ion-datetime>\n                                    </div>\n\n                                    <ion-input *ngIf="option.type != \'date\'" formControlName={{option.model}} type={{option.type}} [ngStyle]="{\'width.em\':option.size}" class="gridborder"></ion-input>\n\n                                    <button *ngIf="option.scan" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(option.model)">\n                    扫一扫\n                  </button>\n                                </ion-row>\n\n                            </ion-col>\n\n                            <ion-col *ngIf="wfInput.method == \'breaks\'" col-3>\n                            </ion-col>\n\n                            <ion-row *ngIf="wfInput.method == \'textarea\'" align-items-center>\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n                                <ion-textarea formControlName={{wfInput.model}} style="min-width: auto;" class="gridborder">\n                                </ion-textarea>\n                            </ion-row>\n\n                            <ion-col *ngIf="wfInput.method == \'inputs\' + wfNavParams.wfProcess">\n                                <ion-row *ngIf="wfInput.header" align-items-center justify-content-center>\n                                    <div style="width: 45px;"></div>\n                                    <div style="text-align: center;">\n                                        {{wfInput.header}}\n                                    </div>\n                                </ion-row>\n\n                                <ion-row *ngFor="let option of wfInput.options" align-items-center justify-content-center>\n\n                                    <div class="inputLabel">\n                                        {{option.title}}\n                                    </div>\n\n                                    <div *ngIf="option.type == \'date\'" [ngStyle]="{\'width.em\':option.size}" class="gridborder">\n                                        <ion-datetime formControlName={{option.model}} displayFormat="DD/MM/YYYY" pickerFormat="DD MM YYYY"></ion-datetime>\n                                    </div>\n\n                                    <ion-input *ngIf="option.type != \'date\'" formControlName={{option.model}} type={{option.type}} [ngStyle]="{\'width.em\':option.size}" class="gridborder"></ion-input>\n\n                                    <button *ngIf="option.scan" item-end ion-button class="barcodeButton" type="button" (click)="checkBeforeScan()">\n                    扫一扫\n                  </button>\n                                </ion-row>\n\n                            </ion-col>\n\n                        </ion-col>\n\n                    </ion-row>\n\n                    <!-- Ageing Input field -->\n                    <ion-row *ngIf=" wfNavParams.wfProcess== \'5a0\' || wfNavParams.wfProcess == \'5b0\'" class="sec" align-items-center justify-content-start>\n\n                        <!-- Ageing field Title -->\n                        <ion-col col-12>\n                            <div *ngIf="wfNavParams.wfProcess== \'5a0\'" class="inputHeader">\n                                <ion-icon name="md-hand"></ion-icon>\n                                &nbsp; 手工老化\n                            </div>\n                            <div *ngIf="wfNavParams.wfProcess== \'5b0\'" class="inputHeader">\n                                <ion-icon name="ios-color-wand-outline"></ion-icon>\n                                &nbsp; 自动老化\n                            </div>\n                        </ion-col>\n\n                        <!-- Auto老化 Input field form -->\n                        <ion-col col-auto>\n                            <ion-row>\n\n                                <!-- Ageing Header -->\n                                <ion-col col-12>\n                                    <ion-row>\n                                        <div style="width: 45px">\n                                            &nbsp; &nbsp;\n                                        </div>\n\n                                        <div style="width: 8em; text-align: center;">\n                                            &nbsp; 规格\n                                        </div>\n\n                                        <div style="width: 8em; text-align: center;">\n                                            &nbsp; 实际\n                                        </div>\n                                    </ion-row>\n                                </ion-col>\n\n                                <!-- Ageing Input -->\n                                <ion-col>\n                                    <ion-row *ngFor="let wfInput of wfAgeingDetails" align-items-center>\n\n                                        <!-- Simple Input field -->\n                                        <div class="inputLabel">\n                                            {{wfInput.title}}\n                                        </div>\n\n                                        <div *ngFor="let col of wfInput.cols">\n                                            <div *ngIf="col.auto === false" [ngStyle]="{\'width.em\':wfInput.size}">\n                                                <ion-input formControlName={{col.model}} type={{col.type}} class="gridborder"></ion-input>\n                                            </div>\n\n                                            <div *ngIf="col.auto === true && wfNavParams.wfProcess == \'5b0\'" [ngStyle]="{\'width.em\':wfInput.size}">\n                                                <ion-input formControlName={{col.model}} type={{col.type}} class="gridborder"></ion-input>\n                                            </div>\n                                        </div>\n                                    </ion-row>\n                                </ion-col>\n                                <ion-col *ngIf="wfNavParams.wfProcess== \'5a0\'" padding-horizontal>\n                                    <ion-row>\n                                        <div class="inputLabel">\n                                            特殊说明\n                                        </div>\n                                    </ion-row>\n                                    <ion-textarea name="wfAgeingNote" style="min-height: 20em; width: auto" class="gridborder">\n                                    </ion-textarea>\n                                </ion-col>\n\n                                <!-- Auto Ageing 2nd part -->\n                                <ion-row *ngIf="wfNavParams.wfProcess== \'5b0\'" class="ageingSubPart">\n\n                                    <ion-col col-6>\n                                        <ion-row wrap align-items-center>\n                                            <ion-col *ngFor="let wfInput of wfAutoAgeingDetails" no-padding col-6>\n\n                                                <ion-row align-items-center>\n                                                    <div class="inputLabel">\n                                                        {{wfInput.title}}\n                                                    </div>\n\n                                                    <div [ngStyle]="{\'width.em\':wfInput.size}">\n                                                        <ion-input formControlName={{wfInput.model}} type={{wfInput.type}} no-padding class="gridborder"></ion-input>\n                                                    </div>\n\n                                                </ion-row>\n                                            </ion-col>\n                                        </ion-row>\n                                    </ion-col>\n\n                                    <!-- Note -->\n                                    <ion-col padding-horizontal>\n                                        <ion-row>\n                                            <div class="inputLabel">\n                                                特殊说明\n                                            </div>\n                                        </ion-row>\n                                        <ion-textarea name="wfAgeingNote" style="min-height: 20em; width: auto" class="gridborder">\n                                        </ion-textarea>\n                                    </ion-col>\n\n                                </ion-row>\n\n\n                            </ion-row>\n                        </ion-col>\n\n                    </ion-row>\n\n                    <!-- Workflow People input field -->\n                    <ion-row class="sec staff" align-items-center justify-content-left>\n\n                        <!-- Input field header -->\n                        <ion-col text-left col-12>\n                            <h4 class="inputHeader">\n                                <ion-icon name="md-contacts"></ion-icon>\n                                &nbsp; 员工信息\n                            </h4>\n                        </ion-col>\n\n\n                        <!-- Input field form -->\n                        <ion-col *ngFor="let wfInput of wfPplInputs" col-auto align-items-left justify-content-center>\n\n                            <!-- Simple Input field -->\n                            <ion-row align-items-center justify-content-center *ngIf="wfInput.method == \'input\'">\n\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n                                <div (click)="showWfOpsInputsAlert(wfInputForm.value.wfOptBadQty, wfInputForm.value.wfOptGoodQty)">\n                                    <ion-input [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')" (change)="updateTextChg();" *ngIf="wfInput.wfPplI == 1" formControlName={{wfInput.model}} type={{wfInput.type}} value={{wfInputForm.controls[wfInput.model].value}}\n                                        [ngStyle]="{\'width.em\':wfInput.size}" class="gridborder"></ion-input>\n                                    <ion-input [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')" *ngIf="wfInput.wfPplI == 2" formControlName={{wfInput.model}} type={{wfInput.type}} value={{wfInputForm.controls[wfInput.model].value}} [ngStyle]="{\'width.em\':wfInput.size}"\n                                        class="gridborder"></ion-input>\n\n                                    <ion-input [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')" *ngIf="wfInput.wfPplI == 3" formControlName={{wfInput.model}} type={{wfInput.type}} value={{wfInputForm.controls[wfInput.model].value}} [ngStyle]="{\'width.em\':wfInput.size}"\n                                        class="gridborder"></ion-input>\n\n                                    <ion-input *ngIf="wfInput.wfPplI == 4" formControlName={{wfInput.model}} type={{wfInput.type}} value={{wfInputForm.controls[wfInput.model].value}} [ngStyle]="{\'width.em\':wfInput.size}" class="gridborder"></ion-input>\n\n                                    <ion-input style="display: inline-block;" [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')" *ngIf="wfInput.wfPplI == 5" formControlName={{wfInput.model}} type={{wfInput.type}} value={{wfInputForm.controls[wfInput.model].value}}\n                                        [ngStyle]="{\'width.em\':wfInput.size}" class="gridborder"></ion-input>\n                                    <button [disabled]="!(wfInputForm.value.wfQCPass == 2 || wfInputForm.value.wfQCPass == 1)" *ngIf="wfInput.scan == 5" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(wfInput.model)">\n                                      簽署 </button>\n                                </div>\n                                <!--\n                <div on-mouseover="showWfOpsInputsAlert(wfInputForm.value.wfOptBadQty, wfInputForm.value.wfOptGoodQty)">\n                    <button [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')" *ngIf="wfInput.scan == 3" item-end ion-button class="barcodeButton" type="button" (click)="scanBarcode(wfInput.model)">\n                    扫一扫\n                </button>\n                </div>\n                <div on-mouseover="showWfQCPassAlert(wfInputForm.value.wfQCPass)">\n\n                </div>\n                -->\n                            </ion-row>\n\n\n                            <ion-row *ngIf="wfInput.method == \'textarea\'" align-items-center>\n                                <div class="inputLabel">\n                                    备注\n                                </div>\n                                <ion-textarea formControlName={{wfInput.model}} [ngStyle]="{\'width.em\':wfInput.size}" class="textarea gridborder"></ion-textarea>\n                                &nbsp;&nbsp;&nbsp;&nbsp;\n                                <button [disabled]="!(wfInputForm.value.wfQCPass == 2 || wfInputForm.value.wfQCPass == 1)" type="button" ion-button (click)="\n                            showWfOpsFinalInputsAlert(wfInputForm.value.wfOrderTotalQty, wfInputForm.value.wfOrderTotalGoodQty, wfInputForm.value.wfOptBadQty, wfInputForm.value.wfOptGoodQty)">保存</button>\n                            </ion-row>\n\n                            <!-- Select Buttons -->\n                            <ion-row *ngIf="wfInput.method == \'buttons\'" align-items-center>\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-input formControlName={{wfInput.model}} hidden></ion-input>\n\n\n                                <ion-buttons>\n                                    <button ion-button round outline type="button" style="width: auto;" *ngFor="let button of wfInput.buttons" (click)="updateForm(wfInput.model,button.value)" [ngClass]="{\'buttonsSelected\': wfInputForm.controls[wfInput.model].value === button.value}">\n                    <ion-icon name="{{button.icon}}"></ion-icon>\n                    &nbsp; {{button.label}}\n                  </button>\n                                </ion-buttons>\n                            </ion-row>\n\n                            <!-- Break -->\n                            <div *ngIf="wfInput.method == \'break\'" [ngStyle]="{\'width.em\':wfInput.size}">\n                            </div>\n\n                        </ion-col>\n                        <ion-row>\n                            &nbsp;&nbsp;&nbsp;&nbsp;\n                            <button ion-button type="button" (click)="takePhoto()">\n                <ion-icon ios="ios-camera" md="md-camera"></ion-icon>\n                &nbsp; 拍照 </button>\n                        </ion-row>\n                    </ion-row>\n\n                    <ion-row justify-content-end>\n\n                    </ion-row>\n\n                </ion-col>\n\n                <ion-col>\n                    <ion-row *ngFor="let image of images">\n                        <img src="{{image}}" class="img">\n                        <!-- <ion-img src="{{image}}"></ion-img> -->\n                    </ion-row>\n                </ion-col>\n\n            </ion-row>\n        </ion-grid>\n    </form>\n</ion-content>'/*ion-inline-end:"/Users/thomasq/Sites/vtApp/src/pages/edit-workflow1/edit-workflow1.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__["a" /* Camera */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* NavParams */]])
], EditWorkflow1Page);

//# sourceMappingURL=edit-workflow1.js.map

/***/ }),

/***/ 197:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditWorkflow2Page; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_barcode_scanner__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__ = __webpack_require__(102);
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
        this.form = __WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* NgForm */];
        this.wfOrderDetails = [];
        this.wfRMDetails = [];
        this.wfAgeingDetails = [];
        this.wfAutoAgeingDetails = [];
        this.wfAutoAgeingSubDetails = [];
        this.wfOpsInputs = [];
        this.wfPplInputs = [];
        this.images = [];
        this.wfNavProcess = 3;
        // For calculating the time value
        this.tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        this.appDate = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);
        // Assume all are ion-input except the one specificed as textarea
        this.wfOrderDetails = [
            { method: "input", model: "WfOrderId", title: "工单号", type: "text", size: 20, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfOrderRMId", title: "料号", type: "text", size: 20, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfOrderSeries", title: "系列", type: "text", size: 10, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfOrderSpec", title: "规格", type: "text", size: 8, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfOrderDim", title: "尺寸", type: "text", size: 8, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfOrderTotalQty", title: "数量", type: "number", size: 8, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfOrderBatchId", title: "批次号", type: "text", size: 20, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfOrderFormId", title: "流程卡号", type: "text", size: 20, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfClientId", title: "客户代码:", type: "text", size: 20, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfSalesOrderId", title: "销售订单号:", type: "text", size: 20, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfOptMachineId", title: "台机号:", type: "text", size: 15, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfOrderFormNote", title: "BOM备注", type: "textarea", size: 23, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfOrderNote", title: "工单备注", type: "textarea", size: 23, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfOrderBOMNote", title: "流程卡备注", type: "textarea", size: 23, highlight: false, process: { 1: true, 2: true, 3: true } },
            { method: "input", model: "wfOrderBOMNote", title: "异常记录", type: "textarea", size: 23, highlight: false, process: { 1: false, 2: false, 3: true } },
        ];
        this.wfRMDetails = [
            { modelName: "wfRMUpBeltName", title: "上带:", type: "text", modelSerial: 'wfRMUpBeltSerial', highlight: false },
            { modelName: "wfRMDownBeltName", title: "下带:", type: "text", modelSerial: 'wfRMDownBeltSerial', highlight: false },
            { modelName: "wfRMBaseName", title: "底座:", type: "text", modelSerial: 'wfRMBaseSerial', highlight: false },
            { modelName: "wfRMCircleName", title: "纸圆卡:", type: "text", modelSerial: 'wfRMCricleSerial', highlight: false },
            { modelName: "wfRMPrintName", title: "油墨:", type: "text", modelSerial: 'wfRMPrintSerial', highlight: false },
        ];
        this.wfOpsInputs = [
            // {method: "input", model: "wfOrderBatchId", title: "批次号", type: "text", size: 25, highlight: false},
            // {method: "input", model: "wfOrderFormId", title: "流程卡号", type: "text", size: 25, highlight: false},
            // {method: "input", model: "wfOrderBOMNote", title: "流程卡备注", type: "text", size: 100, highlight: false},
            // {title: "批次号", method: "input", model: "wfOrderBatchId", type: "text", scan: false, size: 13},
            // {title: "流程卡号", method: "input", model: "wfOrderFormId", type: "text", scan: false, size: 13},
            // {method: "break", size: 20},
            // {title: "流程卡备注", method: "input", model: "wfOrderBOMNote", type: "textarea", scan: false, size: 40},
            // {method: "break", size: 20},
            { title: "CAP: μF", method: "input", model: "wfSpecCap", type: "text", scan: false, size: 9, process: { 1: true, 2: true, 3: true } },
            { title: "DF: %", method: "input", model: "wfSpecDF", type: "text", scan: false, size: 9, process: { 1: true, 2: true, 3: true } },
            { title: "LC: μA", method: "input", model: "wfSpecLC", type: "text", scan: false, size: 9, process: { 1: true, 2: true, 3: true } },
            { title: "Z/ESR(Ω):", method: "input", model: "wfSpecZESR", type: "text", scan: false, size: 9, process: { 1: true, 2: true, 3: true } },
            { title: "备注:", method: "input", model: "wfSpecNote", type: "textarea", scan: false, size: 22, process: { 1: true, 2: true, 3: true } },
            // {method: "break", title: ""},
            // {title: "客户代码:", method: "input", model: "wfClientId", type: "text", scan: false, size: 15},
            // {title: "销售订单号:", method: "input", model: "wfSalesOrderId", type: "text", scan: false, size: 15},
            // {title: "台机号:", method: "input", model: "wfOptMachineId", type: "text", scan: false, size: 9},
            { method: 'inputs', options: [
                    { title: "日期", model: "wfOptInputDate", type: "date", scan: false, size: 8, process: { 1: true, 2: true, 3: true } },
                ], process: { 1: true, 2: true, 3: true } },
            { method: "inputs", options: [
                    // {title: "日期", model: "wfOptInputDate", type: "date", scan: false, size: 8},
                    { title: "不良数", model: "wfOptBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8, process: { 1: true, 2: true, 3: false } },
                    { title: "良品数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8, process: { 1: true, 2: true, 3: false } },
                    { title: "抽查数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8, process: { 1: false, 2: true, 3: false } }
                ], process: { 1: true, 2: true, 3: true } },
        ];
        this.wfPplInputs = [
            { title: "作业員", method: "input", model: "wfStaffOptId", type: "text", icon: 'person', scan: 1, size: 20, process: { 1: true, 2: true, 3: false } },
            // {title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, size: 5},
            { title: "技術員", method: "input", model: "wfStaffTechId", type: "text", icon: 'construct', scan: 2, size: 20, process: { 1: true, 2: true, 3: false } },
            // {title: "X-RAY确认", method: "input", model: "wfStaffXrayId", type: "text", icon: 'construct', scan: 3, size: 20},
            { method: "break", size: 15, process: { 1: true, 2: true, 3: false } },
            { title: "电性", method: "buttons", model: "wfElecPass", process: { 1: false, 2: false, 3: true }, buttons: [
                    { label: "通过", value: 1, },
                    { label: "失败", value: 2 }
                ] },
            { method: "break", size: 15, process: { 1: false, 2: false, 3: true } },
            { title: "外观", method: "buttons", model: "wfLookPass", process: { 1: false, 2: false, 3: true }, buttons: [
                    { label: "通过", value: 1 },
                    { label: "失败", value: 2 }
                ] },
            { method: "break", size: 15, process: { 1: false, 2: false, 3: true } },
            // {title: "品检备注", method: "textarea", model: "wfQCInputNote", type: "text", icon: 'chatbubbles', scan: false, size: 30},
            { title: "品检員", method: "input", model: "wfQCSignOff", type: "text", process: { 1: false, 2: false, 3: true }, scan: 4, size: 20 },
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
        selector: 'page-edit-workflow2',template:/*ion-inline-start:"/Users/thomasq/Sites/vtApp/src/pages/edit-workflow2/edit-workflow2.html"*/'<ion-header style="margin-top: 0px !important;margin-left: 0px !important;">\n    <ion-navbar>\n        <div style="align-items: center; display: inline;">\n            <img src="./assets/img/vt_icon.png" class="icon">\n            <ion-title>\n                <!--&nbsp; ( {{wfNavParams.wfFormName}} )&nbsp; 工序:&nbsp; {{wfNavParams.wfProcessName}}-->\n            </ion-title>\n        </div>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n    <form [formGroup]="wfInputForm" (ngSubmit)="onSubmit()">\n        <ion-grid>\n            <!-- header bar -->\n            <ion-row wrap class="main headbar">\n                <ion-col *ngFor="let wfOrderDetail of wfOrderDetails">\n                    <ion-row justify-content-center wrap>\n                        <ion-col *ngIf="wfOrderDetail.method === \'input\' && wfOrderDetail.process[wfNavProcess]"\n                                 no-padding>\n\n                            <ion-row align-items-center>\n                                <div class="inputLabel" no-padding>\n                                    {{wfOrderDetail.title}}\n                                </div>\n                                <ion-input *ngIf="wfOrderDetail.type != \'textarea\'"\n                                           class="gridborder"\n                                           disabled\n                                           type={{wfOrderDetail.type}}\n                                           [ngStyle]="{\'width.em\':wfOrderDetail.size}"\n                                           formControlName={{wfOrderDetail.model}}></ion-input>\n\n                                <ion-textarea *ngIf="wfOrderDetail.type === \'textarea\'"\n                                              formControlName={{wfOrderDetail.model}}\n                                              [ngStyle]="{\'width.em\':wfOrderDetail.size}"\n                                              class="textarea gridborder"></ion-textarea>\n                            </ion-row>\n                        </ion-col>\n\n                        <!--<ion-col *ngIf="wfOrderDetail.method === \'input\' + wfNavProcess" no-padding>-->\n                        <!--<ion-row align-items-center>-->\n                        <!--<div class="inputLabel" no-padding>-->\n                        <!--{{wfOrderDetail.title}}-->\n                        <!--</div>-->\n                        <!--<ion-input *ngIf="wfOrderDetail.type != \'textarea\'" class="gridborder" disabled type={{wfOrderDetail.type}} [ngStyle]="{\'width.em\':wfOrderDetail.size}" formControlName={{wfOrderDetail.model}}></ion-input>-->\n\n                        <!--<ion-textarea *ngIf="wfOrderDetail.type === \'textarea\'"-->\n                        <!--formControlName={{wfOrderDetail.model}}-->\n                        <!--[ngStyle]="{\'width.em\':wfOrderDetail.size}"-->\n                        <!--class="textarea gridborder"></ion-textarea>-->\n                        <!--</ion-row>-->\n                        <!--</ion-col>-->\n\n                        <ion-col *ngIf="wfOrderDetail.method === \'break\'" no-padding [ngStyle]="{\'width.em\':wfOrderDetail.size}"></ion-col>\n\n                    </ion-row>\n                </ion-col>\n            </ion-row>\n\n            <!-- Content Section -->\n            <ion-row>\n                <!-- Material Info and Serial # -->\n                <ion-col class="main" col-5 no-padding>\n                    <!-- Header -->\n                    <ion-row>\n                        <ion-col col-1></ion-col>\n                        <ion-col text-center col-7>\n                            <h4 class="inputHeader">材料</h4>\n                        </ion-col>\n                        <ion-col text-center>\n                            <h4 class="inputHeader">批号</h4>\n                        </ion-col>\n                    </ion-row>\n\n                    <!-- Body -->\n                    <ion-row *ngFor="let wfRMDetail of wfRMDetails"\n                             justify-content-center\n                             align-items-center>\n                        <ion-col wrap col-auto>\n                            <div class="inputLabel">\n                                {{wfRMDetail.title}}\n                            </div>\n                        </ion-col>\n                        <ion-col col-6>\n                            <ion-input class="gridborder"\n                                       disabled\n                                       value={{wfInputForm.controls[wfRMDetail.modelName].value}}></ion-input>\n                        </ion-col>\n                        <ion-col>\n                            <ion-input class="gridborder"\n                                       value={{wfInputForm.controls[wfRMDetail.modelSerial].value}}></ion-input>\n                        </ion-col>\n                    </ion-row>\n                </ion-col>\n\n                <!-- Production Record + Ageing + Staff input -->\n                <ion-col col-7>\n\n                    <!-- Production input field -->\n                    <ion-row class="sec"\n                             align-self-stretch\n                             justify-content-left>\n\n                        <!-- Input field header -->\n                        <ion-col col-12>\n                            <h4 class="inputHeader">\n                                <ion-icon name="clipboard"></ion-icon>\n                                &nbsp; 参数要求\n                            </h4>\n                        </ion-col>\n\n                        <!-- Input field form -->\n                        <ion-col *ngFor="let wfInput of wfOpsInputs" col-auto>\n\n                            <!-- Simple Input field -->\n                            <ion-row *ngIf="wfInput.method == \'input\' && wfInput.process[wfNavProcess]"\n                                     align-items-center\n                                     justify-content-center>\n\n                                <div *ngIf="wfInput.process[wfNavProcess]"\n                                     style="margin-left: 5px;margin-right: 5px;">\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-input\n                                        *ngIf="wfInput.type != \'textarea\'"\n                                        type={{wfInput.type}}\n                                        formControlName={{wfInput.model}}\n                                        [ngStyle]="{\'width.em\':wfInput.size}"\n                                        class="gridborder"></ion-input>\n\n                                <ion-textarea\n                                        *ngIf="wfInput.type === \'textarea\'"\n                                        formControlName={{wfInput.model}}\n                                        [ngStyle]="{\'width.em\':wfInput.size}"\n                                        class="textarea gridborder"></ion-textarea>\n\n                                <button *ngIf="wfInput.scan"\n                                        item-end\n                                        ion-button\n                                        class="barcodeButton"\n                                        type="button"\n                                        (click)="scanBarcode(wfInput.model)">\n                                    扫一扫\n                                </button>\n                            </ion-row>\n\n                            <ion-row *ngIf="wfInput.method == \'buttons\' && wfInput.process[wfNavProcess]"\n                                     justify-content-left\n                                     align-items-center>\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n\n                                <ion-buttons>\n                                    <button *ngFor="let button of wfInput.buttons"\n                                            (click)="updateForm(wfInput.model, button.value)"\n                                            [ngClass]="{\'buttonsSelected\': wfInputForm.controls[wfInput.model].value === button.value}"\n                                            ion-button\n                                            round\n                                            outline\n                                            type="button"\n                                            style="width: auto;">\n                                        &nbsp; {{button.label}}\n                                    </button>\n                                </ion-buttons>\n                            </ion-row>\n\n                            <ion-col *ngIf="wfInput.method == \'inputs\' && wfInput.process[wfNavProcess]">\n                                <ion-row *ngIf="wfInput.header" align-items-center justify-content-center>\n                                    <div style="width: 45px;"></div>\n                                    <div style="text-align: center;">\n                                        {{wfInput.header}}\n                                    </div>                                                                                                                                                             2\n                                </ion-row>\n\n                                <ion-row *ngFor="let option of wfInput.options"\n                                         align-items-center\n                                         justify-content-center>\n\n                                    <div *ngIf="option.process[wfNavProcess]"\n                                         class="inputLabel">\n                                        {{option.title}}\n                                    </div>\n                                    <!-- datetime -->\n                                    <div *ngIf="option.type == \'date\' && option.process[wfNavProcess]"\n                                         [ngStyle]="{\'width.em\':option.size}"\n                                         class="gridborder">\n                                        <ion-datetime\n                                                formControlName={{option.model}}\n                                                displayFormat="DD/MM/YYYY"\n                                                pickerFormat="DD MM YYYY"></ion-datetime>\n                                    </div>\n\n                                    <ion-input\n                                            *ngIf="option.type != \'date\' && option.process[wfNavProcess]"\n                                            formControlName={{option.model}}\n                                            type={{option.type}}\n                                            [ngStyle]="{\'width.em\':option.size}"\n                                            class="gridborder"></ion-input>\n\n                                    <button\n                                            *ngIf="option.scan && option.process[wfNavProcess]"\n                                            item-end\n                                            ion-button\n                                            class="barcodeButton"\n                                            type="button"\n                                            (click)="scanBarcode(option.model)">\n                                        扫一扫\n                                    </button>\n                                </ion-row>\n\n                            </ion-col>\n\n\n                            <ion-col *ngIf="wfInput.method === \'break\' && option.process[wfNavProcess]"\n                                     no-padding>\n                                <div [ngStyle]="{\'width.em\':wfInput.size}"></div>\n                            </ion-col>\n\n\n                            <ion-row\n                                    *ngIf="wfInput.method == \'textarea\' && option.process[wfNavProcess]"\n                                    align-items-center>\n                                <div class="inputLabel">\n                                    {{wfInput.title}}\n                                </div>\n                                <ion-textarea\n                                        formControlName={{wfInput.model}}\n                                        style="min-width: auto;"\n                                        class="gridborder">\n                                </ion-textarea>\n                            </ion-row>\n\n                        </ion-col>\n\n                    </ion-row>\n\n                    <!-- Workflow People input field -->\n                    <ion-row class="sec staff" align-items-center justify-content-left>\n\n                        <!-- Input field header -->\n                        <ion-col text-left col-12>\n                            <h4 class="inputHeader">\n                                <ion-icon name="md-contacts"></ion-icon>\n                                &nbsp; 员工信息\n                            </h4>\n                        </ion-col>\n\n                        <!-- Input field form -->\n                        <div *ngFor="let wfInput of wfPplInputs">\n                            <ion-row>\n                                <ion-col *ngIf="wfInput.process[wfNavProcess]"\n                                         col-auto align-items-left justify-content-center>\n\n                                    <!-- Simple Input field -->\n                                    <ion-row *ngIf="wfInput.method == \'input\' && wfInput.process[wfNavProcess]"\n                                             align-items-center\n                                             justify-content-center >\n\n                                        <div class="inputLabel">\n                                            {{wfInput.title}}\n                                        </div>\n\n                                        <ion-input\n                                                formControlName={{wfInput.model}}\n                                                type={{wfInput.type}}\n                                                value={{wfInputForm.controls[wfInput.model].value}}\n                                                [ngStyle]="{\'width.em\':wfInput.size}"\n                                                class="gridborder"></ion-input>\n                                        <div on-mouseover="showWfOpsInputsAlert(wfInputForm.value.wfOptBadQty, wfInputForm.value.wfOptGoodQty)">\n                                            <button *ngIf="wfInput.scan == 1"\n                                                    [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')"\n                                                    item-end\n                                                    ion-button\n                                                    class="barcodeButton"\n                                                    type="button"\n                                                    (click)="scanBarcode(wfInput.model)">\n                                                扫一扫\n                                            </button>\n                                            <button *ngIf="wfInput.scan == 2"\n                                                    [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')"\n                                                    item-end\n                                                    ion-button\n                                                    class="barcodeButton"\n                                                    type="button"\n                                                    (click)="scanBarcode(wfInput.model)">\n                                                扫一扫\n                                            </button>\n                                            <button *ngIf="wfInput.scan == 3"\n                                                    [disabled]="(wfInputForm.value.wfOptBadQty == \'\' || wfInputForm.value.wfOptGoodQty == \'\')"\n                                                    item-end\n                                                    ion-button\n                                                    class="barcodeButton"\n                                                    type="button"\n                                                    (click)="scanBarcode(wfInput.model)">\n                                                扫一扫\n                                            </button>\n                                        </div>\n                                        <div on-mouseover="showWfQCPassAlert(wfInputForm.value.wfQCPass)">\n                                            <button *ngIf="wfInput.scan == 4 && wfInput.process[wfNavProcess]"\n                                                    [disabled]="!(wfInputForm.value.wfQCPass == 2 || wfInputForm.value.wfQCPass == 1)"\n                                                    item-end\n                                                    ion-button\n                                                    class="barcodeButton"\n                                                    type="button"\n                                                    (click)="scanBarcode(wfInput.model)">\n                                                扫一扫\n                                            </button>\n                                        </div>\n                                    </ion-row>\n\n\n                                    <ion-row *ngIf="wfInput.method == \'textarea\' && wfInput.process[wfNavProcess]" align-items-center>\n                                        <div class="inputLabel">\n                                            备注\n                                        </div>\n                                        <ion-textarea formControlName={{wfInput.model}} [ngStyle]="{\'width.em\':wfInput.size}" class="textarea gridborder"></ion-textarea>\n                                    </ion-row>\n\n                                    <!-- Select Buttons -->\n                                    <ion-row *ngIf="wfInput.method == \'buttons\' && wfInput.process[wfNavProcess]" align-items-center>\n                                        <div class="inputLabel">\n                                            {{wfInput.title}}\n                                        </div>\n\n                                        <ion-input formControlName={{wfInput.model}} hidden></ion-input>\n\n\n                                        <ion-buttons>\n                                            <button ion-button round outline type="button" style="width: auto;" *ngFor="let button of wfInput.buttons" (click)="updateForm(wfInput.model,button.value)" [ngClass]="{\'buttonsSelected\': wfInputForm.controls[wfInput.model].value === button.value}">\n                                                <ion-icon name="{{button.icon}}"></ion-icon>\n                                                &nbsp; {{button.label}}\n                                            </button>\n                                        </ion-buttons>\n                                    </ion-row>\n\n                                    <!-- Break -->\n                                    <div *ngIf="wfInput.method == \'break\' && wfInput.process[wfNavProcess]" [ngStyle]="{\'width.em\':wfInput.size}">\n                                    </div>\n\n                                </ion-col>\n                            </ion-row>\n                        </div>\n\n\n                    </ion-row>\n\n                    <ion-row justify-content-end>\n                        <button [disabled]="!(wfInputForm.value.wfQCPass == 2 || wfInputForm.value.wfQCPass == 1)" type="submit" ion-button>\n                            <ion-icon ios="ios-checkbox-outline" md="md-checkbox-outline">\n                                &nbsp; 批次完成\n                            </ion-icon>\n                        </button>\n                        <button ion-button type="button" (click)="takePhoto()">\n                            <ion-icon ios="ios-camera" md="md-camera"></ion-icon>\n                            &nbsp; 拍照\n                        </button>\n\n                    </ion-row>\n\n                </ion-col>\n\n                <ion-col>\n                    <ion-row *ngFor="let image of images">\n                        <img src="{{image}}" class="img">\n                        <ion-img src="{{image}}"></ion-img>\n                    </ion-row>\n                </ion-col>\n\n            </ion-row>\n        </ion-grid>\n    </form>\n</ion-content>'/*ion-inline-end:"/Users/thomasq/Sites/vtApp/src/pages/edit-workflow2/edit-workflow2.html"*/,
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_workflow_workflow__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_barcode_scanner__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_screen_orientation__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_edit_workflow1_edit_workflow1__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_edit_workflow2_edit_workflow2__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_camera__ = __webpack_require__(102);
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
            __WEBPACK_IMPORTED_MODULE_7__pages_workflow_workflow__["a" /* WorkflowPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_edit_workflow1_edit_workflow1__["a" /* EditWorkflow1Page */],
            __WEBPACK_IMPORTED_MODULE_11__pages_edit_workflow2_edit_workflow2__["a" /* EditWorkflow2Page */]
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
            __WEBPACK_IMPORTED_MODULE_7__pages_workflow_workflow__["a" /* WorkflowPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_edit_workflow1_edit_workflow1__["a" /* EditWorkflow1Page */],
            __WEBPACK_IMPORTED_MODULE_11__pages_edit_workflow2_edit_workflow2__["a" /* EditWorkflow2Page */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_12__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["a" /* IonicStorageModule */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_screen_orientation__["a" /* ScreenOrientation */],
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_screen_orientation__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_workflow_workflow__ = __webpack_require__(195);
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
    // rootPage:any = EditWorkflow1Page;
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
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/thomasq/Sites/vtApp/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/thomasq/Sites/vtApp/src/app/app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_screen_orientation__["a" /* ScreenOrientation */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ })

},[198]);
//# sourceMappingURL=main.js.map