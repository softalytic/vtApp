import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NgForm, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { WorkflowService } from "../../services/workflow";
import { QRCodeService } from "../../services/qrCode";
import { PhotoService } from "../../services/photo";

@Component({
  selector: 'page-edit-workflow3',
  templateUrl: 'edit-workflow3.html',
})
export class EditWorkflow3Page implements OnInit{

  form = NgForm;
  wfOrderDetails = [];
  wfRMDetails = [];
  wfAgeingDetails = [];
  wfAutoAgeingDetails = [];
  wfAutoAgeingSubDetails = [];
  wfOpsInputs = [];
  wfPplInputs = [];

  wfInputForm: FormGroup;

  images = [];

  pushPage: any;
  wfNavParams = this.navParams.data;

  wfPass: boolean;

  //testing storage for qc part
  wfStaffTechIdTmp: any;
  wfStaffOptShiftTmp: any;
  wfQCSignOffTmp: any;
  wfOrderTotalGoodQtyTmp: any;

  tzoffset: number = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  appDate: String = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,-1);


  constructor(private storage: Storage,
              private formBuilder: FormBuilder,
              private QRCode: QRCodeService,
              private alertCtrl: AlertController,
              private navParams: NavParams,
              private wfSvc: WorkflowService,
              private navCtrl: NavController,
              private photoSvc: PhotoService) {

    storage.ready().then(() => { });


    // Assume all are ion-input except the one specificed as textarea
    this.wfOrderDetails = [
      {method: "input", model: "wfFormId", title: "流程卡号", type: "text", size: 28, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderId", title: "工单号", type: "text", size: 28, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderBatchId", title: "批次号", type: "text", size: 28, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderTotalQty", title: "批次量", type: "number", size: 9, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      // {method: "input", model: "wfOrderTotalGoodQty", title: "良品數總和", type: "number", size: 6, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "input", model: "wfOrderRMId", title: "料号", type: "text", size: 15, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderSeries", title: "系列", type: "text", size: 15, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderSpec", title: "规格", type: "text", size: 15, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderDim", title: "尺寸", type: "text", size: 15, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfClientId", title: "客户代码:", type: "text", size: 15, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfSalesOrderId", title: "销售订单号:", type: "text", size: 20, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "input", model: "wfOrderFormNote", title: "流程卡备注", type: "textarea", size: 33, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderNote", title: "工单备注", type: "textarea", size: 33, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderBOMNote", title: "BOM备注", type: "textarea", size: 33, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}}

    ];

    this.wfRMDetails = [
      {modelName: "wfRMFoilPosName", title: "正箔", type: "text", valueName: "100LG04B-33VF-48UF 5.5mm",
        modelSerial: 'wfRMFoilPosSerial', valueSerial: '17074049', highlight: false},
      {modelName: "wfRMFoilPosLName", title: "正箔 - L", type: "text", valueName: "184",
        modelSerial: 'wfRMFoilPosLSerial', valueSerial: '', highlight: false},
      {modelName: "wfRMFoilNegName", title: "負箔", type: "text", valueName: "F-545M-450UF-5.5MM",
        modelSerial: 'wfRMFoilNegSerial', valueSerial: '0619A04A06', highlight: false},
      {modelName: "wfRMFoilNegLName", title: "負箔 - L", type: "text", valueName: "184",
        modelSerial: 'wfRMFoilNegLSerial', valueSerial: '', highlight: false},
      {modelName: "wfRMPaperName", title: "电解纸", type: "text", valueName: "SM250-50 6.5mm",
        modelSerial: 'wfRMPaperSerial', valueSerial: '17032519A1-B47', highlight: false},
      {modelName: "wfRMGlueName", title: "胶水/胶带", type: "text", valueName: "",
        modelSerial: 'wfRMGlueSerial', valueSerial: '17.7.22', highlight: false},
      {modelName: "wfRMSolName", title: "电解液", type: "text", valueName: "KVP-1B",
        modelSerial: 'wfRMSolSerial', valueSerial: '富凱2017.7119', highlight: false},
      {modelName: "wfRMPinPosName", title: "正导针", type: "text", valueName: "15080(+)",
        modelSerial: 'wfRMPinPosSerial', valueSerial: '1706241163', highlight: false},
      {modelName: "wfRMPinNegName", title: "负导针", type: "text", valueName: "15080(-)",
        modelSerial: 'wfRMPinNegSerial', valueSerial: '1707201194', highlight: false},
      {modelName: "wfRMPlasticName", title: "胶粒", type: "textarea", valueName: "9.3x2.8x1.4 Φ 10x10.5/12.5 (材质IVR-50)",
        modelSerial: 'wfRMPlasticSerial', valueSerial: '17704310121', highlight: false},
      {modelName: "wfRMShellName", title: "铝壳", type: "text", valueName: "10x10.6 3004材质(防爆)",
        modelSerial: 'wfRMShellSerial', valueSerial: '1670722-053842', highlight: false},
      {modelName: "wfRMCoverName", title: "套管", type: "text", valueName: "",
        modelSerial: 'wfRMCoverSerial', valueSerial: '', highlight: false},
    ];

    this.wfOpsInputs = [
      {title: "流程卡号", method: "input", model: "wfFormId", type: "text", icon: 'ios-copy-outline', scan: false, size: 10},
      {title: "机台", method: "input", model: "wfMachineId", type: "text", icon: 'cog', scan: false, size: 10},
      // {title: "批次号", method: "input", model: "wfBatchId", type: "text", icon: 'ios-basket-outline', scan: false, size: 10},
      // {title: "批次量", method: "input", model: "wfBatchQty", type: "text", icon: 'ios-basket-outline', scan: false, size: 5},
      {method: "break", title: ""},

      {method: "inputs4",options: [
        {title: "CAP uF@ 120Hz", model: "wfRMFoilPosLName", type: "number", icon: 'ios-add-circle-outline', scan: false, size: 8},
        {title: "DF %", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
        {title: "LC-T v", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
        {title: "LV uA", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
        {title: "時間 秒", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
        {title: "AG1 v", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
        {title: "AG2 v", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
        {title: "AG3 v", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
        {title: "AG4 v", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
        {title: "AG5 v", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
        {title: "AG6 v", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8},


      ]},
      {method: "inputs2", header: "素子烘烤", options: [
        {title: "时间 H", model: "wfRMWindingTime", type: "number", icon: 'ios-add-circle-outline', scan: false, size: 8},
        {title: "温度 ℃", model: "wfRMWindingDeg", type: "number", icon: 'md-remove-circle', scan: false, size: 8}
      ]},
      {method: 'inputs', options: [
        {title: "日期", model: "wfInputDate", type: "date", icon: "calender", scan: false, size: 8},
        {title: "开始", model: "wfStartTime", type: "time", icon: "time", scan: false, size: 8},
        {title: "完成", model: "wfFinishTime", type: "time", icon: "md-alarm", scan: false, size: 8}
      ]},
      // {title: "日期", method: "date", model: "wfInputDate", type: "date", scan: false, size: 100},
      // {title: "开始", method: "time", model: "wfInputStartTime", type: "time", icon: 'time', scan: false, size: 100},
      // {title: "完成", method: "time", model: "wfInputFinishTime", type: "time", icon: 'timer', scan: false, size: 100},
      {method: "table", size: 8, headers: [{title: "种类"},{title: "数量"}],rows: [
        {title: "不良數1", cols: [
          {model: "wfBadQty", type: "number", disabled: false},
          {model: "wfBadQty", type: "number", disabled: false},
        ]},
        {title: "不良數2", cols: [
          {model: "wfBadQty", type: "number", disabled: false},
          {model: "wfBadQty", type: "number", disabled: false},
        ]},
        {title: "不良數3", cols: [
          {model: "wfBadQty", type: "number", disabled: false},
          {model: "wfBadQty", type: "number", disabled: false},
        ]},
        {title: "不良數4", cols: [
          {model: "wfBadQty", type: "number", disabled: false},
          {model: "wfBadQty", type: "number", disabled: false},
        ]},
        {title: "不良數5", cols: [
          {model: "wfBadQty", type: "number", disabled: false},
          {model: "wfBadQty", type: "number", disabled: false},
        ]},
        {title: "不良數總和", cols: [
          {model: "wfBadQty", type: "number", disabled: true},
          {model: "wfBadQty", type: "number", disabled: false},
        ]},
        {title: "良品數", cols: [
          {model: "wfGoodQty", type: "number", disabled: true},
          {model: "wfGoodQty", type: "number", disabled: false},
        ]},
        // {title: "不良數", model: "wfBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8},
        // {title: "良品數", model: "wfGoodQty", type: "number", icon: 'happy', scan: false, size: 8}
      ]}
      // {title: "不良數", method: "input", model: "wfBadQty", type: "number", icon: 'ios-sad', scan: false, size: 20},
      // {title: "良品數", method: "input", model: "wfGoodQty", type: "number", icon: 'happy', scan: false, size: 20}
    ];

    this.wfAgeingDetails = [
      {title: "电压 DC/V", icon: 'md-flash', method: "table", size: 8, cols: [
        {model: "wfAgeingVoltSet", type: "number", auto: false},
        {model: "wfAgeingVoltAct", type: "number", auto: false},
        {model: "wfAgeingVoltAct1", type: "number", auto: true},
        {model: "wfAgeingVoltAct2", type: "number", auto: true},
        {model: "wfAgeingVoltAct3", type: "number", auto: true},
        {model: "wfAgeingVoltAct4", type: "number", auto: true},
        {model: "wfAgeingVoltAct5", type: "number", auto: true},
      ]},
      {title: "时间 H", icon: 'timer', method: "table", size: 8, cols:[
        {model: "wfAgeingTimeSet", type: "number", auto: false},
        {model: "wfAgeingTimeAct", type: "number", auto: false}
      ]},
      {title: "温度 ℃", icon: 'ios-thermometer-outline', method: "table", size: 8, cols:[
        {model: "wfAgeingDegSet", type: "number", auto: false},
        {model: "wfAgeingDegAct", type: "number", auto: false}
      ]},
      {title: "电流 µA", icon: 'md-pulse', method: "table", size: 8, cols:[
        {model: "wfAgeingCurrentSet", type: "number", auto: false},
        {model: "wfAgeingCurrentAct", type: "number", auto: false}
      ]},
    ];

    this.wfAutoAgeingDetails = [
      {title: "开路电压", method: "input", size: 10, model: "wfOpenVolt", type: "number"},

      {title: "高容", method: "input", size: 10, model: "wfHighCapacity", type: "number"},

      {title: "短路电压", method: "input", size: 10, model: "wfShortVolt", type: "number"},

      {title: "低容", method: "input", size: 10, model: "wfLowCapacity", type: "number"},

      {title: "开路", method: "input", size: 10, model: "wfOpen", type: "number"},

      {title: "损耗", method: "input", size: 10, model: "wfWear", type: "number"},

      {title: "短路", method: "input", size: 10, model: "wfShort", type: "number"},

      {title: "漏电",  method: "input", size: 10, model: "wfVoltLeak", type: "number"},

      {title: "外观", method: "input", size: 10, model: "wfLook", type: "number"}
    ];

    this.wfPplInputs = [
      {title: "作业員", method: "input", model: "wfStaffOptName", type: "text", icon: 'person', scan: false, wfPplI: 1, size: 7},
      {title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, wfPplI: 2, size: 3},
      {title: "技術員", method: "input", model: "wfStaffTechName", type: "text", icon: 'construct', scan: false, wfPplI: 3, size: 7},
      {method: "break", size: 15},
      {title: "终检", method: "buttons", model: "wfQCPass", icon: "md-checkmark-circle-outline",buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},

      {title: "品检員", method: "input", model: "wfStaffQCName", type: "text", icon: 'search', scan: 5, wfPplI: 5, size: 11},
      {title: "品检备注", method: "textarea", model: "wfQCInputNote", type: "text", icon: 'chatbubbles', scan: false, size: 27},
    ];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditWorkflowPage');
    console.log(this.wfNavParams);
    console.log(this.appDate);
  }

  ngOnInit() {
    console.log("Initialise the page 电容器流程卡");

    this.formInit();
    let form = this.wfInputForm;

    console.log("The Nav Params bought to this page is" + this.wfNavParams);

    console.log("loading from storage");
    this.storage.get(this.wfNavParams).then((storageData) => {
      console.log("Storage Data:" + JSON.stringify(storageData));

      for (let key in form.value) {
        // console.log("Loading " + key + " Storage:" + storageData[key]);

        try {
          if(key == 'wfStaffTechId') {
            this.wfStaffTechIdTmp = storageData[key];
            form.controls[key].setValue('');

          } else if(key == 'wfStaffOptShift') {
            this.wfStaffOptShiftTmp = storageData[key];
            form.controls[key].setValue('');

          } else if(key == 'wfQCSignOff') {
            this.wfQCSignOffTmp = storageData[key];
            form.controls[key].setValue('');

          } else if(key == 'wfOptInputDate') {
            this.wfQCSignOffTmp = storageData[key];
            form.controls[key].setValue(this.appDate);

          } else {
            form.controls[key].setValue(storageData[key]);
            console.log("Form value" + form.controls[key])

          }
        } catch (err) {
          // console.log("Got an error from formInit populating from storage: "  + err);

        }
      }
      console.log("Populated form now is: " + JSON.stringify(this.wfInputForm.value));

    });

  }

  updateForm(model: string, value: any) {

    let form = this.wfInputForm;

    console.log(form);
    form.controls[model].setValue(value);
    console.log(form.controls[model].value);

  }

  // showWfOpsFinalInputsAlert(wfOrderTotalQty: any, wfOrderTotalGoodQty: any, wfOptBadQtyValue: any, wfOptGoodQtyValue: any) {
  //
  //   if(wfOptGoodQtyValue) {
  //     let form = this.wfInputForm;
  //     let alert = this.alertCtrl.create({
  //       /*
  //       title: '',
  //
  //       subTitle: '确定完成和上传' + ' Order Total: ' + wfOrderTotalQty + ' Good Total: ' + wfOrderTotalGoodQty + ' Bad:' + wfOptBadQtyValue + ' opt good: ' + wfOptGoodQtyValue,
  //       */
  //       buttons: [{
  //         text: '上存',
  //         handler: () => {
  //           console.log('save clicked');
  //           form.value.wfProcessStatus = "0";
  //           this.storage.set(form.value.wfFormId, form.value);
  //           this.navCtrl.pop();
  //         }
  //       },
  //         {
  //           text: '上存 + 完成工序',
  //           handler: () => {
  //             console.log('submit and save clicked');
  //             console.log(form.value);
  //
  //             let alertCtrl = this.alertCtrl.create({
  //               title: '嚫!',
  //               // subTitle: 'Please select 终检!' + dataXYZ.wfProcess + ' ' + dataXYZ.wfProcessName + ' ' + form.value.wfFormId + ' ' + JSON.stringify(resultStorageItemX),
  //               // comment above for faster process
  //               subTitle: '完成终检!' + form.value.wfProcess + ' ' + form.value.wfProcessName + ' ' + form.value.wfFormId,
  //               buttons: [{text: '確定',
  //                 handler: () => {
  //                   form.value.wfProcessStatus = "1";
  //                   this.storage.set(form.value.wfFormId, form.value);
  //
  //                   // Upload to Server
  //                   console.log("uploading to server");
  //
  //                   // Upload images
  //                   this.wfSvc.upload(form.value,1)
  //                     .subscribe((data)=> {
  //                         console.log("Successfully uploading to server");
  //                         console.log("Upload wfInput reply from server" + JSON.stringify(data));
  //
  //                         if (this.images.length > 0){
  //                           console.log("uploading images to server");
  //                           let imgTotal = this.images.length;
  //
  //                           for (let i = 0; i < imgTotal; i++) {
  //                             this.wfSvc.uploadImage(form,1,this.images[i],i,imgTotal)
  //                               .subscribe((data)=> {
  //                                   console.log("Successfully uploading to server");
  //                                   console.log("Upload img reply from server" + JSON.stringify(data));
  //
  //                                 },
  //                                 error => {
  //                                   console.log(error);
  //                                   // alert("嚫!网路不给力,请再试一次")
  //                                 }
  //                               );
  //                           }
  //                         }
  //
  //                         // Return back to main page
  //                         this.navCtrl.pop();
  //                       },
  //                       error => {
  //                         console.log(error);
  //                         // alert("嚫!网路不给力,请再试一次")
  //                       }
  //                     );
  //                 }
  //               }]
  //             });
  //
  //             alertCtrl.present();
  //
  //             //this.onSubmit();
  //           }
  //         }, {
  //           text: '取消',
  //           role: 'cancel',
  //           handler: () => {
  //             console.log('Cancel clicked');
  //           }
  //         }]
  //     });
  //     alert.present();
  //   } else {
  //     let alert = this.alertCtrl.create({
  //       title: '',
  //       subTitle: '请确定内容: 日期，开始，完成，良品数，不良数 ',
  //       buttons: ['確定']
  //     });
  //     alert.present();
  //
  //   }
  // }

  private formInit() {
    this.wfInputForm = this.formBuilder.group({

      wfProcess: [''],
      wfProcessName: [''],
      wfFormName: [''],
      wfForm: [''],

      // Order Inputs detail
      wfFormId: [''],
      wfOrderId: [''],
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
      wfOrderDim: [''],
      wfClientId: [''],
      wfSalesOrderId: [''],

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

      wfMachineId: [''],
      wfShift: [''],
      wfInputDate: [this.appDate],
      wfStartTime: [''],
      wfFinishTime: [''],
      wfBadQty: [''],
      wfGoodQty: [''],


      wfAgeingDegSet: [''],
      wfAgeingDegAct: [''],


      wfAgeingVoltAct1: [''],
      wfAgeingVoltAct2: [''],
      wfAgeingVoltAct3: [''],
      wfAgeingVoltAct4: [''],
      wfAgeingVoltAct5: [''],
      wfAgeingVoltAct6: [''],
      wfAgeingVoltAct7: [''],

      wfAgeingVoltSet: [''],
      wfAgeingVoltAct: [''],
      wfAgeingCurrentSet: [''],
      wfAgeingCurrentAct: [''],
      wfAgeingTimeSet: [''],
      wfAgeingTimeAct: [''],
      wfAgeingNote: [''],

      wfOpenVolt: [''],
      wfShortVolt: [''],
      wfOpen: [''],
      wfShort: [''],
      wfHighCapacity: [''],
      wfLowCapacity: [''],
      wfWear: [''],
      wfVoltLeak: [''],
      wfLook: [''],

      //Staff Input section
      wfStaffOptId: [''],
      wfStaffOptName: [''],
      wfStaffOptShift: [''],
      wfStaffTechId: [''],
      wfStaffTechName: [''],
      wfStaffXrayId: [''],
      wfStaffXrayName: [''],
      wfStaffQCId: [''],
      wfStaffQCName: [''],
      wfStageStatus: [''],
      wfQCPass: [''],
      wfQCPassCode: [''],
      wfQCSignOff: [''],
      wfQCInputNote: [''],

      //  Appendix
      wfFormStatus: [''],
      wfProcessStatus: ['']

    });

  }

}
