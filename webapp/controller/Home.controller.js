sap.ui.define([
    "ena/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ena/modules/ModelManager"
], function(BaseController, JSONModel, ModelManager) {
        "use strict";

       var oHome = {
            onInit: function() {
                var oComponent = this.getOwnerComponent();
			    var oRouter = oComponent.getRouter();
                oRouter.getRoute("RouteHome").attachMatched({}, this.onRouteMatched, this);
                this.openBusyDialogLoadingView();
                jQuery.sap.delayedCall(4000, this, function() {
                    this.closeBusyDialogLoadingView();
                 }, []);
            },
    
            onRouteMatched: function(oEvent) {
            //	this.openBusyDialogLoadingView();
               // var oParameters = oEvent.getParameters();
               // this.addRouteToRouterHistory(oParameters.name, oParameters.arguments);
                /*ModelManager.getPromiseForModel([
                        "authProfile"
                    ])
                    .then(function() {
                        this.closeBusyDialogLoadingView();
                    }.bind(this));*/
                // jQuery.sap.delayedCall(4000, this, function() {
                // 	this.closeBusyDialogLoadingView();
                // }, []);
            },

            onPressMyInbox: function() {
                window.open("https://19c77004trial.cockpit.workflowmanagement.cfapps.eu10.hana.ondemand.com/cp.portal/site#WorkflowTask-DisplayMyInbox")
            },

            onPressTile: function() {
                this.navTo("RouteAllPosition");  
            },
            onPressApproval: function() {
                this.navTo("RouteApproval");  
            },
    
            onPressAllPositionTile: function() {
               /* var oRouter = sap.ui.core.UIComponent.getRouterFor(this)
                oRouter.navTo("RouteAllPosition");*/
                this.navTo("RouteAllPosition");
            },
            
            onPressTileAnalytics: function (oEvent) {
                this.navTo("Analytics");	
            },
            
            onPressTileRegistry: function(oEvent) {
                this.navTo("Registry");
            }
            
        };
        return BaseController.extend("ena.controller.AllPosition", oHome);
    });
