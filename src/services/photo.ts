import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { AlertController } from 'ionic-angular';

@Injectable()
export class PhotoService {
  // The photo function has been isolated in this Service
  // This service has 1 main function for calling:
  // 1. shoot

  constructor(private storage: Storage,
              private camera: Camera,
              private alertCtrl:AlertController){}

  shoot(images:any, form: any) {
    // This function will call the camera's getPicture function
    // 2 inputs for this function,
    //    1. images array
    //    2. the form itself
    //
    // This function will check if the array of images exceed the limit
    // Current limit set as 5
    // If number of images taken is less than 5 then
    //    Set Camera photo option
    //    Get picture from camera:
    //      concat the image as base64 string with imgUrl that can be shown in the html
    //      push the string into the images array
    //      save the image array into the storage with key: wfFormId + 'img', value: images: array
    // Else
    //    Alert user that they have exceed the limit
    //
    // Future work:
    //    Current function ony has the set function and
    //    will need to add "remove" function of the images

    if (images.length < 5 ) {
      // If the number of images taken is within the limit
      console.log("taking photos for form " + form.value.wfFormId );

      // Set the camera options
      const camOpt: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        saveToPhotoAlbum: true
      };

      // Shoot the photo
      this.camera.getPicture(camOpt).then((imageData) => {
        // The image taken is base64 type and append with below string then
        // it can be shown directly in the html
        let imgUrl = 'data:image/jpeg;base64,' + imageData;

        // An array of img to be loaded and pushed onto the html
        images.push(imgUrl);

        // Store the img into storage with wfFormIdimg as the key
        this.storage.set(form.value.wfFormId + 'img', images);
        console.log(images.length() + " # of images stored")
        // alert("from items " + form.value.wfFormId + 'img');
        //alert()
      }, (err) => {
        console.log("Got and error on taking photo of " + form.value.wfFormId + " : " +err);

      });

    } else {
      // Error handling to alert the user
      let alert = this.alertCtrl.create({
        title: '注意!',
        message: '嚫，最多只能拍5張美圖!',
        buttons: ['好的']
      });
      alert.present();

    }

  }

  imgDelete(images:any, imgIndex: any, form: any) {
    this.storage.get(form.value.wfFormId + 'img').then((imagesX) => {
      if(imagesX) {
        let alert = this.alertCtrl.create({
          title: '删除照片',
          subTitle: '',
          buttons: [
            {
              text: '取消',
              role: 'cancel',
              handler: data => {
                console.log('User has clicked Cancel on img delete');
              }
            },
            {
              text: '确定',
              handler: data => {
                //images = JSON.parse(images);
                images.splice(imgIndex, 1);
                //alert(JSON.stringify(images));
                //this.storage.remove(form.value.wfFormId + 'img');
                this.storage.set(form.value.wfFormId + 'img', images);
                console.log("User has delete the img")
              }
            }
          ]
        });
        alert.present();
        
      } else {
        let alert = this.alertCtrl.create({
          title: '',
          subTitle: '不存在。',
          buttons: ['返回']
        });
        alert.present();
      }
      
    });
  }
}
