import { EXTENTS } from './../mock-extents';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Extent } from '../classes/extent';

@Injectable({
  providedIn: 'root'
})
export class ExtentService {


constructor() { }

// Rest API calls will be here

// Returns only availabe CDBs and their info
  getExtents(): Observable<Extent[]> {
    const extents: Extent[] = EXTENTS;
    return of(extents);
  }

// Returns the requested CDB details
  getExtent(name: string): Observable<Extent> {
    const extents: Extent[] = EXTENTS.filter(a => a.name === name);
    return of(extents[0]);
  }

}
