import { from, from as observableFrom, Observable, Subject } from 'rxjs';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AcLayerComponent, AcNotification, ActionType } from 'angular-cesium';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'html-layer',
  templateUrl: './html-layer.component.html',
  styleUrls: ['./html-layer.component.scss']
})
export class HtmlLayerComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  htmls$: Observable<AcNotification>;

  html1 = {
    id: '0',
    actionType: ActionType.ADD_UPDATE,
    entity: {
      id: '0',
      show: true,
      name: 'Html 1',
      position: Cesium.Cartesian3.fromDegrees(-100, 30),
      color: Cesium.Color.RED
    },
  };
  html2 = {
    id: '1',
    actionType: ActionType.ADD_UPDATE,
    entity: {
      id: '1',
      show: true,
      name: 'Html 2',
      position: Cesium.Cartesian3.fromDegrees(-100, 45),
      color: Cesium.Color.RED
    }
  };

  constructor() {
    const htmlArray = [this.html1, this.html2];
    this.htmls$ = from(htmlArray);
  }

  ngOnInit() {
  }

  updateHtml() {
    if (this.html1) {
      this.html1.entity.name = 'Work!';
      this.layer.update(this.html1.entity, this.html1.id);
    }

    this.html2.entity.name = 'Great!!!!';
    this.html2.entity.position = Cesium.Cartesian3.fromDegrees(-100, 60);
    this.layer.update(this.html2.entity, this.html2.id);
  }

  changeText(html: any, text: any) {
    html.name = text;
    this.layer.update(html, html.id);
    
  }

  pixelOffset(value) {
    return new Cesium.Cartesian2(value[0], value[1]);
  }

  removeFirst() {
    this.layer.remove('0');
    this.html1 = null;
  }

  toggleShow() {
    if (this.html1) {
      this.html1.entity.show = !this.html1.entity.show;
      this.layer.update(this.html1.entity, this.html1.id);
    }
  }
}

