import { DecorateContext, Decorator, IModelConnection, Marker, ScreenViewport } from "@bentley/imodeljs-frontend";
import { HS2Marker } from "../markers/HS2Marker";
import { UiFramework } from "@bentley/ui-framework";
import { Id64 } from "@bentley/bentleyjs-core";

export class HS2Decorator implements Decorator {
    private _iModel: IModelConnection;
    private _markerSet: Marker [];

    constructor(vp : ScreenViewport) {
        this._iModel = vp.iModel;
        this._markerSet = [];
        this.addMarkers();
    }


    public static async getHS2Elements() {
        const classquery = "select distinct ec_classname(el.ecclassid, 's.c') as classname, pd.name as propertyname from bis.element el join meta.ecpropertydef pd on el.ecclassid = pd.class.id where (pd.displaylabel like '%assetID%')"
        const classResults = UiFramework.getIModelConnection()!.query(classquery);
        const assets:any = [];
        var iRow = 0
        for await (const aClass of classResults) {            
            // values.push(aClass);
            const instancequery = "select ecinstanceid as id, ec_classname(ecclassid) as ecClassId, origin, " + aClass.propertyname + " as AssetId from " + aClass.classname ;
            try {
              const results = UiFramework.getIModelConnection()!.query(instancequery);
              for await (const row of results) {
                var item: any = [];
                const theAsset = assets.find((item: any) => item.assetId === row.assetId);
                if (theAsset === undefined) {
                    assets.push({assetId: row.assetId, class: row.ecClassId, origin: row.origin, entities: [row.id]});            
                } else {
                    if ((theAsset.origin === undefined) && (row.origin !== undefined)){
                        theAsset.origin = row.origin;

                    }
                    theAsset.entities.push(row.id);                    
                }              
            }
            }
            catch (e){
                console.log(e)
            }
        }
        /*
        for (var i=0; i < classresults.length; i =+2) {
            const query = 'select ecInstanceId as Id, ecclassId, origin, ' + classresults[i].propertyname + " as AssetID, " + classresults[i+1].propertyname + "as UAID, from " + classresults[i].classname
            const results = UiFramework.getIModelConnection()!.query(query);
            for await (const row of results) {
              values.push(row);
            }
        }
        */
        return assets;
    }

    private async addMarkers() {
        const values = await HS2Decorator.getHS2Elements();        
        values.forEach((value: any) => {
            let origin = value.origin
            if (origin === undefined) {
                origin = {x: 0,y: 0, z: 0}
            }
            const aMarker = new HS2Marker(
                {x: origin.x, y: origin.y, z: origin.z},
                {x: 40, y: 40},
                value.assetId,
                value.class,
                value.entities
            );
            this._markerSet.push(aMarker);
        })
    }

    public decorate(context: DecorateContext) : void {
        this._markerSet.forEach(marker => {
            marker.addDecoration(context);
        })
    }

}