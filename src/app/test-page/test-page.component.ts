import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
})


export class TestPageComponent implements OnInit {
  constructor(
    private titleService: Title,
    private sharedService: SharedService
  ) {}
  title = 'Test';
  ngOnInit() {
    this.titleService.setTitle(`${this.title} - ${this.sharedService.cdbTitle}`);
  }
}
