import { Component, Input } from '@angular/core';
import { ViewerConfiguration } from 'angular-cesium';

@Component({
  selector: 'map',
  template: `
  <div style="height: 100vh">
    <ac-map>
      <html-layer></html-layer>
    </ac-map>
  </div>`,
  providers: [ViewerConfiguration],
},
)
export class MapComponent  {
  @Input() name: string;

  constructor(private viewerConf: ViewerConfiguration) {

    // viewerOptions will be passed the Cesium.Viewer contstuctor 
    viewerConf.viewerOptions = {
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
