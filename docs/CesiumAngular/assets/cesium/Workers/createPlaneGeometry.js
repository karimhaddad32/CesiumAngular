define(["./when-c2e8ef35","./Check-c4f3a3fc","./Math-d30358ed","./Cartesian2-e875d9d2","./Transforms-44592b02","./RuntimeError-6122571f","./WebGLConstants-4ae0db90","./ComponentDatatype-5d3f6452","./GeometryAttribute-4098b8de","./GeometryAttributes-57608efc","./VertexFormat-ad523db1"],function(n,e,t,p,y,r,a,c,s,f,o){"use strict";function i(e){e=n.defaultValue(e,n.defaultValue.EMPTY_OBJECT);var t=n.defaultValue(e.vertexFormat,o.VertexFormat.DEFAULT);this._vertexFormat=t,this._workerName="createPlaneGeometry"}i.packedLength=o.VertexFormat.packedLength,i.pack=function(e,t,r){return r=n.defaultValue(r,0),o.VertexFormat.pack(e._vertexFormat,t,r),t};var m=new o.VertexFormat,u={vertexFormat:m};i.unpack=function(e,t,r){t=n.defaultValue(t,0);var a=o.VertexFormat.unpack(e,t,m);return n.defined(r)?(r._vertexFormat=o.VertexFormat.clone(a,r._vertexFormat),r):new i(u)};var A=new p.Cartesian3(-.5,-.5,0),d=new p.Cartesian3(.5,.5,0);return i.createGeometry=function(e){var t,r,a=e._vertexFormat,n=new f.GeometryAttributes;if(a.position){if((r=new Float64Array(12))[0]=A.x,r[1]=A.y,r[2]=0,r[3]=d.x,r[4]=A.y,r[5]=0,r[6]=d.x,r[7]=d.y,r[8]=0,r[9]=A.x,r[10]=d.y,r[11]=0,n.position=new s.GeometryAttribute({componentDatatype:c.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:r}),a.normal){var o=new Float32Array(12);o[0]=0,o[1]=0,o[2]=1,o[3]=0,o[4]=0,o[5]=1,o[6]=0,o[7]=0,o[8]=1,o[9]=0,o[10]=0,o[11]=1,n.normal=new s.GeometryAttribute({componentDatatype:c.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:o})}if(a.st){var i=new Float32Array(8);i[0]=0,i[1]=0,i[2]=1,i[3]=0,i[4]=1,i[5]=1,i[6]=0,i[7]=1,n.st=new s.GeometryAttribute({componentDatatype:c.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:i})}if(a.tangent){var m=new Float32Array(12);m[0]=1,m[1]=0,m[2]=0,m[3]=1,m[4]=0,m[5]=0,m[6]=1,m[7]=0,m[8]=0,m[9]=1,m[10]=0,m[11]=0,n.tangent=new s.GeometryAttribute({componentDatatype:c.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:m})}if(a.bitangent){var u=new Float32Array(12);u[0]=0,u[1]=1,u[2]=0,u[3]=0,u[4]=1,u[5]=0,u[6]=0,u[7]=1,u[8]=0,u[9]=0,u[10]=1,u[11]=0,n.bitangent=new s.GeometryAttribute({componentDatatype:c.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:u})}(t=new Uint16Array(6))[0]=0,t[1]=1,t[2]=2,t[3]=0,t[4]=2,t[5]=3}return new s.Geometry({attributes:n,indices:t,primitiveType:s.PrimitiveType.TRIANGLES,boundingSphere:new y.BoundingSphere(p.Cartesian3.ZERO,Math.sqrt(2))})},function(e,t){return n.defined(t)&&(e=i.unpack(e,t)),i.createGeometry(e)}});