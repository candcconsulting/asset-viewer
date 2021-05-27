import { Id64 } from "@bentley/bentleyjs-core";
import { XAndY, XYAndZ } from "@bentley/geometry-core";
import { Marker, BeButtonEvent, IModelApp, IModelConnection, StandardViewId, EmphasizeElements } from "@bentley/imodeljs-frontend";

export class HS2Marker extends Marker {
    private _HS2Id: string;
    private _AssetType: string;
    private _elementId: [];

    constructor (location: XYAndZ, size: XAndY, HS2Id: string, assetType: string, elements: []) {
        super(location, size);
        this._HS2Id = HS2Id;
        this._AssetType = assetType;        
//        this.setImageUrl(this._AssetType + ".png");
        this.setImageUrl("Light.png");
        this.title = this.populateTitle();
        this._elementId = elements;
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
        const emph = EmphasizeElements.getOrCreate(IModelApp.viewManager.selectedView!);        
        IModelApp.viewManager.selectedView!.zoomToElements(this._elementId, { animateFrustumChange: true, standardViewId: StandardViewId.RightIso});
        emph.emphasizeElements(this._elementId, IModelApp.viewManager.selectedView!, undefined, true)
//        IModelConnection.selectionSet.replace(this._elementId)
        return true;
    }
}