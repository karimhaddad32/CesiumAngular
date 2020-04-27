import { Feature } from './../geojson.interface';
import { AppComponent } from './../app.component';
import { SharedService } from './../services/shared.service';
import { ExtentService } from './../services/extent.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Dataset } from '../classes/dataset';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import { Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable, from as observableFrom, Subject} from 'rxjs';
import { Extent } from '../classes/extent';
import { AcLayerComponent, CameraService, AcNotification, ActionType, AcEntity, MapsManagerService } from 'angular-cesium';
import { merge, map } from 'rxjs/operators'
import { isArray } from 'util';



/**
 * Node for list item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  parent: string;
}

/** Flat list item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  parent: string;
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  get data(): TodoItemNode[] { return this.dataChange.value; }
  public datasets: Dataset[];
  public datasetsTree: {};
  public testExtent: Extent;
  // ActivatedRoute to get the extension in the URL
  // ExtentService to get the data of the provided extension
  // Router to redirect in case of no response
  // SharedService is for the page titles
  // Title is to access the page title.
  // Meta is to change the meta tags of the website.
  constructor(
    private route: ActivatedRoute,
    private extentService: ExtentService,
    private router: Router) {
    this.datasetsTree = {};
    this.initialize();
  }

  initialize() {

    this.route.params.subscribe(params => {

      this.extentService.getCDBDatasets(params.name).subscribe(extent => {
        if (extent === undefined) {
              this.router.navigateByUrl('404');
              return;
            }
        this.testExtent = extent;

        const data = this.buildFileTree({Extents: this.testExtent}, 0, '');

        // Notify the change.
        this.dataChange.next(data);

      });

    });

  }

  sortByProperty(property: string) {
    return (a, b) => {
       if (a[property] > b[property]) {
          return 1;
       } else if (a[property] < b[property]) {
          return -1;
 }
       return 0;
    };
 }


  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number, parent: string): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      let newVal: any[] = null;

      if (key.split('.').length > 1 ) {
        node.item = key.split('.')[1];
      } else {
        node.item = key;
      }

      node.parent = parent;

      if (value != null) {
        if (Array.isArray(value)){
          newVal = value.filter(x => x.indexOf('LC') < 0)
          if (newVal.length === 0){
            const lowestLod = value.filter(x => x.indexOf('LC') >= 0).pop();
            newVal.unshift(lowestLod)
          }
        }
        if (typeof value === 'object') {
          if (key.split('.').length > 1 ) {
            node.children = this.buildFileTree(value, level + 1, key.split('.')[0]);
          } else {
            if (newVal != null){
              node.children = this.buildFileTree(newVal, level + 1, node.item);
            }else{
              node.children = this.buildFileTree(value, level + 1, node.item);
            }
          }
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  // /** Add an item to to-do list */
  // insertItem(parent: TodoItemNode, name: string) {
  //   if (parent.children) {
  //     parent.children.push({item: name} as TodoItemNode);
  //     this.dataChange.next(this.data);
  //   }
  // }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */

@Component({
  selector: 'app-extent',
  templateUrl: './extent.component.html',
  styleUrls: ['./extent.component.css'],
  providers: [ChecklistDatabase]
})

export class ExtentComponent implements OnInit {

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  // Data Variables
  public currentExtent: Extent;
  public currentDatasets: Dataset[];
  public cdbDatasets: any;
  public currentFeatures: Feature[];

  // Cesium Variables.
  @ViewChild(AcLayerComponent, {static: false}) layer: AcLayerComponent;
  polygons$ : Observable<AcNotification>;
  polyLines$: Observable<AcNotification>;
  polyLinesShow = true;
  polygonsShow = true
  updater = new Subject<AcNotification>();
  cesiumEntities : {} = {};
  entiyCounter = 0;
  cesiumViewer;

  constructor(
    _database: ChecklistDatabase,
    private service: ExtentService,
    private titleService: Title,
    private sharedService: SharedService,
    private meta: Meta,
    private app: AppComponent,
    private camera: CameraService,
    private mapsManagerService: MapsManagerService
    ) {
      this.cesiumViewer = mapsManagerService.getMap().getCesiumViewer();
      this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
      this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      _database.dataChange.subscribe(data => {
        this.dataSource.data = data;
      });
    }



  ngOnInit(): void {
    this.currentFeatures = [];

    for (let index = 0; index < this.cesiumViewer.dataSources.length; index++) {
      const element = this.cesiumViewer.dataSources.get(index);
      this.cesiumViewer.dataSources.remove(element)
    }

    console.log(this.cesiumViewer.dataSources);

    this.service.getSelectedExtent().subscribe(extent => this.currentExtent = extent);
    this.service.getCDBDatasets(this.currentExtent.name).subscribe(datasets => this.cdbDatasets = datasets);

    this.camera.cameraFlyTo({
      destination : Cesium.Cartesian3.fromDegrees(
        (this.currentExtent.baseExtents.x1 + this.currentExtent.baseExtents.x2)/2,
        (this.currentExtent.baseExtents.y1 +this.currentExtent.baseExtents.y2)/2,
        500000.0)
    })

    this.createCesiumCDBBorders();

    this.titleService.setTitle(`${this.currentExtent.name} - ${this.sharedService.cdbTitle}`);

    this.meta.addTags([
      {
        name: 'description',
        content: this.currentExtent.name + ' CDB in Cesium'
      },
      {
        property: 'og:title',
        content: `${this.currentExtent.name} - ${this.sharedService.cdbTitle}`
      },
      {
        property: 'og:type',
        content: 'Web-site'
      },
      {
        property: 'og:url',
        content: this.sharedService.baseUrl + this.currentExtent.name
      },
      {
        property: 'og:description',
        content: this.currentExtent.name + ' CDB in Cesium'
      },
      {
        property: 'og:site_name',
        content: this.sharedService.cdbTitle
      }
    ]);
  }

  createCesiumCDBBorders(){

    const baseExtent: any = new AcEntity({
      hierarchy: Cesium.Cartesian3.fromDegreesArray([this.currentExtent.baseExtents.x1, this.currentExtent.baseExtents.y1,
        this.currentExtent.baseExtents.x2, this.currentExtent.baseExtents.y1,
        this.currentExtent.baseExtents.x2, this.currentExtent.baseExtents.y2 ,
        this.currentExtent.baseExtents.x1, this.currentExtent.baseExtents.y2 ]),
      outline: true,
      outlineColor: Cesium.Color.ORANGE,
      fill: false,
      outlineWidth: 1,
    });

    this.polygons$ = observableFrom([
      {
        id: this.entiyCounter.toString(),
        entity: baseExtent,
        actionType: ActionType.ADD_UPDATE
      }
    ]).pipe(merge(this.updater));
  }

  addCesiumEntities() {

  }



    getLevel = (node: TodoItemFlatNode) => node.level;

    isExpandable = (node: TodoItemFlatNode) => node.expandable;

    getParent = (node: TodoItemFlatNode) => node.parent;

    getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

    hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.parent = node.parent;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }


  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }

    const oldFeatures: Feature[] = this.currentFeatures;

    this.service.getFeatures(this.checklistSelection.selected.filter(a => a.level === 3))
    .subscribe(
      features => this.currentFeatures = features
    );

    this.updateCesium(oldFeatures);
  }

  updateCesium(oldFeatures: Feature[]) {

    console.log(this.currentFeatures);
    console.log(oldFeatures);

    const indexArray = [];
    const lastIndex =  this.cesiumViewer.dataSources.length - oldFeatures.length;
    oldFeatures.forEach(feature => {
      if (!this.currentFeatures.includes(feature)) {
        indexArray.unshift(oldFeatures.indexOf(feature) + lastIndex);
      }
    });

    indexArray.forEach(index =>
      {
        this.cesiumViewer.dataSources.remove(this.cesiumViewer.dataSources
          .get(index), true);
      });
    



    this.currentFeatures.forEach(feature => {
     Cesium.Math.setRandomNumberSeed(3);
     const lod = parseInt(feature.properties.Lod_Level.split('L')[1],0);

     if (!oldFeatures.includes(feature)) {
        const datasourse = Cesium.GeoJsonDataSource.load(feature, {
          stroke: Cesium.Color.fromRandom({
              alpha: 0.5
          }),
          fill: Cesium.Color.fromRandom({
            alpha: 0.5
          }),
          clampToGround: false,
          markerColor: Cesium.Color.fromRandom({
            alpha: 0.5
          })
      });
         this.cesiumViewer.dataSources.add(datasourse);
      }
  });
    console.log(this.cesiumViewer.dataSources);
  }

  // Gets the root node (Extents)
  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }




}
