import { Feature } from './../geojson.interface';
export class Dataset {
    name: string;
    key: string;
    components: CDBComponent[];
}

export class CDBComponent{
    name: string;
    key: string;
    lodLevel: string;
    feature: Feature;
}