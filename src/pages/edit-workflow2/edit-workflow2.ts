import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { WorkflowService } from "../../services/workflow";

@Component({
  selector: 'page-edit-workflow2',
  templateUrl: 'edit-workflow2.html',
})
export class EditWorkflow2Page implements OnInit{

  form = NgForm;
  wfOrderDetails = [];
  wfRMDetails = [];
  wfOpsInputs = [];
  wfPplInputs = [];

  images = [];

  // wfNavProcess = 3;

  wfInputForm: FormGroup;

  pushPage: any;
  wfNavParams = this.navParams.data;

  wfPass: boolean;

  //testing storage for qc part
  wfStaffTechIdTmp: any;
  wfStaffOptShiftTmp: any;
  wfQCSignOffTmp: any;
  wfOrderTotalGoodQtyTmp: any;

  // For calculating the time value
  tzoffset: number = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  appDate: String = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,-1);

  constructor(public storage: Storage,
              private formBuilder: FormBuilder,
              private barcodeScanner: BarcodeScanner,
              private alertCtrl: AlertController,
              private camera: Camera,
              private navParams: NavParams,
              private wfSvc: WorkflowService,
              private navCtrl: NavController) {

    // Assume all are ion-input except the one specificed as textarea
    this.wfOrderDetails = [
      {method: "input", model: "wfFormId", title: "流程卡号", type: "text", size: 20, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "WfOrderId", title: "工单号", type: "text", size: 20, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderBatchId", title: "批次号", type: "text", size: 20, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderTotalQty", title: "批次量", type: "number", size: 8, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "input", model: "wfOrderRMId", title: "料号", type: "text", size: 10, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderSeries", title: "系列", type: "text", size: 10, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderSpec", title: "规格", type: "text", size: 8, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderDim", title: "尺寸", type: "text", size: 4, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "input", model: "wfClientId", title: "客户代码:", type: "text", size: 10, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfSalesOrderId", title: "销售订单号:", type: "text", size: 10, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "input", model: "wfOrderFormNote", title: "流程卡备注", type: "textarea", size: 24, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderNote", title: "工单备注", type: "textarea", size: 24, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderBOMNote", title: "BOM备注", type: "textarea", size: 24, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {title: "CAP: μF", method: "input", model: "wfSpecCap", type: "text", scan: false, size: 9, process: {1: true, 2: true, 3: true, 4:true}},
      {title: "DF: %", method: "input", model: "wfSpecDF", type: "text", scan: false, size: 9, process: {1: true, 2: true, 3: true, 4:true}},
      {title: "LC: μA", method: "input", model: "wfSpecLC", type: "text", scan: false, size: 9, process: {1: true, 2: true, 3: true, 4:true}},
      {title: "Z/ESR(Ω):", method: "input", model: "wfSpecZESR", type: "text", scan: false, size: 9, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "input", model: "wfOrderSupNote", title: "异常记录", type: "textarea", size: 24, highlight: false, process: {1: false, 2: false, 3: false, 4:true}},

      // {title: "客户代码:", method: "input", model: "wfClientId", type: "text", scan: false, size: 15},
      // {title: "销售订单号:", method: "input", model: "wfSalesOrderId", type: "text", scan: false, size: 15},
      // {title: "台机号:", method: "input", model: "wfOptMachineId", type: "text", scan: false, size: 9},

      // {model: "wfOrderQty", title: "总量(批次)", type: "text", highlight: false},

      // {method: "break", size: 10},

      // {method: "input", model: "wfOrderTotalGoodQty", title: "良品數總和", type: "number", size: 5, highlight: false},

    ];

    this.wfRMDetails = [
      {modelName: "wfRMUpBeltName", title: "上带:", type: "text", modelSerial: 'wfRMUpBeltSerial', highlight: false},
      {modelName: "wfRMDownBeltName", title: "下带:", type: "text", modelSerial: 'wfRMDownBeltSerial', highlight: false},
      {modelName: "wfRMBaseName", title: "底座:", type: "text", modelSerial: 'wfRMBaseSerial', highlight: false},
      {modelName: "wfRMCircleName", title: "纸圆卡:", type: "text", modelSerial: 'wfRMCricleSerial', highlight: false},
      {modelName: "wfRMPrintName", title: "油墨:", type: "text", modelSerial: 'wfRMPrintSerial', highlight: false},
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
      {method: "input", model: "wfOptMachineId", title: "台机号:", type: "text", size: 7, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      // {method: "break", title: ""},

      // {title: "客户代码:", method: "input", model: "wfClientId", type: "text", scan: false, size: 15},
      // {title: "销售订单号:", method: "input", model: "wfSalesOrderId", type: "text", scan: false, size: 15},
      // {title: "台机号:", method: "input", model: "wfOptMachineId", type: "text", scan: false, size: 9},


      {method: 'inputs', options: [
         {title: "日期", model: "wfOptInputDate", type: "date", scan: false, size: 8, process: {1: true, 2: true, 3: true, 4:true}},
        // {title: "开始", model: "wfOptStartTime", type: "time", scan: false, size: 8},
        // {title: "完成", model: "wfOptFinishTime", type: "time", scan: false, size: 8}
      ], process: {1: true, 2: true, 3: true, 4:true}},


      {method: "inputs", options: [
        // {title: "日期", model: "wfOptInputDate", type: "date", scan: false, size: 8},
        {title: "不良数", model: "wfOptBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8, process: {1: true, 2: true, 3: true, 4:false}},
        {title: "良品数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8, process: {1: true, 2: true, 3: true, 4:false}},
        // {title: "抽查数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8, process: {1: false, 2: true, 3: false, 4:true}}
      ], process: {1: true, 2: true, 3: true, 4:true}},

      {title: "备注:", method: "input", model: "wfSpecNote", type: "textarea", scan: false, size: 40, process: {1: true, 2: true, 3: true, 4:true}},
      // {title: "备注:", method: "input", model: "wfSpecNote", type: "textarea", scan: false, size: 20},
    ];

    this.wfPplInputs = [
      {title: "作业員", method: "input", model: "wfStaffOptId", type: "text", icon: 'person', scan: 0, size: 20, process: {1: true, 2: true, 3: true, 4:false}},
      // {title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, size: 5},
      {title: "技術員", method: "input", model: "wfStaffTechId", type: "text", icon: 'construct', scan: 0, size: 20, process: {1: true, 2: true, 3: true, 4:false}},
      // {title: "X-RAY确认", method: "input", model: "wfStaffXrayId", type: "text", icon: 'construct', scan: 3, size: 20},
      
      {title: "全检", method: "buttons", model: "wfAllCheck", process: {1: false, 2: false, 3: true, 4:false} ,buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      {title: "抽检", method: "buttons", model: "wfRandomCheckStatus", process: {1: false, 2: false, 3: true, 4:false},buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      {title: "抽检", method: "input", model: "wfRandomCheckInfo", type: "text", icon: 'construct', scan: 0, size: 20, process: {1: false, 2: false, 3: true, 4:false}},
      
      {title: "电性", method: "buttons", model: "wfElecPass", process: {1: false, 2: false, 3: false, 4:true} ,buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      {method: "break", size: 15, process: {1: false, 2: false, 3: false, 4:true}},
      {title: "外观", method: "buttons", model: "wfLookPass", process: {1: false, 2: false, 3: false, 4:true},buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      {title: "终检", method: "buttons", model: "wfQCPass", icon: "md-checkmark-circle-outline", process: {1: true, 2: true, 3: true, 4:true} ,buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      {title: "品检員", method: "input", model: "wfQCSignOff", type: "text", icon: 'construct', scan: 3, size: 20, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "break", size: 15, process: {1: true, 2: true, 3: false, 4:true}},
      {method: "break", size: 15, process: {1: false, 2: false, 3: true, 4:true}},
      // {title: "品检备注", method: "textarea", model: "wfQCInputNote", type: "text", icon: 'chatbubbles', scan: false, size: 30},
      //{title: "品检員", method: "input", model: "wfQCSignOff", type: "text", process: {1: false, 2: false, 3: true, 4:true}, scan: 4, size: 20},
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditWorkflowPage2');
    console.log(this.wfNavParams);
    console.log(this.appDate);
    // alert(JSON.stringify(this.wfNavParams));
  }

  ngOnInit() {
    console.log("Initialise the page 成品流程卡");

    console.log(this.navParams);

    this.formInit();

    let form = this.wfInputForm;

    // alert(this.wfRMDetails[1].modelName)

    let storageData: any;

    console.log("loading from storage");
    this.storage.get(this.wfNavParams).then((dataDumpJsonXTmp) => {
      console.log("this is storage");
      console.log("storage:" + JSON.stringify(dataDumpJsonXTmp));
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

      for (let key in form.value) {
        // console.log("Loading " + key + " Storage:" + storageData[key]);
        try {
          if(key == 'wfStaffTechId') {
            this.wfStaffTechIdTmp = storageData[key];
            //alert('staff 1:' + StaffArr.wfStaffTechIda);
            form.controls[key].setValue('');
            // console.log('storage test 1: ' + this.wfStaffTechIdTmp);
          } else if(key == 'wfStaffOptShift') {
            this.wfStaffOptShiftTmp = storageData[key];
            form.controls[key].setValue('');
            //alert('staff 2:' + this.wfStaffOptShiftTmp);
            // console.log('storage test 1: ' + this.wfStaffOptShiftTmp);
          } else if(key == 'wfQCSignOff') {
            this.wfQCSignOffTmp = storageData[key];
            form.controls[key].setValue('');
            //alert('staff 3:' + this.wfQCSignOffTmp);
            // console.log('storage test 1: ' + this.wfQCSignOffTmp);
          } else {
            form.controls[key].setValue(storageData[key]);
            console.log("Form value" + form.controls[key])
          }
        } catch (err) {
          // console.log(err);
        }
      }

      console.log(this.wfInputForm.value);

    });

    console.log(this.wfInputForm.value);


  }

  checkBeforeScan(form: NgForm) {
    if(form.value.wfOptBadQty === '') {
      alert("请输入良品数!");
      return false;
    } else if(form.value.wfOptGoodQty === '') {
      alert("请输入不良品数!");
      return false;
    }
  }

  scanBarcode(model: string){
    console.log("scanning Barcode");

     /*
     console.log(form.value);

     form.controls['wfProcess'].setValue(1);
     form.controls['wfProcessName'].setValue('钉卷');
     form.controls["wfForm"].setValue(1);

     console.log(form.value);
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
    let form = this.wfInputForm;
    let storageData: any;
    // alert(" < " + form.value + " > !");

    console.log("Submitting the form now");

    console.log(form.value);

    this.wfSvc.upload(form.value, form.value.wfForm);

    switch(form.value.wfProcess) {


      case "5":
        alert("嚫,工序完成了!");
        break;

      default:
        //alert("有問題@_@!");
        //alert('saved!');
    }

    console.log("Saving to local storage");
    this.storage.set(form.value.wfFormId, form.value);

    console.log("Leaving this page");
    this.navCtrl.pop();


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

      wfProcess: [''],
      wfProcessName: [''],
      wfFormName: [''],
      wfForm: [''],

      // Order Inputs detail
      wfFormId: [''],
      WfOrderId: [''],
      wfOrderBatchId: [''],
      wfOrderBatchQty: [''],

      wfOrderFormNote: [''],
      wfOrderBOMNote: [''],
      wfOrderNote: [''],
      wfOrderSupNote: [''],
      wfOrderTotalQty: [''],
      wfOrderTotalGoodQty: [''],
      wfOrderRMId: [''],
      wfOrderSeries: [''],
      wfOrderSpec: [''],
      wfOrderDim: [''],
      wfClientId: [''],
      wfSalesOrderId: [''],

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
      wfSpecCap: [''],
      wfSpecDF: [''],
      wfSpecLC: [''],
      wfSpecZESR: [''],
      wfSpecNote: [''],

      wfOptMachineId: '',
      wfOptInputDate: [this.appDate],
      wfOptStartTime: ['00:00'],
      wfOptFinishTime: ['00:00'],
      wfOptBadQty: [''],
      wfOptGoodQty: [''],

      //Staff Input section
      wfStaffOptId: [''],
      wfStaffOptShift: [''],
      wfStaffTechId: [''],
      wfAllCheck: [''],
      wfRandomCheckInfo: [''],
      wfRandomCheckStatus: [''],      
      wfElecPass: [''],
      wfLookPass: [''],
      wfQCPass: [''],
      wfQCSignOff: [''],
      // wfQCInputNote: [''],

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

  takePhoto() {
    // alert("taking photos");

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

      let imgUrl = 'data:image/jpeg;base64,' + imageData;

      this.images.push(imgUrl);

      this.storage.set('images', this.images);

      // console.log(this.images);


    }, (err) => {
      // Handle error
    });

  }

}
