import { Component, Input } from '@angular/core';
import { ViewerConfiguration, SceneMode } from 'angular-cesium';

@Component({
  selector: 'map',
  template: `
  <div style="height: 100vh">
    <ac-map>
        <router-outlet>

        </router-outlet>
    </ac-map>
  </div>`,
  providers: [ViewerConfiguration],
},
)
export class MapComponent  {
  @Input() name: string;

  constructor(viewerConf: ViewerConfiguration) {

    // viewerOptions will be passed the Cesium.Viewer contstuctor 
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNzJmOWIyYi1hYWZhLTQyNjEtYjk1OS0wOGRjNzIxODY4NTgiLCJpZCI6MzI1MDIsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTcwODYwMTR9.PWgnXks37YjsSP52wqFn3-FDy-ExJ1Wd6bCyDbHGrOk';
    viewerConf.viewerOptions = {
      sceneMode: SceneMode.SCENE3D,
      selectionIndicator: false,
      timeline: false,
      infoBox: false,
      fullscreenButton: false,
      baseLayerPicker: false,
      animation: false,
      shouldAnimate: false,
      homeButton: false,
      geocoder: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
    
    };

    // Will be called on viewer initialistion   
    
    viewerConf.viewerModifier = (viewer: any) => {
      // Remove default double click zoom behaviour
      viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    };
  }
}
