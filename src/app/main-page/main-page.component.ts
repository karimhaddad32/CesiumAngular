import { Dataset } from './../classes/dataset';
import { AppComponent } from './../app.component';
import { SharedService } from './../services/shared.service';
import { ExtentService } from './../services/extent.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Extent } from '../classes/extent';
import { Title } from '@angular/platform-browser';
import { AcLayerComponent } from 'angular-cesium';
import { from, from as observableFrom, Observable, Subject,of } from 'rxjs';
import { AfterViewInit } from '@angular/core';
import {  AcNotification, ActionType, CameraService, ViewerConfiguration } from 'angular-cesium';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  htmls$: Observable<AcNotification>;

  // Template
  // html1 = {
  //   id: '0',
  //   actionType: ActionType.ADD_UPDATE,
  //   entity: {
  //     id: '0',
  //     show: true,
  //     name: 'Html 1',
  //     position: Cesium.Cartesian3.fromDegrees(-100, 30),
  //     color: Cesium.Color.RED
  //   },
  // };
  // html2 = {
  //   id: '1',
  //   actionType: ActionType.ADD_UPDATE,
  //   entity: {
  //     id: '1',
  //     show: true,
  //     name: 'Html 2',
  //     position: Cesium.Cartesian3.fromDegrees(-100, 45),
  //     color: Cesium.Color.RED
  //   }
  // };

  htmlArray: any[];
  extents: Extent[];
  datasets: any;
  viewer: any;

  constructor(
    private app: AppComponent,
    private extentService: ExtentService,
    private titleService: Title,
    private sharedService: SharedService,
    private camera: CameraService
    ) {
      this.getExtents();
      this.setLocationsOnMap();
    }

  title = 'Home';

  ngOnInit() {

    this.titleService.setTitle(`${this.title} - ${this.sharedService.cdbTitle}`);
  }

  // Calls the service and initialize the extents with the response from the service.
  getExtents(): void {
    this.extentService
    .getExtents()
    .subscribe(extents => (this.extents = extents));
  }

  createHtmls(): any[] {
    this.htmlArray  = [];
    let counter = 0;
    this.extents.forEach(location => {
      console.log(location);
      this.htmlArray.push({
        id: counter,
        actionType: ActionType.ADD_UPDATE,
        entity: {
          id: counter,
          show: true,
          name: location.name,
          position: Cesium.Cartesian3.fromDegrees(
            location.coordinate.x,
             location.coordinate.y),
          color: Cesium.Color.RED
        }});
        counter++;
    });


    return this.htmlArray;
  }

  setLocationsOnMap(){
    this.htmlArray = this.createHtmls();
    this.htmls$ = from(this.htmlArray);
    console.log(this.htmlArray);
  }

  zoomToLocation(cdbName: string) {
    this.htmlArray.forEach(index => {
      this.layer.remove(index.id);
      index = null;
    });
    this.extentService.selectedExtent = this.extents.filter(x => x.name === cdbName)[0];
  }

  // getDatasets(extent: Extent): void {
  //   this.extentService.selectedExtent = extent;
  //   this.extentService.getCDBDatasets(extent.name).subscribe(datasets =>
  //     (this.datasets = datasets)
  //     );
  //   console.log(this.datasets);
  // }


  // createDatasetList() {
  //   const htmlString = 'asd';

  //   console.log(this.datasets);

  //   this.contentMenu.nativeElement.innerHTML = htmlString;
  //   this.datasets.key().forEach(dataset => {
  //     console.log(dataset);
  //   });
  // }


  // toggleShow() {
  //   if (this.html1) {
  //     this.html1.entity.show = !this.html1.entity.show;
  //     this.layer.update(this.html1.entity, this.html1.id);
  //   }
  // }

}
