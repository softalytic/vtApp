import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { NgForm, FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { WorkflowService } from "../../services/wfServer";
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

  wfAgeingSeqDisplay: number;

  images = [];

  staffTable: any;
  machineTable: any;


  wfInputForm: FormGroup;

  pushPage: any;
  wfNavParams = this.navParams.data;

  wfPass: boolean;

  //testing storage for qc part
  wfStaffTechIdTmp: any;
  wfStaffOptShiftTmp: any;
  wfQCSignOffTmp: any;
  wfGoodTotalTmp: any;

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

      {method: "input", model: "wfFormId", title: "流程卡号", type: "text", size: 10, disabled: false, highlight: false},      
      {method: "input", model: "wfOrderId", title: "工单号", type: "text", size: 10, disabled: false, highlight: false},
      {method: "input", model: "wfOptMachineId", title: "机台号", type: "text", size: 10, disabled: false, highlight: false},
      {method: "input", model: "wfOrderBatchId", title: "批次号", type: "text", size: 10, disabled: false, highlight: false},

      {method: "break", size: "88", visibility: "hidden"},
      
      // {method: "input", model: "wfSalesOrderId", title: "销售订单号", type: "text", size: 15, disabled:true, highlight: false},
      {method: "input", model: "wfClientId", title: "客户別", type: "text", size: 8, disabled:true, highlight: false},
      {method: "input", model: "wfOrderDate", title: "开单日期", type: "text", size: 10, disabled:true, highlight: false},
      {method: "input", model: "wfOrderBatchQty", title: "批次量", type: "text", size: 5, disabled: false, highlight: false},

      {method: "break", size: "88", visibility: "hidden"},

      {method: "input", model: "wfSalesOrderQty", title: "订单量", type: "text", size: 8, disabled:true, highlight: false},
      {method: "input", model: "wfOrderStartDate", title: "开工日期", type: "text", size: 10, disabled:true, highlight: false},
      {method: "input", model: "wfOrderTotalQty", title: "总批数", type: "number", size: 8, highlight: false},

      {method: "break", size: "88", visibility: "hidden"},

      {method: "input", model: "wfOrderDeliveryDate", title: "交期", type: "text", size: 10, disabled:true, highlight: false},
      {method: "input", model: "wfOrderEstFinishDate", title: "完工日期", type: "text", size: 10, disabled:true, highlight: false},
      {method: "input", model: "wfGoodTotal", title: "良品数总和", type: "number", size: 8, highlight: false},

      {method: "break", size: "88", visibility: "hidden"},
      
      {method: "input", model: "wfOrderSeries", title: "系列", type: "text", size: 10, disabled: true, highlight: false},
      {method: "input", model: "wfOrderRMId", title: "料号", type: "text", size: 10, disabled: true, highlight: false},
      {method: "input", model: "wfOrderSpec", title: "规格", type: "text", size: 8, disabled: true, highlight: false},
      {method: "input", model: "wfOrderDim", title: "尺寸", type: "text", size: 8, disabled: true, highlight: false},

      {method: "break", size: "88", visibility: "hidden"},
      
      // Note
      {method: "input", model: "wfSalesOrderNote", title: "订单记录说明", type: "textarea", size: 25, highlight: false},
      {method: "input", model: "wfOrderNote", title: "工单备注", type: "textarea", size: 25, highlight: false},
      {method: "input", model: "wfOrderBOMNote", title: "BOM备注", type: "textarea", size: 25, highlight: false},
      

    ];

    this.wfRMDetails = [
      {modelName: "wfRMFoilPosName", title: "正箔", type: "text", modelSerial: 'wfRMFoilPosSerial', highlight: false},
      {modelName: "wfRMFoilPosCapFrom", title: "Cap", type: "text", modelSerial: 'wfRMFoilPosCapTo', highlight: false},
      {modelName: "wfRMFoilPosWidth", title: "寛长", type: "number", modelSerial: 'wfRMFoilPosLength', highlight: false},
      {modelName: "wfRMFoilPosQty", title: "数量", type: "number",  highlight: false},
      // {modelName: "wfRMFoilPosLName", title: "L", type: "text", modelSerial: 'wfRMFoilPosLSerial', highlight: false},
      {modelName: "wfRMFoilNegName", title: "負箔", type: "text", modelSerial: 'wfRMFoilNegSerial', highlight: false},
      {modelName: "wfRMFoilNegCapFrom", title: "Cap", type: "text", modelSerial: 'wfRMFoilNegCapTo', highlight: false},
      {modelName: "wfRMFoilNegWidth", title: "寛长", type: "number", modelSerial: 'wfRMFoilNegLength', highlight: false},
      {modelName: "wfRMFoilNegQty", title: "数量", type: "number", highlight: false},
      // {modelName: "wfRMFoilNegLName", title: "L", type: "text", modelSerial: 'wfRMFoilNegLSerial', highlight: false},
      {modelName: "wfRMPaperName", title: "电解纸", type: "text", modelSerial: 'wfRMPaperSerial', highlight: false},
      {modelName: "wfRMPaperQty", title: "数量", type: "number", highlight: false},
      {modelName: "wfRMGlueName", title: "胶水/带", type: "text", modelSerial: 'wfRMGlueSerial', highlight: false},
      {modelName: "wfRMSolName", title: "电解液", type: "text", modelSerial: 'wfRMSolSerial', highlight: false},
      {modelName: "wfRMSolQty", title: "数量", type: "number", highlight: false},
      {modelName: "wfRMPinPosName", title: "正导针", type: "text", modelSerial: 'wfRMPinPosSerial', highlight: false},
      {modelName: "wfRMPinNegName", title: "负导针", type: "text", modelSerial: 'wfRMPinNegSerial', highlight: false},
      {modelName: "wfRMPinPosQty", title: "数量", type: "number", highlight: false},
      // {modelName: "wfRMPinAmtName", title: "导针数量", type: "text", modelSerial: 'wfRMPinAmtSerial', highlight: false},
      {modelName: "wfRMPlasticName", title: "胶粒", type: "text", modelSerial: 'wfRMPlasticSerial', highlight: false},
      {modelName: "wfRMPlasticQty", title: "数量", type: "number", highlight: false},
      {modelName: "wfRMShellName", title: "铝壳", type: "text", modelSerial: 'wfRMShellSerial', highlight: false},
      {modelName: "wfRMShellQty", title: "数量", type: "number", highlight: false},
      {modelName: "wfRMCoverName", title: "套管", type: "text", modelSerial: 'wfRMCoverSerial', highlight: false},
      {modelName: "wfRMCoverQty", title: "数量", type: "number", highlight: false},
      {modelName: "wfRMCoverCheck", title: "周期", type: "text",highlight: false},
    ];

    this.wfAgeDetailInputs = [
      {method: 'inputs', options: [
        {title: "AG1", model: "wfAgeDetailAG1", type: "text", scan: false, size: 4},
        {title: "LC-T", model: "wfAgeDetailLCT", type: "text", scan: false, size: 4},
      ]},
      {method: 'inputs', options: [
        {title: "AG2", model: "wfAgeDetailAG2", type: "text", scan: false, size: 4},
        {title: "LC", model: "wfAgeDetailLC", type: "text", scan: false, size: 4},
      ]},
      {method: 'inputs', options: [
        {title: "AG3", model: "wfAgeDetailAG3", type: "text", scan: false, size: 4},
        {title: "CAP", model: "wfAgeDetailCAP", type: "text", scan: false, size: 4},
      ]},
      {method: 'inputs', options: [
        {title: "AG4", model: "wfAgeDetailAG4", type: "text", scan: false, size: 4},
        {title: "DF", model: "wfAgeDetailDF", type: "text", scan: false, size: 4},
      ]},
      {method: 'inputs', options: [
        {title: "AG5", model: "wfAgeDetailAG5", type: "text", scan: false, size: 4},
        {title: "审核員", model: "wfAgeDetailStaffConfirm", type: "text", scan: false, size: 4}
      ]},
      {method: 'inputs', options: [
        {title: "AG6", model: "wfAgeDetailAG6", type: "text", scan: false, size: 4},
      ]}
  ];

    this.wfOpsInputs = [
      {title: "", method: "buttons", inputType: 9, model: "wfQCCheck", buttons: [
        {label: "全检", value: 1, icon: 'done-all'},
        {label: "抽检", value: 2, icon: 'checkmark'},
      ]},
      {title: "抽检数量", method: "input", model: "wfRandomCheckInfo", type: "number", icon: 'construct', scan: 0, size: 6},
      
      {title: "备注", method: "input", model: "wfSpecNote", type: "textarea", scan: false, size: 40},

      {method: 'inputs', options: [
        {title: "开始日期", model: "wfOptInputDate", type: "date", icon: "calender", scan: false, size: 8},        
        {title: "开始时间", model: "wfOptStartTime", type: "number", icon: "text", scan: false, size: 8},
        {title: "完成时间", model: "wfOptFinishTime", type: "number", icon: "md-alarm", scan: false, size: 8},
        
      ]},

      {method: 'inputs', options: [
        {title: "清机确认", model: "wfOptWashMachine", type: "text", inputType: 1, scan: false, size: 8}, 
        // {title: "总投入数", method: "input", model: "wfOptStartQty", type: "number", icon: 'ios-sad', inputType: 1, scan: false, size: 6},
        {title: "良品數", method: "input", model: "wfOptGoodQty", type: "number", icon: 'ios-sad', inputType: 1, scan: false, size: 6},
        {title: "抽检数量", model: "wfRandomCheckInfo", type: "number", icon: 'construct', inputType: 9, scan: false, size: 8},
      ]},

      {method: 'inputs', options: [
        {title: "烘干温度 ℃", model: "wfDryWindingDeg", type: "number", icon: 'md-remove-circle', inputType: 2, scan: false, size: 8}, 

        {title: "真空度", model: "wfWetEmptyAir", type: "text", inputType: 3, scan: false, size: 8},  
        {title: "气压值", model: "wfWetAir", type: "text", inputType: 3, scan: false, size: 8},     
        
        {title: "批序温度 ℃", model: "wfWashWindingDeg", type: "number", icon: 'md-remove-circle', inputType: 5, scan: false, size: 8},
        {title: "烘干温度 ℃", model: "wfWashDryWindingDeg", type: "number", icon: 'md-remove-circle', inputType: 5, scan: false, size: 8},
        {title: "烘干时间", model: "wfWashDryTime", type: "text", icon: "time", inputType: 5, scan: false, size: 8},

      ]},
      
      {method: 'inputs', options: [
        {title: "备注", model: "wfSpecNote", type: "textarea", inputType: 9, size: 40},
      ]},

      {method: "table", size: 8, headers: [{title: "不良数种类"},{title: "数量"}],rows: [
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

    this.wfAgeingSeqDisplay = 0;
    
    this.wfPplInputs = [
      // {title: "作业員ID", method: "input", model: "wfStaffOptId", type: "text", icon: 'person', scan: true, wfPplI: 1, size: 7},
      {title: "作业员", method: "input", model: "wfStaffOptName", type: "text", icon: 'person', scan: true, wfPplI: 1, size: 7},
      {title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, wfPplI: 2, size: 4},
      {title: "技术员", method: "input", model: "wfStaffTechName", type: "text", icon: 'construct', scan: true, wfPplI: 6, size: 7},
      {title: "班长确认", method: "input", model: "wfStaffLeadName", type: "text", icon: 'construct', scan: true, wfPplI: 3, size: 7},
      // {title: "維修员", method: "input", model: "wfStaffTechName", type: "text", icon: 'construct', scan: true, wfPplI: 4, size: 7},
      {title: "终检", method: "buttons", model: "wfQCPass", icon: "md-checkmark-circle-outline",buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      {title: "品检员", method: "input", model: "wfStaffQCName", type: "text", icon: 'search', scan: true, wfPplI: 5, size: 7},
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
        console.log("New process is triggered");
        form.controls['wfGoodTotal'].setValue(0);
        form.controls['wfBadTotal'].setValue(0);
        if( this.wfSvc.toInt(storageData['wfGoodTotal']) == 0){
          form.controls['wfOptStartQty'].setValue(storageData['wfOptStartQty']);
        } else {
          form.controls['wfOptStartQty'].setValue(storageData['wfGoodTotal']);
        }

        form.controls['wfProcessNew'].setValue(false);
      } else {
        console.log("Continue next process");
        form.controls['wfGoodTotal'].setValue(storageData['wfGoodTotal']);
        form.controls['wfBadTotal'].setValue(storageData['wfBadTotal']);
        form.controls['wfOptStartQty'].setValue(storageData['wfOptStartQty']);
      }

      for (let key in storageData) {
        // console.log("Loading " + key + " Storage: " + storageData[key]);
        if(key in form.controls){
          // console.log("Loading " + key + " in Form: " + storageData[key]);
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

              case 'wfRandomCheckInfo':
              case 'wfOptWashMachine':
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
              // console.log()
            }



          } catch (err) {
            // console.log("Got an error from formInit populating from storage: "  + err);

          }
        }
      }

      //  initial the form for the bad Qty
      if (form.value.wfProcess == "7" || form.value.wfProcess == "8") {

        form.controls['wfBadItem1'].setValue('开路');
        form.controls['wfBadItem2'].setValue('短路');
        form.controls['wfBadItem3'].setValue('高容');
        form.controls['wfBadItem4'].setValue('低容');
        form.controls['wfBadItem5'].setValue('损耗');
        form.controls['wfBadItem6'].setValue('漏电');
        form.controls['wfBadItemTotal'].setValue('不良数总和');

      }
    }

    console.log("Populated form now is: " + JSON.stringify(this.wfInputForm.value));

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
          wfGoodTotal: this.wfGoodTotalTmp, wfStaffTechId: dataMachineXTmp[machineId]['techName'], wfStaffXrayId: dataMachineXTmp[machineId]['xrayName'],});
          
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
    

    this.wfGoodTotalTmp = parseFloat(this.wfInputForm.value.wfGoodTotal)  + parseFloat(this.wfInputForm.value.wfOptGoodQty);
    
    //alert(StaffArr.wfStaffTechId + ' staff 2: ' + StaffArr.wfStaffOptShift  + ' staff 3: ' + StaffArr.wfQCSignOff );
  }

  updateTotalGoodQty(wfOptGoodQtyValue: any) {
    var goodQtyTmp = this.wfNavParams.wfGoodTotal + wfOptGoodQtyValue;
    this.wfInputForm.patchValue({ wfGoodTotal: goodQtyTmp, });
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
