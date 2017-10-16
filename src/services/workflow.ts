import { Injectable} from "@angular/core";
// import { HTTP } from "@ionic-native/http";
import 'rxjs/Rx';
import { Headers, Http, RequestOptions, Response } from "@angular/http";


@Injectable()
export class WorkflowService {
  private httpHeaders = new Headers({'Content-type':'application/json'});
  private httpOptions = new RequestOptions({ headers:this.httpHeaders });
  private baseUrl = "http://localhost:3000/workflow/";

  constructor(private http: Http){}

  upload(wfInputForm: any){
    console.log("Begin to upload onto server");
    console.log("Printing packet to server");
    console.log(wfInputForm);

    let queryUrl = this.baseUrl + "form1/submit/";
    console.log(queryUrl);

    return this.http.post(queryUrl, wfInputForm, this.httpOptions)
      .map((response: Response) => {
        console.log("Responding from Server");
        console.log(response.json());
        return response.json();
      });
  }

  query(wfInputForm: any){
    console.log("Begin to load data from server");
    console.log("Printing request to server");
    console.log(wfInputForm);

    let queryUrl = this.baseUrl + "form1/query/";
    console.log(queryUrl);

    return this.http.post(queryUrl, wfInputForm, this.httpOptions)
      .map((response: Response) => {
        console.log("Responding from Server");
        console.log(response.json()[0]);
        return response.json();
      });
  }
}
