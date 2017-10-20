import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera";


@Injectable()
export class PhotoService {

  constructor(private storage: Storage,
              private camera: Camera){}

  shoot(images:any, form: any) {
    console.log("taking photos for form " + form.value.wfFormId );

    const camOpt: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(camOpt).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let imgUrl = 'data:image/jpeg;base64,' + imageData;

      // An array of img to be loaded and pushed onto the html
      images.push(imgUrl);

      // Store the img into storage with wfFormIdimg as the key
      this.storage.set(form.value.wfFormId + 'img', images);

    }, (err) => {
      console.log("Got and error on taking photo of " + form.value.wfFormId + " : " +err);

    });

  }

}
