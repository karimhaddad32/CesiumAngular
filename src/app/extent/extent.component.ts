import { Feature } from './../geojson.interface';
import { AppComponent } from './../app.component';
import { SharedService } from './../services/shared.service';
import { ExtentService } from './../services/extent.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Dataset } from '../classes/dataset';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import { Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import { Extent } from '../classes/extent';



/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  parent: string;
}

/** Flat to-do item node with expandable and level information */
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
    private router: Router
    ) {

    this.datasetsTree = {};
    this.initialize();

  }

  initialize() {

    this.route.params.subscribe(params => {
      // Working Perfectly
      // this.extentService.getDatasets(params.name)
      // .subscribe(datasets => {
      //   if (datasets === undefined) {
      //     this.router.navigateByUrl('404');
      //     return;
      //   }
      //   this.datasets = datasets;
      //   // Making The Datasets Tree
      //   this.datasets.forEach(element => {
      //     if (!(element.name in this.datasetsTree)) {
      //       this.datasetsTree[element.name] = {};
      //     }
      //     element.components.sort(this.sortByProperty('name')).forEach(comp => {
      //       if (!(comp.key + '.' + comp.name in this.datasetsTree[element.name])) {
      //         this.datasetsTree[element.name][comp.key + '.' + comp.name] = [];
      //       }
      //       this.datasetsTree[element.name][comp.key + '.' + comp.name].push(comp.lodLevel);
      //     });
      //   });

      //   const data = this.buildFileTree({Extents: this.datasetsTree}, 0, '');

      //   // Notify the change.
      //   this.dataChange.next(data);

      // });


      // Also working Perfectly
      this.extentService.getCDBDatasets(params.name).subscribe(extent => {
        this.testExtent = extent;

        this.testExtent.features.forEach(feature => {
          if (!(feature.properties.data_set in this.datasetsTree)) {
            this.datasetsTree[feature.properties.data_set] = {};
          }
          if (!(feature.properties.component_key + '.' + feature.properties.component in this.datasetsTree[feature.properties.data_set])) {
            this.datasetsTree[feature.properties.data_set][feature.properties.component_key + '.' + feature.properties.component] = [];
          }
          this.datasetsTree[feature.properties.data_set][feature.properties.component_key + '.' + feature.properties.component]
          .push(feature.properties.Lod_Level);

        });

        const data = this.buildFileTree({Extents: this.datasetsTree}, 0, '');

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

      if (key.split('.').length > 1 ) {
        node.item = key.split('.')[1];
      } else {
        node.item = key;
      }

      node.parent = parent;

      if (value != null) {
        if (typeof value === 'object') {
          if (key.split('.').length > 1 ) {
            node.children = this.buildFileTree(value, level + 1, key.split('.')[0]);
          } else {
            node.children = this.buildFileTree(value, level + 1, node.item);
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

  constructor(
    _database: ChecklistDatabase,
    private service: ExtentService,
    private titleService: Title,
    private sharedService: SharedService,
    private meta: Meta,
    private app: AppComponent
    ) {

      this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
      this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      _database.dataChange.subscribe(data => {
        this.dataSource.data = data;
      });
    }

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

  public currentExtent: Extent;
  public currentDatasets: Dataset[];
  public testExtent: Extent;
  viewer: any;


  public currentFeatures: Feature[];

  ngOnInit(): void {
    this.currentFeatures = [];

    this.viewer = this.app.cesiumViewer;
    this.viewer.dataSources.removeAll(true);

    this.service.getSelectedExtent().subscribe(extent => this.currentExtent = extent);
    this.service.getDatasets(this.currentExtent.name).subscribe(datasets => this.currentDatasets = datasets);
    this.service.getCDBDatasets(this.currentExtent.name).subscribe(extent => this.testExtent = extent);
    const cdbName = this.currentExtent.name;
    this.viewer.camera.flyTo({
      // tslint:disable-next-line: max-line-length
      destination : Cesium.Cartesian3.fromDegrees(this.currentExtent.coordinate.x, this.currentExtent.coordinate.y, 500000)
    });

    this.titleService.setTitle(`${cdbName} - ${this.sharedService.cdbTitle}`);

    this.meta.addTags([
      {
        name: 'description',
        content: cdbName + ' CDB in Cesium'
      },
      {
        property: 'og:title',
        content: `${cdbName} - ${this.sharedService.cdbTitle}`
      },
      {
        property: 'og:type',
        content: 'Web-site'
      },
      {
        property: 'og:url',
        content: this.sharedService.baseUrl + cdbName
      },
      // {
      //   property: 'og:image',
      //   content: ''
      // },
      {
        property: 'og:description',
        content: cdbName + ' CDB in Cesium'
      },
      {
        property: 'og:site_name',
        content: this.sharedService.cdbTitle
      }
    ]);

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

    this.currentFeatures = this.getFeatures(this.checklistSelection.selected.filter(a => a.level === 3));

    this.updateCesium(oldFeatures);
  }

  updateCesium(oldFeatures: Feature[]) {

    const indexesArray = [];
    oldFeatures.forEach(feature => {
      if (!this.currentFeatures.includes(feature)) {
        indexesArray.unshift(oldFeatures.indexOf(feature));
      }
    });

    indexesArray.forEach(index => {
      this.viewer.dataSources.remove(this.viewer.dataSources.get(index));
    });

    // Working !
    // this.viewer.dataSources.removeAll(true);

    Cesium.Math.setRandomNumberSeed(3);

    this.currentFeatures.forEach(feature => {

     const lod = parseInt(feature.properties.Lod_Level.split('L')[1]);

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
        this.viewer.dataSources.add(datasourse);
      }

    //  this.viewer.dataSources._dataSources.forEach( source =>  {
    //   console.log(source);
    //   let lod = source.entities._entities.values[0]._properties._Lod_Level._value.split('L')[1];

    //   if (lod.includes('C')) {
    //       lod = -1 * parseInt(lod.split('C')[1]);
    //   }

    //   const height =  (parseInt(lod) * 10 );

    //   source.entities._entities.values.forEach(value => {

    //       value.polygon.height._value = height;

    //   });

    // });

  });
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

  getFeatures(selected: TodoItemFlatNode[]): Feature[] {

    // Scenario one

    const featuresList: Feature[] = [];

    // selected.forEach(item => {
    //   this.currentDatasets.forEach(dataset => {
    //     const component = dataset.components.filter(x => x.key === item.parent && x.lodLevel === item.item)[0];
    //     if (component !== undefined) {
    //       featuresList.push(component.feature);
    //     }
    //   });
    // });
    // return featuresList;

    // Scenario two

    selected.forEach(item => {
      console.log(this.testExtent);
      this.testExtent.features.filter(x => x.properties.component_key === item.parent && x.properties.Lod_Level === item.item)
      .forEach(feature => {
          featuresList.push(feature);
        });
    });
    return featuresList;
  }

  // /** Select the category so we can insert the new item. */
  // addNewItem(node: TodoItemFlatNode) {
  //   const parentNode = this.flatNodeMap.get(node);
  //   this._database.insertItem(parentNode!, '');
  //   this.treeControl.expand(node);
  // }

  // /** Save the node to database */
  // saveNode(node: TodoItemFlatNode, itemValue: string) {
  //   const nestedNode = this.flatNodeMap.get(node);
  //   this._database.updateItem(nestedNode!, itemValue);
  // }


}
