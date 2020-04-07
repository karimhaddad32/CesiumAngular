import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

cdbTitle = 'Presagis - Cesium';
baseUrl = 'http://localhost:4200/';

constructor() { }

}
