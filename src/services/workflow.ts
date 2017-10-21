import { Injectable} from "@angular/core";
// import { HTTP } from "@ionic-native/http";
import 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Injectable()
export class WorkflowService {
  private httpHeaders = new Headers({ 'Content-type':'application/json' });
  private httpOptions = new RequestOptions({ headers:this.httpHeaders });

  // For Dev url
  // private baseUrl = "http://localhost:3000/workflow/";
  private baseUrl = "http://192.168.31.170:3000/workflow/";

  // For Test url
  // private baseUrl = "http://192.168.4.200:3000/workflow/";
  // private baseUrl = "http://172.20.10.2:3000/workflow/";

  constructor(private http: Http,
              private storage: Storage,
              private alertCtrl: AlertController){}

  upload(wfInputForm: any, wfForm: number){
    console.log("Begin to upload onto server");
    console.log("Printing packet to server : " + JSON.stringify(wfInputForm));

    let queryUrl = this.baseUrl + "form" + wfForm +"/submit/";
    console.log(queryUrl);

    return this.http.post(queryUrl, wfInputForm, this.httpOptions)
      .timeout(1000)
      .map((response: Response) => {
        console.log("Responding from Server");
        console.log(response.json());
        return response.json();
      });
  }

  query(wfInputForm: any, wfForm: number){
    console.log("Begin to load data from server");
    console.log("Printing request to server : " + JSON.stringify(wfInputForm));

    let queryUrl = this.baseUrl + "form" + wfForm +"/query/";
    console.log(queryUrl);

    return this.http.post(queryUrl, wfInputForm, this.httpOptions)
      .timeout(1000)
      .map((response: Response) => {
        console.log("Responding from Server");
        console.log(response.json()[0]);
        return response.json();
      });
  }

  uploadImage(wfInputForm: any, wfForm: number, image: any, wfImgNum: number, wfImgTotal: number) {
    // Upload image one at a time

    let form = wfInputForm;
    let queryUrl = this.baseUrl + "form" + wfForm +"/image/submit/";

    console.log(queryUrl);
    console.log("Begin to upload image onto server!");
    console.log("Constructing packet to server!");
    console.log("Printing wfInputForm :" + JSON.stringify(form.value));

    // construct packet
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

  showWfOpsFinalInputsAlert(wfOrderTotalQty: any, wfOrderTotalGoodQty: any, wfOptBadQtyValue: any, wfOptGoodQtyValue: any, wfInputForm: any, navCtrl: any, images: any) {

    let form = wfInputForm;
    let alert = this.alertCtrl.create({

      title: '注意!',
      subTitle: '确定完成和上存工單' + form.value.wfFormId,
      buttons: [{
        text: '上存',
        handler: () => {
          console.log('save clicked');
          form.value.wfProcessStatus = "0";
          this.storage.set(form.value.wfFormId, form.value);

          this.upload(form.value,1)
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

                // Return back to main page
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

          navCtrl.pop();
        }
      },
        {
          text: '上存 + 完成工序',
          handler: () => {
            console.log('submit and save clicked');
            console.log("uploading form" + JSON.stringify(form.value));

            let alertCtrl = this.alertCtrl.create({
              title: '嚫!',
              // subTitle: 'Please select 终检!' + dataXYZ.wfProcess + ' ' + dataXYZ.wfProcessName + ' ' + form.value.wfFormId + ' ' + JSON.stringify(resultStorageItemX),
              // comment above for faster process
              subTitle: '完成终检!' + form.value.wfProcess + ' ' + form.value.wfProcessName + ' ' + form.value.wfFormId,
              buttons: [{text: '確定',
                handler: () => {
                  form.value.wfProcessStatus = "1";
                  this.storage.set(form.value.wfFormId, form.value);

                  // Upload to Server
                  console.log("uploading to server");

                  // Upload images
                  this.upload(form.value,form.value.wfForm)
                    .subscribe((data)=> {
                        console.log("Successfully uploading to server");
                        console.log("Upload wfInput reply from server" + JSON.stringify(data));

                        if (images.length > 0){
                          console.log("uploading images to server");
                          let imgTotal = images.length;

                          for (let i = 0; i < imgTotal; i++) {
                            this.uploadImage(form,form.value.wfForm,images[i],i,imgTotal)
                              .subscribe((data)=> {
                                  console.log("Successfully uploading to server");
                                  console.log("Upload img reply from server" + JSON.stringify(data));

                                },
                                error => {
                                  console.log(error);
                                  // let alert = this.alertCtrl.create({
                                  //   title: '注意!',
                                  //   message: '嚫!网路不给力,请再试一次!',
                                  //   buttons: ['好的']
                                  // });
                                  // alert.present();
                                }
                              );
                          }
                        }

                        // Return back to main page
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
              }]
            });

            alertCtrl.present();

            //this.onSubmit();
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

}
