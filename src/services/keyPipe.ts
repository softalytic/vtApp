import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'keys'})

export class KeysPipe implements PipeTransform {
  // Angular does not support key value pair in the for each loop
  // This is the custom function for the *ngFor to loop through kv
  // Basically create an empty array
  // push key into this array
  // return the array

  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return keys;
  }
}