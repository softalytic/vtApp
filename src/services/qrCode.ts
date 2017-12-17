import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";
import { WorkflowService } from "./workflow";

@Injectable()
export class QRCodeService {
  // The QRCode function has been isolated in this Service
  // This service has 2 main functions for calling:
  // 1. scanBarcode
  // 2. qrCodePopulate

  constructor(private storage: Storage,
              private QR: BarcodeScanner,
              private wfSvc: WorkflowService){}

  scanBarcode(model: string, form: any){
    // This function will call the BarcodeScanner's scan function
    // 2 inputs for this function,
    //    1. specific data model of the form
    //    2. the form itself
    //
    // It will first scan the barcode and determine
    // If the dataType is barcode then
    //    fill the form data model with the scanned value
    //    Note: further work if the model is wfFormId
    //          as the change of solution from QR code to Barcode,
    //          once they have scanned the barcode with model of wfFormId
    //          then query the server for the order detail
    //
    // Else if dataType is QRcode then
    //    populate the QRcode data onto the form
    //
    // Else
    //    throw alert to user


    console.log("scanning Barcode for model" + model);

    this.QR.scan().then((barcodeData) => {

      if ( barcodeData.format && barcodeData.format != "QR_CODE" ) {
        console.log("This is barcode" + barcodeData.text);

        let data = barcodeData.text;

        // Assign value via form control
        // Assume Barcode scan is executed before any non form controls items being added
        // Note: If this assumption is invalid, please use the backup code
        form.controls[model].setValue(data);

      } else if (barcodeData.format == "QR_CODE") {
        console.log("This is QR code" + barcodeData.text);

        this.qrCodePopulate(barcodeData.text, form);

      } else {
        // Throw alert and feel free to change it with formal alert controller
        // So the title and buttons are in chinese
        alert('嚫，请确定你所扫描的条码是正确的');

      }
    }, (err) => {
      // An error occurred
      console.log("The barcode scanning has error" + err);

    });
  }

  staffScanBarcode(form: any, staffTable:any, machineTable:any, model: string){
    // This function will call the BarcodeScanner's scan function
    // 2 inputs for this function,
    //    1. specific data model of the form
    //    2. the form itself
    //
    // It will first scan the barcode and determine
    // If the dataType is barcode then
    //    fill the form data model with the scanned value
    //    Note: further work if the model is wfFormId
    //          as the change of solution from QR code to Barcode,
    //          once they have scanned the barcode with model of wfFormId
    //          then query the server for the order detail
    //
    // Else if dataType is QRcode then
    //    populate the QRcode data onto the form
    //
    // Else
    //    throw alert to user


    console.log("scanning Barcode for model" + model);

    this.QR.scan().then((barcodeData) => {

      if ( barcodeData.format && barcodeData.format != "QR_CODE" ) {
        console.log("This is barcode" + barcodeData.text);

        let data = barcodeData.text;

        // Assign value via form control
        // Assume Barcode scan is executed before any non form controls items being added
        // Note: If this assumption is invalid, please use the backup code
        this.wfSvc.populateStaffData(form, staffTable, machineTable, model);

      } else if (barcodeData.format == "QR_CODE") {
        console.log("This is QR code" + barcodeData.text);

        this.qrCodePopulate(barcodeData.text, form);
        this.wfSvc.populateStaffData(form, staffTable, machineTable, model);

      } else {
        // Throw alert and feel free to change it with formal alert controller
        // So the title and buttons are in chinese
        alert('嚫，请确定你所扫描的条码是正确的');

      }
    }, (err) => {
      // An error occurred
      console.log("The barcode scanning has error" + err);

    });
  }

  qrCodePopulate(barcodeData: string, form: any) {
    // This function takes the barcode data and then populate the JSON object onto the form
    // 2 inputs for this function,
    //    1. specific data model of the form
    //    2. the form itself
    //
    // Note: Assume each barcode data is a JSON object and it has a headers and bodies component
    // Loop through the headers
    // For each header
    //    Run the switch statement to execute different operation base on the header value
    //    Append further operations onto the switch statement if needed


    console.log("running qrCodePop with data: " + barcodeData);

    let data = JSON.parse(barcodeData);
    let headers = data.headers;
    let bodies = data.bodies;

    for (let key in headers) {
      console.log("Running qrCodePop with data: " + key + " : " + headers[key])
      switch(headers[key]) {
        case "ngForm":
          // This is the ngForm operation
          // Simply take the data and then populate onto the form
          console.log("Operation in QRcode data " + key + " is ngForm");
          this.populateDataToForm(form,bodies[key]);
          console.log("QRcode of ngForm loaded in form:" + JSON.stringify(form.value));
          break;

        case "ngStorage":
          // This is the ngForm operation
          // Simply take the data and insert into storage
          console.log("Operation in QRcode data " + key + " is ngStorage");
          console.log("Loading data: " + JSON.stringify(bodies[key]) + " into storage" );
          this.storage.set(key, bodies[key]);

          // Testing code to see if storage has been properly set
          // this.storage.get(key).then((values) => {
          //   for (let valKey in values) {
          //     console.log(values[valKey]);
          //   }
          //   console.log(key);
          //   console.log(JSON.stringify(values));
          // });
          break;

        case "ngInput":
          // This is the ngInput operation
          // Simply take the data and then populate onto the form
          // It is same as ngForm in terms of Code, but QR wise, it only has 1 input
          console.log("Operation in QRcode data " + key + " is ngInput");
          this.populateDataToForm(form,bodies[key]);
          console.log("QRcode of ngInput loaded in form:" + JSON.stringify(form.value));
          break;

        case "wfMachine":
          // This is the wfMachine operation
          // It will first lookup the wfMachineId from the storage
          // Then populate the relative staff data onto the form
          // Further work:
          //    This function is not completed because there was a change in the requirement
          //    on how the machineId is paired with staffId, as the unique identifier is the
          //    machineId + wfForm + wfProcess to locate the correct staff combination
          console.log("Operation in QRcode data " + key + " is wfMachine");

          // Assume wfMachineId should be a single value
          let wfMachineId = bodies[key];
          console.log( "Looking up the wfMachineId: " + wfMachineId);

          // Note: Populate the machine onto the form, assume all the form should use wfOptMachineId
          form.controls["wfOptMachineId"].setValue(wfMachineId);

          // load data from the storage, all the operation that depends on this storage data must be
          // nested within this code block or else it wont be executed properly
          this.storage.get("wfMachine").then((values) => {

            console.log("Loading from storage of wfMachine");
            console.log("wfMachine data from storage is: " + JSON.stringify(values));

            // Alert! This is the part that need to be fixed
            // Currently only look up base on wfMachineId, but per new requirement need to consider
            // wfProcess and wfForm lookup
            let staffData = values[wfMachineId];
            console.log("staffData from storage are: " + JSON.stringify(staffData));

            this.populateDataToForm(form,staffData);
          });

          console.log("QRcode of wfMachine loaded in form:" + JSON.stringify(form.value));
          break;

        default:
          console.log("There is an error: " + key);
      }
    }
  }

  populateDataToForm(form:any, bodies: any){
    // This function is to populate the QRcode data and overwrite everything
    // Note: This function is slightly different than the loadDataToForm in the workflow
    //       because this one will overwrite all the existing inputs from the user
    // 2 inputs for this function,
    //    1. the form itself
    //    2. the bodies of the QRcode data
    // This function will loop through the key in the bodies
    //    It will try to populate the data via form control
    //    On Error, it will try to force the form value input

    // Future Work:
    //    This function assume the order of form controls and form value are handled in the QRcode
    //    The workaround solution should be looping through the form.control elements in the QRcode data first
    //    Then force input the remaining value onto the form.value

    for (let key in bodies) {
      // console.log("populating model " + key + " " + bodies[key]);

      try {
        // This use form control for the value setting
        form.controls[key].setValue(bodies[key]);
        // console.log("Form with key : " + key + " has value of " + form[key]);

      }
      catch(err) {
        console.log("Cant find the element of " + key + "in the form control with error: " + err.message);
        // eval('console.log("Retrying force input " + form.value.'+ key + ')');
        eval('form.value.' + key + '= "' + bodies[key] + '"; ');
        // eval('console.log(form.value.' + key + ');');
        // Below line is to dump the whole form value for each step
        // console.log("barcode loaded in form:" + JSON.stringify(form.value));
      }

    }
  }

}
