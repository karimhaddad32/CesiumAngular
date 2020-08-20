import { Extent, Feature } from './../classes/extent';
import { Dataset, CDBComponent } from './../classes/dataset';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { TodoItemFlatNode } from '../extent/extent.component';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})

export class ExtentService {

private _extents: Extent[];
private _selectedExtent: Extent;
  oldFeaturesList: Feature[];
public rasterDatasets = ['001_Elevation', '004_Imagery', '005_RMTexture', '900_ExtImagery', '002_MinMaxElevation'];

public  cdbs = [
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
    baseExtents: {x1: 44, x2: 46, y1: 12, y2: 14}
  },
 {
   id: 9,
   name: 'Montreal',
   coordinate: {x: -73.6050949, y: 45.5023085},
   features: [],
   type: ' ',
   baseExtents: {x1: -74, x2: -73, y1: 45, y2: 46}
  }
]


constructor(private http: HttpClient) {

  this._selectedExtent = new Extent();
  this._extents = [];
}

// Rest API calls will be here
serverUrl = '127.0.0.1:9000/';
// Returns only availabe CDBs and their info
  getExtents(): Observable<Extent[]> {
    // return this.http.get<any>('http://127.0.0.1:9000');

    return of(this.cdbs);

  }

  buildDatasetsObject(extent: Extent) : any {
    const datasetsObject = {};

  

    this.selectedExtent = extent;

    extent.features.forEach(dataset => {
      const properties = dataset.properties;

      if(!properties.data_set.includes('Descriptor')){

      
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
    }
    });
    return datasetsObject;
  }

  getCDBDatasets(name: string): Observable<any> {

    if (this.extentArray.length === 0) {
      this.getExtents().subscribe(result => this.extentArray = result);
    }
   

    // return this.http.get<any[]>('http://127.0.0.1:9000/cdbs/' + name);

    return this.http.get('assets/' + name + '.geojson');

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

  get extentArray(): Extent[] {
    return this._extents;
  }

  set extentArray(extent: Extent[]) {
    this._extents = extent;
  }
}
