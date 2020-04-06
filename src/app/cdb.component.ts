export class CDB{
    
    constructor(private _name:string, private _id:number,private _coordinate: {x:number, y:number,z:number} ){}

    get name(){
        return this._name;
    }

    get coordinate(){
        return this._coordinate;
    }

    get id(){
        return this._id;
    }

    set cdbDetails(value){
    }

    get cdbDetails(){
        return this.cdbDetails;
    }

}