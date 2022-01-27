sap.ui.define([
    "ena/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ena/modules/ModelManager"
], function(BaseController, JSONModel, ModelManager) {
        "use strict";
  
        
           var oAllPosition = {
                onInit: function () {
                    var oComponent = this.getOwnerComponent();
                    var oRouter = oComponent.getRouter();
                    oRouter.getRoute("RouteAllPosition").attachMatched(this._onRouteMatched, this);
            }
           } 

            return BaseController.extend("ena.controller.AllPosition", oAllPosition);
           
    });