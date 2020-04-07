import { SharedService } from './../services/shared.service';
import { ExtentService } from './../services/extent.service';
import { Extent } from './../classes/extent';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

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
  constructor(
    private route: ActivatedRoute,
    private extentService: ExtentService,
    private router: Router,
    private titleService: Title,
    private sharedService: SharedService,
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
    }
    );
  }

}
