import { Injectable} from "@angular/core";
import 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { WorkflowPage } from "../pages/workflow/workflow";

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

  // Comment out below url that is not applicable
  // For Dev url
  // private baseUrl = "http://localhost:3000/workflow/";
  // private baseUrl = "http://192.168.31.170:3000/workflow/";

  // For Test url
  private baseUrl = "http://192.168.4.200:3000/workflow/";
  // private baseUrl = "http://172.20.10.2:3000/workflow/";

  // For calculating the time value
  tzoffset: number = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  appDate: String = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,-1);

  constructor(private http: Http,
              private storage: Storage,
              private alertCtrl: AlertController){}

  upload(wfInputForm: any, wfForm: number){
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
    console.log("Printing packet to server : " + JSON.stringify(wfInputForm));

    // Dynamic url base on the wfForm number
    let queryUrl = this.baseUrl + "form/submit/";
    console.log("Requesting url: " + queryUrl);

    // Return the http post
    return this.http.post(queryUrl, wfInputForm, this.httpOptions)
      .timeout(1000)
      .map((response: Response) => {
        console.log("Response from Server");
        console.log(response.json());
        return response.json();
      });
  }

  query(wfInputForm: any, wfForm: number){
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
    console.log("Printing request to server : " + JSON.stringify(wfInputForm));

    let queryUrl = this.baseUrl + "form/query/";
    console.log("Requesting url: " + queryUrl);

    return this.http.post(queryUrl, wfInputForm, this.httpOptions)
      .timeout(1000)
      .map((response: Response) => {
        console.log("Responding from Server");
        console.log(response.json()[0]);
        return response.json();
      });
  }

  staffPull(){
    // This function pull all the staff data from the server and load into local storage

    console.log("Pulling staff data");

    let queryUrl = this.baseUrl + "erp/query/staff/";
    console.log("Requesting url: " + queryUrl);

    return this.http.post(queryUrl, '', this.httpOptions)
      .timeout(1000)
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
      .timeout(1000)
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
      'wfProcess': form.value.wfProcess,
      'wfProcessName': form.value.wfProcessName,
      'wfFormName': form.value.wfFormName,
      'wfFormId': form.value.wfFormId,
      'wfOrderFormId': form.value.wfOrderFormId,
      'wfOrderId': form.value.wfOrderId,
      'wfImg': image,
    };

    return this.http.post(queryUrl, packet, this.httpOptions)
      .timeout(1000)
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

    return this.http.post(queryUrl, form.value.wfFormId, this.httpOptions)
      .timeout(1000)
      .map((response: Response) => {
        console.log("Responding from Server" + response);
        return response.text();
      });
  }

  showWfOpsFinalInputsAlert(wfInputForm: any, navCtrl: any, images: any, wfPName: any) {
    // This function manage all the form submission in each of the wfForm and connect with the server call
    // 7 inputs for this function,
    //    1. wfOrderTotalQty,
    //    2. wfOrderTotalGoodQty,
    //    3. wfOptBadQtyValue,
    //    4. wfOptGoodQtyValue,
    //    5. wfInputForm,
    //    6. navCtrl,
    //    7. images
    //
    // This function will create an alert with 2 options:
    //    1. Upload
    //    2. Upload and mark process completion
    // Both function set the wfProcessStatus and then execute formSubmission
    //
    // Note:
    //    1. The navCtrl from each form must be passed into this function
    //    2. The alertCtrl for the form submission is handled here
    //    3. Further logic and subscribe function call is handled within here
    //
    // Further work:
    //    1. Error handling on the Server connection is not being handled here
    //    2. Prelim assumption is that any request has failed to send to server
    //       will be stored locally and show a counter in the main page
    //       with a button to send all the pending data


    let form = wfInputForm;

    //form.controls['wfStaffOptName'].setValue('作业員A');

    let alert = this.alertCtrl.create({
      
            //title: wfPName + ' (' + form.value.wfFormId + ')',
            subTitle:  wfPName + ' (' + form.value.wfFormId + ')' + '<br>工序 = ' + form.value.wfProcessName,
            buttons: [{
              text: '上存',
              handler: () => {
                console.log('上存 is clicked');
                console.log("uploading form" + JSON.stringify(form.value));

                form.value.wfProcessStatus = true;

                this.formSubmission(form,images,navCtrl);

              }
            },
              {
                text: '上存 + 完成工序',
                handler: () => {
                  console.log('上存 + 完成工序 is clicked');

                  let alertCtrl = this.alertCtrl.create({
                    // subTitle: 'Please select 终检!' + dataXYZ.wfProcess + ' ' + dataXYZ.wfProcessName + ' ' + form.value.wfFormId + ' ' + JSON.stringify(resultStorageItemX),
                    // comment above for faster process
                    //title: '嚫,完成终检!' + form.value.wfProcess + ' ' + form.value.wfProcessName + ' ' + form.value.wfFormId,
                    //title: '上存及完成工序',
                    subTitle: '上存及完成工序<br>注意: 按"確定"後其他人員將不能再输入同一流程卡，同一工序资料',
                    buttons: [{
                      text: '    確定    ',
                      handler: () => {

                        if (this.finalValidation(form)){
                          console.log('Final confirmation of mark completion is clicked');
                          console.log("uploading form" + JSON.stringify(form.value));

                          form.value.wfFormStatus = true;
                          form.value.wfLastCompletedWf = form.value.wfProcess;
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
              }, {
                text: '    取消    ',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }]
          });

    let missingFeildAlert = true;
    let missingFeildMsg = '';

    if(form.value.wfForm == '1') {
      if(typeof form.value.wfOptStartTime === 'undefined' || isNaN(form.value.wfOptStartTime)) {
        missingFeildMsg += '<br>1. 正確开始时间值必须为 0000 - 2359 之間!';
        form.controls['wfOptStartTime'].setValue(this.toInt(form.value.wfOptStartTime));
      } else {
        let starTimeX = form.value.wfOptStartTime;
        let firstStarTimeX = starTimeX[0]+starTimeX[1];
        let secStarTimeX = starTimeX[2]+starTimeX[3];
        if(starTimeX.length < 4 || starTimeX.length > 4 || this.toInt(firstStarTimeX) < 0 || this.toInt(firstStarTimeX) > 23 || this.toInt(secStarTimeX) < 0 || this.toInt(secStarTimeX) > 59) {
          missingFeildMsg += '<br>1. 正確开始时间值必须为 0000 - 2359 之間!';
          form.controls['wfOptStartTime'].setValue(this.toInt(starTimeX));
        }
      }

      if(typeof form.value.wfOptFinishTime === 'undefined' || isNaN(form.value.wfOptFinishTime)) {
        missingFeildMsg += '<br>2. 完成时间值必须为 0000 - 2359 之間!';
        form.controls['wfOptFinishTime'].setValue(this.toInt(form.value.wfOptFinishTime));
      } else {
        let endTimeX = form.value.wfOptFinishTime;
        let firstEndTimeX = endTimeX[0]+endTimeX[1];
        let secEndTimeX = endTimeX[2]+endTimeX[3];
        if(typeof endTimeX === 'undefined'  || endTimeX.length < 4 || endTimeX.length > 4 || this.toInt(firstEndTimeX) < 0 || this.toInt(firstEndTimeX) > 23 || this.toInt(secEndTimeX) < 0 || this.toInt(secEndTimeX) > 59) {
          missingFeildMsg += '<br>2. 完成时间值必须为 0000 - 2359 之間!';
          form.controls['wfOptFinishTime'].setValue(endTimeX);
        }
      }

      if(form.value.wfOptBadQty < 0) {
        missingFeildMsg += '<br>3. 不良数不能小於零!';
      }
      if(form.value.wfOptGoodQty < 0) {
        missingFeildMsg += '<br>4. 良品数必須为正数!';
      }
      if(typeof form.value.wfStaffOptName === 'undefined') {
        missingFeildMsg += '<br>5. 輸入作业員!';
      }


    } else if(form.value.wfForm == '2') {

      if(form.value.wfOptBadQty < 0) {
        missingFeildMsg += '<br>3. 不良数不能小於零';
      }
      if(form.value.wfOptGoodQty < 0) {
        missingFeildMsg += '<br>4. 良品数必須为正数!';
      }
      if(typeof form.value.wfStaffOptName === 'undefined' && form.value.wfProcess != 4) {
        missingFeildMsg += '<br>5. 輸入作业員!';

      }

    } else if(form.value.wfForm == '3' && form.value.wfProcess != '9') {
        if(typeof form.value.wfOptStartTime === 'undefined' || isNaN(form.value.wfOptStartTime)) {
          missingFeildMsg += '<br>1. 正確开始时间值必须为 0000 - 2359 之間!';
          form.controls['wfOptStartTime'].setValue(this.toInt(form.value.wfOptStartTime));
        } else {
          let starTimeX = form.value.wfOptStartTime;
          let firstStarTimeX = starTimeX[0]+starTimeX[1];
          let secStarTimeX = starTimeX[2]+starTimeX[3];
          if(starTimeX.length < 4 || starTimeX.length > 4 || this.toInt(firstStarTimeX) < 0 || this.toInt(firstStarTimeX) > 23 || this.toInt(secStarTimeX) < 0 || this.toInt(secStarTimeX) > 59) {
            missingFeildMsg += '<br>1. 正確开始时间值必须为 0000 - 2359 之間!';
            form.controls['wfOptStartTime'].setValue(this.toInt(starTimeX));
          }
        }

        if(typeof form.value.wfOptFinishTime === 'undefined' || isNaN(form.value.wfOptFinishTime)) {
          missingFeildMsg += '<br>2. 正確完成时间值必须为 0000 - 2359 之間!';
          form.controls['wfOptFinishTime'].setValue(this.toInt(form.value.wfOptFinishTime));
        } else {
          let endTimeX = form.value.wfOptFinishTime;
          let firstEndTimeX = endTimeX[0]+endTimeX[1];
          let secEndTimeX = endTimeX[2]+endTimeX[3];
          if(typeof endTimeX === 'undefined'  || endTimeX.length < 4 || endTimeX.length > 4 || this.toInt(firstEndTimeX) < 0 || this.toInt(firstEndTimeX) > 23 || this.toInt(secEndTimeX) < 0 || this.toInt(secEndTimeX) > 59) {
            missingFeildMsg += '<br>2. 正確完成时间值必须为 0000 - 2359 之間!';
            form.controls['wfOptFinishTime'].setValue(endTimeX);
          }
        }

      if(form.value.wfOptBadQty < 0) {
        missingFeildMsg += '<br>3. 不良数不能小於零!';

      }
      if(form.value.wfOptGoodQty < 0) {
        missingFeildMsg += '<br>4. 良品数必須为正数!';

      }
      if ( typeof form.value.wfStaffOptName === 'undefined' ) {
        missingFeildMsg += '<br>5. 輸入作业員!';

      }
    }

    if(missingFeildMsg != '') {
      missingFeildAlert = false;
      this.warningAlert('請提供或更正下列资料：', missingFeildMsg, '继續');

    }

    //this.warningAlert('Q', form.value.wfForm + ' ' + form.value.wfProcess, '继續');
    if(missingFeildAlert) {
      if((form.value.wfForm == '1' && (form.value.wfProcess == '5' || form.value.wfProcess == '6' || form.value.wfProcess == '8')) || (form.value.wfForm == '3' && (form.value.wfProcess == '7' || form.value.wfProcess == '8')))
      {
        let totalBadQtyX = this.toInt(form.value.wfBadQty1);
        totalBadQtyX += this.toInt(form.value.wfBadQty2);
        totalBadQtyX += this.toInt(form.value.wfBadQty3);
        totalBadQtyX += this.toInt(form.value.wfBadQty4);
        totalBadQtyX += this.toInt(form.value.wfBadQty5);
        totalBadQtyX += this.toInt(form.value.wfBadQty6);

        form.controls['wfOptBadQty'].setValue(totalBadQtyX);
      }

      let updatedGoodQty = this.toInt(form.value.wfOptGoodQty) / 1000;
      let qtyCheckMsg = '不良数總和: ' + this.toInt(form.value.wfOptBadQty);

      qtyCheckMsg += '<br>良品数: ' + this.toInt(form.value.wfOptGoodQty) + ' (' + updatedGoodQty + 'K)';

      if(this.toInt(form.value.wfOptBadQty) > this.toInt(form.value.wfOptGoodQty)) {
        qtyCheckMsg += '<br>不良数 ('+form.value.wfOptBadQty+') 大於 良品数 ('+form.value.wfOptGoodQty+')！';
      }

      if(this.toInt(form.value.wfOptGoodQty) > this.toInt(form.value.wfOrderBatchQty) * 1000) {
        qtyCheckMsg += '<br>良品数 ('+form.value.wfOptGoodQty+') 大於 批次量 ('+ form.value.wfOrderBatchQty * 1000 +')！';
      }

      qtyCheckMsg += '<br>如需修改，請按 “取消” 再重新輸入。';

      let qtyConfirm = this.alertCtrl.create({
        title: '',
        message: qtyCheckMsg,
        buttons: [
          {
            text: '    取消    ',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: '    继續    ',
            handler: () => {
              console.log('Agree clicked');

              alert.present();
            }
          }
        ]
      });

      if(form.value.wfForm == '3' && (form.value.wfProcess == '9' || form.value.wfProcess == '2')) {
        alert.present();
      } else {
        qtyConfirm.present();
      }
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
        text: '    確定    ',
        handler: () => {

          if(finalSubmission){
            console.log('上存 + 完成工序 is clicked');
            if (this.finalValidation(form)){
              console.log('Final confirmation of mark completion is clicked');
              form.controls['wfFormStatus'].setValue(true);
              form.controls['wfLastCompletedWf'].setValue(form.value.wfProcess);
              console.log("uploading form" + JSON.stringify(form.value));
              this.formSubmission(form,images,navCtrl);

            }

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

  wfFormSubmission(wfInputForm: any, navCtrl: any, images: any, finalSubmission: boolean) {
    // This function manage all the form submission in each of the wfForm and connect with the server call
    // 7 inputs for this function,
    //    1. wfOrderTotalQty,
    //    2. wfOrderTotalGoodQty,
    //    3. wfOptBadQtyValue,
    //    4. wfOptGoodQtyValue,
    //    5. wfInputForm,
    //    6. navCtrl,
    //    7. images
    //
    // This function will create an alert with 2 options:
    //    1. Upload
    //    2. Upload and mark process completion
    // Both function set the wfProcessStatus and then execute formSubmission
    //
    // Note:
    //    1. The navCtrl from each form must be passed into this function
    //    2. The alertCtrl for the form submission is handled here
    //    3. Further logic and subscribe function call is handled within here
    //
    // Further work:
    //    1. Error handling on the Server connection is not being handled here
    //    2. Prelim assumption is that any request has failed to send to server
    //       will be stored locally and show a counter in the main page
    //       with a button to send all the pending data


    let form = wfInputForm;

    //form.controls['wfStaffOptName'].setValue('作业員A');

    let missingFeildAlert = true;
    let missingFeildMsg = '';

    if(form.value.wfForm == '1') {

      if(! this.checkInputAsTime(form.value.wfOptStartTime)) {
        missingFeildMsg += '<br>1. 正確开始时间值必须为 0000 - 2359 之間!';
        form.controls['wfOptStartTime'].setValue(this.toInt(form.value.wfOptStartTime));

      }

      if(! this.checkInputAsTime(form.value.wfOptFinishTime)){
        missingFeildMsg += '<br>2. 完成时间值必须为 0000 - 2359 之間!';
        form.controls['wfOptFinishTime'].setValue(this.toInt(form.value.wfOptFinishTime));

      }

      if(form.value.wfOptBadQty < 0) {
        missingFeildMsg += '<br>3. 不良数不能小於零!';
      }
      if(form.value.wfOptGoodQty < 0) {
        missingFeildMsg += '<br>4. 良品数必須为正数!';
      }
      if(typeof form.value.wfStaffOptName === 'undefined') {
        missingFeildMsg += '<br>5. 輸入作业員!';
      }


    } else if(form.value.wfForm == '2') {

      if(form.value.wfOptBadQty < 0) {
        missingFeildMsg += '<br>3. 不良数不能小於零';
      }
      if(form.value.wfOptGoodQty < 0) {
        missingFeildMsg += '<br>4. 良品数必須为正数!';
      }
      if(typeof form.value.wfStaffOptName === 'undefined' && form.value.wfProcess != 4) {
        missingFeildMsg += '<br>5. 輸入作业員!';

      }

    } else if(form.value.wfForm == '3' && form.value.wfProcess != '9') {
      if(! this.checkInputAsTime(form.value.wfOptStartTime)) {
        missingFeildMsg += '<br>1. 正確开始时间值必须为 0000 - 2359 之間!';
        form.controls['wfOptStartTime'].setValue(this.toInt(form.value.wfOptStartTime));

      }

      if(! this.checkInputAsTime(form.value.wfOptFinishTime)){
        missingFeildMsg += '<br>2. 完成时间值必须为 0000 - 2359 之間!';
        form.controls['wfOptFinishTime'].setValue(this.toInt(form.value.wfOptFinishTime));

      }

      if(form.value.wfOptBadQty < 0) {
        missingFeildMsg += '<br>3. 不良数不能小於零!';

      }

      if(form.value.wfOptGoodQty < 0) {
        missingFeildMsg += '<br>4. 良品数必須为正数!';

      }

      if ( typeof form.value.wfStaffOptName === 'undefined' ) {
        missingFeildMsg += '<br>5. 輸入作业員!';

      }
    }

    if(missingFeildMsg != '') {
      missingFeildAlert = false;
      this.warningAlert('請提供或更正下列资料：', missingFeildMsg, '继續');

    }

    if(missingFeildAlert) {
      if((form.value.wfForm == '1' && (form.value.wfProcess == '5' || form.value.wfProcess == '6' || form.value.wfProcess == '8')) || (form.value.wfForm == '3' && (form.value.wfProcess == '7' || form.value.wfProcess == '8')))
      {
        let totalBadQtyX = this.toInt(form.value.wfBadQty1);
        totalBadQtyX += this.toInt(form.value.wfBadQty2);
        totalBadQtyX += this.toInt(form.value.wfBadQty3);
        totalBadQtyX += this.toInt(form.value.wfBadQty4);
        totalBadQtyX += this.toInt(form.value.wfBadQty5);
        totalBadQtyX += this.toInt(form.value.wfBadQty6);

        form.controls['wfOptBadQty'].setValue(totalBadQtyX);
      }

      let updatedGoodQty = this.toInt(form.value.wfOptGoodQty) / 1000;
      let qtyCheckMsg = '<br>不良数總和: ' + this.toInt(form.value.wfOptBadQty);

      qtyCheckMsg += '<br>良品数: ' + this.toInt(form.value.wfOptGoodQty) + ' (' + updatedGoodQty + 'K)';

      if(this.toInt(form.value.wfOptBadQty) > this.toInt(form.value.wfOptGoodQty)) {
        qtyCheckMsg += '<br>不良数 ('+form.value.wfOptBadQty+') 大於 良品数 ('+form.value.wfOptGoodQty+')！';
      }

      if(this.toInt(form.value.wfOptGoodQty) > this.toInt(form.value.wfOrderBatchQty) * 1000) {
        qtyCheckMsg += '<br>良品数 ('+form.value.wfOptGoodQty+') 大於 批次量 ('+ form.value.wfOrderBatchQty * 1000 +')！';
      }

      qtyCheckMsg += '<br>如需修改，請按 “取消” 再重新輸入。';

      let qtyConfirm = this.alertCtrl.create({
        title: '',
        message: qtyCheckMsg,
        buttons: [
          {
            text: '    取消    ',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: '    继續    ',
            handler: () => {
              console.log('Agree clicked');
              this.wfFormUpload(form, navCtrl, images, finalSubmission);
            }
          }
        ]
      });

      if(form.value.wfForm == '3' && (form.value.wfProcess == '9' || form.value.wfProcess == '2')) {
        this.wfFormUpload(form, navCtrl, images, finalSubmission);
      } else {
        qtyConfirm.present();
      }
    }

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
    this.warningAlert('', this.appDate+' - '+endDate+' ', '继續');
  }

  showGoodBadQtyInputsAlert(wfInputForm: any) {

    let form = wfInputForm;   
    
    let wfOptBadQtyValue = form.value.wfOptBadQty;
    let wfOptGoodQtyValue = form.value.wfOptGoodQty;
    let wfOrderBatchQtyValue = form.value.wfOrderBatchQty;
    
    if(wfOptGoodQtyValue === '') {
      this.warningAlert('', '請輸入良品数', '继續');
    } else if(wfOptBadQtyValue === '') {
      this.warningAlert('', '請輸入不良数', '继續');
    }
    wfOptBadQtyValue = this.toInt(wfOptBadQtyValue);
    wfOptGoodQtyValue = this.toInt(wfOptGoodQtyValue);
    wfOrderBatchQtyValue = this.toInt(wfOrderBatchQtyValue);
    /*
    if(wfOptGoodQtyValue <= 0) {
      this.warningAlert('', '請輸入良品数('+wfOptGoodQtyValue+')', '继續');
    } 
    if(wfOptBadQtyValue <= 0 ) {
      this.warningAlert('', '請輸入不良数('+wfOptBadQtyValue+')', '继續');
    } else */ if(wfOptBadQtyValue > wfOptGoodQtyValue) {
      this.warningAlert('', '不良数('+wfOptBadQtyValue+')大於良品数('+wfOptGoodQtyValue+')', '继續');
    } else if(wfOptGoodQtyValue > wfOrderBatchQtyValue * 1000) {
      this.warningAlert('', '良品数('+wfOptGoodQtyValue+')大於批次量('+wfOrderBatchQtyValue * 1000+')', '继續');
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
        alert("嚫，查无此人!?");
        break;

      case "wfStaffLeadName":
        for (let key in staffTable) {
          if (staffTable[key].wfStaffLeadId == input  || staffTable[key].wfStaffLeadName == input){
            form.controls["wfStaffLeadName"].setValue(staffTable[key].wfStaffLeadName);
            form.controls["wfStaffLeadId"].setValue(staffTable[key].wfStaffLeadId);

            return;
          }
        }

        alert("嚫，查无此人!?");
        break;

      case "wfStaffQCName":
        for (let key in staffTable) {
          if (staffTable[key].wfStaffQCId == input  || staffTable[key].wfStaffQCName == input){
            form.controls["wfStaffQCId"].setValue(staffTable[key].wfStaffQCId);
            form.controls["wfStaffQCName"].setValue(staffTable[key].wfStaffQCName);

            return;
          }
        }
        alert("嚫，查无此人!?");
        break;

      case "wfStaffTechName":
        for (let key in staffTable) {
          if (staffTable[key].wfStaffTechId == input  || staffTable[key].wfStaffTechName == input){
            form.controls["wfStaffTechId"].setValue(staffTable[key].wfStaffTechId);
            form.controls["wfStaffTechName"].setValue(staffTable[key].wfStaffTechName);

            return;
          }
        }
        alert("嚫，查无此人!?");
        break;

      case "wfStaffXrayName":
        for (let key in staffTable) {
          if (staffTable[key].wfStaffXrayId == input  || staffTable[key].wfStaffXrayName == input){
            form.controls["wfStaffXrayId"].setValue(staffTable[key].wfStaffXrayId);
            form.controls["wfStaffXrayName"].setValue(staffTable[key].wfStaffXrayName);

            return;
          }
        }
        alert("嚫，查无此人!?");
        break;

      default:
        console.log("Failed to lookup the staff record " + model);
        alert("嚫，查无此人!?");
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
    alert("嚫，查无此人!?");

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
    this.storage.clear();
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

    this.storage.set(form.value.wfFormId, form.value);

    this.upload(form.value,form.value.wfForm)
      .subscribe((data)=> {
          console.log("Successfully uploading to server");
          console.log("Upload wfInput reply from server" + JSON.stringify(data));

          if (images.length > 0){
            console.log("uploading images to server");

            this.uploadImage(form, images).subscribe((data) => {
              // alert(data);
              // need to add loading screen for image upload
              navCtrl.setRoot(WorkflowPage);

            })


          } else {
            // Below code can be comment out that depends on the Error handling
            // Return back to main page
            // BUG: Calling navCtrl.pop outside of the image upload will have issue that
            //      it is executed before images upload finish
            // navCtrl.pop();
            // this.storage.clear();
            navCtrl.setRoot(WorkflowPage);
          }
        },
        error => {
          // On error, prompt network msg and can save locally
          console.log(error);
          this.networkError(form, navCtrl);
          
        }
        
      );
  };

  networkError(form:any, navCtrl: any){
    let alert = this.alertCtrl.create({
      title: '注意!',
      message: '嚫!网路不给力,请再试一次!',
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
          this.storage.set(form.value.wfFormId, form.value);
          navCtrl.setRoot(WorkflowPage);
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
    form.controls["wfGoodTotal"].setValue(( this.toInt(form.value.wfOptGoodQty) + this.toInt(form.value.wfGoodTotal)));
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
      .timeout(1000)
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
      .timeout(1000)
      .map((response: Response) => {
        console.log("Responding from ERP Exc Server");
        // console.log(response.json());
        return response.json();
      });
  };

  finalValidation(form:any) {
    var except = form.value.wfFormExcept;
    console.log('wfFormExcept is ' + except);
    if (except) {
      return true;
    } else {
      let startQty = this.toInt(form.value.wfOptStartQty);
      let goodQty: number;

      if(this.toInt(form.value.wfOptGoodQty) == 0) {
        goodQty = startQty
      } else {
        goodQty = this.toInt(form.value.wfOptGoodQty);
      }

      let badQty = this.toInt(form.value.wfOptBadQty);
      let batchQty = (this.toInt(form.value.wfOrderBatchQty)) * 1000;

      let wtForm = form.value.wfForm;
      let ProcessCount = this.toInt(form.value.wfProcess);

      //良品数上下限
      let QC_UPPER = 1.2;
      let QC_LOWER = 0.8;

      //vairance (flexible quantity - inputQty)
      let OtherLimit = 3000;

      //not exceeding 10k of batch qty
      //flexible_quantity - Finished_Product = 10000;
      let finishProdLimit = 10000;

      //  sub process card
      //rule 5 cannot exceed batch quantity
      if (badQty > batchQty) {
        console.log('batchQty' + batchQty);
        console.log('badqty'+ badQty);
        alert('不良品不得超过批次量');
        return false;
      }

      switch (wtForm) {
        // specific process cards
        // CASE 1 (naked process card )

        case '1':
          if (ProcessCount>1) {
            if (Math.abs(goodQty - startQty) <= OtherLimit) {
              return true;
            }
            // rule 4 cant not exceed 20% of good quantity from last process
            else if (goodQty > (QC_UPPER * startQty)) {
              alert('良品数上限不得超过投入数百分之二十');
              return false;
            }
            // rule number 7 good quantity exceeding 3k, cant allow it lower than 80% of good qty from last process
            else if (goodQty < (QC_LOWER * startQty)) {
              alert('良品数下限不得低于投入数百分之八十');
              return false;
            }
          } else {
            return true;
          }
          break;

        // CASE 2 (finished product)
        case '2':
          if (ProcessCount>1) {
            if (Math.abs(goodQty - startQty) <= OtherLimit) {
              console.log('goodQty' + goodQty);
              console.log('startQty' + startQty);
              console.log('batchQty' + batchQty);
              // rule 2 cant be below batch quantity
              if (goodQty < batchQty) {
                alert('良品数不得小于批次量');
                return false;
              }

              //rule 1 cannot exceed 10k of batch quantity
              else if ((goodQty - batchQty) > (finishProdLimit)) {
                alert('良品不得超過批次量一万以上');
                return false;
              }
            }
            // rule number 7 good quantity exceeding 3k, cant allow it lower than 80% of good qty from last process
            else if (goodQty < (QC_LOWER * startQty)) {
              alert('良品数下限不得低于投入数百分之八十');
              return false;
            }
          } else {
            if (goodQty < batchQty) {
              alert('良品数不得小于批次量');
              return false;
            }

            //rule 1 cannot exceed 10k of batch quantity
            else if ((goodQty - batchQty) > (finishProdLimit)) {
              alert('良品不得超過批次量一万以上');
              return false;
            }
          }
          break;

        // CASE 3 (插件 embedded)
        //same logic as naked product
        case '3':
          if (ProcessCount>1) {
            if (Math.abs(goodQty - startQty) <= OtherLimit) {
              return true;
            }
            // rule 4 cant not exceed 20% of good quantity from last process
            else if (goodQty > (QC_UPPER * startQty)) {
              alert('良品数上限不得超过投入数百分之二十');
              return false;
            }
            // rule number 7 good quantity exceeding 3k, cant allow it lower than 80% of good qty from last process
            else if (goodQty < (QC_LOWER * startQty)) {
              alert('良品数下限不得低于投入数百分之八十');
              return false;
            }
          } else {
            return true;
          }
          break;

        default:
          return true;
      }

    }
  };

  dateValidation(form:any){
    // Assume each shift is finished within 24 hours
    // If the finish time is bigger than start time, then
    //    It assume it has finished in the next day

    console.log("In the dateValidation");
    console.log('inputdate' + form.value.wfOptInputDate);
    let dateObj = new Date(form.value.wfOptInputDate);
    let numberOfDaysToAdd = 1;

    if (form.value.wfOptStartTime > form.value.wfOptFinishTime) {
      dateObj.setDate(dateObj.getDate() + numberOfDaysToAdd);
      console.log("Time has been checked, increase date by 1")
    }

    form.controls["wfOptInputEndDate"].setValue(dateObj);
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
      .timeout(3000)
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
      .timeout(3000)
      .map((response: Response) => {
        // console.log("Responding from Server of staff Data " + JSON.stringify(response.json()[0]));
        return response.json()[0];
      });
  }


}
