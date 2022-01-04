import { Injectable } from '@angular/core';
import { catchError, pluck, shareReplay } from 'rxjs';
import { ajax } from 'rxjs/ajax';

@Injectable({
  providedIn: 'root'
})
export class ApirequestService {
  api_url = "./assets/"

  constructor() { }

  getLoans(){
    return ajax(this.api_url +"loans.json").pipe(
      pluck("response"),
      catchError( error => {
        console.warn("Error de petición", error.message);
        return [];
      })
    )
  }

  getAccounts(){
    return ajax(this.api_url +"accounts.json").pipe(
      pluck("response"),
      shareReplay(),
      catchError( error => {
        console.warn("Error de petición", error.message);
        return [];
      })
    );
  }

}
