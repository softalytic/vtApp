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
    let queryUrl = this.baseUrl + "form" + wfForm +"/submit/";
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

    let queryUrl = this.baseUrl + "form" + wfForm +"/query/";
    console.log("Requesting url: " + queryUrl);

    return this.http.post(queryUrl, wfInputForm, this.httpOptions)
      .timeout(1000)
      .map((response: Response) => {
        console.log("Responding from Server");
        console.log(response.json()[0]);
        return response.json();
      });
  }

  uploadImage(wfInputForm: any, wfForm: number, image: any, wfImgNum: number, wfImgTotal: number) {
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

    let form = wfInputForm;
    let queryUrl = this.baseUrl + "form" + wfForm +"/image/submit/";
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

      'wfImgTotal': wfImgTotal,
      'wfImgNum': wfImgNum,
      'wfImg': image,
    };

    return this.http.post(queryUrl, packet, this.httpOptions)
      .timeout(5000)
      .map((response: Response) => {
        console.log("Responding from Server" + response);
        return response.json();
      });
  }

  showWfOpsFinalInputsAlert(wfOrderTotalQty: any, wfOrderTotalGoodQty: any, wfOptBadQtyValue: any, wfOptGoodQtyValue: any, wfInputForm: any, navCtrl: any, images: any, wfPName: any) {
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
    /*
    let wfPName = '';
    if(form.value.wfProcess == '1') {
      wfPName = '裸品流程卡'+form.value.wfProcess;
    } else if(form.value.wfProcess == '2') {
      wfPName = '成品流程卡'+form.value.wfProcess;
    } else if(form.value.wfProcess == '3') {
      wfPName = '电容器流程卡'+form.value.wfProcess;
    }
    */
    let alert = this.alertCtrl.create({

      //title: wfPName + ' (' + form.value.wfFormId + ')',
      subTitle:  wfPName + ' (' + form.value.wfFormId + ')' + '<br><br>工序 = ' + form.value.wfProcessName,
      buttons: [{
        text: '上存',
        handler: () => {
          console.log('上存 is clicked');
          console.log("uploading form" + JSON.stringify(form.value));

          form.value.wfProcessStatus = "0";
          this.formSubmission(form,images,navCtrl);
          // This function replace below code block
          // this.storage.set(form.value.wfFormId, form.value);
          //
          // this.upload(form.value,form.value.wfForm)
          //   .subscribe((data)=> {
          //       console.log("Successfully uploading to server");
          //       console.log("Upload wfInput reply from server" + JSON.stringify(data));
          //
          //       if (images.length > 0){
          //         console.log("uploading images to server");
          //         let imgTotal = images.length;
          //
          //         for (let i = 0; i < imgTotal; i++) {
          //           this.uploadImage(form,1,images[i],i,imgTotal)
          //             .subscribe((data)=> {
          //                 console.log("Successfully uploading to server");
          //                 console.log("Upload img reply from server" + JSON.stringify(data));
          //
          //               },
          //               error => {
          //                 console.log(error);
          //                 let alert = this.alertCtrl.create({
          //                   title: '注意!',
          //                   message: '嚫!网路不给力,请再试一次!',
          //                   buttons: ['好的']
          //                 });
          //                 alert.present();
          //               }
          //             );
          //         }
          //       }
          //
          //       // Return back to main page
          //       navCtrl.pop();
          //     },
          //     error => {
          //       console.log(error);
          //       let alert = this.alertCtrl.create({
          //         title: '注意!',
          //         message: '嚫!网路不给力,请再试一次!',
          //         buttons: ['好的']
          //       });
          //       alert.present();
          //
          //     }
          //   );

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
              subTitle: '上存及完成工序<br><br>注意: 按"確定"後其他人員將不能再输入同一流程卡，同一工序资料',
              buttons: [{
                text: '確定',
                handler: () => {
                  console.log('Final confirmation of mark completion is clicked');
                  console.log("uploading form" + JSON.stringify(form.value));

                  form.value.wfProcessStatus = "1";
                  this.formSubmission(form,images,navCtrl);
                  // This function replace below code block
                  // this.storage.set(form.value.wfFormId, form.value);
                  //
                  // // Upload to Server
                  // console.log("uploading to server");
                  //
                  // // Upload images
                  // this.upload(form.value,form.value.wfForm)
                  //   .subscribe((data)=> {
                  //       console.log("Successfully uploading to server");
                  //       console.log("Upload wfInput reply from server" + JSON.stringify(data));
                  //
                  //       if (images.length > 0){
                  //         console.log("uploading images to server");
                  //         let imgTotal = images.length;
                  //
                  //         for (let i = 0; i < imgTotal; i++) {
                  //           this.uploadImage(form,form.value.wfForm,images[i],i,imgTotal)
                  //             .subscribe((data)=> {
                  //                 console.log("Successfully uploading to server");
                  //                 console.log("Upload img reply from server" + JSON.stringify(data));
                  //
                  //               },
                  //               error => {
                  //                 console.log(error);
                  //                 // let alert = this.alertCtrl.create({
                  //                 //   title: '注意!',
                  //                 //   message: '嚫!网路不给力,请再试一次!',
                  //                 //   buttons: ['好的']
                  //                 // });
                  //                 // alert.present();
                  //               }
                  //             );
                  //         }
                  //       }
                  //
                  //       // Return back to main page
                  //       navCtrl.pop();
                  //     },
                  //     error => {
                  //       console.log(error);
                  //       let alert = this.alertCtrl.create({
                  //         title: '注意!',
                  //         message: '嚫!网路不给力,请再试一次!',
                  //         buttons: ['好的']
                  //       });
                  //       alert.present();
                  //
                  //     }
                  //   );

                }
              },{
                text: '取消',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }]
            });

            alertCtrl.present();

          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    alert.present();

    // if(wfOptGoodQtyValue) {
    //   let form = wfInputForm;
    //   let alert = this.alertCtrl.create({
    //
    //     title: '注意!',
    //     subTitle: '确定完成和上存工單' + form.value.wfFormId,
    //     buttons: [{
    //       text: '上存',
    //       handler: () => {
    //         console.log('save clicked');
    //         form.value.wfProcessStatus = "0";
    //         this.storage.set(form.value.wfFormId, form.value);
    //
    //         this.upload(form.value,1)
    //           .subscribe((data)=> {
    //               console.log("Successfully uploading to server");
    //               console.log("Upload wfInput reply from server" + JSON.stringify(data));
    //
    //               if (images.length > 0){
    //                 console.log("uploading images to server");
    //                 let imgTotal = images.length;
    //
    //                 for (let i = 0; i < imgTotal; i++) {
    //                   this.uploadImage(form,1,images[i],i,imgTotal)
    //                     .subscribe((data)=> {
    //                         console.log("Successfully uploading to server");
    //                         console.log("Upload img reply from server" + JSON.stringify(data));
    //
    //                       },
    //                       error => {
    //                         console.log(error);
    //                         let alert = this.alertCtrl.create({
    //                           title: '注意!',
    //                           message: '嚫!网路不给力,请再试一次!',
    //                           buttons: ['好的']
    //                         });
    //                         alert.present();
    //                       }
    //                     );
    //                 }
    //               }
    //
    //               // Return back to main page
    //               navCtrl.pop();
    //             },
    //             error => {
    //               console.log(error);
    //               let alert = this.alertCtrl.create({
    //                 title: '注意!',
    //                 message: '嚫!网路不给力,请再试一次!',
    //                 buttons: ['好的']
    //               });
    //               alert.present();
    //
    //             }
    //           );
    //
    //         navCtrl.pop();
    //       }
    //     },
    //       {
    //         text: '上存 + 完成工序',
    //         handler: () => {
    //           console.log('submit and save clicked');
    //           console.log("uploading form" + JSON.stringify(form.value));
    //
    //           let alertCtrl = this.alertCtrl.create({
    //             title: '嚫!',
    //             // subTitle: 'Please select 终检!' + dataXYZ.wfProcess + ' ' + dataXYZ.wfProcessName + ' ' + form.value.wfFormId + ' ' + JSON.stringify(resultStorageItemX),
    //             // comment above for faster process
    //             subTitle: '完成终检!' + form.value.wfProcess + ' ' + form.value.wfProcessName + ' ' + form.value.wfFormId,
    //             buttons: [{text: '確定',
    //               handler: () => {
    //                 form.value.wfProcessStatus = "1";
    //                 this.storage.set(form.value.wfFormId, form.value);
    //
    //                 // Upload to Server
    //                 console.log("uploading to server");
    //
    //                 // Upload images
    //                 this.upload(form.value,form.value.wfForm)
    //                   .subscribe((data)=> {
    //                       console.log("Successfully uploading to server");
    //                       console.log("Upload wfInput reply from server" + JSON.stringify(data));
    //
    //                       if (images.length > 0){
    //                         console.log("uploading images to server");
    //                         let imgTotal = images.length;
    //
    //                         for (let i = 0; i < imgTotal; i++) {
    //                           this.uploadImage(form,form.value.wfForm,images[i],i,imgTotal)
    //                             .subscribe((data)=> {
    //                                 console.log("Successfully uploading to server");
    //                                 console.log("Upload img reply from server" + JSON.stringify(data));
    //
    //                               },
    //                               error => {
    //                                 console.log(error);
    //                                 // let alert = this.alertCtrl.create({
    //                                 //   title: '注意!',
    //                                 //   message: '嚫!网路不给力,请再试一次!',
    //                                 //   buttons: ['好的']
    //                                 // });
    //                                 // alert.present();
    //                               }
    //                             );
    //                         }
    //                       }
    //
    //                       // Return back to main page
    //                       navCtrl.pop();
    //                     },
    //                     error => {
    //                       console.log(error);
    //                       let alert = this.alertCtrl.create({
    //                         title: '注意!',
    //                         message: '嚫!网路不给力,请再试一次!',
    //                         buttons: ['好的']
    //                       });
    //                       alert.present();
    //
    //                     }
    //                   );
    //               }
    //             }]
    //           });
    //
    //           alertCtrl.present();
    //
    //           //this.onSubmit();
    //         }
    //       }, {
    //         text: '取消',
    //         role: 'cancel',
    //         handler: () => {
    //           console.log('Cancel clicked');
    //         }
    //       }]
    //   });
    //   alert.present();
    // } else {
    //   let alert = this.alertCtrl.create({
    //     title: '',
    //     subTitle: '请确定内容: 日期，开始，完成，良品数，不良数 ',
    //     buttons: ['確定']
    //   });
    //   alert.present();
    // }
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
    wfOptBadQtyValue = parseInt(wfOptBadQtyValue);
    wfOptGoodQtyValue = parseInt(wfOptGoodQtyValue);
    wfOrderBatchQtyValue = parseInt(wfOrderBatchQtyValue);
    /*
    if(wfOptGoodQtyValue <= 0) {
      this.warningAlert('', '請輸入良品数('+wfOptGoodQtyValue+')', '继續');
    } 
    if(wfOptBadQtyValue <= 0 ) {
      this.warningAlert('', '請輸入不良数('+wfOptBadQtyValue+')', '继續');
    } else */ if(wfOptBadQtyValue > wfOptGoodQtyValue) {
      this.warningAlert('', '不良数('+wfOptBadQtyValue+')大於良品数('+wfOptGoodQtyValue+')', '继續');
    } else if(wfOptGoodQtyValue > wfOrderBatchQtyValue) {
      this.warningAlert('', '良品数('+wfOptGoodQtyValue+')大於批次量('+wfOrderBatchQtyValue+')', '继續');
    } 
    
  }

  updateTextChg(wfInputForm: any) {
    let form = wfInputForm;
    form.controls['wfStaffOptShift'].setValue('A');
    form.controls['wfStaffTechName'].setValue('技術員A');
    form.controls['wfStaffQCName'].setValue('品检員A');
  }

  updateTextChg2(wfInputForm: any) {
    let form = wfInputForm;
    form.controls['wfStaffTechName'].setValue('技術員A');
    form.controls['wfStaffQCName'].setValue('品检員A');
  }

  updateTextChg3(wfInputForm: any) {
    let form = wfInputForm;
    form.controls['wfStaffOptShift'].setValue('A');
    form.controls['wfStaffTechName'].setValue('技術員A');
    form.controls['wfOptQtyChecked'].setValue(8);
    form.controls['wfStaffRepairName'].setValue('維修員A');
    form.controls['wfStaffQCName'].setValue('品检員A');
  }

  warningAlert(titleTxt: any, subTitleTxt: any, buttons: any) {
    let alert = this.alertCtrl.create({
      title: titleTxt,
      subTitle: subTitleTxt,
      buttons: [buttons]
    });
    alert.present();
  }

  cancelBtn(navCtrl: any) {
    this.storage.clear();
    navCtrl.setRoot(WorkflowPage);
  }

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

    this.storage.set(form.value.wfFormId, form.value);
    /*
    //added this for testing clear
    this.storage.clear();
    let dataWfProcess = {
      "1":{"wfFormName": "裸品流程卡", "Process":{"1":"釘卷","2":"含浸","3":"组立","4":"清洗","5":"自動老化","6":"手工老化","7":"串排","8":"测试分选","9":"外观"}},
      "2":{"wfFormName": "成品流程卡", "Process":{"1":"打印","2":"测试上带","3":"贴片外观","4":"终检"}},
      "3":{"wfFormName": "电容器流程卡", "Process":{"1":"素子钉卷","2":"烘干","3":"含浸","4":"組立","5":"清洗","6":"套管","7":"老化","8":"手工分选","9":"外观全检","10":"编带剪切","11":"包装"}}
    };
  
    let dataMachine = {
      "AA001":{"wfStaffOptId":"S0001","wfStaffOptName":"員工01","wfStaffTechId":"T0001","wfStaffTechName":"技術員工01","wfStaffXrayId":"X0001","wfStaffXrayName":"Xray員工01","wfStaffOptShift":"A"},
      "AB002":{"wfStaffOptId":"S0002","wfStaffOptName":"員工02","wfStaffTechId":"T0002","wfStaffTechName":"技術員工01","wfStaffXrayId":"X0002","wfStaffXrayName":"Xray員工02","wfStaffOptShift":"B"},
      "AC003":{"wfStaffOptId":"S0003","wfStaffOptName":"員工03","wfStaffTechId":"T0003","wfStaffTechName":"技術員工03","wfStaffXrayId":"X0003","wfStaffXrayName":"Xray員工03","wfStaffOptShift":"A"}
    };
    this.storage.set("wfProcess", dataWfProcess);
    this.storage.set("wfMachine", dataMachine);
    */

    //navCtrl.popToRoot();
    //navCtrl.remove(0, 1); 
    //navCtrl.insert(1, WorkflowPage);
    this.storage.clear();
    navCtrl.setRoot(WorkflowPage);
    //navCtrl.pop();
    
    
    this.upload(form.value,form.value.wfForm)
      .subscribe((data)=> {
          console.log("Successfully uploading to server");
          console.log("Upload wfInput reply from server" + JSON.stringify(data));

          if (images.length > 0){
            console.log("uploading images to server");
            let imgTotal = images.length;

            for (let i = 0; i < imgTotal; i++) {
              this.uploadImage(form,1,images[i],i,imgTotal)
                .subscribe((data)=> {
                    console.log("Successfully uploading to server");
                    console.log("Upload img reply from server" + JSON.stringify(data));

                  },
                  error => {
                    console.log(error);
                    let alert = this.alertCtrl.create({
                      title: '注意!',
                      message: '嚫!网路不给力,请再试一次!',
                      buttons: ['好的']
                    });
                    alert.present();
                  }
                );
            }
          }

          // Below code can be comment out that depends on the Error handling
          // Return back to main page
          // BUG: Calling navCtrl.pop outside of the image upload will have issue that
          //      it is executed before images upload finish
          navCtrl.pop();
        },
        error => {
          console.log(error);
          let alert = this.alertCtrl.create({
            title: '注意!',
            message: '嚫!网路不给力,请再试一次!',
            buttons: ['好的']
          });
          alert.present();
          
        }
        
      );
  }
}
