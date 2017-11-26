import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { WorkflowService } from "../../services/workflow";
import { QRCodeService } from "../../services/qrCode";
import { PhotoService } from "../../services/photo";

@Component({
  selector: 'page-edit-workflow1',
  templateUrl: 'edit-workflow1.html',
})
export class EditWorkflow1Page implements OnInit{

  form = NgForm;
  wfOrderDetails = [];
  wfRMDetails = [];
  wfAgeingDetails = [];
  wfAutoAgeingDetails = [];
  wfAutoAgeingSubDetails = [];
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
      {method: "input", model: "wfFormId", title: "流程卡号", type: "text", size: 12, highlight: false},
      {method: "input", model: "wfOrderId", title: "工单号", type: "text", size: 12, highlight: false},
      {method: "input", model: "wfOptMachineId", title: "机台号", type: "text", size: 6, highlight: false},
      {method: "break", size: "88", visibility: "hidden"},

      {method: "input", model: "wfOrderSeries", title: "系列", type: "text", size: 12, highlight: false},
      {method: "input", model: "wfOrderRMId", title: "料号", type: "text", size: 12, highlight: false},
      {method: "input", model: "wfOrderSpec", title: "规格", type: "text", size: 10, highlight: false},
      {method: "input", model: "wfOrderDim", title: "尺寸", type: "text", size: 10, highlight: false},
      {method: "break", size: "88", visibility: "hidden"},

      {method: "input", model: "wfOrderBatchId", title: "批次号", type: "text", size: 12, highlight: false},
      {method: "input", model: "wfOrderBatchQty", title: "批次量", type: "number", size: 5, highlight: false},
      {method: "input", model: "wfOrderTotalGoodQty", title: "良品數總和", type: "number", size: 5, highlight: false},
      {method: "break", size: "88", visibility: "hidden"},

      {method: "input", model: "wfOrderBOMNote", title: "BOM备注", type: "textarea", size: 20, highlight: false},
      {method: "input", model: "wfOrderNote", title: "工单备注", type: "textarea", size: 20, highlight: false},

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

    this.wfOpsInputs = [
      // {title: "分單", method: "input", model: "wfFormSplit", type: "text", icon: 'ios-copy-outline', scan: false, size: 6, wfOpslI: 2},
      // {method: "break", title: ""},

      {method: "inputs2", header: "素子烘烤", options: [
        {title: "时间 H", model: "wfRMWindingTime", type: "text", icon: 'ios-add-circle-outline', scan: false, size: 8},
        {title: "温度 ℃", model: "wfRMWindingDeg", type: "number", icon: 'md-remove-circle', scan: false, size: 8}
      ]},
      {method: 'inputs', options: [
        {title: "完成日期", model: "wfOptInputDate", type: "date", icon: "calender", scan: false, size: 8},
        {title: "开始时间", model: "wfOptStartTime", type: "number", icon: "time", scan: false, size: 8},
        {title: "完成时间", model: "wfOptFinishTime", type: "number", icon: "md-alarm", scan: false, size: 8}
      ]},
      {method: "inputs", options: [
        {title: "投入数", model: "wfOptStartQty", type: "number", scan: false, size: 8},
        {title: "不良数", model: "wfOptBadQty", type: "number", wfBadQty: '1', scan: false, size: 8},
        {title: "良品数", model: "wfOptGoodQty", type: "number",  scan: false, size: 8}
      ]},
      {method: "table", size: 8, headers: [{title: "不良數种类"},{title: "数量"}],rows: [
        {title: "1", cols: [
          {model: "wfBadItem1", type: "text", size:"6", disabled: false},
          {model: "wfBadQty1", type: "number", size:"6", disabled: false},
        ]},
        {title: "2", cols: [
          {model: "wfBadItem2", type: "text", size:"6", disabled: false},
          {model: "wfBadQty2", type: "number", size:"6",  disabled: false},
        ]},
        {title: "3", cols: [
          {model: "wfBadItem3", type: "text", size:"6", disabled: false},
          {model: "wfBadQty3", type: "number", size:"6",  disabled: false},
        ]},
        {title: "4", cols: [
          {model: "wfBadItem4", type: "text", size:"6", disabled: false},
          {model: "wfBadQty4", type: "number", size:"6",  disabled: false},
        ]},
        {title: "5", cols: [
          {model: "wfBadItem5", type: "text", size:"6", disabled: false},
          {model: "wfBadQty5", type: "number", size:"6",  disabled: false},
        ]},
        {title: "6", cols: [
          {model: "wfBadItem6", type: "text", size:"6", disabled: false},
          {model: "wfBadQty6", type: "number", size:"6",  disabled: false},
        ]},

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
        {model: "wfAgeTimeSet", type: "text", auto: false},
        {model: "wfAgeTimeAct", type: "text", auto: false}
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

    /*
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
    */
    
    this.wfPplInputs = [
      {title: "作业員ID", method: "input", model: "wfStaffOptNameID", type: "text", icon: 'person', scan: true, wfPplI: 1, size: 7},
      {title: "作业員", method: "input", model: "wfStaffOptName", type: "text", icon: 'person', scan: false, wfPplI: 2, size: 6},
      {title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, wfPplI: 2, size: 3},
      {title: "技術員", method: "input", model: "wfStaffTechName", type: "text", icon: 'construct', scan: true, wfPplI: 3, size: 7},
      {title: "X-RAY", method: "input", model: "wfStaffXrayName", type: "text", icon: 'construct', scan: true, wfPplI: 4, size: 7},

      {title: "终检", method: "buttons", model: "wfQCPass", icon: "md-checkmark-circle-outline",buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},

      {title: "品检員", method: "input", model: "wfStaffQCName", type: "text", icon: 'search', scan: 5, wfPplI: 5, size: 11},
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
            form.controls[key].setValue(this.appDate);

          }  else if(key == 'wfBadItem1') {
            form.controls[key].setValue('开路');

          }  else if(key == 'wfBadItem2') {
            form.controls[key].setValue('短路');

          }  else if(key == 'wfBadItem3') {
            form.controls[key].setValue('高容');

          }  else if(key == 'wfBadItem4') {
            form.controls[key].setValue('低容');

          }  else if(key == 'wfBadItem5') {
            form.controls[key].setValue('损耗');

          }  else if(key == 'wfBadItem6') {
            form.controls[key].setValue('漏电');
          } else if(key == 'wfBadQty1') {
            form.controls[key].setValue(0);
          }  else if(key == 'wfBadQty2') {
            form.controls[key].setValue(0);
          }  else if(key == 'wfBadQty3') {
            form.controls[key].setValue(0);
          }  else if(key == 'wfBadQty4') {
            form.controls[key].setValue(0);
          }  else if(key == 'wfBadQty5') {
            form.controls[key].setValue(0);
          } else if(key == 'wfBadQty6') {
            form.controls[key].setValue(0);
          } else if(key == 'wfBadItemTotal') {
            form.controls[key].setValue('不良数總和');
          }  else if(key == 'wfOptBadQty') {
            form.controls[key].setValue(0);
          }  else if(key == 'wfOptGoodQty') {
            form.controls[key].setValue(0);
          }

          else {
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
      wfForm: [''],

      // Order Inputs detail
      wfFormId: [''],
      wfFormSplit: [''],
      wfOrderId: [''],
      wfOrderBatchId: [''],
      wfOrderBatchQty: [''],
      wfOptMachineId: [''],

      wfOrderBOMNote: [''],
      wfOrderNote: [''],
      wfOrderTotalQty: [''],
      wfOrderTotalGoodQty: [''],
      wfOrderRMId: [''],
      wfOrderSeries: [''],
      wfOrderSpec: [''],
      wfOrderDim: [''],

      // Good / Bad Qty Input
      wfBadItem1: ['开路'],
      wfBadQty1: ['0'],
      wfBadItem2: ['短路'],
      wfBadQty2: ['0'],
      wfBadItem3: ['高容'],
      wfBadQty3: ['0'],
      wfBadItem4: ['低容'],
      wfBadQty4: ['0'],
      wfBadItem5: ['损耗'],
      wfBadQty5: ['0'],    
      wfBadItem6: ['漏电'],
      wfBadQty6: ['0'],
      wfBadItemTotal: ['不良数總和'],

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
      wfOptInputDate: [this.appDate],
      wfOptStartTime: [''],
      wfOptFinishTime: [''],
      wfOptBadQty: ['0'],
      wfOptGoodQty: ['0'],

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
      wfStaffOptNameID: [''],
      wfStaffTitle: [''],
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
      wfOptStartQty: [''],
      wfBadTotal: [''],
      wfGoodTotal: [''],
      wfFormStatus: [''],
      wfProcessStatus: [''],

    });

  }

}
