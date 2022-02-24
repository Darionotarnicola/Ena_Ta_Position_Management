sap.ui.define([
    "ena/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ena/modules/ModelManager"
], function(BaseController, JSONModel, ModelManager) {
        "use strict";
  
        
           var oRoutePreFilterPage = {
                onInit: function () {
                    this.openBusyDialogLoadingView();
                    var oComponent = this.getOwnerComponent();
                    var oRouter = oComponent.getRouter();
                    oRouter.getRoute("RoutePreFilterPage").attachMatched(this.onRouteMatched, this);
                    ModelManager.getPromiseForModel([
                        "all"
                    ]).then(function () {
                        this._initViewModel();
                        this.closeBusyDialogLoadingView();
                    }.bind(this))
                    
                },

                onRouteMatched: function(oEvent) {
                    this.openBusyDialogLoadingView();
                    var oParameters = oEvent.getParameters();
                    var oArguments = oParameters.arguments;
                    this.addRouteToRouterHistory(oParameters.name, oArguments);
                    ModelManager.getPromiseForModel([
                        "all"
                    ]).then(function () {
                        this._initViewModel();
                        this.closeBusyDialogLoadingView();
                    }.bind(this))
                },

                onPressNext: function() {
                    this.openBusyDialogLoadingView();
                    var oView = this.getView();
                    var oViewModel = oView.getModel("view");
                    var oSelectedFilter = oViewModel.getProperty("/ListOfFilter");
                    ModelManager.readProducWithfilter(oSelectedFilter).then(function() {
                        this.navTo("RouteAllPosition");
                        this.closeBusyDialogLoadingView();
                    }.bind(this)).catch(function(oError) {
                        this.closeBusyDialogLoadingView();
                    }.bind(this));
                },

                _initViewModel: function() {
                    var oView = this.getView();
                    var oViewModel = new JSONModel({
                        ListOfFilter: {
                        }
                    });
                    oView.setModel(oViewModel, "view");
                }
           }

           

            return BaseController.extend("ena.controller.PreFilterPage", oRoutePreFilterPage);
           
    });