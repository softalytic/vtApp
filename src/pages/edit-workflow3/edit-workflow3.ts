import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
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
  wfAgeDetailInputs = [];
  wfAutoAgeingDetails = [];
  wfAutoAgeingSubDetails = [];
  wfDryWetWashDetails = [];
  wfDryDetails = [];
  wfWetDetails = [];
  wfWashDetails = [];
  wfDryInputs = [];
  wfWetInputs = [];
  wfWashInputs = [];
  wfOpsInputs = [];
  wfPplInputs = [];

  images = [];

  wfInputForm: FormGroup;

  pushPage: any;
  wfNavParams = this.navParams.data;

  wfPass: boolean;

  //testing storage for qc part
  wfStaffTechIdTmp: any;
  wfStaffOptShiftTmp: any;
  wfQCSignOffTmp: any;
  wfOrderTotalGoodQtyTmp: any;

  codeDataSet: any;

  dataInicial: String;
  maxDate: string;

  // For calculating the time value
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

      // Production spec
      {method: "input", model: "wfFormId", title: "流程卡号", type: "text", size: 15, highlight: false},
      {method: "input", model: "wfOrderId", title: "工单号", type: "text", size: 15, highlight: false},
      {method: "input", model: "wfOrderRMId", title: "料号", type: "text", size: 15, highlight: false},
      {method: "input", model: "wfOrderSeries", title: "系列", type: "text", size: 10, highlight: false},
      {method: "input", model: "wfOrderSpec", title: "规格", type: "text", size: 8, highlight: false},
      {method: "input", model: "wfOrderDim", title: "尺寸", type: "text", size: 8, highlight: false},


      {method: "input", model: "wfClientId", title: "客户代码:", type: "text", size: 8, disabled:true, highlight: false},
      // {method: "input", model: "wfSalesOrderId", title: "销售订单号:", type: "text", size: 15, disabled:true, highlight: false},
      {method: "input", model: "wfSalesOrderQty", title: "销售订总量:", type: "text", size: 8, disabled:true, highlight: false},
      {method: "input", model: "wfOrderTotalQty", title: "预设总量", type: "number", size: 8, highlight: false},
      {method: "input", model: "wfOrderTotalGoodQty", title: "良品數總和", type: "number", size: 8, highlight: false},

      // Date
      {method: "input", model: "wfOrderDate", title: "开单日期:", type: "text", size: 10, disabled:true, highlight: false},
      {method: "input", model: "wfOrderStartDate", title: "开工日期:", type: "text", size: 10, disabled:true, highlight: false},
      {method: "input", model: "wfOrderEstFinishDate", title: "完工日期:", type: "text", size: 10, disabled:true, highlight: false},
      {method: "input", model: "wfOrderDeliveryDate", title: "交期:", type: "text", size: 10, disabled:true, highlight: false},

      // Note
      {method: "input", model: "wfOrderNote", title: "工单备注", type: "textarea", size: 25, highlight: false},
      {method: "input", model: "wfSalesOrderNote", title: "订单记录说明", type: "textarea", size: 25, highlight: false},
      {method: "input", model: "wfOrderBOMNote", title: "BOM备注", type: "textarea", size: 25, highlight: false},

    ];

    this.wfRMDetails = [
      {modelName: "wfRMFoilPosName", title: "正箔", type: "text", modelSerial: 'wfRMFoilPosSerial', highlight: false},
      {modelName: "wfRMFoilPosLName", title: "正箔 - L", type: "text", modelSerial: 'wfRMFoilPosLSerial', highlight: false},
      {modelName: "wfRMFoilNegName", title: "負箔", type: "text", modelSerial: 'wfRMFoilNegSerial', highlight: false},
      {modelName: "wfRMFoilNegLName", title: "負箔 - L", type: "text", modelSerial: 'wfRMFoilNegLSerial', highlight: false},
      {modelName: "wfRMPaperName", title: "电解纸", type: "text", modelSerial: 'wfRMPaperSerial', highlight: false},
      {modelName: "wfRMGlueName", title: "胶水/胶带", type: "text", modelSerial: 'wfRMGlueSerial', highlight: false},
      {modelName: "wfRMSolName", title: "电解液", type: "text", modelSerial: 'wfRMSolSerial', highlight: false},
      {modelName: "wfRMPinPosName", title: "正导针", type: "text", modelSerial: 'wfRMPinPosSerial', highlight: false},
      {modelName: "wfRMPinNegName", title: "负导针", type: "text", modelSerial: 'wfRMPinNegSerial', highlight: false},
      {modelName: "wfRMPlasticName", title: "胶粒", type: "textarea", modelSerial: 'wfRMPlasticSerial', highlight: false},
      {modelName: "wfRMShellName", title: "铝壳", type: "text", modelSerial: 'wfRMShellSerial', highlight: false},
      {modelName: "wfRMCoverName", title: "套管", type: "text", modelSerial: 'wfRMCoverSerial', highlight: false},
    ];

    /*
    
    this.wfDryDetails = [
      {method: "table", size: 8, headers: [{title: "烘千"}],rows: [
        {title: "迄时间", cols: [
          {model: "wfDryStartTime", type: "time", disabled: false},
        ]},
        {title: "止时间 1", cols: [
          {model: "wfDryFinishTime1", type: "text", disabled: false},
        ]},
        {title: "止时间 2", cols: [
          {model: "wfDryFinishTime2", type: "text", disabled: false},
        ]},
        {title: "温度 ℃", cols: [
          {model: "wfDryWindingDeg", type: "number", disabled: false},
        ]},
        {title: "作业者", cols: [
          {model: "wfStaffDryName", type: "text", disabled: false},
        ]}
      ]}

    ];

    this.wfWetDetails = [
      {method: "table", size: 8, headers: [{title: "含浸"}],rows: [
        {title: "真空度", cols: [
          {model: "wfWetEmptyAir", type: "text", disabled: false},
        ]},
        {title: "气压值", cols: [
          {model: "wfWetAir", type: "text", disabled: false},
        ]},
        {title: "迄时间 2", cols: [
          {model: "wfWetStartTime", type: "time", disabled: false},
        ]},
        {title: "止时间 ℃", cols: [
          {model: "wfWetFinishTime", type: "time", disabled: false},
        ]},
        {title: "作业者", cols: [
          {model: "wfStaffWetName", type: "text", disabled: false},
        ]}
      ]}

    ];

    this.wfWashDetails = [
      {method: "table", size: 8, headers: [{title: "清洗"}],rows: [
        {title: "批序/温度 ℃", cols: [
          {model: "wfWashWindingDeg", type: "number", disabled: false},
        ]},
        {title: "清冼迄时间", cols: [
          {model: "wfWashStartTime", type: "time", disabled: false},
        ]},
        {title: "清冼止时间", cols: [
          {model: "wfWashFinishTime", type: "time", disabled: false},
        ]},
        {title: "烘千温度 ℃", cols: [
          {model: "wfWashDryWindingDeg", type: "number", disabled: false},
        ]},
        {title: "烘千时间", cols: [
          {model: "wfWashDryTime", type: "time", disabled: false},
        ]},
        {title: "作业者", cols: [
          {model: "wfStaffWashName", type: "text", disabled: false},
        ]}
      ]}

    ];

    */

    this.wfDryInputs = [
      {method: "inputs", options: [
        {title: "迄时间", model: "wfDryStartTime", type: "time", icon: "time", scan: false, size: 8},
        {title: "止时间1", model: "wfDryFinishTime1", type: "text", icon: "time", scan: false, size: 8},
        {title: "止时间2", model: "wfDryFinishTime2", type: "text", icon: "time", scan: false, size: 8},
      ]},
      {method: 'inputs', options: [
        {title: "温度 ℃", model: "wfDryWindingDeg", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
        {title: "作业者", model: "wfStaffDryName", type: "text", icon: 'person', scan: false, size: 8}
      ]},
    ];
  
  this.wfWetInputs = [
    {method: 'inputs', options: [
      {title: "真空度", model: "wfWetEmptyAir", type: "text", scan: false, size: 8},
      {title: "气压值", model: "wfWetAir", type: "text", scan: false, size: 8}
    ]},
    {method: "inputs", options: [
      {title: "迄时间", model: "wfWetStartTime", type: "time", icon: "time", scan: false, size: 8},
      {title: "止时间", model: "wfWetFinishTime", type: "time", icon: "time", scan: false, size: 8},
      {title: "作业者", model: "wfStaffWetName", type: "text", icon: 'person', scan: false, size: 8}
    ]},
  ];
  
  this.wfWashInputs = [

    {method: 'inputs', options: [
      {title: "批序/温度 ℃", model: "wfWashWindingDeg", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
      {title: "清冼迄时间", model: "wfWashStartTime", type: "time", icon: "time", scan: false, size: 8},
      {title: "清冼止时间", model: "wfWashFinishTime", type: "time", icon: "time", scan: false, size: 8}
    ]},
    {method: "inputs", options: [
      {title: "烘千温度 ℃", model: "wfWashDryWindingDeg", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
      {title: "烘千时间", model: "wfWashDryTime", type: "time", icon: "time", scan: false, size: 8},
      {title: "作业者", model: "wfStaffWashName", type: "text", icon: 'person', scan: false, size: 8}
    ]},
  ];

  this.wfAgeDetailInputs = [
    {method: 'inputs', options: [
      {title: "AG1", model: "wfAgeDetailAG1", type: "text", scan: false, size: 4},
      {title: "AG2", model: "wfAgeDetailAG2", type: "text", scan: false, size: 4},
      {title: "AG3", model: "wfAgeDetailAG3", type: "text", scan: false, size: 4}
    ]},
    {method: 'inputs', options: [
      {title: "AG4", model: "wfAgeDetailAG4", type: "text", scan: false, size: 4},
      {title: "AG5", model: "wfAgeDetailAG5", type: "text", scan: false, size: 4},
      {title: "AG6", model: "wfAgeDetailAG6", type: "text", scan: false, size: 4}
    ]},
    {method: 'inputs', options: [
      {title: "LC-T", model: "wfAgeDetailLCT", type: "text", scan: false, size: 4},
      {title: "LC", model: "wfAgeDetailLC", type: "text", scan: false, size: 4},
      {title: "CAP", model: "wfAgeDetailCAP", type: "text", scan: false, size: 4}
    ]},
    {method: 'inputs', options: [
      {title: "DF", model: "wfAgeDetailDF", type: "text", scan: false, size: 4},
      {title: "时间", model: "wfAgeDetailTime", type: "text", scan: false, size: 4}
    ]},
    {method: 'inputs', options: [
      {title: "核准", model: "wfAgeDetailStaffApprove", type: "text", scan: false, size: 4},
      {title: "作成", model: "wfAgeDetailStaffFinish", type: "text", scan: false, size: 4},
      {title: "审核", model: "wfAgeDetailStaffConfirm", type: "text", scan: false, size: 4}
    ]}
  ];

    this.wfOpsInputs = [
      {title: "分單", method: "input", model: "wfFormSplit", type: "text", icon: 'ios-copy-outline', scan: false, size: 2, wfOpslI: 2},
      {title: "流程卡号", method: "input", model: "wfFormId", type: "text", icon: 'ios-copy-outline', scan: false, size: 7},
      {title: "批次号", method: "input", model: "wfOrderBatchId", type: "text", icon: 'ios-basket-outline', scan: false, size: 7},
      {title: "批次量", method: "input", model: "wfOrderBatchQty", type: "text", icon: 'ios-basket-outline', scan: false, size: 5},
      {title: "投入数", method: "input", model: "wfOptStartQty", type: "number", icon: 'ios-sad', scan: false, size: 6},
      //{method: "break", title: ""},

      {method: "inputs", options: [
        {title: "机台", model: "wfOptMachineId", type: "text", scan: false, size: 8},
        {title: "清机确认", model: "wfOptWashMachine", type: "text", scan: false, size: 8},
        {title: "正箔 - L", model: "wfRMFoilPosLName", type: "number", icon: 'ios-add-circle-outline', scan: false, size: 8},
        {title: "負箔 - L", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8}       
      ]},
      {method: "inputs2", header: "素子烘烤", options: [
        {title: "时间 H", model: "wfRMWindingTime", type: "number", icon: 'ios-add-circle-outline', scan: false, size: 8},
        {title: "温度 ℃", model: "wfRMWindingDeg", type: "number", icon: 'md-remove-circle', scan: false, size: 8}
      ]},
      {method: 'inputs', options: [
        {title: "日期", model: "wfOptInputDate", type: "date", icon: "calender", scan: false, size: 8},
        {title: "开始", model: "wfOptStartTime", type: "time", icon: "time", scan: false, size: 8},
        {title: "完成", model: "wfOptFinishTime", type: "time", icon: "md-alarm", scan: false, size: 8}
      ]},
    
      /*
      {method: "inputs", options: [
        
        //{title: "不良数(项目)", model: "wfOptBadQtyItem", type: "text", icon: 'ios-sad', scan: false, size: 8},
        //{title: "不良数", model: "wfOptBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8},
        //{title: "良品数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8}
        
      ]},
      */
      {method: "table", size: 8, headers: [{title: "种类"},{title: "数量"}],rows: [
        {title: "不良數1", cols: [
          {model: "wfBadItem1", type: "number", disabled: false},
          {model: "wfBadQty1", type: "number", disabled: false},
        ]},
        {title: "不良數2", cols: [
          {model: "wfBadItem2", type: "number", disabled: false},
          {model: "wfBadQty2", type: "number", disabled: false},
        ]},
        {title: "不良數3", cols: [
          {model: "wfBadItem3", type: "number", disabled: false},
          {model: "wfBadQty3", type: "number", disabled: false},
        ]},
        {title: "不良數4", cols: [
          {model: "wfBadItem4", type: "number", disabled: false},
          {model: "wfBadQty4", type: "number", disabled: false},
        ]},
        {title: "不良數5", cols: [
          {model: "wfBadItem5", type: "number", disabled: false},
          {model: "wfBadQty5", type: "number", disabled: false},
        ]},
        {title: "不良數總和", cols: [
          {model: "wfBadTotal", type: "number", disabled: true},
          {model: "wfBadTotal", type: "number", disabled: false},
        ]},
        {title: "良品數", cols: [
          {model: "wfGoodTotal", type: "number", disabled: true},
          {model: "wfGoodTotal", type: "number", disabled: false},
        ]},
        // {title: "不良數", model: "wfBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8},
        // {title: "良品數", model: "wfGoodQty", type: "number", icon: 'happy', scan: false, size: 8}
      ]}
    ];

    this.wfAgeingDetails = [
      {title: "电压 DC/V", icon: 'md-flash', method: "table", size: 6, cols: [
        {model: "wfAgeVoltSet", type: "number", auto: false},
        {model: "wfAgeVoltAct", type: "number", auto: false},
        {model: "wfAutoAgeVoltAct1", type: "number", auto: true},
        {model: "wfAutoAgeVoltAct2", type: "number", auto: true},
        {model: "wfAutoAgeVoltAct3", type: "number", auto: true},
        {model: "wfAutoAgeVoltAct4", type: "number", auto: true},
        // {model: "wfAutoAgeVoltAct5", type: "number", auto: true},
      ]},
      {title: "时间 H", icon: 'timer', method: "table", size: 6, cols:[
        {model: "wfAgeTimeSet", type: "number", auto: false},
        {model: "wfAgeTimeAct", type: "number", auto: false}
      ]},
      {title: "温度 ℃", icon: 'ios-thermometer-outline', method: "table", size: 6, cols:[
        {model: "wfAgeDegSet", type: "number", auto: false},
        {model: "wfAgeDegAct", type: "number", auto: false}
      ]},
      {title: "电流 µA", icon: 'md-pulse', method: "table", size: 6, cols:[
        {model: "wfAgeCurrentSet", type: "number", auto: false},
        {model: "wfAgeCurrentAct", type: "number", auto: false}
      ]},
    ];

    this.wfAutoAgeingDetails = [
      {title: "开路电压", method: "input", size: 6, model: "wfAutoAgeOpenVolt", type: "number"},

      {title: "高容", method: "input", size: 6, model: "wfAutoAgeHighCapacity", type: "number"},

      {title: "短路电压", method: "input", size: 6, model: "wfAutoAgeShortVolt", type: "number"},

      {title: "低容", method: "input", size: 6, model: "wfAutoAgeLowCapacity", type: "number"},

      {title: "开路", method: "input", size: 6, model: "wfAutoAgeOpen", type: "number"},

      {title: "损耗", method: "input", size: 6, model: "wfAutoAgeWear", type: "number"},

      {title: "短路", method: "input", size: 6, model: "wfAutoAgeShort", type: "number"},

      {title: "漏电",  method: "input", size: 6, model: "wfAutoAgeVoltLeak", type: "number"},

      {title: "外观", method: "input", size: 6, model: "wfAutoAgeLook", type: "number"}
    ];
    
    this.wfPplInputs = [
      {title: "作业員", method: "input", model: "wfStaffOptName", type: "text", icon: 'person', scan: false, wfPplI: 1, size: 7},
      {title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, wfPplI: 2, size: 3},
      {title: "班长硧认", method: "input", model: "wfOptQtyChecked", type: "number", icon: 'construct', scan: false, wfPplI: 3, size: 7},
      {title: "維修摘要", method: "input", model: "wfStaffRepairName", type: "text", icon: 'construct', scan: false, wfPplI: 4, size: 7},
      {title: "外覌抽验判定", method: "input", model: "wfStaffRandomPickName", type: "text", icon: 'construct', scan: false, wfPplI: 6, size: 7},

      {title: "终检", method: "buttons", model: "wfQCPass", icon: "md-checkmark-circle-outline",buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      {title: "QC检查不良墑认", method: "input", model: "wfStaffQCSummary", scan: false, wfPplI: 3, type: "text", size: 15},
      {title: "QC判定者", method: "input", model: "wfStaffQCName", type: "text", icon: 'search', scan: 5, wfPplI: 5, size: 11},
      {title: "编切/包装前特性抽獫判𤴓", method: "input", model: "wfStaffQCPreRandomCheck", scan: false, wfPplI: 6, type: "text", size: 15},
      {title: "品检备注", method: "textarea", model: "wfQCInputNote", type: "text", icon: 'chatbubbles', scan: false, size: 27},
    ];
  }

  @ViewChild('datePicker') datePicker;

  open() {
    if (!this.dataInicial) {
        this.dataInicial = new Date().toJSON().split('T')[0];
        setTimeout(() => {
            this.datePicker.open();
        }, 50)
    } else {
        this.datePicker.open();
    }

}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditWorkflowPage1');
    console.log(this.wfNavParams);
    console.log(this.appDate);
  }

  ngOnInit() {
    console.log("Initialise the page 裸品流程卡");

    this.formInit();
    let form = this.wfInputForm;

    console.log("The Nav Params bought to this page is " + this.wfNavParams);

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
            // console.log("Form value" + form.controls[key])

          }
        } catch (err) {
          // console.log("Got an error from formInit populating from storage: "  + err);

        }
      }
      console.log("Populated form now is: " + JSON.stringify(this.wfInputForm.value));

    });

  }

  checkBeforeScan(form: NgForm) {
    if(form.value.wfOptBadQty === '') {
      alert("请输入良品数!");
      return false;
    } else if(form.value.wfOptGoodQty === '') {
      alert("请输入良品数!");
      return false;
    }
  }

  inputWf(){
    console.log('inputWf activated')
  }

  setWfPass(){
    console.log('checked');
    /*
     // this.wfPass = result;
     */
  }

  onSubmit(){
    let form = this.wfInputForm;
    let storageData: any;
    //alert(" < " + form.value + " > !");

    console.log(this.wfInputForm);


  }

  updateForm(model: string, value: any) {

    let form = this.wfInputForm;

    console.log(form);
    form.controls[model].setValue(value);
    console.log(form.controls[model].value);

  }

  promptAlert(){
    let alertCtl = this.alertCtrl.create();

    alertCtl.setTitle("确定完成和上传");

    alertCtl.addButton('取消');

    alertCtl.addButton({
      text: '確定',
      handler: (data: any) => {
        // Once selected the subprocess, update the form and then submit the form to next process stage
        alert("上传成功");
      }
    });

    alertCtl.present();
  }

  keyPress(keycode: number) {
    if (keycode == 13) {
      alert('next');
    }
  }

  updateTextChg() {
    if(this.wfInputForm.value.wfOptMachineId) {
      let machineId = this.wfInputForm.value.wfOptMachineId;
      this.storage.get('wfMachine').then((dataMachineXTmp) => {
        if(dataMachineXTmp) {
          
          //alert(dataMachineXTmp);
          dataMachineXTmp = JSON.parse(dataMachineXTmp);
          //alert(dataMachineXTmp[machineId]['staffName']);
          this.wfInputForm.patchValue({ wfStaffOptShift: dataMachineXTmp[machineId]['shift'], wfStaffOptId: dataMachineXTmp[machineId]['staffName'], 
          wfOrderTotalGoodQty: this.wfOrderTotalGoodQtyTmp, wfStaffTechId: dataMachineXTmp[machineId]['techName'], wfStaffXrayId: dataMachineXTmp[machineId]['xrayName'],});
          
        } else {
          let alert = this.alertCtrl.create({
            title: '',
            subTitle: '机台号不存在，请重新输入。',
            buttons: ['返回']
          });
          alert.present();
        }
        
      });
    }
    

    this.wfOrderTotalGoodQtyTmp = parseFloat(this.wfInputForm.value.wfOrderTotalGoodQty)  + parseFloat(this.wfInputForm.value.wfOptGoodQty);
    
    //alert(StaffArr.wfStaffTechId + ' staff 2: ' + StaffArr.wfStaffOptShift  + ' staff 3: ' + StaffArr.wfQCSignOff );
  }

  updateTotalGoodQty(wfOptGoodQtyValue: any) {
    var goodQtyTmp = this.wfNavParams.wfOrderTotalGoodQty + wfOptGoodQtyValue;
    this.wfInputForm.patchValue({ wfOrderTotalGoodQty: goodQtyTmp, });
  }

  showWfOpsInputsAlert(wfOptBadQtyValue: any, wfOptGoodQtyValue: any) {
    if(wfOptBadQtyValue == '' || wfOptGoodQtyValue == '') {
      let alert = this.alertCtrl.create({
        title: '',
        subTitle: '请确定内容: 日期，开始，完成，良品数，不良数 ',
        buttons: ['確定']
      });
      alert.present();

    }
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
  //             console.log("uploading form" + JSON.stringify(form.value));
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

  showWfQCPassAlert(wfQCPassValue: any) {
    if(!(wfQCPassValue == 2 || wfQCPassValue == 1)) {
      let alert = this.alertCtrl.create({
        title: 'Please Check!',
        subTitle: 'Please select 终检!',
        buttons: ['OK']
      });
      alert.present();

    }
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
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
          handler: data => {
            console.log('User has clicked Cancel');
          }
        },
        {
          text: '确定',
          handler: data => {
            console.log("User has saved the description")
          }
        }
      ]
    });
    alert.present();
  }

  // takePhoto() {
  //   // alert("taking photos");
  //
  //   this.presentPrompt();
  //
  //   const options: CameraOptions = {
  //     quality: 50,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     correctOrientation: true,
  //     saveToPhotoAlbum: true
  //   };
  //
  //   this.camera.getPicture(options).then((imageData) => {
  //     // imageData is either a base64 encoded string or a file URI
  //     // If it's base64:
  //
  //     // Photo attribute: wfForm, time, date, process or description
  //
  //     let imgUrl = 'data:image/jpeg;base64,' + imageData;
  //
  //     this.images.push(imgUrl);
  //
  //     this.storage.set('images', this.images);
  //
  //     // console.log(this.images);
  //
  //
  //   }, (err) => {
  //     // Handle error
  //   });
  //
  // }

  /*
  scanBarcode(model: string){

    let form = this.wfInputForm;

    console.log("scanning Barcode");
    console.log(model);

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

    // console.log(data);

    for (let key in headers) {
      // console.log(key + " : " + headers[key])
      switch(headers[key]) {
        case "ngForm":
          // console.log(key + " is a form")

          let formBodies = bodies[key];
          for (let formKey in formBodies) {
            // console.log("populate form model " + formKey);
            // console.log("populating model " + formKey + " " + formBodies[formKey]);

            try {
              // Dynamically set form value from the scanned code data
              // try and catch here is to protect if some of the fields are missing or failed,
              // then it will skip onto the next key

              // backup code for assigning the value into form
              // ngForm.controls[formKey].setValue(form[formKey]);

              // This use form control for the value setting
              console.log("formKey : " + formKey);
              console.log("Form " + form[formKey]);

              this.setFormValue(formKey, formBodies[formKey]);

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



  */

  setFormValue(model: string, value: any){
    //It is used for html
    let form = this.wfInputForm;

    form.controls[model].setValue(value);
  }

  private formInit() {
    this.wfInputForm = this.formBuilder.group({
      wfProcess: [''],
      wfProcessName: [''],
      wfFormName: [''],

      // Order Inputs detail
      wfFormId: [''],
      wfOrderId: [''],
      wfOrderBatchId: [''],
      wfOrderBatchQty: [''],
      wfOptMachineId: [''],

      wfOrderBOMNote: [''],
      wfOrderNote: [''],
      wfSalesOrderNote: [''],
      wfOrderTotalQty: [''],
      wfOrderTotalGoodQty: [''],
      wfOrderRMId: [''],
      wfOrderSeries: [''],
      wfOrderSpec: [''],
      wfOrderDim: [''],
      wfFormSplit: [''],
      wfClientId: [''],
      wfSalesOrderId: [''],
      wfSalesOrderQty: [''],
      // Date
      wfOrderDate: [''],
      wfOrderStartDate: [''],
      wfOrderEstFinishDate: [''],
      wfOrderDeliveryDate: [''],

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

      // dry input
      wfDryStartTime: [''],
      wfDryFinishTime1: [''],
      wfDryFinishTime2: [''],
      wfDryWindingDeg: [''],
      wfStaffDryName: [''],

      // wet Input
      wfWetEmptyAir: [''],
      wfWetAir: [''],
      wfWetStartTime: [''],
      wfWetFinishTime: [''],
      wfStaffWetName: [''],

      // Wash Input
      wfWashWindingDeg: [''],
      wfWashStartTime: [''],
      wfWashFinishTime: [''],
      wfWashDryWindingDeg: [''],      
      wfWashDryTime: [''],
      wfStaffWashName: [''],

      // aging input details
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
      wfAgeDetailTime: [''],
      wfAgeDetailStaffApprove: [''],
      wfAgeDetailStaffFinish: [''],
      wfAgeDetailStaffConfirm: [''],

      // Operational Input
      wfOptInputDate: [this.appDate],
      wfOptWashMachine: [''],
      wfOptStartTime: ['00:00'],
      wfOptFinishTime: ['00:00'],
      wfOptStartQty: [''],
      wfOptBadQtyItem: [''],
      wfOptBadQty: [''],
      wfOptGoodQty: [''],

      // Good / Bad Qty Input
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
      wfBadTotal: [''],
      wfGoodTotal: [''],

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
      wfStaffOptName: [''],
      wfStaffOptShift: [''],
      wfOptQtyChecked: [''],
      wfStaffRepairName: [''],
      wfStaffTechId: [''],
      wfStaffTechName: [''],
      wfStaffXrayId: [''],
      wfStaffXrayName: [''],
      wfStaffQCId: [''],
      wfStaffQCName: [''],
      wfStageStatus: [''],
      wfStaffQCSummary: [''],
      wfStaffQCPreRandomCheck: [''],
      wfStaffRandomPickName: [''],
      wfQCPass: [''],
      wfQCPassCode: [''],
      wfQCSignOff: [''],
      wfQCInputNote: [''],

      //  Appendix
      wfFormStatus: [''],
      wfProcessStatus: [''],

    });

  }

}
