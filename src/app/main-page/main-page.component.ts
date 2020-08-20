import { Dataset } from './../classes/dataset';
import { AppComponent } from './../app.component';
import { SharedService } from './../services/shared.service';
import { ExtentService } from './../services/extent.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Extent } from '../classes/extent';
import { Title } from '@angular/platform-browser';
import { AcLayerComponent, MapsManagerService } from 'angular-cesium';
import { from, from as observableFrom, Observable, Subject,of } from 'rxjs';
import { AfterViewInit } from '@angular/core';
import {  AcNotification, ActionType, CameraService, ViewerConfiguration } from 'angular-cesium';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  htmls$: Observable<AcNotification> = new Observable<AcNotification>();

  htmlArray: any[] = [];
  extents: Extent[];
  datasets: any;
  viewer: any;
  cesiumViewer;

  constructor(
    private app: AppComponent,
    private extentService: ExtentService,
    private titleService: Title,
    private sharedService: SharedService,
    private camera: CameraService,
    private mapsManagerService: MapsManagerService,
    private http: HttpClient
    ) {
      
      this.extentService.getExtents().subscribe(extents => {
        this.extents = extents;
        this.extentService.extentArray = extents;
        this.setLocationsOnMap();
        this.cesiumViewer = mapsManagerService.getMap().getCesiumViewer();
      });
    }

  title = 'Home';

  ngOnInit() {
    this.titleService.setTitle(`${this.title} - ${this.sharedService.cdbTitle}`);
  }

  createHtmls(): any[] {
    this.htmlArray = [];
    let counter = 0;
    this.extents.forEach(location => {
    
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
    this.htmls$.forEach(element => {
    
      this.layer.updateNotification(element);
    });
  }

  removeButtons(cdbName: string) {
    this.htmlArray.forEach(index => {
      this.layer.remove(index.id);
      index = null;
    });
    this.extentService.selectedExtent = this.extents.filter(x => x.name === cdbName)[0];
  }
}
