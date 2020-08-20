
import { enableProdMode, isDevMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (isDevMode()){
  Cesium.buildModuleUrl.setBaseUrl('/assets/cesium/');

}else{
  Cesium.buildModuleUrl.setBaseUrl('/CesiumAngular/assets/cesium/');

}

platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


