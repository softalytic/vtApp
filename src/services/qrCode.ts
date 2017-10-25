import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";
import { WorkflowService } from "./workflow";

@Injectable()
export class QRCodeService {

  constructor(private storage: Storage,
              private QR: BarcodeScanner,
              private wfSvc: WorkflowService){}

  scanBarcode(model: string, form: any){

    // let form = this.wfInputForm;

    console.log("scanning Barcode");
    console.log(model);

    this.QR.scan().then((barcodeData) => {
      // Success! Barcode data is here
      // Limiter to assume the Barcode is default used in this orderID
      // alert("This is QR Scan from services");

      if ( barcodeData.format && barcodeData.format != "QR_CODE" ) {
        console.log("this is barcode");

        let data = barcodeData.text;

        form.controls[model].setValue(data);

        if (model == "wfFormId") {
          console.log("Execute ERP query process")
        }


      } else if (barcodeData.format == "QR_CODE") {
        // alert('嚫，请确定你所扫描的条码是正确的');
        // Try if it is QR code
        console.log(barcodeData.text);
        //alert(barcodeData.text);
        console.log("This is QR Code");
        this.qrCodePopulate(barcodeData.text, form);

      } else {
        alert('嚫，请确定你所扫描的条码是正确的');
      }
    }, (err) => {
      // An error occurred
      alert(err);
    });
  }

  qrCodePopulate(barcodeData: string, form: any) {

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
    // let form = this.wfInputForm;

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

              // This use form control for the value setting
              // console.log("formKey : " + formKey);
              // console.log("Form " + form[formKey]);

              form.controls[formKey].setValue(formBodies[formKey]);

            }
            catch(err) {
              console.log(err.message);
              eval('form.value.' + formKey + '= "' + formBodies[formKey] + '"; ');
              eval('console.log("Retrying force input " + form.value.'+ formKey + ')');
              eval('console.log(form.value.' + formKey + ');');
              // console.log("barcode loaded in form:" + JSON.stringify(form.value));
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
            // console.log("populate form model" + inputKey);

            try {
              // Dynamically set form value from the scanned code data
              // try and catch here is to protect if some of the fields are missing or failed,
              // then it will skip onto the next key

              // This use form control for the value setting
              console.log("InputKey : " + inputKey);
              console.log("Form " + form[inputKey]);
              form.controls[inputKey].setValue(inputBodies[inputKey]);

            }
            catch(err) {
              console.log(err.message);
              eval('console.log(form.value.' + inputKey + ');');
              // console.log("barcode loaded in form:" + JSON.stringify(form.value));
            }

          }

          break;

        case "wfMachine":

          console.log("The QRcode will update machine data");
          let wfMachineId = bodies[key];
          console.log(wfMachineId);

          form.controls["wfOptMachineId"].setValue(wfMachineId);

          this.storage.get("wfMachine").then((values) => {

            console.log("Loading from storage of wfMachine");
            console.log("wfStorage: " + JSON.stringify(values));

            let staffData = values[wfMachineId];

            console.log("staffData" + JSON.stringify(staffData));

            for (let formKey in staffData) {
              // console.log("populate form model " + formKey);
              // console.log("populating model " + formKey + " " + formBodies[formKey]);

              try {
                // Dynamically set form value from the scanned code data
                // try and catch here is to protect if some of the fields are missing or failed,
                // then it will skip onto the next key

                // This use form control for the value setting
                // console.log("formKey : " + formKey);
                // console.log("Form " + form[formKey]);
                form.controls[formKey].setValue(staffData[formKey]);

              }
              catch(err) {
                console.log(err.message);
                // eval('form.value.' + formKey + '= "' + formBodies[formKey] + '"; ');
                // eval('console.log("Retrying force input " + form.value.'+ formKey + ')');
                // eval('console.log(form.value.' + formKey + ');');
                // console.log("barcode loaded in form:" + JSON.stringify(form.value));
              }

            }

          });

          console.log("barcode loaded in form:" + JSON.stringify(form.value));
          break;

        default:
          console.log(key + " is error");
      }
    }
  }

}
