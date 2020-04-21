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
  styleUrls: ['./html-layer.component.scss'],
  providers: [ChecklistDatabase]
})
export class HtmlLayerComponent implements OnInit {

  @ViewChild(AcLayerComponent) layer: AcLayerComponent;
  
  @ViewChild('contentMenu') private contentMenu: ElementRef;

  htmls$: Observable<AcNotification>;

  // Template
  html1 = {
    id: '0',
    actionType: ActionType.ADD_UPDATE,
    entity: {
      id: '0',
      show: true,
      name: 'Html 1',
      position: Cesium.Cartesian3.fromDegrees(-100, 30),
      color: Cesium.Color.RED
    },
  };
  html2 = {
    id: '1',
    actionType: ActionType.ADD_UPDATE,
    entity: {
      id: '1',
      show: true,
      name: 'Html 2',
      position: Cesium.Cartesian3.fromDegrees(-100, 45),
      color: Cesium.Color.RED
    }
  };

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
    console.log(this.extents);
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
    // this.camera.flyTo(html.entity.position);
    // this.layer.remove(html.id);
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
    this.updateHtml()
  }

  getDatasets(extent: Extent): void {
    this.extentService.selectedExtent = extent;
    this.extentService.getCDBDatasets(extent.name).subscribe(datasets =>
      (this.datasets = datasets)
      );
    console.log(this.datasets);
  }


  updateHtml() {

    // if (this.html1) {
    //   this.html1.entity.name = 'Work!';
    //   this.layer.update(this.html1.entity, this.html1.id);
    // }

    // this.html2.entity.name = 'Great!!!!';
    // this.html2.entity.position = Cesium.Cartesian3.fromDegrees(-100, 60);
    // this.layer.update(this.html2.entity, this.html2.id);

    const htmlString = 'hello'

    console.log(this.datasets);

    this.contentMenu.nativeElement.innerHTML = htmlString;
    this.datasets.key().forEach(dataset => {
      console.log(dataset);
    });

    

    


  }



  pixelOffset(value) {
    return new Cesium.Cartesian2(value[0], value[1]);
  }

  removeFirst() {
    this.layer.remove('0');
    this.html1 = null;
  }

  toggleShow() {
    if (this.html1) {
      this.html1.entity.show = !this.html1.entity.show;
      this.layer.update(this.html1.entity, this.html1.id);
    }
  }
}

