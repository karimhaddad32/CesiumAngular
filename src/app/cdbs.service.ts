import { CDB } from './cdb.component';
import { HttpClient } from '@angular/common/http';
export class CDBsService{
    
    cdbNames:object;

    getCDBs(http:HttpClient, cdbsUrl:string){
        
        // var test = http.get(cdbsUrl);
        
        return [{id: 1, name:"Tijuana", coordinate: {x:-117.0382,y:32.5149, z:50000}}, {id: 2, name:"Yemen", coordinate: {x:44.85,y:12.750,z:200000}}];
    }

    getCDBDataSets(cdbName:string){
        
        return ["dataset1", "dataset2", "dataset3"];
    }

    getComponents(dataset){
        return ["component1", "component2", "component3"];
    }
}