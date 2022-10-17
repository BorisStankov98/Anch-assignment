import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  localUrl:string="http://localhost:3000/getData"
  constructor(
    private http: HttpClient
  ) { }

    getData(){
     return this.http.get(this.localUrl).pipe(
      shareReplay()
     ) as Observable<any>
    }
}
