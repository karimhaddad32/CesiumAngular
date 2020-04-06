import { AppComponent } from './../app.component';
import { CDB } from './../cdb.component';
import { HttpClient } from '@angular/common/http';
import { CesiumComponent } from '../cesium/cesium.component';
import { CDBsService } from '../cdbs.service';
import { Component, OnInit } from '@angular/core';


declare var Cesium: any;
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'cdbs', // <cdbs>
    templateUrl: './presagis-cdbs.component.html'
})

export class PresagisCDBsComponent extends AppComponent implements OnInit {

    title = 'PRESAGIS CDBs';
    selectedCDB: CDB;

    constructor(service: CDBsService, http: HttpClient) {
        super(http, service);

    }

    ngOnInit() {

        this.viewer = new Cesium.Viewer('cesiumContainer', {baseLayerPicker: true, geocoder: false});

      }

    onSelect(cdb: CDB): void {

        this.selectedCDB = new CDB(cdb['name'], cdb['id'], cdb['coordinate']);


        this.viewer.camera.flyTo({
            // tslint:disable-next-line: max-line-length
            destination : Cesium.Cartesian3.fromDegrees(this.selectedCDB.coordinate.x, this.selectedCDB.coordinate.y, this.selectedCDB.coordinate.z)
            });


        this.http.get(this.extentsUrl + this.selectedCDB.name.toLowerCase() + '.json').toPromise().then(data => {

            this.selectedCDB.cdbDetails = data;

        });


        // this.http.get(this.extentsUrl + this.selectedCDB.name.toLowerCase() + ".json").toPromise().then(data => {


            // Cesium.Math.setRandomNumberSeed(3);

            // data["features"].forEach(element => {

            //     var datasourse = Cesium.GeoJsonDataSource.load(element,{

            //         stroke: Cesium.Color.fromRandom({
            //             alpha: 1.0
            //         }),
            //         fill: Cesium.Color.fromRandom({
            //             alpha: 1.0
            //         }),
            //         clampToGround: false,
            //         markerColor: Cesium.Color.fromRandom({
            //             alpha: 1.0
            //         })

            //     });


            //     this.viewer.dataSources.add(datasourse);

            // });

            // this.viewer.dataSources._dataSources.forEach( source =>  {

            //     var lod = source.entities._entities.values[0]._properties._Lod_Level._value.split("L")[1];

            //     if (lod.includes("C")){
            //         lod = -1*parseInt(lod.split("C")[1]);
            //     }

            //     var height =  (parseInt(lod) + 10 )  *100;

            //     source.entities._entities.values.forEach(value => {

            //         value.polygon.height._value = height;

            //     })

            // })

        // })

        console.log(this.selectedCDB.coordinate);
    }

}

