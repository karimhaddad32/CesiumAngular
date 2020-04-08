import { Dataset } from './classes/dataset';
import { Extent } from './classes/extent';
import { ExtentService } from './services/extent.service';
import { Component, NgModule, OnInit, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SharedService } from './services/shared.service';

declare var Cesium: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  protected cdbsUrl = '';
  protected extentsUrl = 'assets/cdbs/';
  protected viewer;

  public cesiumViewer;
  public extents: Extent[];
  public selectedExtent: Extent[];
  public currentDatasets: Dataset[];

  constructor(
    private extentService: ExtentService,
    private titleService: Title,
    private sharedService: SharedService,
    ) {
      this.extents = [];
      this.selectedExtent = new Extent();
      this.currentDatasets = [];
  }

  ngOnInit(): void {
    this.cesiumViewer = new Cesium.Viewer('cesiumContainer', {baseLayerPicker: true, geocoder: false});
  }



}

