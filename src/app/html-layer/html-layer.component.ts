import { ChecklistDatabase, ExtentComponent } from './../extent/extent.component';
import { SharedService } from './../services/shared.service';
import { Title } from '@angular/platform-browser';
import { AppComponent } from './../app.component';
import { ExtentService } from './../services/extent.service';
import { Extent } from './../classes/extent';
import { from, from as observableFrom, Observable, Subject,of } from 'rxjs';
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AcLayerComponent, AcNotification, ActionType, CameraService, ViewerConfiguration } from 'angular-cesium';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'html-layer',
  templateUrl: './html-layer.component.html',
  styleUrls: ['./html-layer.component.scss']
})
export class HtmlLayerComponent implements OnInit {

  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  @ViewChild("contentMenu") contentMenu: ElementRef;

  htmls$: Observable<AcNotification>;
  htmlArray: any[];
  extents: Extent[];
  datasets: any;
  
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

    const selected: Extent = this.extents.filter(x => x.name === cdbName)[0];
    this.camera.cameraFlyTo({
      destination : Cesium.Cartesian3.fromDegrees(
        selected.coordinate.x,
        selected.coordinate.y,
        500000.0)
    })

    this.htmlArray.forEach(index => {
      this.layer.remove(index.id);
      index = null;
    });

    this.getDatasets(selected);
    this.createDatasetList()
  }

  getDatasets(extent: Extent): void {
    this.extentService.selectedExtent = extent;
    this.extentService.getCDBDatasets(extent.name).subscribe(datasets =>
      (this.datasets = datasets)
      );
    console.log(this.datasets);
  }


  createDatasetList() {

    const htmlString = 'asd';

    console.log(this.datasets);

    this.contentMenu.nativeElement.innerHTML = htmlString;
    this.datasets.key().forEach(dataset => {
      console.log(dataset);
    });
  }

}

