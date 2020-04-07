import { SharedService } from './../services/shared.service';
import { ExtentService } from './../services/extent.service';
import { Extent } from './../classes/extent';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-extent',
  templateUrl: './extent.component.html',
  styleUrls: ['./extent.component.css']
})
export class ExtentComponent implements OnInit {

  extent: Extent = new Extent();

  // ActivatedRoute to get the extension in the URL
  // ExtentService to get the data of the provided extension
  // Router to redirect in case of no response
  // SharedService is for the page titles
  // Title is to access the page title.
  // Meta is to change the meta tags of the website.

  constructor(
    private route: ActivatedRoute,
    private extentService: ExtentService,
    private router: Router,
    private titleService: Title,
    private sharedService: SharedService,
    private meta: Meta
    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const name = params.name;
      this.extentService.getExtent(name)
      .subscribe(extent => {
        if (extent === undefined) {
          this.router.navigateByUrl('404');
          return;
        }
        this.extent = extent;
        this.titleService.setTitle(`${this.extent.name} - ${this.sharedService.cdbTitle}`);
      });
      this.meta.addTags([
        {
          name: 'description',
          content: this.extent.name + ' CDB in Cesium'
        },
        {
          property: 'og:title',
          content: `${this.extent.name} - ${this.sharedService.cdbTitle}`
        },
        {
          property: 'og:type',
          content: 'Web-site'
        },
        {
          property: 'og:url',
          content: this.sharedService.baseUrl + this.extent.name
        },
        {
          property: 'og:image',
          content: ''
        },
        {
          property: 'og:description',
          content: this.extent.name + ' CDB in Cesium'
        },
        {
          property: 'og:site_name',
          content: this.sharedService.cdbTitle
        }
      ]);
    });
  }

}
