import { AppComponent } from './../app.component';
import { SharedService } from './../services/shared.service';
import { ExtentService } from './../services/extent.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Dataset } from '../classes/dataset';

@Component({
  selector: 'app-extent',
  templateUrl: './extent.component.html',
  styleUrls: ['./extent.component.css']
})
export class ExtentComponent implements OnInit {

  datasets: Dataset[] = [];
  cdbName: string;

  // ActivatedRoute to get the extension in the URL
  // ExtentService to get the data of the provided extension
  // Router to redirect in case of no response
  // SharedService is for the page titles
  // Title is to access the page title.
  // Meta is to change the meta tags of the website.
  viewer: any;
  constructor(
    private route: ActivatedRoute,
    private extentService: ExtentService,
    private router: Router,
    private titleService: Title,
    private sharedService: SharedService,
    private meta: Meta,
    private app: AppComponent
    ) { }

  ngOnInit() {

    this.viewer = this.app.cesiumViewer;
    this.route.params.subscribe(params => {
      this.cdbName = params.name;
      this.extentService.getDatasets(name)
      .subscribe(datasets => {
        if (datasets === undefined) {
          this.router.navigateByUrl('404');
          return;
        }
        this.datasets = datasets;
        console.log(this.datasets);
        this.titleService.setTitle(`${this.cdbName} - ${this.sharedService.cdbTitle}`);
      });

      this.meta.addTags([
        {
          name: 'description',
          content: this.cdbName + ' CDB in Cesium'
        },
        {
          property: 'og:title',
          content: `${this.cdbName} - ${this.sharedService.cdbTitle}`
        },
        {
          property: 'og:type',
          content: 'Web-site'
        },
        {
          property: 'og:url',
          content: this.sharedService.baseUrl + this.cdbName
        },
        // {
        //   property: 'og:image',
        //   content: ''
        // },
        {
          property: 'og:description',
          content: this.cdbName + ' CDB in Cesium'
        },
        {
          property: 'og:site_name',
          content: this.sharedService.cdbTitle
        }
      ]);
    });

  }

}
