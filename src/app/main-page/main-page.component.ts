import { Dataset } from './../classes/dataset';
import { AppComponent } from './../app.component';
import { SharedService } from './../services/shared.service';
import { ExtentService } from './../services/extent.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Extent } from '../classes/extent';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  viewer: any;
  extents: Extent[];
  datasets: Dataset[];
  constructor(
    private app: AppComponent,
    private extentService: ExtentService,
    private titleService: Title,
    private sharedService: SharedService,
    ) {}

  title = 'Home';

  ngOnInit() {
    this.viewer = this.app.cesiumViewer;
    this.titleService.setTitle(`${this.title} - ${this.sharedService.cdbTitle}`);
    this.getExtents();
  }

  // Calls the service and initialize the extents with the response from the service.
  getExtents(): void {
    this.extentService
    .getExtents()
    .subscribe(extents => (this.extents = extents));
    console.log(this.extents);
  }

  getDatasets(extent: Extent): void {
    this.extentService.selectedExtent = extent;
    this.extentService.getDatasets(extent.name).subscribe(datasets =>
      (this.datasets = datasets)
      );
    console.log(this.datasets);
  }
}
