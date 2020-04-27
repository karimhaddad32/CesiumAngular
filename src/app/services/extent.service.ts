import { Extent, Feature } from './../classes/extent';
import { DATASETS } from './../mock-datasets';
import { Dataset, CDBComponent } from './../classes/dataset';
import { HttpClient } from '@angular/common/http';
import { EXTENTS } from './../mock-extents';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { TodoItemFlatNode } from '../extent/extent.component';
import { get } from 'http';

@Injectable({
  providedIn: 'root'
})
export class ExtentService {

private extents: Extent[];
private _selectedExtent: Extent;
  oldFeaturesList: Feature[];

constructor(private http: HttpClient) {

  this._selectedExtent = new Extent();
  this._selectedExtent = null;
  this.extents = [
    {
      id: 1,
      name: 'Tijuana',
      coordinate: {x: -117.0382, y: 32.5149},
      features: [],
      type: ' ',
      baseExtents: {x1: -116, x2: -119, y1: 31, y2: 33}
    },
    {
      id: 2,
      name: 'Yemen',
      coordinate: {x: 44.4216433, y: 15.0565379},
      features: [],
      type: ' ',
      baseExtents:{x1: 44, x2 : 46, y1: 12, y2: 14}
  },
    {
      id: 3,
      name: 'Pendleton',
      coordinate: {x: -117.5 , y: 33.523},
      features: [],
      type: ' ',
      baseExtents: undefined
    }
    ,
    {
      id: 4,
      name: 'Charlottetown',
      coordinate: {x: -56.12619, y: 52.76273},
      features: [],
      type: ' ',
      baseExtents: undefined
    }
];
}

// Rest API calls will be here
serverUrl = '';
// Returns only availabe CDBs and their info
  getExtents(): Observable<Extent[]> {
    // Tempo
    // const extents: Extent[] = EXTENTS;
    return of(this.extents);
    // Rest API call from the web server.
    return this.http.get<Extent[]>(this.serverUrl);
  }

  getCDBDatasets(name: string): Observable<any>{

    // HTML Inside
    console.log(this.extents);
    const extents = this.extents.filter(a => a.name === name);
    const datasetsObject = {};
    if (extents.length > 0) {

      this.selectedExtent = this.extents.filter(a => a.name === name)[0];
      this.selectedExtent.features = EXTENTS.filter(x => x.name === name)[0].features;

      this._selectedExtent.features.forEach(dataset => {
        const properties = dataset.properties;
        if(!(properties.data_set in datasetsObject)){
          datasetsObject[properties.data_set] = {};
        }

        if(!(properties.component in datasetsObject[properties.data_set])){
          datasetsObject[properties.data_set][properties.component] = []
        }

        if(!datasetsObject[properties.data_set][properties.component].includes(properties.Lod_Level)){
          datasetsObject[properties.data_set][properties.component].push(properties.Lod_Level);
        }
      });
    } else {
      this._selectedExtent = undefined;
      this.selectedExtent = null;
    }
    console.log(datasetsObject);
    return of(datasetsObject);
  }

  getFeatures(checkedItems: TodoItemFlatNode[]): Observable<Feature[]>
  {
    const featuresList: Feature[] = [];

    checkedItems.forEach(item => {
      const feature = this.selectedExtent.features.filter(x => x.properties.component === item.parent
        && x.properties.Lod_Level === item.item)[0]
      featuresList.push(feature);
    });
    return of(featuresList);
  }



  getSelectedExtent(): Observable<Extent> {
    return of(this.selectedExtent);
  }


  get selectedExtent(): Extent {
    return this._selectedExtent;
  }

  set selectedExtent(extent: Extent) {
    this._selectedExtent = extent;
  }


}
