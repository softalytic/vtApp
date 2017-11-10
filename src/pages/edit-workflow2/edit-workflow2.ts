import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { WorkflowService } from "../../services/workflow";
import { QRCodeService } from "../../services/qrCode";
import { PhotoService } from "../../services/photo";

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
              private alertCtrl: AlertController,
              private navParams: NavParams,
              private navCtrl: NavController,
              private wfSvc: WorkflowService,
              private QRCode: QRCodeService,
              private photoSvc: PhotoService) {

    storage.ready().then(() => { });

    // Assume all are ion-input except the one specificed as textarea
    this.wfOrderDetails = [
      {method: "input", model: "wfFormId", title: "流程卡号", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderId", title: "工单号", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOptMachineId", title: "台机号", type: "text", size: 7, scan: false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderBatchId", title: "批次号", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      // {method: "input", model: "wfOrderTotalGoodQty", title: "良品數總和", type: "number", size: 6, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "break", size: "135", visibility: "hidden"},
      
      {method: "input", model: "wfClientId", title: "客户代码", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfSalesOrderId", title: "销售订单号", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderTotalQty", title: "批次量", type: "number", size: 9, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "break", size: "135", visibility: "hidden"},

      {method: "input", model: "wfOrderSeries", title: "系列", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderRMId", title: "料号", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderSpec", title: "规格", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderDim", title: "尺寸", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "break", size: "135", visibility: "hidden"},

      {method: "input", model: "wfOrderFormNote", title: "流程卡备注", type: "textarea", size: 35, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderNote", title: "工单备注", type: "textarea", size: 35, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderBOMNote", title: "BOM备注", type: "textarea", size: 35, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "break", size: "135", visibility: "hidden"},

      {method: "label",process: {1: true, 2: true, 3: true, 4:true}},
      {title: "CAP: μF", method: "input", model: "wfSpecCap", type: "text", scan: false, size: 12, disabled:false, process: {1: true, 2: true, 3: true, 4:true}},
      {title: "DF: %", method: "input", model: "wfSpecDF", type: "text", scan: false, size: 12, disabled:false, process: {1: true, 2: true, 3: true, 4:true}},
      {title: "LC: μA", method: "input", model: "wfSpecLC", type: "text", scan: false, size: 12, disabled:false, process: {1: true, 2: true, 3: true, 4:true}},
      {title: "Z/ESR(Ω)", method: "input", model: "wfSpecZESR", type: "text", scan: false, size: 12, disabled:false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "input", model: "wfOrderSupNote", title: "异常记录", type: "textarea", size: 24, highlight: false, process: {1: false, 2: false, 3: false, 4:true}},

      // {title: "客户代码", method: "input", model: "wfClientId", type: "text", scan: false, size: 15},
      // {title: "销售订单号", method: "input", model: "wfSalesOrderId", type: "text", scan: false, size: 15},
      // {title: "台机号", method: "input", model: "wfOptMachineId", type: "text", scan: false, size: 9},

      // {model: "wfOrderQty", title: "总量(批次)", type: "text", highlight: false},

      // {method: "break", size: 10},

      // {method: "input", model: "wfOrderTotalGoodQty", title: "良品數總和", type: "number", size: 5, highlight: false},

    ];

    this.wfRMDetails = [
      {modelName: "wfRMUpBeltName", title: "上带", type: "text", modelSerial: 'wfRMUpBeltSerial', highlight: false},
      {modelName: "wfRMDownBeltName", title: "下带", type: "text", modelSerial: 'wfRMDownBeltSerial', highlight: false},
      {modelName: "wfRMBaseName", title: "底座", type: "text", modelSerial: 'wfRMBaseSerial', highlight: false},
      {modelName: "wfRMCircleName", title: "纸圆卡", type: "text", modelSerial: 'wfRMCricleSerial', highlight: false},
      {modelName: "wfRMPrintName", title: "油墨", type: "text", modelSerial: 'wfRMPrintSerial', highlight: false},
      {modelName: "wfRMPrintNameText", title: "", type: "text", modelSerial: 'wfRMPrintSerial', highlight: false},
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
      // {method: "input", model: "wfOptMachineId", title: "台机号", type: "text", size: 7, scan: false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      // {method: "break", title: ""},

      // {title: "客户代码", method: "input", model: "wfClientId", type: "text", scan: false, size: 15},
      // {title: "销售订单号", method: "input", model: "wfSalesOrderId", type: "text", scan: false, size: 15},
      // {title: "台机号", method: "input", model: "wfOptMachineId", type: "text", scan: false, size: 9},

      {method: 'inputs', options: [
         {title: "日期", model: "wfOptInputDate", type: "date", scan: false, size: 8, process: {1: true, 2: true, 3: true, 4: true}},
        // {title: "开始", model: "wfOptStartTime", type: "time", scan: false, size: 8},
        // {title: "完成", model: "wfOptFinishTime", type: "time", scan: false, size: 8}
      ], process: {1: true, 2: true, 3: true, 4:true}},


      {method: "inputs", options: [
        // {title: "日期", model: "wfOptInputDate", type: "date", scan: false, size: 8},
        {title: "不良数", model: "wfOptBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8, process: {1: true, 2: true, 3: false, 4:false}},
        {title: "良品数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8, process: {1: true, 2: true, 3: false, 4:false}},
        // {title: "抽查数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8, process: {1: false, 2: true, 3: false, 4:true}}
      ], process: {1: true, 2: true, 3: true, 4:true}},

      {title: "", method: "buttons", model: "wfQCCheck", process: {1: false, 2: false, 3: true, 4:false} ,buttons: [
        {label: "全检", value: 1, icon: 'done-all'},
        {label: "抽检", value: 2, icon: 'checkmark'}
      ]},
      {title: "抽检数量", method: "input", model: "wfRandomCheckInfo", type: "number", icon: 'construct', scan: 0, size: 6, process: {1: false, 2: false, 3: true, 4:false}},
      {title: "終检数量", method: "input", model: "wfFinalCheckInfo", type: "number", icon: 'construct', scan: 0, size: 6, process: {1: false, 2: false, 3: false, 4:true}},

      {title: "备注", method: "input", model: "wfSpecNote", type: "textarea", scan: false, size: 40, process: {1: true, 2: true, 3: true, 4:true}},
      // {title: "备注", method: "input", model: "wfSpecNote", type: "textarea", scan: false, size: 20},
    ];

    this.wfPplInputs = [
      {title: "作业員", method: "input", model: "wfStaffOptName", type: "text", icon: 'person', scan: 0, wfPplI: 1,size: 20, process: {1: true, 2: true, 3: true, 4:false}},
      // {title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, size: 5},
      {title: "技術員", method: "input", model: "wfStaffTechName", type: "text", icon: 'construct', scan: 0, size: 20, process: {1: true, 2: true, 3: true, 4:false}},
      // {title: "X-RAY确认", method: "input", model: "wfStaffXrayId", type: "text", icon: 'construct', scan: 3, size: 20},
      
      {title: "抽检", method: "buttons", model: "wfRandomCheckStatus", process: {1: false, 2: false, 3: false, 4:false},buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      
      {title: "电性", method: "buttons", model: "wfElecPass", process: {1: false, 2: false, 3: false, 4:true} ,buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      {method: "break", size: 15, process: {1: false, 2: false, 3: false, 4:true}},
      {title: "外观", method: "buttons", model: "wfLookPass", process: {1: false, 2: false, 3: false, 4:true},buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      {title: "终检", method: "buttons", model: "wfQCPass", icon: "md-checkmark-circle-outline", process: {1: true, 2: true, 3: false, 4:false} ,buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      {title: "品检員", method: "input", model: "wfStaffQCName", type: "text", icon: 'construct', scan: 3, size: 20, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "break", size: 15, process: {1: true, 2: true, 3: false, 4:true}},
      {method: "break", size: 15, process: {1: false, 2: false, 3: true, 4:true}},
      {title: "备注", method: "input", model: "wfQCInputNote", type: "textarea", scan: false, size: 40, process: {1: true, 2: true, 3: true, 4:true}},
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
          console.log("Got an error from formInit populating from storage: "  + err);

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
      alert("请输入不良品数!");
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

  keyPress(keycode: number) {
    if (keycode == 13) {
      alert('next');
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

  // takePhoto() {
  //   // alert("taking photos");
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

  setFormValue(model: string, value: any){

    let form = this.wfInputForm;

    form.controls[model].setValue(value);
  }
  */

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
      wfOptMachineId: [''],

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
      wfRMPrintNameText: [''],

      // Operational Input
      wfSpecCap: [''],
      wfSpecDF: [''],
      wfSpecLC: [''],
      wfSpecZESR: [''],
      wfSpecNote: [''],

      wfOptInputDate: [this.appDate],
      wfOptStartTime: ['00:00'],
      wfOptFinishTime: ['00:00'],
      wfOptBadQty: [''],
      wfOptGoodQty: [''],

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
      wfQCCheck: [''],
      wfRandomCheckInfo: [''],
      wfFinalCheckInfo: [''],
      wfElecPass: [''],
      wfLookPass: [''],
      wfQCPass: [''],
      wfQCSignOff: [''],
      wfQCInputNote: [''],

      //  Appendix
      wfFormStatus: [''],
      wfProcessStatus: [''],

    });

  }

}
