import { IModelApp, StandardViewId, EmphasizeElements,  } from "@bentley/imodeljs-frontend";
import * as React from "react";
import { HS2Decorator } from "../decorators/HS2Decorator";

export function HS2ListWidgetComponent() {
  const [smartTableList, setSmartTableList] = React.useState<JSX.Element[]>([]);

  React.useEffect(() => {
    (async () => {
      const values = await HS2Decorator.getHS2Elements();
      const tableList: JSX.Element[] = [];
      const emph = EmphasizeElements.getOrCreate(IModelApp.viewManager.selectedView!)
      for (let value of values) {
        tableList.push(
          <tr onClick={() => { 
            IModelApp.viewManager.selectedView!.zoomToElements(value.entities, { animateFrustumChange: true, standardViewId: StandardViewId.RightIso});
            emph.emphasizeElements(value.entities, IModelApp.viewManager.selectedView!, undefined, true)
              }
          }>
            <th>{value.assetId}</th>
            <th>{value.class}</th>
          </tr>
        )
      }

      setSmartTableList(tableList);
    })();

  }, [])

  return (
    <table className="smart-table">
      <tbody>
        <tr>
          <th>AssetId</th>
          <th>AssetType</th>
        </tr>
        {smartTableList}
      </tbody>
    </table>
  )
}