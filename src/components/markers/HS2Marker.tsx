import { Id64 } from "@bentley/bentleyjs-core";
import { XAndY, XYAndZ } from "@bentley/geometry-core";
import { Marker, BeButtonEvent, IModelApp, IModelConnection, StandardViewId, EmphasizeElements, FeatureSymbology } from "@bentley/imodeljs-frontend";
import { ColorByName, ColorDef, FeatureAppearance, Hilite} from "@bentley/imodeljs-common"

export class HS2Marker extends Marker {
    private _HS2Id: string;
    private _AssetType: string;
    private _elementId: [];

    constructor (location: XYAndZ, size: XAndY, HS2Id: string, assetType: string, elements: []) {
        super(location, size);
        this._HS2Id = HS2Id;
        this._AssetType = assetType;        
//        this.setImageUrl(this._AssetType + ".png");
        this.setImageUrl(this.getImage(assetType));
        this.title = this.populateTitle();
        this._elementId = elements;
    }

    private getImage(assetType: string): string {
        let image = ""
        switch (true) {
            case (assetType.indexOf("Floor") > 0): {
                image = "floor.png"
                break;
            }
            case (assetType.indexOf("Roof") > 0): {
                image = "roof.png"
                break;
            }
            case (assetType.indexOf("Wall") > 0): {
                image = "wall.png"
                break;
            }
            case (assetType.indexOf("Stair") > 0): {
                image = "Stairs.png"
                break;
            }
            case (assetType.indexOf("Tunnel") > 0): {
                image = "Tunnel.png"
                break;
            }
            case (assetType.indexOf("Rail") > 0): {
                image = "Railings.png"
                break;
            }
            case (assetType.indexOf("Struc") > 0): {
                image = "Structure.png"
                break;
            }

            default: {
                image = "default.jpg";
                console.log(assetType + " image not defined")
                break;
            }
        }
        return image;
    }

    private populateTitle() {
        let smartTable = "";
        const smartTableDiv = document.createElement("div");
        smartTableDiv.className = "smart-table";
        smartTableDiv.innerHTML = "<h3>" + this._HS2Id + "</h3>" + 
        "<table>" + smartTable + "</table>";
        return smartTableDiv;
        
    }

    onMouseButton(_ev: BeButtonEvent): boolean {
        if (!_ev.isDown) return true;
        let emphasis = new Hilite.Settings(ColorDef.blue, 0, 1, Hilite.Silhouette.Thick);  
        // let featureApp = FeatureAppearance.fromJSON({emphasized: undefined, rgb: {r: 0, g: 0 , b:255}, transparency: .95, weight: 1})     
        //IModelApp.viewManager.selectedView!.emphasisSettings = emphasis;
        
                
        let emph = EmphasizeElements.getOrCreate(IModelApp.viewManager.selectedView!);      
        emph.wantEmphasis = true;  
        IModelApp.viewManager.selectedView!.zoomToElements(this._elementId, { animateFrustumChange: true, standardViewId: StandardViewId.RightIso});
        emph.emphasizeElements(this._elementId, IModelApp.viewManager.selectedView!, undefined , true)
//        IModelConnection.selectionSet.replace(this._elementId)
        return true;
    }
}