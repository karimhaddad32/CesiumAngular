export class Extent {
    id: number;
    name: string;
    coordinate: {x: number, y: number};
    type: string;
    totalFeatureCount: number;
    features: Feature[];
}

export class Geometry {
    type: string;
    coordinates: any[][][];
}

export class Properties {
    // tslint:disable-next-line: variable-name
    Lod_Level: string;
    // tslint:disable-next-line: variable-name
    data_set: string;
    component: string;
    // tslint:disable-next-line: variable-name
    component_key: string;
    // tslint:disable-next-line: variable-name
    features_count: number;
    features: any[];
}

export class Feature {
    type: string;
    geometry: Geometry;
    properties: Properties;
}


