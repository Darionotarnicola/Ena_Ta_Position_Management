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

    function (BaseManager, JSONModel, AbstractInterfaces, ResourceModel, FilterOperator, Filter, Core, MessageBox) {
        "use strict";

        var ApprovalManager = {

            /* _PrepareListOfPositions: function () {
                 return new Promise(function (resolve,reject){ 
                     var oComponent = this.getComponent();
                     var appId = this.getComponent().getManifestEntry("/sap.app/id");
                     var appPath = appId.replaceAll(".", "/");
                     var appModulePath = jQuery.sap.getModulePath(appPath);
                     $.ajax({
                         url: appModulePath + "/bpmworkflowruntime/v1/xsrf-token",
                         method: "GET",
                         headers: {
                             "X-CSRF-Token": "Fetch"
                         },
                         success: function (result, xhr, data) {
                             var token = data.getResponseHeader("X-CSRF-Token");
                             if (token === null) return;
         
                             // Prepare list of istances Status Ready
                             $.ajax({
                                 url: appModulePath + "/bpmworkflowruntime/v1/task-instances",
                                 type: "GET",
                                 headers: {
                                     "X-CSRF-Token": token,
                                     "Content-Type": "application/json",
                                 },
                                 data: {
                                     status: "READY",
                                     workflowDefinitionId: "wfdemohr"
                                 },
                                 async: false,
                                 success: function (data) {
                                     var oListPosition = new JSONModel(data);
                                     oComponent.setModel(oListPosition, "ListPositions");
                                     sap.ui.getCore().getEventBus().publish("ListPositionsModelInizialized");
                                     resolve(console.log("ciao"))
                                 },
                                 error: function (data) {
                                     MessageBox.information("failed");
                                 }
                             });
                         },
                         error: function (data) {
                             MessageBox.information("failed");
                         }.bind(this)
                     });
                     
                 }.bind(this))
             },*/

             _SelectedPosition: function (oSelectedList) {
                return new Promise(function (resolve, reject) {
                    var sSelectedItemId = oSelectedList.id
                    var oComponent = this.getComponent();
                    var oComponentModel = oComponent.getModel("getParameters").getData()
                    // Prepare list of istances Status Ready
                    $.ajax({
                        url: oComponentModel.pathModule + "/bpmworkflowruntime/v1/task-instances/" + sSelectedItemId + "/context",
                        type: "GET",
                        headers: {
                            "X-CSRF-Token": oComponentModel.token,
                            "Content-Type": "application/json",
                        },
                        async: false,
                        success: function (data) {
                            resolve(data)
                        },
                        error: function (data) {
                            MessageBox.information("failed");
                        }
                    });

                }.bind(this));

            },

            _ifError: function(idWorkflow) {
                return new Promise(function (resolve, reject) {
                    var oComponent = this.getComponent();
                    var oComponentModel = oComponent.getModel("getParameters").getData()
                    // Prepare list of istances Status Ready
                    $.ajax({
                        url: oComponentModel.pathModule + "/bpmworkflowruntime/v1/workflow-instances/" + idWorkflow +"/error-messages",
                        type: "GET",
                        headers: {
                            "X-CSRF-Token": oComponentModel.token,
                            "Content-Type": "application/json",
                        },
                        async: false,
                        success: function (data) {
                            resolve(data)
                        },
                        error: function (data) {
                            MessageBox.information("failed");
                        }
                    });

                }.bind(this));
            },
            _PrepareListOfPositions: function () {
                return new Promise(function (resolve, reject) {
                    var oComponent = this.getComponent();
                    var oComponentModel = oComponent.getModel("getParameters").getData()
                    // Prepare list of istances Status Ready
                    $.ajax({
                        url: oComponentModel.pathModule + "/bpmworkflowruntime/v1/task-instances",
                        type: "GET",
                        headers: {
                            "X-CSRF-Token": oComponentModel.token,
                            "Content-Type": "application/json",
                        },
                        data: {
                            status: "READY",
                            workflowDefinitionId: "wfdemohr",
                            recipientUsers: "corrado.scarfone@eng.it"
                        },
                        async: false,
                        success: function (data) {
                            var oListPosition = new JSONModel(data);
                            oComponent.setModel(oListPosition, "ListPositions");
                            sap.ui.getCore().getEventBus().publish("ListPositionsModelInizialized");
                            resolve(console.log("ciao"))
                        },
                        error: function (data) {
                            MessageBox.information("failed");
                        }
                    });

                }.bind(this));

            },
        };

        BaseManager.extend(ApprovalManager);
        ApprovalManager.onInit(function () {


        });

        return ApprovalManager;
    });