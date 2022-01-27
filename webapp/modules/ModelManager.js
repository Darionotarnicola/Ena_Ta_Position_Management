/* eslint-disable sap-no-element-creation */
sap.ui.define([
    "ena/modules/BaseManager",
    "sap/ui/model/json/JSONModel",
    "ena/controller/interfaces/AbstractInterfaces",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/core/Core",
    "sap/m/MessageBox"
],

function(BaseManager, JSONModel, AbstractInterfaces, ResourceModel, FilterOperator, Filter, Core, MessageBox) {
    "use strict";

    var ModelManager = {

        _prepareNavigationModel: function() {
            var oComponent = this.getComponent();
            var oNavigationModel = new JSONModel({
                "CurrentRoute": "",
                "RouterHistory": [],
                "RouteStepBack": false
            });
            oComponent.setModel(oNavigationModel, "Navigation");
            sap.ui.getCore().getEventBus().publish("NavigationModelInizialized");
        },

        /*_prepareUserInfoModel: function() {
            var oComponent = this.getComponent();
            var sUserInfo = sap.ushell.Container.getService("UserInfo").getId();
            var aUserInfo = {
                "Id": sUserInfo
            };
            var oUserInfo = new JSONModel(aUserInfo);
            oComponent.setModel(oUserInfo, "UserInfo");
        },*/

       /* readAuthUser: function() {
            // var sUserInfo = sap.ushell.Container.getService("UserInfo").getId();
            // var sUserInfo = "SAPREPLY";
            return new Promise(function(success, reject) {
                var oComponent = this.getComponent();
                var oMDModel = oComponent.getModel("MD");
                oMDModel.read("/auth_cdc_listSet", {
                    format: "json",
                    // filters: [
                    // 	new Filter("xxxxxxxx", FilterOperator.EQ, sUserInfo),
                    // ],
                    success: function(oResponse, oHeaders) {
                        var oTableAuth = oResponse.results;
                        var oTableAuthModel = new JSONModel(oTableAuth);
                        oComponent.setModel(oTableAuthModel, "authProfile");
                        sap.ui.getCore().getEventBus().publish("authProfileModelInizialized");
                        success();
                    }.bind(this),
                    error: function(oError) {
                        jQuery.sap.log.error("PreOpenProcedureManager: Error: " + oError.toString());
                        reject(oError);
                    }.bind(this)
                });
            }.bind(this));
        },*/

        _PrepareKpiForTile: function() {
            var oComponent = this.getComponent();
            var oData = new JSONModel();
            oData.loadData(jQuery.sap.getModulePath("ena.", "/model/json/KPI.json"));
            oData.attachRequestCompleted(function() {
                var aSteps = oData.getProperty("/KpiForTile");
                var oDataModel = new JSONModel(aSteps);
                oDataModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
                oComponent.setModel(oDataModel, "Kpis");
                sap.ui.getCore().getEventBus().publish("KpiModelInizialized");
            });
        },

        _PrepareListOfPositions: function(){
            var oComponent = this.getComponent();
                    var oData = new JSONModel();
                    oData.loadData(jQuery.sap.getModulePath("ena.", "/model/json/listPosition.json"));
                    oData.attachRequestCompleted(function() {
                        var aSteps = oData.getProperty("/Positions");
                        var oDataModel = new JSONModel(aSteps);
                        oDataModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
                        oComponent.setModel(oDataModel, "ListPositions");
                        sap.ui.getCore().getEventBus().publish("ListPositionsModelInizialized");
                    });
        },

        /*_PrepareListOdPositions :  function (){

            $.ajax({
                url: "/ena/bpmworkflowruntime/v1/xsrf-token",
                method: "GET",
                headers: {
                    "X-CSRF-Token": "Fetch"
                },
                success: function (result, xhr, data) {
                    var token = data.getResponseHeader("X-CSRF-Token");
                    if (token === null) return;

                    // Start workflow 
                    $.ajax({
                        url: "/ena/bpmworkflowruntime/v1/workflow-instances",
                        type: "GET",
                        Content-Type: "application/json"
                        headers: {
                            "X-CSRF-Token": token,
                        },
                        data: { 
                            Status: "xxxx",
                            recipientUser: "xxxxx"
                        }
                        async: false,
                        success: function (data) {
                            this.closeBusyDialogLoadingView();
                            MessageBox.information("The workflow is started");
                        },
                        error: function (data) {
                            this.closeBusyDialogLoadingView();
                            MessageBox.information("failed");
                        }
                    });
                },
                error: function (data) {
                    this.closeBusyDialogLoadingView();
                    MessageBox.information("failed");
                }.bind(this)
            });
        }*/
        
      

       
        initApplicationsModel: function() {
            this._prepareNavigationModel();
            this._PrepareKpiForTile();
            this._PrepareListOfPositions();

        },

        _getPromiseForModel: function(sModelName) {
            var oComponent = this.getComponent();
            return new Promise(function(resolve) {
                var oModel = oComponent.getModel(sModelName);
                var oModelData = null;
                var sModelType = "";

                if (oModel !== undefined) {
                    sModelType = oModel.getMetadata()._sClassName;
                    if (sModelType === "sap.ui.model.resource.ResourceModel") { //getData is no defined on ResourceModel
                        oModelData = oModel.getResourceBundle();
                    } else {
                        oModelData = oModel.getData();
                    }
                }

                if (sModelType === "sap.ui.model.odata.v2.ODataModel") {
                    oModel.metadataLoaded().then(function(mParams) {
                        resolve();
                    });
                    return;
                }

                if (oModelData !== null && Object.keys(oModelData).length >= 0) {
                    resolve();
                } else {
                    Core.getEventBus().subscribe(sModelName + "ModelInizialized", function() {
                        resolve();
                    });
                }
            });
        },

        _getPromiseForModels: function(aModelNames) {
            var aModelPromises = [];
            aModelNames.forEach(function(sModelName) {
                aModelPromises.push(this.getPromiseForModel(sModelName));
            }.bind(this));

            var oModelPromises = Promise.all(aModelPromises);
            oModelPromises.catch(function(oError) {
                jQuery.sap.log.error("ModelManager: Error: " + oError.toString());
            });
            return oModelPromises.then(function(values) {
                return new Promise(function(resolve) {
                    resolve();
                });
            });
        },

        getPromiseForModel: function(sModelName) {
            if (typeof sModelName === "string") {
                return this._getPromiseForModel(sModelName);
            }

            if (Array.isArray(sModelName)) {
                return this._getPromiseForModels(sModelName);
            } else {
                jQuery.sap.log.error("ModelManager: Error: unsupported input");
            }
        },

        _mappingData: function(oDataModel) {
            return {
            }
        }
    };

    BaseManager.extend(ModelManager);
    ModelManager.onInit(function() {
        //ErrorManager.registerBackendServices();
        ModelManager.initApplicationsModel();
       

    });

    return ModelManager;
});