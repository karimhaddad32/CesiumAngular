import { Extent, Feature } from './../classes/extent';
import { DATASETS } from './../mock-datasets';
import { Dataset, CDBComponent } from './../classes/dataset';
import { HttpClient } from '@angular/common/http';
import { EXTENTS } from './../mock-extents';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { TodoItemFlatNode } from '../extent/extent.component';

@Injectable({
  providedIn: 'root'
})

export class ExtentService {

private extents: Extent[];
private _selectedExtent: Extent;
  oldFeaturesList: Feature[];
public rasterDatasets = ['001_Elevation', '004_Imagery', '005_RMTexture', '900_ExtImagery', '002_MinMaxElevation'];

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
    // Temporary
    // const extents: Extent[] = EXTENTS;
    return of(this.extents);

    // Rest API call from the web server.
    return this.http.get<Extent[]>(this.serverUrl);
  }

  //cdbName
  getCDBDatasets(name: string): Observable<any>{

    const extents = this.extents.filter(a => a.name === name);
    if (extents.length === 0){
      this.selectedExtent = undefined;
      return undefined;
    }

    const datasetsObject = {};


    this.selectedExtent = this.extents.filter(a => a.name === name)[0];
    this.selectedExtent.features = EXTENTS.filter(x => x.name === name)[0].features;

    this.selectedExtent.features.forEach(dataset => {
      const properties = dataset.properties;

      if(!(properties.data_set in datasetsObject)){
        datasetsObject[properties.data_set] = {
          total_features_count: properties.features_count
        };
      }else{
        datasetsObject[properties.data_set].total_features_count += properties.features_count;
      }

      let lod =0;

      if (properties.Lod_Level.includes('LC')){
        lod = -1* parseInt(properties.Lod_Level.split('LC')[1], 10);
      }else{
        lod = parseInt(properties.Lod_Level.split('L')[1],10);
      }

      if(!(properties.component in datasetsObject[properties.data_set])){
        datasetsObject[properties.data_set][properties.component] = {
          lods: [properties.Lod_Level],
          lod_range: [lod],
          features_count: properties.features_count
        }
      }else
      {
        if(!datasetsObject[properties.data_set][properties.component].lod_range.includes(lod)){
          datasetsObject[properties.data_set][properties.component].lods.push(properties.Lod_Level);
          datasetsObject[properties.data_set][properties.component].lod_range.push(lod);
        }
        datasetsObject[properties.data_set][properties.component].features_count += properties.features_count;
      }
    });
    return of(datasetsObject);
  }

  getFeatures(checkedItems: TodoItemFlatNode[]): Observable<Feature[]>
  {
    const featuresList: Feature[] = [];
    checkedItems.forEach(item => {
      if(item.level === 3){
        const feature = this.selectedExtent.features.filter(x => x.properties.component === item.parent
          && x.properties.Lod_Level === item.item)[0]
        featuresList.push(feature);
      }
      else{
        const feature = this.selectedExtent.features.filter(x => x.properties.data_set === item.item
         ).sort((a, b) => (a.properties.Lod_Level.localeCompare(b.properties.Lod_Level)))[0]
        featuresList.push(feature);
      }
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
