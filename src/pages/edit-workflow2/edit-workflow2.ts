import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { NgForm, FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";

@Component({
  selector: 'page-edit-workflow2',
  templateUrl: 'edit-workflow2.html',
})
export class EditWorkflow2Page implements OnInit{

  form = NgForm;
  wfOrderDetails = [];
  wfRMDetails = [];
  wfAgeingDetails = [];
  wfAutoAgeingDetails = [];
  wfAutoAgeingSubDetails = [];
  wfOpsInputs = [];
  wfPplInputs = [];

  wfInputForm: FormGroup;

  pushPage: any;
  wfNavParams: any;

  wfPass: boolean;

  tzoffset: number = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  appDate: String = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,-1);


  constructor(private navCtrl: NavController,
              private formBuilder: FormBuilder,
              private barcodeScanner: BarcodeScanner,
              private alertCtrl: AlertController,
              public navParams: NavParams) {

  this.wfNavParams = this.navParams.data.value;

  // Assume all are ion-input except the one specificed as textarea
  this.wfOrderDetails = [
    // {model: "wfFormId", title: "流程卡号", type: "text", highlight: false},
    {method: "input", model: "WfOrderId", title: "工单号", type: "text", size: 20, highlight: false},
    // {model: "wfOrderBatchId", title: "批次号", type: "text", highlight: false},
    // {model: "wfOrderQty", title: "总量(批次)", type: "text", highlight: false},

    {method: "input", model: "wfOrderRMId", title: "料号", type: "text", size: 20, highlight: false},
    {method: "input", model: "wfOrderSeries", title: "系列", type: "text", size: 10, highlight: false},
    {method: "input", model: "wfOrderSpec", title: "规格", type: "text", size: 8, highlight: false},
    {method: "input", model: "wfOrderDim", title: "尺寸", type: "text", size: 8, highlight: false},
    // {method: "break", size: 10},
    {method: "input", model: "wfBOMNote", title: "BOM备注", type: "textarea", size: 30, highlight: false},
    {method: "input", model: "wfOrderNote", title: "工单备注", type: "textarea", size: 30, highlight: false},
    {method: "input", model: "wfTotalQty", title: "预设总量", type: "number", size: 5, highlight: false},
    {method: "input", model: "wfTotalGoodQty", title: "良品數總和", type: "number", size: 5, highlight: false},

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
    {title: "流程卡号", method: "input", model: "wfCardId", type: "text", icon: 'ios-copy-outline', scan: false, size: 10},
    {title: "机台", method: "input", model: "wfMachineId", type: "text", icon: 'cog', scan: false, size: 10},
    {title: "批次号", method: "input", model: "wfBatchId", type: "text", icon: 'ios-basket-outline', scan: false, size: 10},
    {title: "批次量", method: "input", model: "wfBatchQty", type: "text", icon: 'ios-basket-outline', scan: false, size: 5},
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
    {title: "作业員", method: "input", model: "wfStaffId", type: "text", icon: 'person', scan: true, size: 20},
    {title: "班别", method: "input", model: "wfShift", type: "text", icon: 'briefcase', scan: false, size: 5},
    {title: "技術員", method: "input", model: "wfTechId", type: "text", icon: 'construct', scan: true, size: 20},
    {method: "break", size: 15},
    {title: "终检", method: "buttons", model: "wfPass", icon: "md-checkmark-circle-outline",buttons: [
      {label: "通过", value: true, icon: 'checkmark'},
      {label: "失败", value: false, icon: 'close'}
    ]},
    {title: "品检备注", method: "textarea", model: "wfInputNote", type: "text", icon: 'chatbubbles', scan: false, size: 30},
    {title: "品检員", method: "input", model: "wfSignOff", type: "text", icon: 'search', scan: true, size: 20},
  ];

}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditWorkflowPage');
    console.log(this.wfNavParams);
    console.log(this.appDate);
  }

  ngOnInit() {
    this.formInit();
  }

  scanBarcode(model: string){
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
        this.wfInputForm.controls[model].setValue(barcodeData.text);

        switch (barcodeData.text) {
          case 'QC0001':
            this.wfInputForm.controls['wfSignOff'].setValue(barcodeData.text);
            this.promptAlert();
            break;

          case 'QC0002':
            this.wfInputForm.controls['wfSignOff'].setValue(barcodeData.text);
            this.promptAlert();
            break;

          case 'QC0003':
            this.wfInputForm.controls['wfSignOff'].setValue(barcodeData.text);
            this.promptAlert();
            break;

          default:
            alert('嚫，请确定你所扫描的条码是正确的');
        }

      } else {
        alert('嚫，请确定你所扫描的条码是正确的');
      }
    }, (err) => {
      // An error occurred
      alert(err);
    });
  }

  inputWf(){
    console.log('inputWf activated')
  }

  setWfPass(){
    console.log('checked');
    // this.wfPass = result;
  }

  onSubmit(){
    console.log(this.wfInputForm);
  }

  updateForm(form: NgForm, model: string, value: any) {
    form.controls[model].setValue(value);
    console.log(form.value);
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

  private formInit() {
    this.wfInputForm = this.formBuilder.group({
      wfCardId: [this.wfNavParams.wfFormId],
      WfOrderId: [this.wfNavParams.wfOrderId],
      wfBatchId: [this.wfNavParams.wfBatchId],
      wfBatchQty: [this.wfNavParams.wfBatchQty],
      wfOrderBOMNote: [this.wfNavParams.wfOBOMNote],
      wfOrderNote: [this.wfNavParams.wfONote],
      wfOrderTotalQty: [this.wfNavParams.wfOTotalQty],
      wfOrderTotalGoodQty: [this.wfNavParams.wfOTotalGoodQty],
      wfOrderRMId: [this.wfNavParams.wfORMId],
      wfOrderSeries: [this.wfNavParams.wfOSeries],
      wfOrderSpec: [this.wfNavParams.wfOSpec],
      // wfOrderQty: [''],
      wfOrderDim: [this.wfNavParams.wfODim],

      wfProcess: new FormControl(this.wfNavParams.wfProcess),
      wfProcessName: new FormControl(this.wfNavParams.wfProcessName),

      

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

      wfMachineId: [this.wfNavParams.wfMachineId],
      wfShift: [''],
      wfInputDate: [this.appDate],
      wfStartTime: [this.appDate],
      wfFinishTime: [this.appDate],
      wfBadQty: [''],
      wfGoodQty: [''],
      wfStaffId: [''],
      wfTechId: [''],
      wfPass: [''],
      wfSignOff: [''],
      wfInputNote: [''],

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



    });

  }

  keypress(keycode: number) {
    if (keycode == 13) {
      alert('next');
    }
  }


}
