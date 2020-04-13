import { EXTENTS } from './../mock-extents';
import { TreeChecklistComponent } from './../tree-checklist.component';
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
import { Z_NEED_DICT } from 'zlib';



/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
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
  public currentExtent: Extent;
  public datasets: Dataset[];
  public datasetsTree: {};
  public componentList: any[];
  public lodList: string[];
  cdbName: string;
  viewer: any;

  // ActivatedRoute to get the extension in the URL
  // ExtentService to get the data of the provided extension
  // Router to redirect in case of no response
  // SharedService is for the page titles
  // Title is to access the page title.
  // Meta is to change the meta tags of the website.
  constructor(
    private service: ExtentService,
    private route: ActivatedRoute,
    private extentService: ExtentService,
    private router: Router,
    private titleService: Title,
    private sharedService: SharedService,
    private meta: Meta,
    private app: AppComponent) {

    this.datasetsTree = {};
    this.componentList = [];
    this.lodList = [];
    this.initialize();

  }

  initialize() {

    this.viewer = this.app.cesiumViewer;


    this.route.params.subscribe(params => {
      this.extentService.getDatasets(params.name)
      .subscribe(datasets => {
        if (datasets === undefined) {
          this.router.navigateByUrl('404');
          return;
        }

        this.service.getSelectedExtent().subscribe(extent => this.currentExtent = extent);
        console.log(this.currentExtent);
        this.datasets = datasets;
        
        this.viewer.camera.flyTo({
          // tslint:disable-next-line: max-line-length
          destination : Cesium.Cartesian3.fromDegrees(this.currentExtent.coordinate.x, this.currentExtent.coordinate.y, 500000)
        });

        // Making The Datasets Tree

        this.datasets.forEach(element => {
          element.components.sort(this.sortByProperty('name')).forEach(comp => {
            if (!this.componentList.includes(comp.name)) {
              this.componentList.push(comp.name);
            }
          });
          this.datasetsTree[element.name] = this.componentList;
          this.componentList = [];
        });

        console.log(this.datasetsTree);
        const data = this.buildFileTree({Extents: this.datasetsTree}, 0);

        // Notify the change.
        this.dataChange.next(data);

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
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
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

export class ExtentComponent {

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

  public datasets: Dataset[] = [];
  public cdbName: string;

  constructor(private _database: ChecklistDatabase) {

      this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
      this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      _database.dataChange.subscribe(data => {
        this.dataSource.data = data;
      });
    }

    getLevel = (node: TodoItemFlatNode) => node.level;

    isExpandable = (node: TodoItemFlatNode) => node.expandable;

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
    console.log(node);
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

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this._database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this._database.updateItem(nestedNode!, itemValue);
  }
}
