import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { EditWorkflow1Page } from "../edit-workflow1/edit-workflow1";
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Camera, CameraOptions } from "@ionic-native/camera";


@Component({
  selector: 'page-edit-workflow',
  templateUrl: 'edit-workflow.html',
})
export class EditWorkflowPage implements OnInit{

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
  wfNavParams: any;

  wfPass: boolean;

  // For calculating the time value
  tzoffset: number = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  appDate: String = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,-1);

  constructor(private storage: Storage,
              private formBuilder: FormBuilder,
              private barcodeScanner: BarcodeScanner,
              private alertCtrl: AlertController,
              private camera: Camera,
              private navParams: NavParams) {
    /*
    // this.pushPage = EditWorkflow1Page;
    */
    this.wfNavParams = this.navParams.data.value;

    // Assume all are ion-input except the one specificed as textarea
    this.wfOrderDetails = [
      /*
      // {model: "wfFormId", title: "流程卡号", type: "text", highlight: false},
      */
      {method: "input", model: "WfOrderId", title: "工单号", type: "text", size: 20, highlight: false},

      /*
      // {model: "wfOrderBatchId", title: "批次号", type: "text", highlight: false},
      // {model: "wfOrderQty", title: "总量(批次)", type: "text", highlight: false},
      */

      {method: "input", model: "wfOrderRMId", title: "料号", type: "text", size: 20, highlight: false},
      {method: "input", model: "wfOrderSeries", title: "系列", type: "text", size: 10, highlight: false},
      {method: "input", model: "wfOrderSpec", title: "规格", type: "text", size: 8, highlight: false},
      {method: "input", model: "wfOrderDim", title: "尺寸", type: "text", size: 8, highlight: false},
      // {method: "break", size: 10},
      {method: "input", model: "wfOrderBOMNote", title: "BOM备注", type: "textarea", size: 30, highlight: false},
      {method: "input", model: "wfOrderNote", title: "工单备注", type: "textarea", size: 30, highlight: false},
      {method: "input", model: "wfOrderTotalQty", title: "预设总量", type: "number", size: 5, highlight: false},
      {method: "input", model: "wfOrderTotalGoodQty", title: "良品數總和", type: "number", size: 5, highlight: false},

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
      {title: "流程卡号", method: "input", model: "wfOrderFormId", type: "text", icon: 'ios-copy-outline', scan: false, size: 9},
      {title: "机台", method: "input", model: "wfOptMachineId", type: "text", icon: 'cog', scan: false, size: 6},
      {title: "批次号", method: "input", model: "wfOrderBatchId", type: "text", icon: 'ios-basket-outline', scan: false, size: 11},
      {title: "批次量", method: "input", model: "wfOrderBatchQty", type: "text", icon: 'ios-basket-outline', scan: false, size: 5},
      {method: "break", title: ""},

      {method: "inputs", options: [
        {title: "正箔 - L", model: "wfRMFoilPosLName", type: "number", icon: 'ios-add-circle-outline', scan: false, size: 8},
        {title: "負箔 - L", model: "wfRMFoilNegLName", type: "number", icon: 'md-remove-circle', scan: false, size: 8}
      ]},
      {method: "inputs2", header: "素子烘烤", options: [
        {title: "时间 H", model: "wfRMWindingTime", type: "number", icon: 'ios-add-circle-outline', scan: false, size: 8},
        {title: "温度 ℃", model: "wfRMWindingDeg", type: "number", icon: 'md-remove-circle', scan: false, size: 8}
      ]},
      {method: 'inputs', options: [
        {title: "日期", model: "wfOptInputDate", type: "date", icon: "calender", scan: false, size: 8},
        {title: "开始", model: "wfOptStartTime", type: "text", icon: "time", scan: false, size: 8},
        {title: "完成", model: "wfOptFinishTime", type: "text", icon: "md-alarm", scan: false, size: 8}
        ]},
      {method: "inputs", options: [
        {title: "不良数", model: "wfOptBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8},
        {title: "良品数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8}
      ]}
    ];

    this.wfAgeingDetails = [
      {title: "电压 DC/V", icon: 'md-flash', method: "table", size: 7, cols: [
        {model: "wfAgeVoltSet", type: "number", auto: false},
        {model: "wfAgeVoltAct", type: "number", auto: false},
        {model: "wfAutoAgeVoltAct1", type: "number", auto: true},
        {model: "wfAutoAgeVoltAct2", type: "number", auto: true},
        {model: "wfAutoAgeVoltAct3", type: "number", auto: true},
        {model: "wfAutoAgeVoltAct4", type: "number", auto: true},
        {model: "wfAutoAgeVoltAct5", type: "number", auto: true},
      ]},
      {title: "时间 H", icon: 'timer', method: "table", size: 7, cols:[
        {model: "wfAgeTimeSet", type: "number", auto: false},
        {model: "wfAgeTimeAct", type: "number", auto: false}
      ]},
      {title: "温度 ℃", icon: 'ios-thermometer-outline', method: "table", size: 7, cols:[
        {model: "wfAgeDegSet", type: "number", auto: false},
        {model: "wfAgeDegAct", type: "number", auto: false}
      ]},
      {title: "电流 µA", icon: 'md-pulse', method: "table", size: 7, cols:[
        {model: "wfAgeCurrentSet", type: "number", auto: false},
        {model: "wfAgeCurrentAct", type: "number", auto: false}
      ]},
    ];

    this.wfAutoAgeingDetails = [

      {title: "开路电压", method: "input", size: 8, model: "wfAutoAgeOpenVolt", type: "number"},

      {title: "高容", method: "input", size: 8, model: "wfAutoAgeHighCapacity", type: "number"},

      {title: "短路电压", method: "input", size: 8, model: "wfAutoAgeShortVolt", type: "number"},

      {title: "低容", method: "input", size: 8, model: "wfAutoAgeLowCapacity", type: "number"},

      {title: "开路", method: "input", size: 8, model: "wfAutoAgeOpen", type: "number"},

      {title: "损耗", method: "input", size: 8, model: "wfAutoAgeWear", type: "number"},

      {title: "短路", method: "input", size: 8, model: "wfAutoAgeShort", type: "number"},

      {title: "漏电",  method: "input", size: 8, model: "wfAutoAgeVoltLeak", type: "number"},

      {title: "外观", method: "input", size: 8, model: "wfAutoAgeLook", type: "number"}
    ];

    this.wfPplInputs = [
      {title: "作业員", method: "input", model: "wfStaffOptId", type: "text", icon: 'person', scan: 1, size: 20},
      {title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, size: 5},
      {title: "技術員", method: "input", model: "wfStaffTechId", type: "text", icon: 'construct', scan: 2, size: 20},
      {title: "X-RAY确认", method: "input", model: "wfStaffXrayId", type: "text", icon: 'construct', scan: 3, size: 20},
      {method: "break", size: 15},
      {title: "终检", method: "buttons", model: "wfQCPass", icon: "md-checkmark-circle-outline",buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      {title: "品检备注", method: "textarea", model: "wfQCInputNote", type: "text", icon: 'chatbubbles', scan: false, size: 30},
      {title: "品检員", method: "input", model: "wfQCSignOff", type: "text", icon: 'search', scan: 4, size: 20},
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditWorkflowPage');
    console.log(this.wfNavParams);
    console.log(this.appDate);
  }

  ngOnInit() {
    this.formInit();
    // alert(this.wfRMDetails[1].modelName)
  }

  checkBeforeScan(form: NgForm) {
    if(form.value.wfOptBadQty === '') {
    alert("input good items is missing!");  
    return false;
    } else if(form.value.wfOptGoodQty === '') 
    { alert("input good items is missing!"); 
    return false; } 
  }
 
  scanBarcode(model: string){
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
    
    let form = this.wfInputForm;

    this.barcodeScanner.scan().then((barcodeData) => {
      // Success! Barcode data is here
      // Limiter to assume the Barcode is default used in this orderID
      

      form.controls[model].setValue(barcodeData.text);

      if ( barcodeData.format && barcodeData.format != "QR_CODE" && model == "wfSignOff" ) {

        switch (barcodeData.text) {
          case 'QC0001':
            form.controls['wfSignOff'].setValue(barcodeData.text);
            this.promptAlert();
            break;

          case 'QC0002':
            form.controls['wfSignOff'].setValue(barcodeData.text);
            this.promptAlert();
            break;

          case 'QC0003':
            form.controls['wfSignOff'].setValue(barcodeData.text);
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
    /*
    // this.wfPass = result;
    */
  }

  onSubmit(){
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

  private formInit() {
    this.wfInputForm = this.formBuilder.group({
      wfProcess: new FormControl(this.wfNavParams.wfProcess),
      wfProcessName: new FormControl(this.wfNavParams.wfProcessName),

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
      wfOptMachineId: [this.wfNavParams.wfMachineId],
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

  }

  keyPress(keycode: number) {
    if (keycode == 13) {
      alert('next');
    }
  }

  showWfOpsInputsAlert(wfOptBadQtyValue: any, wfOptGoodQtyValue: any) {
    if(wfOptBadQtyValue == '' || wfOptGoodQtyValue == '') {
      let alert = this.alertCtrl.create({
        title: 'Please Check!',
        subTitle: 'Please fill out the following: 日期，开始，完成，良品数，不良数 ',
        buttons: ['OK']
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

  takePhoto() {
    // alert("taking photos");

    this.presentPrompt();

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:

      // Photo attribute: wfForm, time, date, process or description

      let imgUrl = 'data:image/jpeg;base64,' + imageData;

      this.images.push(imgUrl);

      this.storage.set('images', this.images);

      // console.log(this.images);


    }, (err) => {
      // Handle error
    });

  }



}
