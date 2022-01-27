sap.ui.define([
    "ena/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "ena/modules/ModelManager"
], function (BaseController, MessageBox, JSONModel, ModelManager) {
    "use strict";


    var oApproval = {
        onInit: function () {
            var oComponent = this.getOwnerComponent();
            var oRouter = oComponent.getRouter();
            this._initViewModel();
            oRouter.getRoute("RouteApproval").attachMatched(this._onRouteMatched, this);
            var oView = this.getView();
            var oViewModel = oView.getModel("view");
            var oComponent = this.getOwnerComponent();
            var oComponentModel = oComponent.getModel("ListPositions").getData();
            oViewModel.setProperty("/ListPositionsView", oComponentModel);

            //this._selectRegionFilters();
            //this._selectCEDIFilters();
            this.initMasterListPositions();
            //this._setSelectedSubSection(sSelectedKey);
            this.closeBusyDialogLoadingView();
        },

        initMasterListPositions: function () {
            var oView = this.getView();
            var oViewModel = oView.getModel("view");
            var sIdListPosition = oViewModel.getProperty("/ListPositionsView/ID_RICHIESTA");

            this._selectContract(sIdListPosition);
        },

        onPressListItem: function (oEvent) {
            var oView = this.getView();
            var oViewModel = oView.getModel("view");
            var oSelectedItem = oEvent.getParameter("listItem");
            var sIdListItem = oEvent.getParameters().id.split("---")[1]
            var oBindingContext = oSelectedItem.getBindingContext("ListPositions");
            var oPositionSelected = oBindingContext.getObject();
            oViewModel.setProperty("/enableModify", false);
            //	this._clearDataField();

            this._selectContract(oPositionSelected.ID_RICHIESTA, sIdListItem);
        },

        _selectContract: function (sIdListPosition, sIdListItem) {
            var oView = this.getView();
            var oViewModel = oView.getModel("view");
            var oComponent = this.getOwnerComponent();
            var oListPositionsModel = oComponent.getModel("ListPositions")
            var aListPosition = oListPositionsModel.getData();

            var oSelectedList;

            if (sIdListPosition) {
                oSelectedList = aListPosition.find(function (oListPosition) {
                    return oListPosition.ID_RICHIESTA === sIdListPosition;
                });
                if (oSelectedList === undefined) {
                    oSelectedList = aListPosition[0];
                }
            } else {
                if (sIdListPosition === undefined) {
                    oSelectedList = aListPosition[0];
                }
            }
            if (oSelectedList) {

                this._changeListSelection(oSelectedList.ID_RICHIESTA, sIdListItem);
                //oSelectedListMDSpa.ZCEIO024 = oSelectedListMDSpa.ZCEIO024 === "No" ? false : true;
                oViewModel.setProperty("/ListPositionsSelected", oSelectedList);
                // if (!bSkipScroll) {
                // this._scrollToListItem();
                // }
                this._fireMasterListGrowing();
                // this.navToDetailContract(oSelectedListMDSpa.key2, true, true);
            } else {
                oViewModel.setProperty("/noListMDSpa", true);
            }
            this.closeBusyDialogLoadingView();
        },

        _changeListSelection: function (sIdListPosition, sIdListItem) {
            var oComponent = this.getOwnerComponent();
            var oListPositionsModel = oComponent.getModel("ListPositions");
            var aListPositions = oListPositionsModel.getData();
            var oSelectedPosition = aListPositions.find(function (oListPositions) {
                return oListPositions.ID_RICHIESTA === sIdListPosition;
            });
            var oPreviusSelectedIndex = aListPositions.findIndex(function (oListPositions) {
                return oSelectedPosition.selected;
            });
            if (oPreviusSelectedIndex !== -1) {
                aListPositions[oPreviusSelectedIndex].selected = false;
            } else {
                oSelectedPosition.selected = true;
            }
            oSelectedPosition.selected = true;

            oListPositionsModel.refresh();
        },

        _fireMasterListGrowing: function () {
            jQuery.sap.delayedCall(0, this, function () {
                var oView = this.getView();
                var oList = oView.byId("idPositionsMasterList");
                oList._oGrowingDelegate._updateTrigger(false);
            }, []);
        },

        /*_scrollToListItem: function() {
            jQuery.sap.delayedCall(0, this, function() {
                var oView = this.getView();
                var oComponent = this.getOwnerComponent();
                var oProjectModel = oComponent.getModel("MDSpaFilter");
                var aProjects = oProjectModel.getData();
                var oViewModel = oView.getModel("view");
                var sProjectID = oViewModel.getProperty("ListPositionsView");
                var oProject = aProjects.find(function(oProject) {
                    return oProject.TAX_NUMB === sProjectID;
                });
                if (!oProject) {
                    return;
                }
                var oList = oView.byId("idPositionsMasterList");
                var oProjectelected;
                var aItemsList = oList.getItems();
                while (!oProjectelected && aItemsList.length <= aProjects.length) {
                    aItemsList = oList.getItems();
                    oProjectelected = aItemsList.find(function(oProject) {
                        return oProject.getSelected();
                    });
                    if (!oProjectelected) {
                        var iGrowingThreshold = oProject.getGrowingThreshold();
                        var oGrowingDelegate = oProject._oGrowingDelegate;
                        oGrowingDelegate._iLimit = aItemsList.length + iGrowingThreshold;
                        oProject.updateItems("Growing");
                    }
                }
                if (oProjectelected) {
                    var oItemDomRef = oProjectelected.getDomRef();
                    // Get rid of jquery.animate due to bad performance of it
                    if (oItemDomRef) {
                        var oScroller = oList.getParent()._oScroller;
                        // oScroller.scrollTo(0, 0);
                        oScroller.scrollToElement(oItemDomRef, 500);
                    }
                }
            }, []);
        },*/

        onPressStartWF: function () {
            this.openBusyDialogLoadingView();

            var startContext = this.getView().getModel("view").getProperty("ListPositionsSelected");
            var workflowStartPayload = { definitionId: "demohr", context: startContext }

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
                        type: "POST",
                        data: JSON.stringify(workflowStartPayload),
                        headers: {
                            "X-CSRF-Token": token,
                            "Content-Type": "application/json"
                        },
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

        },

        onPressApprove: function () {
            this.openBusyDialogLoadingView();

            var startContext = this.getView().getModel("view").getProperty("ListPositionsSelected");
            var workflowStartPayload = { definitionId: "demohr", context: startContext }
            var sUrl = "/ena/bpmworkflowruntime/v1/workflow-instances" + ID; //da capire quale è l'istanza della singola richiesta
            var sContext;
            sContext.approvalStatus = "approvato";
            var aBody = {
                context: sContext,
                status: "COMPLETED"
            };

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
                        url: sUrl,
                        type: "PATCH",
                        async: false,
                        contentType: "application/json",
                        headers: {
                            "X-CSRF-Token": token,
                        },
                        data: JSON.stringify(aBody),
                        
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

        },

        _initViewModel: function () {
            var oView = this.getView();
            var oViewModel = new JSONModel({

            });
            oView.setModel(oViewModel, "view");
        }

    }

    return BaseController.extend("ena.controller.Approval", oApproval);

});