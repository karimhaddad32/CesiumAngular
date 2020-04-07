import { SharedService } from './../services/shared.service';
import { ExtentService } from './../services/extent.service';
import { EXTENTS } from './../mock-extents';
import { Component, OnInit } from '@angular/core';
import { Extent } from '../classes/extent';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  extents: Extent[] = [];

  constructor(
    private extentService: ExtentService,
    private titleService: Title,
    private sharedService: SharedService,

    ) { }

  title = 'Home';

  ngOnInit() {
    this.titleService.setTitle(`${this.title} - ${this.sharedService.cdbTitle}`);
    this.getExtents();
  }
  // Calls the service and initialize the extents with the response from the service.
  getExtents(): void {
    this.extentService
    .getExtents()
    .subscribe(extents => (this.extents = extents));
  }

}
