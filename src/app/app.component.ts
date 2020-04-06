// import { CDB } from './cdb.component';
// import { CDBsService } from './cdbs.service';
// import { Component, NgModule, OnInit,Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
// import {NestedTreeControl} from '@angular/cdk/tree';
// import {MatTreeNestedDataSource} from '@angular/material/tree';

// declare var Cesium:  any;

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })


// export class AppComponent  {

//   protected cdbsUrl = '';
//   protected extentsUrl = 'assets/cdbs/';
//   protected viewer;
//   protected cdbs: any[];
//   nestedTreeControl: NestedTreeControl<FileNode>;
//   nestedDataSource: MatTreeNestedDataSource<FileNode>;
//   dataChange: BehaviorSubject<FileNode[]> = new BehaviorSubject<FileNode[]>([]);

//   private _getChildren = (node: FileNode) => { return observableOf(node.children); };
  
//   hasNestedChild = (_: number, nodeData: FileNode) => {return !(nodeData.type); };

  
//   constructor(public http: HttpClient, public service:CDBsService) {
    
//     this.cdbs = this.service.getCDBs(this.http,this.cdbsUrl);

//     this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
//     this.nestedDataSource = new MatTreeNestedDataSource();

//     this.dataChange.subscribe(data => this.nestedDataSource.data = data);

//     this.dataChange.next(this.cdbs);

//   }

// }



// export class FileNode {
//   children: FileNode[];
//   filename: string;
//   type: any;
// }


import { CDB } from './cdb.component';
import { CDBsService } from './cdbs.service';
import { Component, NgModule, OnInit,Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

declare var Cesium:  any;

@Component({

  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  
})


export class AppComponent  {
  constructor() {  }
}





