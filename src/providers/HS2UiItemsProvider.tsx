import { AbstractWidgetProps, UiItemsProvider, StagePanelLocation, StagePanelSection, ToolbarUsage, ToolbarOrientation, CommonToolbarItem, StageUsage, ToolbarItemUtilities } from "@bentley/ui-abstract";
import { HS2ListWidgetComponent } from "../components/widgets/HS2ListWidgetComponent";
import * as React from "react";

export class HS2UiItemsProvider implements UiItemsProvider {
  public readonly id = "HS2UiProvider";
  private _toggleWalls: boolean = false;


  
  public provideWidgets(stageId: string, stageUsage: string, location: StagePanelLocation, section?: StagePanelSection) : ReadonlyArray<AbstractWidgetProps> {
    const widgets: AbstractWidgetProps[] = [];

    if (stageId === "DefaultFrontstage" && location === StagePanelLocation.Right) {

      const widget: AbstractWidgetProps = {
        id: "AssetListWidget",
        label: "HS2 Assets",
        getWidgetContent: () => {
          return <HS2ListWidgetComponent></HS2ListWidgetComponent>
        }
      }

      widgets.push(widget);

    }

    return widgets;

  }

}