import { Dataset } from './classes/dataset';

export const DATASETS: Dataset[] =
[
    {
        name: 'Elevation',
        key: '001_Elevation',
        components: [
            {
                name: 'Primary Terrain Elevation',
                key: 'D001_S001_T001',
                lodLevel: 'L00',
                feature: {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [
                                    -116.0,
                                    32.0
                                ],
                                [
                                    -116.0,
                                    31.0
                                ],
                                [
                                    -117.0,
                                    31.0
                                ],
                                [
                                    -118.0,
                                    31.0
                                ],
                                [
                                    -119.0,
                                    31.0
                                ],
                                [
                                    -119.0,
                                    32.0
                                ],
                                [
                                    -119.0,
                                    33.0
                                ],
                                [
                                    -118.0,
                                    33.0
                                ],
                                [
                                    -117.0,
                                    33.0
                                ],
                                [
                                    -116.0,
                                    33.0
                                ],
                                [
                                    -116.0,
                                    32.0
                                ]
                            ]
                        ]
                    },
                    properties: {
                        Lod_Level: 'L00',
                        data_set: '001_Elevation',
                        component: 'Primary Terrain Elevation',
                        component_key: 'D001_S001_T001'
                    }
                }
            },
            {
                name: 'Subordinate Bathymetry',
                key: 'D001_S100_T001',
                lodLevel: 'L00',
                feature: {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [
                                    -116.0,
                                    32.0
                                ],
                                [
                                    -116.0,
                                    31.0
                                ],
                                [
                                    -117.0,
                                    31.0
                                ],
                                [
                                    -118.0,
                                    31.0
                                ],
                                [
                                    -119.0,
                                    31.0
                                ],
                                [
                                    -119.0,
                                    32.0
                                ],
                                [
                                    -119.0,
                                    33.0
                                ],
                                [
                                    -118.0,
                                    33.0
                                ],
                                [
                                    -117.0,
                                    33.0
                                ],
                                [
                                    -116.0,
                                    33.0
                                ],
                                [
                                    -116.0,
                                    32.0
                                ]
                            ]
                        ]
                    },
                    properties: {
                        Lod_Level: 'L00',
                        data_set: '001_Elevation',
                        component: 'Subordinate Bathymetry',
                        component_key: 'D001_S100_T001'
                    }
                }
            },
            {
                name: 'Primary Terrain Elevation',
                key: 'D001_S001_T001',
                lodLevel: 'L01',
                feature: {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [
                                    -116.0,
                                    32.0
                                ],
                                [
                                    -116.0,
                                    31.5
                                ],
                                [
                                    -116.0,
                                    31.0
                                ],
                                [
                                    -116.5,
                                    31.0
                                ],
                                [
                                    -117.0,
                                    31.0
                                ],
                                [
                                    -117.5,
                                    31.0
                                ],
                                [
                                    -118.0,
                                    31.0
                                ],
                                [
                                    -118.5,
                                    31.0
                                ],
                                [
                                    -119.0,
                                    31.0
                                ],
                                [
                                    -119.0,
                                    31.5
                                ],
                                [
                                    -119.0,
                                    32.0
                                ],
                                [
                                    -119.0,
                                    32.5
                                ],
                                [
                                    -119.0,
                                    33.0
                                ],
                                [
                                    -118.5,
                                    33.0
                                ],
                                [
                                    -118.0,
                                    33.0
                                ],
                                [
                                    -117.5,
                                    33.0
                                ],
                                [
                                    -117.0,
                                    33.0
                                ],
                                [
                                    -116.5,
                                    33.0
                                ],
                                [
                                    -116.0,
                                    33.0
                                ],
                                [
                                    -116.0,
                                    32.5
                                ],
                                [
                                    -116.0,
                                    32.0
                                ]
                            ]
                        ]
                    },
                    properties: {
                        Lod_Level: 'L01',
                        data_set: '001_Elevation',
                        component: 'Primary Terrain Elevation',
                        component_key: 'D001_S001_T001'
                    }
                }
            }
        ]
    },
    {
        name: 'GSFeature',
        key: '100_GSFeature',
        components: [
            {
                name: 'Man-Made Point Features',
                key: 'D100_S001_T001',
                lodLevel: 'l06',
                feature: {
                    type: 'Feature',
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: [
                            [
                                [
                                    [
                                        44.984375,
                                        12.75
                                    ],
                                    [
                                        44.984375,
                                        12.765625
                                    ],
                                    [
                                        44.96875,
                                        12.765625
                                    ],
                                    [
                                        44.96875,
                                        12.78125
                                    ],
                                    [
                                        44.984375,
                                        12.78125
                                    ],
                                    [
                                        45.0,
                                        12.78125
                                    ],
                                    [
                                        45.0,
                                        12.765625
                                    ],
                                    [
                                        45.0,
                                        12.75
                                    ],
                                    [
                                        44.984375,
                                        12.75
                                    ]
                                ]
                            ],
                            [
                                [
                                    [
                                        45.03125,
                                        12.75
                                    ],
                                    [
                                        45.03125,
                                        12.765625
                                    ],
                                    [
                                        45.03125,
                                        12.78125
                                    ],
                                    [
                                        45.03125,
                                        12.796875
                                    ],
                                    [
                                        45.03125,
                                        12.8125
                                    ],
                                    [
                                        45.03125,
                                        12.828125
                                    ],
                                    [
                                        45.03125,
                                        12.84375
                                    ],
                                    [
                                        45.046875,
                                        12.84375
                                    ],
                                    [
                                        45.0625,
                                        12.84375
                                    ],
                                    [
                                        45.0625,
                                        12.828125
                                    ],
                                    [
                                        45.046875,
                                        12.828125
                                    ],
                                    [
                                        45.046875,
                                        12.8125
                                    ],
                                    [
                                        45.046875,
                                        12.796875
                                    ],
                                    [
                                        45.0625,
                                        12.796875
                                    ],
                                    [
                                        45.0625,
                                        12.78125
                                    ],
                                    [
                                        45.0625,
                                        12.765625
                                    ],
                                    [
                                        45.0625,
                                        12.75
                                    ],
                                    [
                                        45.046875,
                                        12.75
                                    ],
                                    [
                                        45.03125,
                                        12.75
                                    ]
                                ]
                            ]
                        ]
                    },
                    properties: {
                        Lod_Level: 'L06',
                        data_set: '100_GSFeature',
                        component: 'Man-Made Point Features',
                        component_key: 'D100_S001_T001',
                        features_count: 0,
                        features: []
                    }
                }
        }
    ]
    }
];
