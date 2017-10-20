import { Injectable} from "@angular/core";
// import { HTTP } from "@ionic-native/http";
import 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from "@angular/http";



@Injectable()
export class WorkflowService {
  private httpHeaders = new Headers({ 'Content-type':'application/json' });
  private httpOptions = new RequestOptions({ headers:this.httpHeaders });

  // For Dev url
  private baseUrl = "http://localhost:3000/workflow/";

  // For Test url
  // private baseUrl = "http://192.168.4.200:3000/workflow/";
  // private baseUrl = "http://172.20.10.2:3000/workflow/";

  constructor(private http: Http){}

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

}
