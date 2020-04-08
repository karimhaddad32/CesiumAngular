import { ExtentService } from './../services/extent.service';
import { Extent } from './../classes/extent';
import { MainPageComponent } from './../main-page/main-page.component';
import { AppComponent } from './../app.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: "cesium",
  templateUrl: './cesium.component.html',
  styleUrls: ['./cesium.component.scss'],
})
export class CesiumComponent implements OnInit {
  extents: Extent[];
  viewer: any;
  constructor(private app: AppComponent, private service: ExtentService) {}

  ngOnInit() {
    this.viewer = this.app.cesiumViewer;
    this.getExtents();
    this.extents = this.app.extents;
    console.log(this.extents);
    
    // this.app.cesiumViewer.camera.flyTo({
    //   // tslint:disable-next-line: max-line-length
    //   destination : Cesium.Cartesian3.fromDegrees(45, 13.5, 500000)
    //   });
  }

  getExtents(): void {
    this.service.getExtents()
    .subscribe(extents => (this.extents = extents));
    this.createLocationPoints();
  }

  createLocationPoints(): void{
    this.extents.forEach((extent) => {
      let citizensBankPark = this.viewer.entities.add({

        name: extent.name,
        position: Cesium.Cartesian3.fromDegrees(extent.coordinate.x, extent.coordinate.y),
        point: {
          pixelSize: 5,
          color: Cesium.Color.RED,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
        },
        label: {
          text: extent.name,
          font: '10pt monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -9),
        },
      });
    });
  }
}
