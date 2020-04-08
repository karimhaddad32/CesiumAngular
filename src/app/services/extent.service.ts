import { Extent } from './../classes/extent';
import { DATASETS } from './../mock-datasets';
import { Dataset, CDBComponent } from './../classes/dataset';
import { HttpClient } from '@angular/common/http';
import { EXTENTS } from './../mock-extents';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExtentService {

private extents: Extent[];
private _selectedExtent: Extent;
private cdbDatasets: Dataset[];
private _checkedComponents: CDBComponent[];

constructor(private http: HttpClient){
  this.extents = this.getExtents();
  this._selectedExtent = new Extent();
  this.cdbDatasets = [];
  this._checkedComponents = [];
}

// Rest API calls will be here
serverUrl = '';
// Returns only availabe CDBs and their info
  getExtents(): Observable<Extent[]> {
    // Tempo
    // const extents: Extent[] = EXTENTS;
    this.extents = [
      {
        id: 1,
        name: 'Tijuana',
        coordinate: {x: -117.0382, y: 32.5149},
        totalFeatureCount: 23,
        type: '',
        features: []
      },
      {
        id: 2,
        name: 'Yemen',
        coordinate: {x: 44.4216433, y: 15.0565379},
        totalFeatureCount: 23,
        type: '',
        features: []
    }
  ];
    return of(this.extents);
    // Rest API call from the web server.
    return this.http.get<Extent[]>(this.serverUrl);
  }

// Returns the requested CDB details
  getDatasets(name: string): Observable<Dataset[]> {
    // Tempo
    // const extents: Extent[] = EXTENTS.filter(a => a.name === name);
    this.cdbDatasets = DATASETS;
    return of(this.cdbDatasets);
    // Rest API call from the web server.
    return this.http.get<Dataset[]>(this.serverUrl + '/name');
  }

  getSelectedExtent(): Observable<Extent> {
    return of(this.selectedExtent);
  }

  get checkedComponents(): CDBComponent[]{
    return this._checkedComponents;
  }

  set checkedComponents(componentsList: CDBComponent[]){
    this.checkedComponents = componentsList;
  }

  get selectedExtent(): Extent{
    return this._selectedExtent;
  }

  set selectedExtent(extent: Extent){
    this._selectedExtent = extent;
  }


}
