 export class Geometry {
    type: string;
    coordinates: number[][][];
}

export class Properties {
    Lod_Level: string;
    data_set: string;
    component: string;
    component_key: string;
    features_count: number;
    features: any[];
}

export class Feature {
    type: string;
    geometry: Geometry;
    properties: Properties;
}

export class GeojsonObject{
    type: string;
    features: Feature[];
}


