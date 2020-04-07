import { HttpClient } from '@angular/common/http';
import { EXTENTS } from './../mock-extents';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Extent } from '../classes/extent';

@Injectable({
  providedIn: 'root'
})
export class ExtentService {


constructor(private http: HttpClient) { }

// Rest API calls will be here
serverUrl = '';
// Returns only availabe CDBs and their info
  getExtents(): Observable<Extent[]> {
    // Tempo
    const extents: Extent[] = EXTENTS;
    return of(extents);
    // Rest API call from the web server.
    return this.http.get<Extent[]>(this.serverUrl);
  }

// Returns the requested CDB details
  getExtent(name: string): Observable<Extent> {
    // Tempo
    const extents: Extent[] = EXTENTS.filter(a => a.name === name);
    return of(extents[0]);
    // Rest API call from the web server.
    return this.http.get<Extent>(this.serverUrl + '/name');
  }

}
