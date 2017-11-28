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

  wfAgeingSeqDisplay: number;

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
      {method: "input", model: "wfOrderTotalGoodQty", title: "良品數總和", type: "number", size: 8, highlight: false},

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

    /*
    this.wfDryDetails = [
      {method: "table", size: 8, headers: [{title: "烘干"}],rows: [
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
        {title: "烘干温度 ℃", cols: [
          {model: "wfWashDryWindingDeg", type: "number", disabled: false},
        ]},
        {title: "烘干时间", cols: [
          {model: "wfWashDryTime", type: "time", disabled: false},
        ]},
        {title: "作业者", cols: [
          {model: "wfStaffWashName", type: "text", disabled: false},
        ]}
      ]}

    ];

    */
/*
    this.wfDryInputs = [
      {method: "inputs", options: [
        {title: "迄时间", model: "wfDryStartTime", type: "time", icon: "time", scan: false, size: 8},
        {title: "止时间", model: "wfDryFinishTime", type: "text", icon: "time", scan: false, size: 8},
      ]},
      {method: 'inputs', options: [
        {title: "温度 ℃", model: "wfDryWindingDeg", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
        {title: "作业員", model: "wfStaffDryName", type: "text", icon: 'person', scan: false, size: 8}
      ]},
    ];
  
    this.wfWetInputs = [    
    {method: "inputs", options: [
      {title: "迄时间", model: "wfWetStartTime", type: "time", icon: "time", scan: false, size: 8},
      {title: "止时间", model: "wfWetFinishTime", type: "time", icon: "time", scan: false, size: 8},
      {title: "作业員", model: "wfStaffWetName", type: "text", icon: 'person', scan: false, size: 8}
    ]},
    {method: 'inputs', options: [
      {title: "真空度", model: "wfWetEmptyAir", type: "text", scan: false, size: 8},
      {title: "气压值", model: "wfWetAir", type: "text", scan: false, size: 8}
    ]},
  ];
  
    this.wfWashInputs = [

    {method: 'inputs', options: [
      {title: "批序/温度 ℃", model: "wfWashWindingDeg", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
      {title: "清冼迄时间", model: "wfWashStartTime", type: "time", icon: "time", scan: false, size: 8},
      {title: "清冼止时间", model: "wfWashFinishTime", type: "time", icon: "time", scan: false, size: 8}
    ]},
    {method: "inputs", options: [
      {title: "烘干温度 ℃", model: "wfWashDryWindingDeg", type: "number", icon: 'md-remove-circle', scan: false, size: 8},
      {title: "烘干时间", model: "wfWashDryTime", type: "time", icon: "time", scan: false, size: 8},
      {title: "作业員", model: "wfStaffWashName", type: "text", icon: 'person', scan: false, size: 8}
    ]},
  ];
*/
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
      ]},
      /*
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
    */
  ];

    this.wfOpsInputs = [
      // {title: "分單", method: "input", model: "wfFormSplit", type: "text", icon: 'ios-copy-outline', inputType: 1, scan: false, size: 5, wfOpslI: 2},
      //{method: "break", title: ""},
      /*
      {method: "inputs2", header: "素子烘烤", options: [
        {title: "时间 H", model: "wfRMWindingTime", type: "number", icon: 'ios-add-circle-outline', inputType: 1, scan: false, size: 8},
        {title: "温度 ℃", model: "wfRMWindingDeg", type: "number", icon: 'md-remove-circle', inputType: 1, scan: false, size: 8}
      ]},
      */
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
        //{title: "完成日期", model: "wfOptInputEndDate", type: "date", icon: "calender", scan: false, size: 8},        
        //{title: "完成时间", model: "wfOptFinishTime", type: "text", icon: "md-alarm", scan: false, size: 8},
        {title: "清机确认", model: "wfOptWashMachine", type: "text", inputType: 1, scan: false, size: 8}, 
        {title: "投入数", method: "input", model: "wfOptStartQty", type: "number", icon: 'ios-sad', inputType: 1, scan: false, size: 6},
        {title: "良品數", method: "input", model: "wfGoodTotal", type: "number", icon: 'ios-sad', inputType: 1, scan: false, size: 6},
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
      /*
      {method: "inputs", options: [
        
        //{title: "不良数(项目)", model: "wfOptBadQtyItem", type: "text", icon: 'ios-sad', scan: false, size: 8},
        //{title: "不良数", model: "wfOptBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8},
        //{title: "良品数", model: "wfOptGoodQty", type: "number", icon: 'happy', scan: false, size: 8}
        
      ]},
      */
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
        
        /*
        {title: "", cols: [
          {model: "wfBadItemTotal", type: "text", size:"7", disabled: false, wftotal: "t", title: "不良数總和"},
          {model: "wfOptBadQty", type: "number", size:"6",  disabled: false},
        ]},
        
        {title: "不良數總和", cols: [
          {model: "wfBadTotal", type: "text", disabled: true},
          {model: "wfBadTotal", type: "number", disabled: false},
        ]},        
        {title: "良品數", cols: [
          {model: "wfGoodTotal", type: "text", disabled: true},
          {model: "wfGoodTotal", type: "number", disabled: false},
        ]},
        // {title: "不良數", model: "wfBadQty", type: "number", icon: 'ios-sad', scan: false, size: 8},
        // {title: "良品數", model: "wfGoodQty", type: "number", icon: 'happy', scan: false, size: 8}
        */
      ]}
    ];

    /*
    this.wfAgeingDetails = [
      [
        {title: "机台号", method: "input", size: 6, model: "wfAge1MachineId", type: "text"},
        {title: "作业員", method: "input", size: 6, model: "wfAge1StaffId", type: "text"},
        {title: "清机/面板設定確認", method: "input", size: 6, model: "wfAge1MachineClear", type: "text"},
        {title: "老化時間", method: "input", size: 6, model: "wfAge1Time", type: "text"},
        {title: "老化温度", method: "input", size: 6, model: "wfAge1Temp", type: "text"},
        {title: "充电电压", method: "table", size: 6, data:[
          {label: "AG1", model:"wfAge1AG1",type:"number", size: 4},
          {label: "AG2", model:"wfAge1AG2",type:"number", size: 4},
          {label: "AG3", model:"wfAge1AG3",type:"number", size: 4},
          {label: "AG4", model:"wfAge1AG4",type:"number", size: 4},
          {label: "AG5", model:"wfAge1AG5",type:"number", size: 4},
          {label: "AG6", model:"wfAge1AG6",type:"number", size: 4},
          {label: "AG7", model:"wfAge1AG7",type:"number", size: 4},
          {label: "AG8", model:"wfAge1AG8",type:"number", size: 4},
          {label: "AG9", model:"wfAge1AG9",type:"number", size: 4},
          {label: "AG10", model:"wfAge1AG10",type:"number", size: 4},
          {label: "AG11", model:"wfAge1AG11",type:"number", size: 4},
          {label: "AG12", model:"wfAge1AG12",type:"number", size: 4},
        ]},
        {title: "LC測試电压 V", method: "input", size: 6, model: "wfAge1LC", type: "number"},
        {title: "測試頻率 Hz", method: "input", size: 6, model: "wfAge1Feq", type: "number"},
        {title: "Cap上限 uF", method: "input", size: 6, model: "wfAge1CapU", type: "number"},
        {title: "Cap下限 uF", method: "input", size: 6, model: "wfAge1CapD", type: "number"},
        {title: "DF上限 %", method: "input", size: 6, model: "wfAge1DFU", type: "number"},
        {title: "LC上限 uA", method: "input", size: 6, model: "wfAge1LCU", type: "number"},
        {title: "作业开始時間", method: "input", size: 6, model: "wfAge1Start", type: "text"},
        {title: "作业結束時間", method: "input", size: 6, model: "wfAge1End", type: "text"},
        {title: "投入数", method: "input", size: 6, model: "wfAge1DeployQty", type: "number"},
        {title: "良品数", method: "input", size: 6, model: "wfAge1GoodQty", type: "number"},
        {title: "Insert/Open", method: "input", size: 6, model: "wfAge1OptInsertOpen", type: "number"},
        {title: "Short", method: "input", size: 6, model: "wfAge1OptShort", type: "number"},
        {title: "Mark", method: "input", size: 6, model: "wfAge1OptMark", type: "number"},
        {title: "Cx", method: "input", size: 6, model: "wfAge1OptCx", type: "number"},
        {title: "Dx", method: "input", size: 6, model: "wfAge1OptDx", type: "number"},
        {title: "LC-NG(大LC)", method: "input", size: 6, model: "wfAge1OptLCBig", type: "number"},
        {title: "Recheck(小LC)", method: "input", size: 6, model: "wfAge1OptLCSmall", type: "number"},
        {title: "良品/不良品確認", method: "input", size: 6, model: "wfAge1OptQC", type: "number"},

        {title: "Insert/Open", method: "input", size: 6, model: "wfAge1DisInsertOpen", type: "text"},
        {title: "Short", method: "input", size: 6, model: "wfAge1DisShort", type: "text"},
        {title: "Mark", method: "input", size: 6, model: "wfAge1DistMark", type: "text"},
        {title: "Cx", method: "input", size: 6, model: "wfAge1DistCx", type: "text"},
        {title: "Dx", method: "input", size: 6, model: "wfAge1DistDx", type: "text"},
        {title: "LC-NG(大LC)", method: "input", size: 6, model: "wfAge1DisLCBig", type: "text"},
        {title: "Recheck(小LC)", method: "input", size: 6, model: "wfAge1DisLCSmall", type: "text"},
        {title: "判定", method: "input", size: 6, model: "wfAge1DisQC", type: "text"},
      ],
      [
        {title: "机台号", method: "input", size: 6, model: "wfAge2MachineId", type: "text"},
        {title: "作业員", method: "input", size: 6, model: "wfAge2StaffId", type: "text"},
        {title: "清机/面板設定確認", method: "input", size: 6, model: "wfAge2MachineClear", type: "text"},
        {title: "老化時間", method: "input", size: 6, model: "wfAge2Time", type: "text"},
        {title: "老化温度", method: "input", size: 6, model: "wfAge2Temp", type: "number"},
        {title: "充电电压", method: "table", size: 6, data:[
          {label: "AG1", model:"wfAge2AG1",type:"number"},
          {label: "AG2", model:"wfAge2AG2",type:"number"},
          {label: "AG3", model:"wfAge2AG3",type:"number"},
          {label: "AG4", model:"wfAge2AG4",type:"number"},
          {label: "AG5", model:"wfAge2AG5",type:"number"},
          {label: "AG6", model:"wfAge2AG6",type:"number"},
          {label: "AG7", model:"wfAge2AG7",type:"number"},
          {label: "AG8", model:"wfAge2AG8",type:"number"},
        ]},
        {title: "LC測試电压 V", method: "input", size: 6, model: "wfAge2LC", type: "number"},
        {title: "測試頻率 Hz", method: "input", size: 6, model: "wfAge2Feq", type: "number"},
        {title: "Cap上限 uF", method: "input", size: 6, model: "wfAge2CapU", type: "number"},
        {title: "Cap下限 uF", method: "input", size: 6, model: "wfAge2CapD", type: "number"},
        {title: "DF上限 %", method: "input", size: 6, model: "wfAge2DFU", type: "number"},
        {title: "LC上限 uA", method: "input", size: 6, model: "wfAge2LCU", type: "number"},
        {title: "作业开始時間", method: "input", size: 6, model: "wfAge2Start", type: "text"},
        {title: "作业結束時間", method: "input", size: 6, model: "wfAge2End", type: "text"},
        {title: "投入数", method: "input", size: 6, model: "wfAge2DeployQty", type: "number"},
        {title: "良品数", method: "input", size: 6, model: "wfAge2GoodQty", type: "number"},
        {title: "Insert/Open", method: "input", size: 6, model: "wfAge2OptInsertOpen", type: "number"},
        {title: "Short", method: "input", size: 6, model: "wfAge2OptShort", type: "number"},
        {title: "Mark", method: "input", size: 6, model: "wfAge2OptMark", type: "number"},
        {title: "Cx", method: "input", size: 6, model: "wfAge2OptCx", type: "number"},
        {title: "Dx", method: "input", size: 6, model: "wfAge2OptDx", type: "number"},
        {title: "LC-NG(大LC)", method: "input", size: 6, model: "wfAge2OptLCBig", type: "number"},
        {title: "Recheck(小LC)", method: "input", size: 6, model: "wfAge2OptLCSmall", type: "number"},
        {title: "良品/不良品確認", method: "input", size: 6, model: "wfAge2OptQC", type: "number"},

        {title: "Insert/Open", method: "input", size: 6, model: "wfAge2DisInsertOpen", type: "text"},
        {title: "Short", method: "input", size: 6, model: "wfAge2DisShort", type: "text"},
        {title: "Mark", method: "input", size: 6, model: "wfAge2DistMark", type: "text"},
        {title: "Cx", method: "input", size: 6, model: "wfAge2DistCx", type: "text"},
        {title: "Dx", method: "input", size: 6, model: "wfAge2DistDx", type: "text"},
        {title: "LC-NG(大LC)", method: "input", size: 6, model: "wfAge2DisLCBig", type: "text"},
        {title: "Recheck(小LC)", method: "input", size: 6, model: "wfAge2DisLCSmall", type: "text"},
        {title: "判定", method: "input", size: 6, model: "wfAge2DisQC", type: "text"},
      ],
      [
        {title: "机台号", method: "input", size: 6, model: "wfAge3MachineId", type: "text"},
        {title: "作业員", method: "input", size: 6, model: "wfAge3StaffId", type: "text"},
        {title: "清机/面板設定確認", method: "input", size: 6, model: "wfAge3MachineClear", type: "text"},
        {title: "老化時間", method: "input", size: 6, model: "wfAge3Time", type: "text"},
        {title: "老化温度", method: "input", size: 6, model: "wfAge3Temp", type: "number"},
        {title: "充电电压", method: "table", size: 6, data:[
          {label: "AG1", model:"wfAge3AG1",type:"number"},
          {label: "AG2", model:"wfAge3AG2",type:"number"},
          {label: "AG3", model:"wfAge3AG3",type:"number"},
          {label: "AG4", model:"wfAge3AG4",type:"number"},
          {label: "AG5", model:"wfAge3AG5",type:"number"},
          {label: "AG6", model:"wfAge3AG6",type:"number"},
          {label: "AG7", model:"wfAge3AG7",type:"number"},
          {label: "AG8", model:"wfAge3AG8",type:"number"},
        ]},
        {title: "LC測試电压 V", method: "input", size: 6, model: "wfAge3LC", type: "number"},
        {title: "測試頻率 Hz", method: "input", size: 6, model: "wfAge3Feq", type: "number"},
        {title: "Cap上限 uF", method: "input", size: 6, model: "wfAge3CapU", type: "number"},
        {title: "Cap下限 uF", method: "input", size: 6, model: "wfAge3CapD", type: "number"},
        {title: "DF上限 %", method: "input", size: 6, model: "wfAge3DFU", type: "number"},
        {title: "LC上限 uA", method: "input", size: 6, model: "wfAge3LCU", type: "number"},
        {title: "作业开始時間", method: "input", size: 6, model: "wfAge3Start", type: "text"},
        {title: "作业結束時間", method: "input", size: 6, model: "wfAge3End", type: "text"},
        {title: "投入数", method: "input", size: 6, model: "wfAge3DeployQty", type: "number"},
        {title: "良品数", method: "input", size: 6, model: "wfAge3GoodQty", type: "number"},
        {title: "Insert/Open", method: "input", size: 6, model: "wfAge3OptInsertOpen", type: "number"},
        {title: "Short", method: "input", size: 6, model: "wfAge3OptShort", type: "number"},
        {title: "Mark", method: "input", size: 6, model: "wfAge3OptMark", type: "number"},
        {title: "Cx", method: "input", size: 6, model: "wfAge3OptCx", type: "number"},
        {title: "Dx", method: "input", size: 6, model: "wfAge3OptDx", type: "number"},
        {title: "LC-NG(大LC)", method: "input", size: 6, model: "wfAge3OptLCBig", type: "number"},
        {title: "Recheck(小LC)", method: "input", size: 6, model: "wfAge3OptLCSmall", type: "number"},
        {title: "良品/不良品確認", method: "input", size: 6, model: "wfAge3OptQC", type: "number"},

        {title: "Insert/Open", method: "input", size: 6, model: "wfAge3DisInsertOpen", type: "text"},
        {title: "Short", method: "input", size: 6, model: "wfAge3DisShort", type: "text"},
        {title: "Mark", method: "input", size: 6, model: "wfAge3DistMark", type: "text"},
        {title: "Cx", method: "input", size: 6, model: "wfAge3DistCx", type: "text"},
        {title: "Dx", method: "input", size: 6, model: "wfAge3DistDx", type: "text"},
        {title: "LC-NG(大LC)", method: "input", size: 6, model: "wfAge3DisLCBig", type: "text"},
        {title: "Recheck(小LC)", method: "input", size: 6, model: "wfAge3DisLCSmall", type: "text"},
        {title: "判定", method: "input", size: 6, model: "wfAge3DisQC", type: "text"},
      ],
      [
        {title: "机台号", method: "input", size: 6, model: "wfAge4MachineId", type: "text"},
        {title: "作业員", method: "input", size: 6, model: "wfAge4StaffId", type: "text"},
        {title: "清机/面板設定確認", method: "input", size: 6, model: "wfAge4MachineClear", type: "text"},
        {title: "老化時間", method: "input", size: 6, model: "wfAge4Time", type: "text"},
        {title: "老化温度", method: "input", size: 6, model: "wfAge4Temp", type: "number"},
        {title: "充电电压", method: "table", size: 6, data:[
          {label: "AG1", model:"wfAge4AG1",type:"number"},
          {label: "AG2", model:"wfAge4AG2",type:"number"},
          {label: "AG3", model:"wfAge4AG3",type:"number"},
          {label: "AG4", model:"wfAge4AG4",type:"number"},
          {label: "AG5", model:"wfAge4AG5",type:"number"},
          {label: "AG6", model:"wfAge4AG6",type:"number"},
          {label: "AG7", model:"wfAge4AG7",type:"number"},
          {label: "AG8", model:"wfAge4AG8",type:"number"},
        ]},
        {title: "LC測試电压 V", method: "input", size: 6, model: "wfAge4LC", type: "number"},
        {title: "測試頻率 Hz", method: "input", size: 6, model: "wfAge4Feq", type: "number"},
        {title: "Cap上限 uF", method: "input", size: 6, model: "wfAge4CapU", type: "number"},
        {title: "Cap下限 uF", method: "input", size: 6, model: "wfAge4CapD", type: "number"},
        {title: "DF上限 %", method: "input", size: 6, model: "wfAge4DFU", type: "number"},
        {title: "LC上限 uA", method: "input", size: 6, model: "wfAge4LCU", type: "number"},
        {title: "作业开始時間", method: "input", size: 6, model: "wfAge4Start", type: "text"},
        {title: "作业結束時間", method: "input", size: 6, model: "wfAge4End", type: "text"},
        {title: "投入数", method: "input", size: 6, model: "wfAge4DeployQty", type: "number"},
        {title: "良品数", method: "input", size: 6, model: "wfAge4GoodQty", type: "number"},
        {title: "Insert/Open", method: "input", size: 6, model: "wfAge4OptInsertOpen", type: "number"},
        {title: "Short", method: "input", size: 6, model: "wfAge4OptShort", type: "number"},
        {title: "Mark", method: "input", size: 6, model: "wfAge4OptMark", type: "number"},
        {title: "Cx", method: "input", size: 6, model: "wfAge4OptCx", type: "number"},
        {title: "Dx", method: "input", size: 6, model: "wfAge4OptDx", type: "number"},
        {title: "LC-NG(大LC)", method: "input", size: 6, model: "wfAge4OptLCBig", type: "number"},
        {title: "Recheck(小LC)", method: "input", size: 6, model: "wfAge4OptLCSmall", type: "number"},
        {title: "良品/不良品確認", method: "input", size: 6, model: "wfAge4OptQC", type: "number"},

        {title: "Insert/Open", method: "input", size: 6, model: "wfAge4DisInsertOpen", type: "text"},
        {title: "Short", method: "input", size: 6, model: "wfAge4DisShort", type: "text"},
        {title: "Mark", method: "input", size: 6, model: "wfAge4DistMark", type: "text"},
        {title: "Cx", method: "input", size: 6, model: "wfAge4DistCx", type: "text"},
        {title: "Dx", method: "input", size: 6, model: "wfAge4DistDx", type: "text"},
        {title: "LC-NG(大LC)", method: "input", size: 6, model: "wfAge4DisLCBig", type: "text"},
        {title: "Recheck(小LC)", method: "input", size: 6, model: "wfAge4DisLCSmall", type: "text"},
        {title: "判定", method: "input", size: 6, model: "wfAge4DisQC", type: "text"},
      ]
    ];
    */
    this.wfAgeingSeqDisplay = 0;
    
    this.wfPplInputs = [
      {title: "作业員ID", method: "input", model: "wfStaffOptNameID", type: "text", icon: 'person', scan: true, wfPplI: 1, size: 7},
      {title: "作业員", method: "input", model: "wfStaffOptName", type: "text", icon: 'person', scan: false, wfPplI: 2, size: 7},
      {title: "班别", method: "input", model: "wfStaffOptShift", type: "text", icon: 'briefcase', scan: false, wfPplI: 2, size: 4},
      {title: "技術員", method: "input", model: "wfStaffTechName", type: "text", icon: 'construct', scan: true, wfPplI: 6, size: 7},
      {title: "班长硧认", method: "input", model: "wfOptQtyChecked", type: "text", icon: 'construct', scan: true, wfPplI: 3, size: 7},
      {title: "維修員", method: "input", model: "wfStaffRepairName", type: "text", icon: 'construct', scan: true, wfPplI: 4, size: 7},
      //{title: "外覌抽验判定", method: "input", model: "wfStaffRandomPickName", type: "text", icon: 'construct', scan: false, wfPplI: 6, size: 7},
      {title: "终检", method: "buttons", model: "wfQCPass", icon: "md-checkmark-circle-outline",buttons: [
        {label: "通过", value: 1, icon: 'checkmark'},
        {label: "失败", value: 2, icon: 'close'}
      ]},
      //{title: "QC检查不良墑认", method: "input", model: "wfStaffQCSummary", scan: false, wfPplI: 3, type: "text", size: 15},
      {title: "品检員", method: "input", model: "wfStaffQCName", type: "text", icon: 'search', scan: true, wfPplI: 5, size: 7},
      //{title: "编切/包装前特性抽獫判𤴓", method: "input", model: "wfStaffQCPreRandomCheck", scan: false, wfPplI: 6, type: "text", size: 15},
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

              case 'wfGoodTotal':
                if (form.value.wfProcessStatus) {
                  form.controls[key].setValue(0);
                  form.controls['wfOptStartQty'].setValue(storageData[key]);
                } else {
                  form.controls[key].setValue(storageData[key]);
                }
                break;

              case 'wfBadTotal':
                if (form.value.wfProcessStatus) {
                  form.controls[key].setValue(0);
                }
                break;

              case 'wfOptStartQty':
                if (form.value.wfProcessStatus) {
                  break;
                } else {
                  form.controls[key].setValue(storageData[key]);
                }
                break;

              default:
                form.controls[key].setValue(storageData[key]);
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
        form.controls['wfBadItemTotal'].setValue('不良数總和');

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
      wfSalesOrderNote: [''],
      wfOrderTotalQty: [''],
      wfOrderTotalGoodQty: [''],
      wfOrderRMId: [''],
      wfOrderSeries: [''],
      wfOrderSpec: [''],
      wfOrderDim: [''],
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
      wfRMFoilPosCapFrom: [''],
      wfRMFoilPosCapTo: [''],
      wfRMFoilPosWidth: [''],
      wfRMFoilPosLength: [''],
      wfRMFoilPosQty: [''],
      // wfRMFoilPosLName: [''],
      // wfRMFoilPosLSerial: [''],
      wfRMFoilNegName: [''],
      wfRMFoilNegSerial: [''],
      wfRMFoilNegCapFrom: [''],
      wfRMFoilNegCapTo: [''],
      wfRMFoilNegWidth: [''],
      wfRMFoilNegLength: [''],
      wfRMFoilNegQty: [''],
      // wfRMFoilNegLName: [''],
      // wfRMFoilNegLSerial: [''],
      wfRMPaperName: [''],
      wfRMPaperSerial: [''],
      //
      wfRMPaperQty: [''],
      wfRMGlueName: [''],
      wfRMGlueSerial: [''],
      wfRMSolName: [''],
      wfRMSolSerial: [''],
      //
      wfRMSolQty: [''],
      wfRMPinPosName: [''],
      wfRMPinPosSerial: [''],
      wfRMPinNegName: [''],
      wfRMPinNegSerial: [''],
      //
      wfRMPinPosQty: [''],
      wfRMPlasticName: [''],
      wfRMPlasticSerial: [''],
      //
      wfRMPlasticQty: [''],
      wfRMShellName: [''],
      wfRMShellSerial: [''],
      //
      wfRMShellQty: [''],
      wfRMCoverName: [''],
      wfRMCoverSerial: [''],
      //
      wfRMCoverQty: [''],
      wfRMCoverCheck: [''],
      wfRMWindingTime: [''],
      wfRMCoverWeek: [''],      
      wfRMWindingDeg: [''],

      // dry input
      wfDryStartTime: [''],
      wfDryFinishTime: [''],
      wfDryWindingDeg: ['0'],
      wfStaffDryName: [''],

      // wet Input
      wfWetEmptyAir: ['0'],
      wfWetAir: ['0'],
      wfWetStartTime: [''],
      wfWetFinishTime: [''],
      wfStaffWetName: [''],

      // Wash Input
      wfWashWindingDeg: ['0'],
      wfWashStartTime: [''],
      wfWashFinishTime: [''],
      wfWashDryWindingDeg: [''],      
      wfWashDryTime: ['MM Mins'],
      wfStaffWashName: [''],
      wfQCCheck: [''],
      wfRandomCheckInfo: [''],
      wfSpecNote: [''],

      // aging input details
      wfAgeDetailAG1: [''],
      wfAgeDetailAG2: [''],
      wfAgeDetailAG3: [''],
      wfAgeDetailAG4: [''],
      wfAgeDetailAG5: [''],
      wfAgeDetailAG6: [''],
      wfAgeDetailAG7: [''],
      wfAgeDetailAG8: [''],
      wfAgeDetailAG9: [''],
      wfAgeDetailAG10: [''],
      wfAgeDetailAG11: [''],
      wfAgeDetailAG12: [''],
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
      wfOptInputEndDate: [this.appDate],
      wfOptWashMachine: [''],
      wfOptStartTime: [''],
      wfOptFinishTime: [''],
      wfOptBadQtyItem: [''],
      wfOptBadQty: ['0'],
      wfOptGoodQty: ['0'],
      

      // Good / Bad Qty Input
      wfBadItem1: [''],
      wfBadQty1: ['0'],
      wfBadItem2: [''],
      wfBadQty2: ['0'],
      wfBadItem3: [''],
      wfBadQty3: ['0'],
      wfBadItem4: [''],
      wfBadQty4: ['0'],
      wfBadItem5: [''],
      wfBadQty5: ['0'],    
      wfBadItem6: [''],
      wfBadQty6: ['0'],
      wfBadItemTotal: [''],

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
      
      // Aging Part 1
      wfAge1MachineId: [''],
      wfAge1StaffId: [''],
      wfAge1MachineClear: [''],
      wfAge1Time: [''],
      wfAge1Temp: [''],
      wfAge1AG1: [''],
      wfAge1AG2: [''],
      wfAge1AG3: [''],
      wfAge1AG4: [''],
      wfAge1AG5: [''],
      wfAge1AG6: [''],
      wfAge1AG7: [''],
      wfAge1AG8: [''],
      wfAge1AG9: [''],
      wfAge1AG10: [''],
      wfAge1AG11: [''],
      wfAge1AG12: [''],
      wfAge1LC: [''],
      wfAge1Feq: [''],
      wfAge1CapU: [''],
      wfAge1CapD: [''],
      wfAge1DFU: [''],
      wfAge1LCU: [''],
      wfAge1Start: [''],
      wfAge1End: [''],
      wfAge1DeployQty: [''],
      wfAge1GoodQty: [''],
      wfAge1OptInsertOpen: [''],
      wfAge1OptShort: [''],
      wfAge1OptMark: [''],
      wfAge1OptCx: [''],
      wfAge1OptDx: [''],
      wfAge1OptLCBig: [''],
      wfAge1OptLCSmall: [''],
      wfAge1OptQC: [''],

      wfAge1DisInsertOpen: [''],
      wfAge1DisShort: [''],
      wfAge1DistMark: [''],
      wfAge1DistCx: [''],
      wfAge1DistDx: [''],
      wfAge1DisLCBig: [''],
      wfAge1DisLCSmall: [''],
      wfAge1DisQC: [''],

      // Aging Part 2
      wfAge2MachineId: [''],
      wfAge2StaffId: [''],
      wfAge2MachineClear: [''],
      wfAge2Time: [''],
      wfAge2Temp: [''],
      wfAge2AG1: [''],
      wfAge2AG2: [''],
      wfAge2AG3: [''],
      wfAge2AG4: [''],
      wfAge2AG5: [''],
      wfAge2AG6: [''],
      wfAge2AG7: [''],
      wfAge2AG8: [''],
      wfAge2LC: [''],
      wfAge2Feq: [''],
      wfAge2CapU: [''],
      wfAge2CapD: [''],
      wfAge2DFU: [''],
      wfAge2LCU: [''],
      wfAge2Start: [''],
      wfAge2End: [''],
      wfAge2DeployQty: [''],
      wfAge2GoodQty: [''],
      wfAge2OptInsertOpen: [''],
      wfAge2OptShort: [''],
      wfAge2OptMark: [''],
      wfAge2OptCx: [''],
      wfAge2OptDx: [''],
      wfAge2OptLCBig: [''],
      wfAge2OptLCSmall: [''],
      wfAge2OptQC: [''],

      wfAge2DisInsertOpen: [''],
      wfAge2DisShort: [''],
      wfAge2DistMark: [''],
      wfAge2DistCx: [''],
      wfAge2DistDx: [''],
      wfAge2DisLCBig: [''],
      wfAge2DisLCSmall: [''],
      wfAge2DisQC: [''],

      // Aging Part 3
      wfAge3MachineId: [''],
      wfAge3StaffId: [''],
      wfAge3MachineClear: [''],
      wfAge3Time: [''],
      wfAge3Temp: [''],
      wfAge3AG1: [''],
      wfAge3AG2: [''],
      wfAge3AG3: [''],
      wfAge3AG4: [''],
      wfAge3AG5: [''],
      wfAge3AG6: [''],
      wfAge3AG7: [''],
      wfAge3AG8: [''],
      wfAge3LC: [''],
      wfAge3Feq: [''],
      wfAge3CapU: [''],
      wfAge3CapD: [''],
      wfAge3DFU: [''],
      wfAge3LCU: [''],
      wfAge3Start: [''],
      wfAge3End: [''],
      wfAge3DeployQty: [''],
      wfAge3GoodQty: [''],
      wfAge3OptInsertOpen: [''],
      wfAge3OptShort: [''],
      wfAge3OptMark: [''],
      wfAge3OptCx: [''],
      wfAge3OptDx: [''],
      wfAge3OptLCBig: [''],
      wfAge3OptLCSmall: [''],
      wfAge3OptQC: [''],

      wfAge3DisInsertOpen: [''],
      wfAge3DisShort: [''],
      wfAge3DistMark: [''],
      wfAge3DistCx: [''],
      wfAge3DistDx: [''],
      wfAge3DisLCBig: [''],
      wfAge3DisLCSmall: [''],
      wfAge3DisQC: [''],

      // Aging Part 4
      wfAge4MachineId: [''],
      wfAge4StaffId: [''],
      wfAge4MachineClear: [''],
      wfAge4Time: [''],
      wfAge4Temp: [''],
      wfAge4AG1: [''],
      wfAge4AG2: [''],
      wfAge4AG3: [''],
      wfAge4AG4: [''],
      wfAge4AG5: [''],
      wfAge4AG6: [''],
      wfAge4AG7: [''],
      wfAge4AG8: [''],
      wfAge4LC: [''],
      wfAge4Feq: [''],
      wfAge4CapU: [''],
      wfAge4CapD: [''],
      wfAge4DFU: [''],
      wfAge4LCU: [''],
      wfAge4Start: [''],
      wfAge4End: [''],
      wfAge4DeployQty: [''],
      wfAge4GoodQty: [''],
      wfAge4OptInsertOpen: [''],
      wfAge4OptShort: [''],
      wfAge4OptMark: [''],
      wfAge4OptCx: [''],
      wfAge4OptDx: [''],
      wfAge4OptLCBig: [''],
      wfAge4OptLCSmall: [''],
      wfAge4OptQC: [''],

      wfAge4DisInsertOpen: [''],
      wfAge4DisShort: [''],
      wfAge4DistMark: [''],
      wfAge4DistCx: [''],
      wfAge4DistDx: [''],
      wfAge4DisLCBig: [''],
      wfAge4DisLCSmall: [''],
      wfAge4DisQC: [''],

      //  Status control fields
      wfOptStartQty: [''],
      wfBadTotal: [''],
      wfGoodTotal: [''],
      wfFormStatus: [''],
      wfProcessStatus: [''],
      wfFormExcept: ['']

    });

  }

}
