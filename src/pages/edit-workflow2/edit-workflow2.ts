import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { WorkflowService } from "../../services/wfServer";
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

  staffTable: any;
  machineTable: any;


  //testing storage for qc part
  wfStaffTechIdTmp: any;
  wfStaffOptShiftTmp: any;
  wfQCSignOffTmp: any;

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
      {method: "input", model: "wfFormId", title: "流程卡号", type: "text", size: 12, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderId", title: "工单号", type: "text", size: 12, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOptMachineId", title: "台机号", type: "text", size: 7, scan: false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderBatchId", title: "批次号", type: "text", size: 12, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "break", size: "135", visibility: "hidden"},
      {method: "input", model: "wfPriorWfFormId", title: "裸品卡号", type: "text", size: 12, scan: true, disabled: false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfClientId", title: "客户代码", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfSalesOrderId", title: "销售订单号", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderBatchQty", title: "批次量(千)", type: "number", size: 9, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "break", size: "135", visibility: "hidden"},
      {method: "input", model: "wfOrderSeries", title: "系列", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderRMId", title: "料号", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderSpec", title: "规格", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderDim", title: "尺寸", type: "text", size: 12, disabled:true, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "break", size: "135", visibility: "hidden"},

      {method: "input", model: "wfOrderFormNote", title: "流程卡备注", type: "textarea", size: 25, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderNote", title: "工单备注", type: "textarea", size: 25, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},
      {method: "input", model: "wfOrderBOMNote", title: "BOM备注", type: "textarea", size: 25, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "break", size: "135", visibility: "hidden"},
      {method: "input", model: "wfGoodTotal", title: "良品數總和", type: "number", size: 12, disabled:false, highlight: false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "label",process: {1: true, 2: true, 3: true, 4:true}},
      {title: "CAP: μF", method: "input", model: "wfSpecCap", type: "text", scan: false, size: 12, disabled:false, process: {1: true, 2: true, 3: true, 4:true}},
      {title: "DF: %", method: "input", model: "wfSpecDF", type: "text", scan: false, size: 12, disabled:false, process: {1: true, 2: true, 3: true, 4:true}},
      {title: "LC: μA", method: "input", model: "wfSpecLC", type: "text", scan: false, size: 12, disabled:false, process: {1: true, 2: true, 3: true, 4:true}},
      {title: "Z/ESR(Ω)", method: "input", model: "wfSpecZESR", type: "text", scan: false, size: 12, disabled:false, process: {1: true, 2: true, 3: true, 4:true}},

      {method: "input", model: "wfOrderSupNote", title: "异常记录", type: "textarea", size: 24, highlight: false, process: {1: false, 2: false, 3: false, 4:true}},


    ];

    this.wfRMDetails = [

      {modelName: "wfNakedProductSpec", title: "裸品规格", type: "text", modelSerial: 'wfNakedProductSerial', highlight: false},
      {modelName: "wfRMUpBeltName", title: "上带", type: "text", modelSerial: 'wfRMUpBeltSerial', highlight: false},
      {modelName: "wfRMDownBeltName", title: "下带", type: "text", modelSerial: 'wfRMDownBeltSerial', highlight: false},
      {modelName: "wfRMBaseName", title: "底座", type: "text", modelSerial: 'wfRMBaseSerial', highlight: false},
      {modelName: "wfRMCircleName", title: "纸圆卡", type: "text", modelSerial: 'wfRMCricleSerial', highlight: false},
      {modelName: "wfRMPrintName", title: "油墨", type: "text", modelSerial: 'wfRMPrintSerial', highlight: false},
    ];
    
    this.wfOpsInputs = [

      {method: 'inputs', options: [
         {title: "日期", model: "wfOptInputDate", type: "date", scan: false, size: 8, process: {1: true, 2: true, 3: true, 4: true}},
      ], process: {1: true, 2: true, 3: true, 4:true}},


      {title: "", method: "buttons", model: "wfQCCheck", process: {1: false, 2: false, 3: true, 4:false} ,buttons: [
        {label: "全检", value: 1, icon: 'done-all'},
        {label: "抽检", value: 2, icon: 'checkmark'}
      ]},

      {title: "抽检数量", method: "input", model: "wfRandomCheckInfo", type: "number", icon: 'construct', scan: 0, size: 6, process: {1: false, 2: false, 3: true, 4:false}},
      {title: "終检数量", method: "input", model: "wfFinalCheckInfo", type: "number", icon: 'construct', scan: 0, size: 6, process: {1: false, 2: false, 3: false, 4:true}},

      {method: "inputs", options: [
        {title: "总投入数", model: "wfOptStartQty", type: "number", icon: 'ios-sad', scan: false, size: 8, process: {1: true, 2: true, 3:true, 4:true}},
        {title: "不良数", model: "wfOptBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8, process: {1: true, 2: true, 3:true, 4:true}},
        {title: "良品数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8, process: {1: true, 2:true, 3:true, 4:true}},
      ], process: {1: true, 2: true, 3: true, 4:true}},


      {title: "备注", method: "input", model: "wfSpecNote", type: "textarea", scan: false, size: 40, process: {1: true, 2: true, 3: true, 4:true}},
    ];

    this.wfPplInputs = [
      // {title: "作业員ID", method: "input", model: "wfStaffOptId", type: "text", icon: 'person', scan: 3, wfPplI: 1,size: 20, process: {1: true, 2: true, 3: true, 4:false}},
      {title: "作业員", method: "input", model: "wfStaffOptName", type: "text", icon: 'person', scan: 1,size: 20, process: {1: true, 2: true, 3: true, 4:false}},
      {title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, size: 5, process: {1: true, 2: true, 3: true, 4:false}},
      {title: "技術員", method: "input", model: "wfStaffTechName", type: "text", icon: 'construct', scan: 1, size: 20, process: {1: true, 2: true, 3: true, 4:false}},
      // {title: "X-RAY确认", method: "input", model: "wfStaffXrayId", type: "text", icon: 'construct', scan: 3, size: 20},

      // Backup code
      // {title: "抽检", method: "buttons", model: "wfRandomCheckStatus", process: {1: false, 2: false, 3: false, 4:false},buttons: [
      //   {label: "通过", value: 1, icon: 'checkmark'},
      //   {label: "失败", value: 2, icon: 'close'}
      // ]},
      
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
      // {method: "break", size: 15, process: {1: false, 2: false, 3: true, 4:true}},
      {title: "备注", method: "input", model: "wfQCInputNote", type: "textarea", scan: false, size: 30, process: {1: true, 2: true, 3: true, 4:true}},
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
    console.log("The Nav Params bought to this page is " + this.wfNavParams);

    this.formInit();
    let form = this.wfInputForm;

    console.log("loading staff data");
    this.storage.get("staffDate").then((storageData) => {
      console.log("staffDate from storage is " + JSON.stringify(storageData));

      this.wfSvc.sendStaffDate2Server().subscribe((data) => {
        console.log("Staff date from Server " + data['dttm']);
        console.log("Staff date from storage" + storageData);
        console.log("Need to update the staff table? " + data['dttm'] === storageData);

        if(data === storageData || data == "" || data == null || typeof data == 'undefined' ){
          this.storage.get("staffTable").then((storageData) => {
            // console.log("staffTable from storage is " + JSON.stringify(storageData));
            this.staffTable = storageData;
            // console.log(this.staffTable);

          });

          this.storage.get("machineTable").then((storageData) => {
            // console.log("machineTable from storage is " + JSON.stringify(storageData));
            this.machineTable = storageData;
            // console.log(this.machineTable);

          });

        } else {
          this.wfSvc.pullStaffDataFromServer().subscribe((data) => {
            let staffDate = data.dttm;
            let staff = JSON.parse(data.staff);
            let machine = JSON.parse(data.machine);

            console.log("staffDate is " + staffDate);
            // console.log("staffTable is " + JSON.stringify(staffTable));
            // console.log("machineTable is " + JSON.stringify(machineTable));

            this.storage.set("staffDate", staffDate);
            this.storage.set("staffTable",staff);
            this.storage.set("machineTable",machine);

            this.staffTable = staff;
            this.machineTable = machine;

          }, error => {
            console.log("staffData" + error);
            // this.networkError(navCtrl);
          });

        }
      }, error => {
        console.log("staffDate" + error);
        // this.networkError(navCtrl);
        this.storage.get("staffTable").then((storageData) => {
          // console.log("staffTable from storage is " + JSON.stringify(storageData));
          this.staffTable = storageData;
          // console.log(this.staffTable);

        });

        this.storage.get("machineTable").then((storageData) => {
          // console.log("machineTable from storage is " + JSON.stringify(storageData));
          this.machineTable = storageData;
          // console.log(this.machineTable);

        });

      });
    });

    console.log("loading form data from storage");
    this.populateNavParam();

  }

  populateNavParam(){
    console.log("navParams Data:" + JSON.stringify(this.navParams));

    let storageData = this.navParams.data;
    let form = this.wfInputForm;

    if (storageData['wfReadOnly']) {
      for (let key in form.controls) {
        // console.log("Loading " + key + " Storage:" + storageData[key]);
        form.controls[key].setValue(storageData[key]);
      }

      this.wfSvc.pullImage(form).subscribe((imgs) => {
        console.log("Pulling images for review");
        // console.log("images");
        if (imgs != "" && imgs != null && typeof imgs != 'undefined'){
          this.images = imgs[0].wfImg;
        }
        // console.log(this.images);

      }, error => {
        console.log("pullImages: Has error" + error);
      })

    } else {
      // Preload the data for form
      if (storageData['wfProcessNew']) {
        form.controls['wfGoodTotal'].setValue(0);
        form.controls['wfBadTotal'].setValue(0);
        form.controls['wfOptStartQty'].setValue(storageData['wfGoodTotal']);
        form.controls['wfProcessNew'].setValue(false);
      } else {
        form.controls['wfGoodTotal'].setValue(storageData['wfGoodTotal']);
        form.controls['wfBadTotal'].setValue(storageData['wfBadTotal']);
        form.controls['wfOptStartQty'].setValue(storageData['wfOptStartQty']);
      }

      for (let key in form.value) {
        // console.log("Loading " + key + " Storage:" + storageData[key]);
        if(key in storageData){
          try {
            switch (key) {
              case 'wfStaffTechId':
                this.wfStaffTechIdTmp = storageData[key];
                form.controls[key].setValue('');
                break;

              case 'wfStaffOptShift':
                this.wfStaffOptShiftTmp = storageData[key];
                form.controls[key].setValue('');
                break;

              case 'wfQCSignOff':
                this.wfQCSignOffTmp = storageData[key];
                form.controls[key].setValue('');
                break;

              case 'wfOptInputDate':
                form.controls[key].setValue(this.appDate);
                break;

              case 'wfBadTotal':
                if (form.value.wfProcessStatus) {
                  form.controls[key].setValue(0);
                }
                break;

              case 'wfRandomCheckInfo':
              case 'wfQCCheck':
              case 'wfQCPass':
              case 'wfGoodTotal':
              case 'wfBadTotal':
              case 'wfOptStartQty':
              case 'wfProcessNew':
              case 'wfStaffOptId':
              case 'wfStaffOptName':
              case 'wfStaffOptShift':
              case 'wfStaffLeadName':
              case 'wfStaffLeadId':
              case 'wfStaffTechId':
              case 'wfStaffTechName':
              case 'wfStaffXrayId':
              case 'wfStaffXrayName':
              case 'wfStaffXrayName':
              case 'wfStaffQCId':
              case 'wfStaffQCName':
              case 'wfBadItem1':
              case 'wfBadQty1':
              case 'wfBadItem2':
              case 'wfBadQty2':
              case 'wfBadItem3':
              case 'wfBadQty3':
              case 'wfBadItem4':
              case 'wfBadQty4':
              case 'wfBadItem5':
              case 'wfBadQty5':
              case 'wfBadItem6':
              case 'wfBadQty6':
              case 'wfBadItemTotal':
                break;


              default:
                form.controls[key].setValue(storageData[key]);
            }

          } catch (err) {
            console.log("Got an error from formInit populating from storage: "  + err);

          }
        }

      }

      if (form.value.wfProcess == "4") {
        // Default to pass per user request
        form.controls['wfElecPass'].setValue(1);
        form.controls['wfLookPass'].setValue(1);

      }
    }

    console.log("Populated form now is: " + JSON.stringify(this.wfInputForm.value));

  }

  capInput(form: any, model: any){
    var str = form.controls[model].value;
    form.controls[model].setValue(str.toUpperCase());

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

  private formInit() {

    this.wfInputForm = this.formBuilder.group({
      wfProcess: [''],
      wfProcessName: [''],
      wfForm: [''],
      wfFormId: [''],
      wfFormSplit: [''],
      wfOptMachineId: [''],
      wfSpecCap: [''],
      wfSpecDF: [''],
      wfSpecLC: [''],
      wfSpecZESR: [''],
      wfAgeVoltSet: [''],
      wfPriorWfFormId: [''],
      wfNakedProductSpec: [''],
      wfOrderId: [''],
      wfOrderSeries: [''],
      wfOrderBatchId: [''],
      wfOrderRMId: [''],
      wfOrderSpec: [''],
      wfOrderDim: [''],
      wfOrderBatchQty: [''],
      wfOrderTotalQty: [''],
      wfSalesOrderQty: [''],
      wfClientId: [''],
      wfOrderFormNote: [''],
      wfOrderNote: [''],
      wfOrderBOMNote: [''],
      wfSalesOrderId: [''],
      wfOrderDate: [''],
      wfOrderStartDate: [''],
      wfOrderEstFinishDate: [''],
      wfOrderDeliveryDate: [''],
      wfOrderTK: [''],
      wfRMFoilPosName: [''],
      wfRMFoilPosLName: [''],
      wfRMFoilPosCapFrom: [''],
      wfRMFoilPosCapTo: [''],
      wfRMFoilPosWidth: [''],
      wfRMFoilPosLength: [''],
      wfRMFoilNegName: [''],
      wfRMFoilNegLName: [''],
      wfRMFoilNegCapFrom: [''],
      wfRMFoilNegCapTo: [''],
      wfRMFoilNegWidth: [''],
      wfRMFoilNegLength: [''],
      wfRMFoilNegQty: [''],
      wfRMPaperName: [''],
      wfRMPaperQty: [''],
      wfRMPinPosName: [''],
      wfRMPinNegName: [''],
      wfRMPinPosQty: [''],
      wfRMPinNegQty: [''],
      wfRMGlueName: [''],
      wfRMSolName: [''],
      wfRMSolQty: [''],
      wfRMShellName: [''],
      wfRMShellQty: [''],
      wfRMPlasticName: [''],
      wfRMPlasticQty: [''],
      wfRMCoverName: [''],
      wfRMCoverQty: [''],
      wfRMUpBeltName: [''],
      wfRMDownBeltName: [''],
      wfRMBaseName: [''],
      wfRMCircleName: [''],
      wfRMFoilPosSerial: [''],
      wfRMFoilNegSerial: [''],
      wfRMFoilPosLSerial: [''],
      wfRMFoilNegLSerial: [''],
      wfRMPaperSerial: [''],
      wfRMGlueSerial: [''],
      wfRMSolSerial: [''],
      wfRMPinPosSerial: [''],
      wfRMPinNegSerial: [''],
      wfRMPlasticSerial: [''],
      wfRMShellSerial: [''],
      wfRMCoverSerial: [''],
      wfRMFoilPosQty: [''],
      wfRMCoverCheck: [''],
      wfRMWindingTime: [''],
      wfRMWindingDeg: [''],
      wfDryWindingDeg: [''],
      wfWetEmptyAir: [''],
      wfWetAir: [''],
      wfWashWindingDeg: [''],
      wfWashDryWindingDeg: [''],
      wfWashDryTime: [''],
      wfQCCheck: [''],
      wfRandomCheckInfo: [''],
      wfSpecNote: [''],
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
      wfAgeDetailStaffConfirm: [''],
      wfOptInputDate: [this.appDate],
      wfOptInputEndDate: [this.appDate],
      wfOptWashMachine: [''],
      wfOptStartTime: [''],
      wfOptFinishTime: [''],
      wfOptBadQtyItem: [''],
      wfOptBadQty: [''],
      wfOptGoodQty: [''],
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
      wfBadItem6: [''],
      wfBadQty6: [''],
      wfBadItemTotal: [''],
      wfAgeDegSet: [''],
      wfAgeDegAct: [''],
      wfAgeVoltAct: [''],
      wfAgeCurrentSet: [''],
      wfAgeCurrentAct: [''],
      wfAgeTimeSet: [''],
      wfAgeTimeAct: [''],
      wfAgeNote: [''],
      wfAutoAgeVoltAct1: [''],
      wfAutoAgeVoltAct2: [''],
      wfAutoAgeVoltAct3: [''],
      wfAutoAgeVoltAct4: [''],
      wfStaffOptId: [''],
      wfStaffOptName: [''],
      wfStaffOptShift: [''],
      wfStaffLeadName: [''],
      wfStaffLeadId: [''],
      wfStaffTechId: [''],
      wfStaffTechName: [''],
      wfStaffXrayId: [''],
      wfStaffXrayName: [''],
      wfStaffQCId: [''],
      wfStaffQCName: [''],
      wfQCPass: [''],
      wfQCSignOff: [''],
      wfQCInputNote: [''],
      wfOrderSupNote: [''],
      wfNakedProductSerial: [''],
      wfRMUpBeltSerial: [''],
      wfRMDownBeltSerial: [''],
      wfRMBaseSerial: [''],
      wfRMCricleSerial: [''],
      wfRMPrintName: [''],
      wfRMPrintSerial: [''],
      wfFinalCheckInfo: [''],
      wfElecPass: [''],
      wfLookPass: [''],
      wfOptStartQty: [''],
      wfBadTotal: [''],
      wfGoodTotal: [''],
      wfFormStatus: [''],
      wfProcessStatus: [''],
      created: [''],
      appUpload: [''],
      wfFormExcept: [''],
      wfReadOnly: [''],
      wfProcessNew: [''],
      wfLastCompletedWf: [''],
      wfErrorMsg: ['']
    });

  }

}
