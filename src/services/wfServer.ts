import { Injectable} from "@angular/core";
import 'rxjs/Rx';
import 'rxjs/add/operator/catch'
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { WorkflowPage } from "../pages/workflow/workflow";
import { observable } from "rxjs/symbol/observable";
import { Observable } from "rxjs/Observable";

@Injectable()
export class WorkflowService {
  // The wfSvc function handles all the communication between the app and server
  // This service has 4 main functions for calling:
  // 1. upload
  // 2. query
  // 3. uploadImage
  // 4. showWfOpsFinalInputAlert

  // Universal http options setup
  private httpHeaders = new Headers({ 'Content-type':'application/json' });
  private httpOptions = new RequestOptions({ headers:this.httpHeaders });

  // URL for production

  // For URL for the server call
  public baseUrl = "http://192.168.4.200:3000/workflow/";
  // public baseUrl = "http://localhost:3000/workflow/";
  // can be assigned in the workflow.ts

  // For calculating the time value
  tzoffset: number = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  appDate: String = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,10);

  constructor(private http: Http,
              private storage: Storage,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController){}

  upload(form: any){
    // This function simply submit the form as packet to the url based on the wfForm number
    // 2 inputs for this function,
    //    1. the form itself
    //    2. the wfForm number
    //
    // Note:
    //    1. This is a promise call function which means that
    //       it will need to be executed with .subscribe in the call function's main body.
    //    2. The reason why wfForm is separated from extracting from the form because
    //       I want it to be explicitly filled and make sure it has a value before calling

    console.log("Begin to upload onto server");
    console.log("Printing packet to server : " + JSON.stringify(form));

    // Dynamic url base on the wfForm number
    let queryUrl = this.baseUrl + "form/submit/";
    console.log("Requesting url: " + queryUrl);

    // Return the http post
    return this.http.post(queryUrl, form, this.httpOptions)
      .timeout(4000)
      .map((response: Response) => {
        console.log("Response from Server");
        console.log(response.json());
        return response.json();
      });
  }

  query(form: any){
    // This function simply query the wfFormId to the url based on the wfForm number
    // 2 inputs for this function,
    //    1. the form itself
    //    2. the wfForm number
    //
    // Note:
    //    1. This is a promise call function which means that
    //       it will need to be executed with .subscribe in the call function's main body
    //    2. The reason why wfForm is separated from extracting from the form because
    //       I want it to be explicitly filled and make sure it has a value before calling
    //
    // Further work:
    //    Right now the query if through submission of entire form,
    //    can rework the query only on the wfFormId instead.
    //    Original design concept is to let server side decide which field to be looked up

    console.log("Begin to load data from server");
    console.log("Printing request to server : " + JSON.stringify(form));

    let queryUrl = '';

    if (form.wfReadOnly){
      queryUrl = this.baseUrl + "form/readonly/";
    } else {
      queryUrl = this.baseUrl + "form/query/";
    }

    console.log("Requesting url: " + queryUrl);

    return this.http.post(queryUrl, form, this.httpOptions)
      .timeout(4000)
      .map((response: Response) => {
        console.log("Responding from Server");
        console.log(response);
        return response.json();
      });
  }

  staffPull(){
    // This function pull all the staff data from the server and load into local storage

    console.log("Pulling staff data");

    let queryUrl = this.baseUrl + "erp/query/staff/";
    console.log("Requesting url: " + queryUrl);

    return this.http.post(queryUrl, '', this.httpOptions)
      .timeout(4000)
      .map((response: Response) => {
        console.log("Responding from Server");
        console.log(response.json()[0]);
        return response.json()[0];
      });
  }

  staffCheck(staffData: any){
    // This function check the dttm from the server and decide if a full refresh is needed

    console.log("Checking staff data from server");
    console.log("Printing request to server : " + JSON.stringify(staffData));

    let queryUrl = this.baseUrl + "erp/query/staff/dttm/";
    console.log("Requesting url: " + queryUrl);

    return this.http.post(queryUrl, staffData, this.httpOptions)
      .timeout(4000)
      .map((response: Response) => {
        console.log("Responding from Server");
        console.log(response.json()[0]);
        return response.json();
      });
  }

  uploadImage(form: any,image: any) {
    // This function formulate a packet with some parts of the form value and images array
    // to the url based on the wfForm number
    // 5 inputs for this function,
    //    1. The form itself
    //    2. The wfForm number
    //    3. Images array
    //    4. The number of images upload
    //    5. Total number of images array
    //
    // Note:
    //    1. This is a promise call function which means that
    //       it will need to be executed with .subscribe in the call function's main body
    //    2. The reason why wfForm is separated from extracting from the form because
    //       I want it to be explicitly filled and make sure it has a value before calling
    //    3. This function only trigger single image upload, so the for loop of call is assumed
    //       to be handled by the main function call

    let queryUrl = this.baseUrl + "form/image/submit/";
    console.log("Requesting url: " + queryUrl);
    console.log("Begin to upload image onto server!");
    console.log("Printing wfInputForm :" + JSON.stringify(form.value));
    console.log("Constructing packet to server!");

    // Do not print the packet below in the console as it will slow the performance due to it's size
    // Any change of the field name in the form need to be updated manually here
    let packet = {
      wfProcess: form.value.wfProcess,
      wfProcessName: form.value.wfProcessName,
      wfProcessStatus: form.value.wfProcessStatus,
      wfFormName: form.value.wfFormName,
      wfForm: form.value.wfForm,
      wfFormId: form.value.wfFormId,
      wfFormSplit: form.value.wfFormSplit,
      wfFormStatus: form.value.wfFormStatus,
      wfOrderFormId: form.value.wfOrderFormId,
      wfOrderId: form.value.wfOrderId,
      wfStaffOptId: form.value.wfStaffOptId,
      wfStaffOptName: form.value.wfStaffOptName,
      wfStaffOptShift: form.value.wfStaffOptShift,
      wfStaffLeadId: form.value.wfStaffLeadId,
      wfStaffLeadName: form.value.wfStaffLeadName,
      wfStaffTechId: form.value.wfStaffTechId,
      wfStaffTechName: form.value.wfStaffTechName,
      wfStaffXrayId: form.value.wfStaffXrayId,
      wfStaffXrayName: form.value.wfStaffXrayName,
      wfStaffQCId: form.value.wfStaffQCId,
      wfStaffQCName: form.value.wfStaffQCName,
      wfImg: image,
    };

    return this.http.post(queryUrl, packet, this.httpOptions)
      .timeout(3000)
      .map((response: Response) => {
        console.log("Responding from Server" + response);
        return response.text();
      });
  }

  batchUploadImages(form: any) {
    console.log("In the batchUploadImages");
    let queryUrl = this.baseUrl + "form/image/submit/";
    console.log("Requesting url: " + queryUrl);
    console.log("Begin to upload image onto server!");

    return this.http.post(queryUrl, form, this.httpOptions)
      .timeout(3000)
      .map((response: Response) => {
        console.log("Responding from Server" + response);
        return response.text();
      });
  }

  pullImage(form: any) {
    // Pull images from the Server
    console.log("Pulling images from Server");
    let queryUrl = this.baseUrl + "form/image/query/";
    console.log("pullImages: Requesting url: " + queryUrl);
    console.log("Begin to pull images from server!");
    console.log("pullImages: Printing wfInputForm :" + JSON.stringify(form.value));
    console.log("pullImages: Constructing packet to server!");

    // Do not print the packet below in the console as it will slow the performance due to it's size
    // Any change of the field name in the form need to be updated manually here

    return this.http.post(queryUrl, form.value, this.httpOptions)
      .timeout(4000)
      .map((response: Response) => {
        console.log("Responding from Server" + response);
        return response.json();
      });
  }

  storageBatchUpload(form:any, loadingCtrl:any) {

    if(form.length){
      console.log("storageBatchUpload is being called " + JSON.stringify(form.value));

      //Create loading screen
      let loading = this.loadingCtrl.create({
        content: "上存纪录" + form.length + "中。。。。"
      });

      // Loading screen will be there until loading.dismiss() is being called
      // Currently default it will timeout differently base on the type of the upload
      loading.present();

      this.batchUpload(form).subscribe( () => {
        console.log('All batchUpload requests finished');
        // Dismiss the loading screen
        loading.dismiss();
        // Call next batch Upload
        return this.storageBatchUpload(form,loadingCtrl);

      }, err => {
        loading.dismiss();
        alert("亲,网路不给力: " + err);

      });
    } else {
      alert("亲,所有本地的纪录已经全部上传!!");
    }
  }

  batchUpload(storageData) {

    console.log( "batchUpload wfServer is called" );

    if ( storageData.length ) {
      let payload = JSON.parse(storageData[0]);
      let queryUrl: string;
      let timeOut: number;


      console.log( 'storageData = ' + storageData.length );

      // console.log("payload" + JSON.stringify(payload));

      if ( typeof payload[ 'wfImg' ] == 'undefined' ) {
        queryUrl = this.baseUrl + "form/submit/";
        timeOut = 3000;

      } else {
        queryUrl = this.baseUrl + "form/image/submit/";
        timeOut = 10000;

      }

      console.log("batchUploading requesting url: " + queryUrl );
      console.log("batchUploading Timeout " + timeOut );

      return this.http.post( queryUrl, payload, this.httpOptions )
        .timeout( timeOut )
        .map((res) => res.json() )
        .do((res) => {
          console.log('batchUpload request finished' + JSON.stringify( res.wfFormId ) );
          console.log("Clearing the storage cache now");
          storageData.splice( 0, 1 );
        } );

    }
  }

  wfFormUpload(form: any, navCtrl: any, images: any, finalSubmission: boolean){

    console.log('wfFormUpload is clicked');

    let mainTitleMsg: string;
    let msg: string;

    if (finalSubmission) {
      mainTitleMsg = "你选择了上存及完成工序!";
      msg = "注意: 按\"确定\"后其他人员将不能再输入同一流程卡，同一工序资料";
    } else {
      mainTitleMsg = "你选择了上存工序!";
      msg = "注意: 按\"确定\"后将不能再修改";
    }

    let alertCtrl = this.alertCtrl.create({
      title: mainTitleMsg,
      message: msg,
      buttons: [{
        text: '    确定    ',
        handler: () => {

          if(finalSubmission){
            console.log('上存 + 完成工序 is clicked');
            form.controls['wfFormStatus'].setValue(true);
            form.controls['wfLastCompletedWf'].setValue(form.value.wfProcess);
            console.log("uploading form" + JSON.stringify(form.value));
            this.formSubmission(form,images,navCtrl);

          } else {
            console.log('上存 is clicked');
            form.controls['wfProcessStatus'].setValue(true);
            console.log("uploading form" + JSON.stringify(form.value));
            this.formSubmission(form,images,navCtrl);

          }

        }
      },{
        text: '    取消    ',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    alertCtrl.present();

  }

  wfFormSubmission(form: any, navCtrl: any, images: any, finalSubmission: boolean) {

    let missingfield = [];
    let missingfieldMsg = '';

    this.wfFormValidation(form,missingfield);

    if(missingfield.length) {
      console.log("The Form has failed the validation");
      for(let key in missingfield){
        missingfieldMsg += '<br>' + (this.toInt(key) + 1) + '.  ' + missingfield[key]
      }

      this.warningAlert('请提供或更正下列资料：', missingfieldMsg, '继续');

    } else {
      console.log("The Form has passed the validation");
      if(this.toInt(form.controls['wfOptBadQty'].value) == 0) {
        let totalBadQtyX = this.toInt(form.value.wfBadQty1);
        totalBadQtyX += this.toInt(form.value.wfBadQty2);
        totalBadQtyX += this.toInt(form.value.wfBadQty3);
        totalBadQtyX += this.toInt(form.value.wfBadQty4);
        totalBadQtyX += this.toInt(form.value.wfBadQty5);
        totalBadQtyX += this.toInt(form.value.wfBadQty6);

        form.controls['wfOptBadQty'].setValue(totalBadQtyX);
      }

      // updatedGoodQty is same as totalGoodQty except
      let updatedGoodQty = (this.toInt(form.value.wfOptGoodQty) + this.toInt(form.value.wfOptGoodQty2))/ 1000;
      let totalGoodQty = this.toInt(form.value.wfOptGoodQty) + this.toInt(form.value.wfOptGoodQty2);
      let qtyCheckMsg = '<br>不良数总和: ' + this.toInt(form.value.wfOptBadQty);

      qtyCheckMsg += '<br>良品数: ' + totalGoodQty + ' (' + updatedGoodQty + 'K)';

      if(this.toInt(form.value.wfOptBadQty) > totalGoodQty ) {
        qtyCheckMsg += '<br>不良数 ('+form.value.wfOptBadQty+') 大于 良品数 (' + totalGoodQty + ')！';
      }

      if(totalGoodQty > this.toInt(form.value.wfOrderBatchQty) * 1000) {
        qtyCheckMsg += '<br>良品数 ('+ totalGoodQty +') 大于 批次量 ('+ form.value.wfOrderBatchQty * 1000 +')！';
      }

      qtyCheckMsg += '<br>如需修改，请按 “取消” 再重新输入。';

      let qtyConfirm = this.alertCtrl.create({
        title: '流程卡概括',
        message: qtyCheckMsg,
        buttons: [
          {
            text: '    继续    ',
            handler: () => {
              console.log('Agree clicked');
              this.wfFormUpload(form, navCtrl, images, finalSubmission);
            }
          },
          {
            text: '    取消    ',
            handler: () => {
              console.log('Disagree clicked');
            }
          }
        ]
      });

      if(form.value.wfForm == '3' && (form.value.wfProcess == '9' || form.value.wfProcess == '2')) {
        this.wfFormUpload(form, navCtrl, images, finalSubmission);
      } else {

        if(finalSubmission){
          if(this.finalValidation(form)){
            qtyConfirm.present();
          }

        } else {
          qtyConfirm.present();

        }

      }
    }

  }

  wfFormValidation(form: any, alertMsg: any){
    console.log("wfFormValidation is being called");
    if(form.value.wfForm == '1') {

      if(! this.checkInputAsTime(form.value.wfOptStartTime)) {
        alertMsg.push('正确开始时间值必须为 0000 - 2359 之间!');
        form.controls['wfOptStartTime'].setValue(this.toInt(form.value.wfOptStartTime));

      }

      if(! this.checkInputAsTime(form.value.wfOptFinishTime)){
        alertMsg.push("完成时间值必须为 0000 - 2359 之间!");
        form.controls['wfOptFinishTime'].setValue(this.toInt(form.value.wfOptFinishTime));

      }

      if(form.value.wfOptBadQty < 0) {
        alertMsg.push("不良数不能小于零!");
      }
      if(form.value.wfOptGoodQty < 0) {
        alertMsg.push("良品数必须为正数!");
      }
      if(typeof form.value.wfStaffOptName === 'undefined') {
        alertMsg.push("输入作业员!");
      }


    } else if(form.value.wfForm == '2') {

      if(form.value.wfOptBadQty < 0) {
        alertMsg.push("不良数不能小于零");
      }
      if(form.value.wfOptGoodQty < 0) {
        alertMsg.push("良品数必须为正数!");
      }
      if(typeof form.value.wfStaffOptName === 'undefined' && form.value.wfProcess != 4) {
        alertMsg.push("输入作业员!");
      }

    } else if(form.value.wfForm == '3' && (form.value.wfProcess != '9' && form.value.wfProcess != '11')) {
      if(! this.checkInputAsTime(form.value.wfOptStartTime)) {
        alertMsg.push('正确开始时间值必须为 0000 - 2359 之间!');
        form.controls['wfOptStartTime'].setValue(this.toInt(form.value.wfOptStartTime));

      }

      if(! this.checkInputAsTime(form.value.wfOptFinishTime)){
        alertMsg.push("完成时间值必须为 0000 - 2359 之间!");
        form.controls['wfOptFinishTime'].setValue(this.toInt(form.value.wfOptFinishTime));

      }

      if(form.value.wfOptBadQty < 0) {
        alertMsg.push("不良数不能小于零!");

      }

      if(form.value.wfOptGoodQty < 0) {
        alertMsg.push("良品数必须为正数!");

      }

      if ( typeof form.value.wfStaffOptName === 'undefined' ) {
        alertMsg.push("输入作业员!");
      }
    }
    console.log(alertMsg);
  }

  checkInputAsTime(input: any){
    console.log("Checking input as time value");

    if(input == 'undefined' || isNaN(input)){
      console.log("Error: invalid time input");
      return false;

    }

    let time = input.toString();

    if(time.length != 4 ) {
      console.log("Error: time length over 4 characters");
      return false;

    }

    // If length == 4 then continue below part
    let hour = this.toInt(time.substr(0,2));
    let min = this.toInt(time.substr(2,2));

    if(hour < 0 || hour > 24){
      console.log("Error: hour exceed 24 or below 0");
      return false;

    } else if (min < 0 || min > 59) {
      console.log("Error: mins exceed 59 or below 0");
      return false;

    }
    return true;

  }

  showEndDateErrorAlert(endDate: any) {
    console.log(this.appDate);
    this.warningAlert('', this.appDate+' - '+endDate+' ', '继续');
  }

  showGoodBadQtyInputsAlert(wfInputForm: any) {

    let form = wfInputForm;

    let wfOptBadQtyValue = form.value.wfOptBadQty;
    let wfOptGoodQtyValue = form.value.wfOptGoodQty;
    let wfOrderBatchQtyValue = form.value.wfOrderBatchQty;

    if(wfOptGoodQtyValue === '') {
      this.warningAlert('', '请输入良品数', '继续');
    } else if(wfOptBadQtyValue === '') {
      this.warningAlert('', '请输入不良数', '继续');
    }
    wfOptBadQtyValue = this.toInt(wfOptBadQtyValue);
    wfOptGoodQtyValue = this.toInt(wfOptGoodQtyValue);
    wfOrderBatchQtyValue = this.toInt(wfOrderBatchQtyValue);
    /*
    if(wfOptGoodQtyValue <= 0) {
      this.warningAlert('', '请输入良品数('+wfOptGoodQtyValue+')', '继续');
    }
    if(wfOptBadQtyValue <= 0 ) {
      this.warningAlert('', '请输入不良数('+wfOptBadQtyValue+')', '继续');
    } else */ if(wfOptBadQtyValue > wfOptGoodQtyValue) {
      this.warningAlert('', '不良数('+wfOptBadQtyValue+')大于良品数('+wfOptGoodQtyValue+')', '继续');
    } else if(wfOptGoodQtyValue > wfOrderBatchQtyValue * 1000) {
      this.warningAlert('', '良品数('+wfOptGoodQtyValue+')大于批次量('+wfOrderBatchQtyValue * 1000+')', '继续');
    }

  }

  populateStaffData(form:any, staffTable:any, machineTable:any, model: string){
    // First determine if the input is ID or name,
    // Name: Lookup Name
    // ID: Lookup Id
    console.log("Staff update is triggered");

    let input = form.controls[model].value;
    input = input.toUpperCase();
    form.controls[model].setValue(input);
    // alert(input);
    // let name = parseInt(input.substr(input.length-1)) >= 0;

    switch (model){
      case "wfStaffOptName":
        for (let key in staffTable) {
          if (staffTable[key].wfStaffOptId == input || staffTable[key].wfStaffOptName == input ){
            form.controls["wfStaffTechId"].setValue(staffTable[key].wfStaffTechId);
            form.controls["wfStaffLeadName"].setValue(staffTable[key].wfStaffLeadName);
            form.controls["wfStaffLeadId"].setValue(staffTable[key].wfStaffLeadId);
            form.controls["wfStaffOptId"].setValue(staffTable[key].wfStaffOptId);
            form.controls["wfStaffOptName"].setValue(staffTable[key].wfStaffOptName);
            form.controls["wfStaffOptShift"].setValue(staffTable[key].wfStaffOptShift);
            form.controls["wfStaffQCId"].setValue(staffTable[key].wfStaffQCId);
            form.controls["wfStaffQCName"].setValue(staffTable[key].wfStaffQCName);
            form.controls["wfStaffTechName"].setValue(staffTable[key].wfStaffTechName);
            form.controls["wfStaffXrayId"].setValue(staffTable[key].wfStaffXrayId);
            form.controls["wfStaffXrayName"].setValue(staffTable[key].wfStaffXrayName);

            if (form.controls["wfStaffTechId"].value == "" || form.controls["wfStaffTechName"].value == "" || form.controls["wfStaffTechName"] == "machine"){
              this.staffMachinePair(form,machineTable);
            }

            return;
          }

        }
        alert("亲，查无此人!?");
        break;

      case "wfStaffLeadName":
        for (let key in staffTable) {
          if (staffTable[key].wfStaffLeadId == input  || staffTable[key].wfStaffLeadName == input){
            form.controls["wfStaffLeadName"].setValue(staffTable[key].wfStaffLeadName);
            form.controls["wfStaffLeadId"].setValue(staffTable[key].wfStaffLeadId);

            return;
          }
        }

        alert("亲，查无此人!?");
        break;

      case "wfStaffQCName":
        for (let key in staffTable) {
          if (staffTable[key].wfStaffQCId == input  || staffTable[key].wfStaffQCName == input){
            form.controls["wfStaffQCId"].setValue(staffTable[key].wfStaffQCId);
            form.controls["wfStaffQCName"].setValue(staffTable[key].wfStaffQCName);

            return;
          }
        }
        alert("亲，查无此人!?");
        break;

      case "wfStaffTechName":
        for (let key in staffTable) {
          if (staffTable[key].wfStaffTechId == input  || staffTable[key].wfStaffTechName == input){
            form.controls["wfStaffTechId"].setValue(staffTable[key].wfStaffTechId);
            form.controls["wfStaffTechName"].setValue(staffTable[key].wfStaffTechName);

            return;
          }
        }
        alert("亲，查无此人!?");
        break;

      case "wfStaffXrayName":
        for (let key in staffTable) {
          if (staffTable[key].wfStaffXrayId == input  || staffTable[key].wfStaffXrayName == input){
            form.controls["wfStaffXrayId"].setValue(staffTable[key].wfStaffXrayId);
            form.controls["wfStaffXrayName"].setValue(staffTable[key].wfStaffXrayName);

            return;
          }
        }
        alert("亲，查无此人!?");
        break;

      default:
        console.log("Failed to lookup the staff record " + model);
        alert("亲，查无此人!?");
        break;
    }

  };

  staffMachinePair(form:any, machineTable:any){
    // First determine if the input is ID or name,
    // Name: Lookup Name
    // ID: Lookup Id
    console.log("Staff Machine pair is triggered");
    console.log(machineTable);

    let machineId = form.controls["wfOptMachineId"].value;
    let staffShift = form.controls["wfStaffOptShift"].value;
    console.log("machineId for input" + machineId);
    console.log("staffShift for input " + staffShift);

    for (let key in machineTable) {
      if (machineTable[key].wfOptMachineId == machineId &&  machineTable[key].wfStaffOptShift == staffShift){
        form.controls["wfStaffTechId"].setValue(machineTable[key].wfStaffTechId);
        form.controls["wfStaffTechName"].setValue(machineTable[key].wfStaffTechName);

        return;
      }

    }

    // Default cmd if no result is found!
    alert("亲，查无此人!?");

  };

  warningAlert(titleTxt: any, msgTxt: any, buttons: any) {
    let alert = this.alertCtrl.create({
      title: titleTxt,
      message: msgTxt,
      buttons: [buttons]
    });
    alert.present();
  };

  cancelBtn(navCtrl: any) {
    // this.storage.clear();
    navCtrl.setRoot(WorkflowPage);
  };

  setBadQty(wfForm: any) {
    let form = wfForm;

    if(form.value.wfProcessName ){

    }
  };

  formSubmission(form: any, images: any, navCtrl: any) {
    // This function manage all the form submission in each of the wfForm and connect with the server call
    // 3 inputs for this function,
    //    1. form itself,
    //    2. images
    //    3. navCtrl
    //
    // This function will do the following:
    //    1. Save form data into storage
    //    2. Call the upload function from this service for the form data
    //        Upon successful form submission, then
    //        Upload each image from images array:
    //          First check if there is any image to upload
    //          Then loop through each image from the images array to upload
    //          Throw error alert to user if any
    //    3. If the entire upload function is completed, then call navCtrl.pop()
    //       There is a bug as navCtrl.pop() is executed before images upload finish
    //
    //
    // Further work:
    //    1. Need to work on the function to determine all the promises call are completed
    //       before navCtrl.pop() is called
    //    2. Error handling on the Server connection is not being handled here
    //    3. Prelim assumption is that any request has failed to send to server
    //       will be stored locally and show a counter in the main page
    //       with a button to send all the pending data

    this.runningTotal(form);

    this.dateValidation(form);

    //Create loading screen
    let loading = this.loadingCtrl.create({
      content: "上存流程卡中。。。。"
    });

    // Loading screen will be there until loading.dismiss() is being called
    // Currently default it will timeout differently base on the type of the upload
    loading.present();

    this.upload(form.value)
      .subscribe((data)=> {
          console.log("Successfully uploading to server");
          console.log("Upload wfInput reply from server" + JSON.stringify(data));
          loading.dismiss();

          if (images.length){
            console.log("uploading images to server");

            //Create loading screen
            let loadingImg = this.loadingCtrl.create({
              content: "上存流程卡图片中。。。。"
            });

            // Loading screen will be there until loading.dismiss() is being called
            // Currently default it will timeout differently base on the type of the upload
            loadingImg.present();

            this.uploadImage(form, images).subscribe((data) => {
              loadingImg.dismiss();
              navCtrl.setRoot(WorkflowPage);

            }, err => {
              loadingImg.dismiss();

              alert("图片上存错误!先存储在本地,稍后再上传! " + err);

              // Stored locally in the backup
              this.storage.get("backupForm").then((data) => {
                if(typeof data == 'undefined' || data == "" || data == null) {
                  // If the storage is empty, then initate an empty array
                  data = [];
                }

                let packet = this.imgPacket(form,images);

                data.push(JSON.stringify(packet));
                this.storage.set("backupForm", data);

              }, err => {
                alert("本地存储错误 " + err);
              });

            })

          } else {
            // navCtrl.pop();
            // this.storage.clear();
            navCtrl.setRoot(WorkflowPage);
          }
        },
        error => {
          // On error, prompt network msg and can save locally
          console.log(error);
          loading.dismiss();
          this.networkError(form, navCtrl, images);

        }

      );
  };

  imgPacket(form: any, images: any){
    console.log("imgPacket is being called");
    let packet = {
      wfProcess: form.value.wfProcess,
      wfProcessName: form.value.wfProcessName,
      wfProcessStatus: form.value.wfProcessStatus,
      wfFormName: form.value.wfFormName,
      wfForm: form.value.wfForm,
      wfFormId: form.value.wfFormId,
      wfFormSplit: form.value.wfFormSplit,
      wfFormStatus: form.value.wfFormStatus,
      wfOrderFormId: form.value.wfOrderFormId,
      wfOrderId: form.value.wfOrderId,
      wfStaffOptId: form.value.wfStaffOptId,
      wfStaffOptName: form.value.wfStaffOptName,
      wfStaffOptShift: form.value.wfStaffOptShift,
      wfStaffLeadId: form.value.wfStaffLeadId,
      wfStaffLeadName: form.value.wfStaffLeadName,
      wfStaffTechId: form.value.wfStaffTechId,
      wfStaffTechName: form.value.wfStaffTechName,
      wfStaffXrayId: form.value.wfStaffXrayId,
      wfStaffXrayName: form.value.wfStaffXrayName,
      wfStaffQCId: form.value.wfStaffQCId,
      wfStaffQCName: form.value.wfStaffQCName,
      wfImg: images,
    };

    return packet;
  }

  networkError(form:any, navCtrl: any, images: any){
    console.log("networkError is being called");
    let alert = this.alertCtrl.create({
      title: '注意!',
      message: '亲! 网路不给力,请再试一次!',
      buttons: [{
        text: '    重试    ',
        role: 'cancel',
        handler: () => {
          console.log('重试');
        }},{
        text: '    先储档    ',
        handler: () => {
          console.log('先储档,稍后再试');
          // console.log('saving into storage now ' + JSON.stringify(form.value));
          this.storage.get("backupForm").then((data) => {
            console.log("Loading local backup");

            if(typeof data == 'undefined' || data == "" || data == null) {
              // If the storage is empty, then initate an empty array
              console.log("Local backup is empty and initializing a new one");
              data = [];
            }

            data.push(JSON.stringify(form.value));

            if(images.length > 0 ){
              let packet = this.imgPacket(form, images);
              data.push(JSON.stringify(packet));
            }

            this.storage.set("backupForm", data).then(() =>{
              navCtrl.setRoot(WorkflowPage);
            });

          }, error => {
            console.log("本地存储错误 " + error);
          });

        }
      }]
    });
    alert.present();
  };

  toInt(text: string){
    if (text == "" || text == null ) {
      text = "0"
    }

    // change to float because of the batch number could be decimal
    return parseFloat(text);
  };

  runningTotal(form:any){
    console.log("In the running total");
    form.controls["wfGoodTotal"].setValue((this.toInt(form.value.wfOptGoodQty) + this.toInt(form.value.wfOptGoodQty2) + this.toInt(form.value.wfGoodTotal)));
    console.log("GoodQtyRunning Total" + form.value.wfGoodTotal);

    form.controls["wfOptBadQtyItem"].setValue(this.toInt(form.value.wfBadItem1) + this.toInt(form.value.wfBadItem2) + this.toInt(form.value.wfBadItem3) + this.toInt(form.value.wfBadItem4) + this.toInt(form.value.wfBadItem5) + this.toInt(form.value.wfBadItem6));
    console.log("BadQtySubTotal" + form.value.wfOptBadQtyItem);

    form.value.wfBadTotal = ( this.toInt(form.value.wfOptBadQty) + this.toInt(form.value.wfOptBadQtyItem) + form.value.wfBadTotal );
    console.log("BadQtyRunning Total" + form.value.wfBadTotal);

  };

  erpQuery(form: any){
    // This function simply query the wfFormId to the url based on the wfForm number
    // 2 inputs for this function,
    //    1. the form itself
    //    2. the wfForm number
    //
    // Note:
    //    1. This is a promise call function which means that
    //       it will need to be executed with .subscribe in the call function's main body
    //    2. The reason why wfForm is separated from extracting from the form because
    //       I want it to be explicitly filled and make sure it has a value before calling
    //
    // Further work:
    //    Right now the query if through submission of entire form,
    //    can rework the query only on the wfFormId instead.
    //    Original design concept is to let server side decide which field to be looked up

    console.log("Loading from ERP");
    console.log("Printing request to server : " + JSON.stringify(form));

    let queryUrl = this.baseUrl + "erp/query/";
    console.log("Requesting ERP url: " + queryUrl);

    return this.http.post(queryUrl, form, this.httpOptions)
      .timeout(4000)
      .map((response: Response) => {
        console.log("Responding from ERP Server");
        console.log(response.json()[0]);
        return response.json();
      });
  };

  erpQueryExcept(form: any){
    // This function simply query the wfFormId to the url based on the wfForm number
    // 2 inputs for this function,
    //    1. the form itself
    //    2. the wfForm number
    //
    // Note:
    //    1. This is a promise call function which means that
    //       it will need to be executed with .subscribe in the call function's main body
    //    2. The reason why wfForm is separated from extracting from the form because
    //       I want it to be explicitly filled and make sure it has a value before calling
    //
    // Further work:
    //    Right now the query if through submission of entire form,
    //    can rework the query only on the wfFormId instead.
    //    Original design concept is to let server side decide which field to be looked up

    console.log("Checking from ERP Exceptional");
    console.log("Printing ERP Exc request to server : " + JSON.stringify(form.value));

    let queryUrl = this.baseUrl + "erp/query/exc/";
    console.log("Requesting ERP Exc url: " + queryUrl);

    return this.http.post(queryUrl, form.value, this.httpOptions)
      .timeout(4000)
      .map((response: Response) => {
        console.log("Responding from ERP Exc Server");
        // console.log(response.json());
        return response.json();
      });
  };

  finalValidation(form:any) {
    console.log("Calling Final Validation");

    // Defined the exceptional variable
    let except: boolean;

    // Check if exceptional is true, or set it to false
    if(form.value.wfFormExcept) {
      except = form.value.wfFormExcept;
    } else {
      form.value.wfFormExcept = false;
      except = form.value.wfFormExcept;
    }

    console.log('finalValidation: wfFormExcept is ' + except);

    if (except) {
      console.log("finalValidation: Skipping the validation because abnormal checked");
      return true;

    } else {
      console.log("finaValidation: Checking the rules");
      let startQty = this.toInt( form.value.wfOptStartQty );
      let goodQty: number;

      if ( this.toInt( form.value.wfOptGoodQty ) == 0 ) {
        goodQty = startQty
      } else {
        goodQty = (this.toInt(form.value.wfOptGoodQty) + this.toInt(form.value.wfOptGoodQty2));
      }

      let badQty = this.toInt( form.value.wfOptBadQty );
      let batchQty = (this.toInt( form.value.wfOrderBatchQty )) * 1000;

      let wtForm = form.value.wfForm;
      let ProcessCount = this.toInt( form.value.wfProcess );
      let RunningTotal = this.toInt(form.value.wfGoodTotal);

      //良品数上下限
      let QC_UPPER = 1.2;
      let QC_LOWER = 0.8;

      //vairance (flexible quantity - inputQty)
      let OtherLimit = 3000;

      //not exceeding 10k of batch qty
      //flexible_quantity - Finished_Product = 10000;
      let finishProdLimit = 10000;
      // ComparingTotal is a combination of goodQty and Running total so
      //running total is used to comparing instead of just GoodQty alone
      let ComparingTotal = RunningTotal + goodQty;

      // Added new rules per the discussion 24 Mar 2018
      // If the start qty is 0, then assign it with the order batch qty
      if (startQty == 0){
        startQty = batchQty
      }



      console.log("finalValidation: startQty: " + startQty +
        " goodQty: " + goodQty + " badQty: " + badQty +
        " batchQty: " + batchQty + " ProcessCount: " + ProcessCount + "RunningTotal:" + RunningTotal+
        " ComparingTotal:" + ComparingTotal);
      //  sub process card
      //rule 5 cannot exceed batch quantity
      if ( badQty > batchQty ) {
        console.log( 'batchQty' + batchQty );
        console.log( 'badqty' + badQty );
        alert( '不良品不得超过批次量' );
        return false;
      }

      switch ( wtForm ) {

        case '1':
          console.log("finalValidation: Checking Form 1");
          if ( Math.abs( ComparingTotal - startQty ) <= OtherLimit ) {
            // for the variance within the limit, no actions
            return true;

          } else if ( ComparingTotal > (QC_UPPER * startQty) ) {
            // rule 4 cant not exceed 20% of good quantity from last process
            alert( '良品数上限不得超过投入数百分之二十' );
            return false;

          } else if ( ComparingTotal < (QC_LOWER * startQty) ) {
            // rule number 7 good quantity exceeding 3k, cant allow it lower than 80% of good qty from last process
            alert( '良品数下限不得低于投入数百分之八十' );
            return false;

          }

          console.log("exceed 3k threshold but within 20%");
          return true;

        // CASE 2 (finished product)
        case '2':
          console.log("finalValidation: Checking Form 2");
          if ( Math.abs( ComparingTotal - startQty ) <= OtherLimit ) {
            // for the variance within the limit, no actions

            if ( ComparingTotal < batchQty ) {
              // rule 2 cant be below batch quantity
              alert( '良品数不得小于批次量' );
              return false;

            } else if ( (ComparingTotal - batchQty) > (finishProdLimit) ) {
              //rule 1 cannot exceed 10k of batch quantity
              alert( '良品不得超过批次量一万以上' );
              return false;

            }

            console.log("Good Qty exceed batch Qty but within 10k");
            return true;

          } else if ( ComparingTotal < (QC_LOWER * startQty) ) {
            // rule number 7 good quantity exceeding 3k, cant allow it lower than 80% of good qty from last process
            alert( '良品数下限不得低于投入数百分之八十' );
            return false;

          }

          console.log("Greater than batch Qty but within 10k limit as well not lower than 90% of input qty");
          return true;

        // CASE 3 (插件 embedded)
        //same logic as naked product
        case '3':
          console.log("finalValidation: Checking Form 3");
          if ( Math.abs( ComparingTotal - startQty ) <= OtherLimit ) {
            return true;
          }
          // rule 4 cant not exceed 20% of good quantity from last process
          else if ( ComparingTotal > (QC_UPPER * startQty) ) {
            alert( '良品数上限不得超过投入数百分之二十' );
            return false;
          }
          // rule number 7 good quantity exceeding 3k, cant allow it lower than 80% of good qty from last process
          else if ( ComparingTotal < (QC_LOWER * startQty) ) {
            alert( '良品数下限不得低于投入数百分之八十' );
            return false;
          }

          console.log("exceed 3k threshold but within 20%");
          return true;

        default:
          alert("输入错误，请检查");
          return false;
      }

    }

  };

  dateValidation(form:any){
    // Assume each shift is finished within 24 hours
    // If the finish time is bigger than start time, then
    //    It assume it has finished in the next day

    console.log("In the dateValidation");
    console.log('inputdate' + form.value.wfOptInputDate);
    // let dateObj = new Date(form.value.wfOptInputDate);
    // let numberOfDaysToAdd = 1;
    //
    // alert(dateObj);
    // if (form.value.wfOptStartTime > form.value.wfOptFinishTime) {
    //   dateObj.setDate(dateObj.getDate() + numberOfDaysToAdd);
    //   console.log("Time has been checked, increase date by 1")
    // }

    form.controls["wfOptInputEndDate"].setValue(form.value.wfOptInputDate);
    console.log("end date is: " + form.controls["wfOptInputEndDate"].value);

  };

  sendStaffDate2Server(){
    console.log("Begin to check with Server on Staff Date");
    // console.log("Printing request to server : " + staffStorage);

    // let httpHeaders = new Headers({ 'Content-type':'text/html;' });
    // let httpOptions = new RequestOptions({ headers:httpHeaders });

    // if(staffStorage == null || staffStorage == ""){
    //   staffStorage = this.appDate
    // }

    let queryUrl = this.baseUrl + "erp/query/staff/dttm/";
    // let packet = '{"dttm":"' + staffStorage +'"}';
    // let packet = staffStorage;
    // console.log("staffDate request to server is " + packet);
    console.log("Requesting url: " + queryUrl);

    return this.http.post(queryUrl, "", this.httpOptions)
      .timeout(5000)
      .map((response: Response) => {
        // console.log("staffDate from Server is " + response);
        return response.text();
      });
  }

  pullStaffDataFromServer(){
    console.log("Begin to pull staff Data from server");

    let queryUrl = this.baseUrl + "erp/query/staff/";
    console.log("Requesting url: " + queryUrl);

    return this.http.post(queryUrl, "", this.httpOptions)
      .timeout(5000)
      .map((response: Response) => {
        // console.log("Responding from Server of staff Data " + JSON.stringify(response.json()[0]));
        return response.json()[0];
      });
  }

}

