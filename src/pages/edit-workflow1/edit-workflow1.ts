import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { WorkflowService } from "../../services/workflow";


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
  wfNavParams: any;

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
              private barcodeScanner: BarcodeScanner,
              private alertCtrl: AlertController,
              private camera: Camera,
              private navParams: NavParams,
              private wfSvc: WorkflowService,
              private navCtrl: NavController) {

    storage.ready().then(() => { });

    this.wfNavParams = this.navParams.data;

    // Assume all are ion-input except the one specificed as textarea
    this.wfOrderDetails = [
  
      {method: "input", model: "wfFormId", title: "流程卡号", type: "text", size: 20, highlight: false},
       
      {method: "input", model: "WfOrderId", title: "工单号", type: "text", size: 20, highlight: false},

      /*
       {model: "wfOrderBatchId", title: "批次号", type: "text", highlight: false},
       {model: "wfOrderQty", title: "总量(批次)", type: "text", highlight: false},
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
      {title: "分單", method: "input", model: "wfFormSplit", type: "text", icon: 'ios-copy-outline', scan: false, size: 2, wfOpslI: 2},
      {title: "流程卡号", method: "input", model: "wfOrderFormId", type: "text", icon: 'ios-copy-outline', scan: false, size: 9},
      {title: "机台", method: "input", model: "wfOptMachineId", type: "text", icon: 'cog', wfOpslI: 1, scan: true, size: 6},
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
        {title: "开始", model: "wfOptStartTime", type: "time", icon: "time", scan: false, size: 8},
        {title: "完成", model: "wfOptFinishTime", type: "time", icon: "md-alarm", scan: false, size: 8}
      ]},
      {method: "inputs", options: [
        {title: "不良数", model: "wfOptBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8},
        {title: "良品数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8}
      ]},
      
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
      {title: "作业員", method: "input", model: "wfStaffOptId", type: "text", icon: 'person', scan: false, wfPplI: 1, size: 7},
      {title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, wfPplI: 2, size: 3},
      {title: "技術員", method: "input", model: "wfStaffTechId", type: "text", icon: 'construct', scan: false, wfPplI: 3, size: 7},
      {title: "X-RAY确认", method: "input", model: "wfStaffXrayId", type: "text", icon: 'construct', scan: false, wfPplI: 4, size: 7},

      {title: "终检", method: "buttons", model: "wfQCPass", icon: "md-checkmark-circle-outline",buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},

      {title: "品检員", method: "input", model: "wfQCSignOff", type: "text", icon: 'search', scan: 5, wfPplI: 5, size: 11},
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
    console.log('ionViewDidLoad EditWorkflowPage');
    console.log(this.wfNavParams);
    console.log(this.appDate);
  }

  ngOnInit() {
    console.log("Initialise the page 裸品流程卡");

    this.formInit();

    let form = this.wfInputForm;

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
          }
          
        } catch (err) {
          console.log(err);
        }
      }

    });



    // alert(this.wfRMDetails[1].modelName)
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

  private formInit() {
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
      wfOrderDim: [''],
      wfFormSplit: [''],

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
      wfQCPass: [''],
      wfQCPassCode: [''],
      wfQCSignOff: [''],
      wfQCInputNote: [''],

    });

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

  showWfOpsFinalInputsAlert(wfOrderTotalQty: any, wfOrderTotalGoodQty: any, wfOptBadQtyValue: any, wfOptGoodQtyValue: any) {
    if(wfOrderTotalQty > wfOptGoodQtyValue) {
      let alert = this.alertCtrl.create({
        title: '',
        subTitle: '预设总量 (' + wfOptGoodQtyValue + ') 小於 批次量 ('  + wfOrderTotalQty + ')!',
        buttons: ['確定']
      });
      alert.present();
    } else if(wfOrderTotalQty < wfOptGoodQtyValue) {
      let form = this.wfInputForm;
      let alert = this.alertCtrl.create({
        /*
        title: '',
        
        subTitle: '确定完成和上传' + ' Order Total: ' + wfOrderTotalQty + ' Good Total: ' + wfOrderTotalGoodQty + ' Bad:' + wfOptBadQtyValue + ' opt good: ' + wfOptGoodQtyValue,
        */
        buttons: [{
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },{
          text: '上存',
          role: 'cancel',
          handler: () => {
            console.log('save clicked');
          }
        },
          {
            text: '上存 + 完成工序',
            handler: () => {
              console.log('submit and save clicked');
              console.log(form.value);

              // Upload to Server
              this.wfSvc.upload(form.value,1)
                .subscribe((data)=> {
                    console.log("success");
                    console.log(data[0]);
                  },
                  error => {
                    console.log(error);
                  }
                );

              let dataXYZ = {"wfProcess": form.value.wfProcess,
              "wfProcessName": form.value.wfProcessName,
              "wfForm": form.value.wfForm,
              "wfFormId": form.value.wfFormId,
              "wfOrderFormId": form.value.wfOrderFormId,
              "WfOrderId": form.value.WfOrderId,
              "wfOrderBatchId": form.value.wfOrderBatchId,
              "wfOrderBatchQty": form.value.wfOrderBatchQty,
              "wfOrderTotalQty": form.value.wfOrderTotalQty,
              "wfOrderTotalGoodQty": form.value.wfOrderTotalGoodQty,
              "wfOrderRMId": form.value.wfOrderRMId,
              "wfOrderSeries": form.value.wfOrderSeries,
              "wfOrderSpec": form.value.wfOrderSpec,
              "wfOrderDim": form.value.wfOrderDim,
              "wfRMFoilPosName": form.value.wfRMFoilPosName,
              "wfRMFoilPosSerial": form.value.wfRMFoilPosSerial,
              "wfRMFoilPosLName": form.value.wfRMFoilPosLName,
              "wfRMFoilNegName": form.value.wfRMFoilNegName,
              "wfRMFoilNegSerial": form.value.wfRMFoilNegSerial,
              "wfRMFoilNegLName": form.value.wfRMFoilNegLName,
              "wfRMPaperName": form.value.wfRMPaperName,
              "wfRMPaperSerial": form.value.wfRMPaperSerial,
              "wfRMGlueName": "",
              "wfRMGlueSerial": form.value.wfRMGlueSerial,
              "wfRMSolName": form.value.wfRMSolName,
              "wfRMSolSerial": form.value.wfRMSolSerial,
              "wfRMPinPosName": form.value.wfRMPinPosName,
              "wfRMPinPosSerial": form.value.wfRMPinPosSerial,
              "wfRMPinNegName": form.value.wfRMPinNegName,
              "wfRMPinNegSerial": form.value.wfRMPinNegSerial,
              "wfRMPlasticName": form.value.wfRMPlasticName,
              "wfRMPlasticSerial": form.value.wfRMPlasticSerial,
              "wfRMCoverName": form.value.wfRMCoverName,
              "wfRMCoverSerial": form.value.wfRMCoverSerial,
              "wfStaffTechId": form.value.wfStaffTechId,
              "wfStaffOptShift": form.value.wfStaffOptShift,
              "wfQCSignOff": form.value.wfQCSignOff};

              /*
              this.storage.get('wfProcess').then((dataProcessXTmp) => {
                dataXYZ.wfProcess = form.value.wfProcess;
                //dataXYZ.wfProcess++;
                //dataXYZ.wfProcessName = dataProcessXTmp[dataXYZ.wfProcess]["Process"][form.value.wfFormId];
                
                let alertX = this.alertCtrl.create({
                  title: 'Please Check!',
                  subTitle: dataProcessXTmp[dataXYZ.wfProcess]["Process"][form.value.wfFormId],
                  buttons: ['OK']
                });
                alertX.present();
              });
              */
              if(form.value.wfProcess == 1) {
                dataXYZ.wfProcess = 2
                dataXYZ.wfProcessName = '组立'; 
                this.storage.set(form.value.wfFormId, dataXYZ);
              } else if(form.value.wfProcess == 3) {
                dataXYZ.wfProcess = 4
                dataXYZ.wfProcessName = '含浸'; 
                this.storage.set(form.value.wfFormId, dataXYZ);
              } else if(form.value.wfProcess == 4) {
                dataXYZ.wfProcess = 5
                dataXYZ.wfProcessName = '清洗'; 
                this.storage.set(form.value.wfFormId, dataXYZ);
              }     
              //watch data 
              this.storage.get(form.value.wfFormId).then((resultStorageItemX) => {
                if(resultStorageItemX){
                  let alert = this.alertCtrl.create({
                    title: 'Please Check!',
                    // subTitle: 'Please select 终检!' + dataXYZ.wfProcess + ' ' + dataXYZ.wfProcessName + ' ' + form.value.wfFormId + ' ' + JSON.stringify(resultStorageItemX),
                    // comment above for faster process
                    subTitle: 'Please select 终检!' + dataXYZ.wfProcess + ' ' + dataXYZ.wfProcessName + ' ' + form.value.wfFormId,
                    buttons: [{text: '確定',
                      handler: () => {
                        // Return back to main page
                        this.navCtrl.pop();
                      }
                    }]
                  });

                  alert.present(); }
              });
              //this.onSubmit();
            }
          }]
      });
      alert.present();
    } else {
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
