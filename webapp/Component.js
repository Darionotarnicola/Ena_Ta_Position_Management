sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "ena/model/models",
        "ena/modules/BaseManager",
        "ena/controller/interfaces/LoadingBusyDialogInterfaces"
    ],
    function (UIComponent, Device, models, BaseManager, LoadingBusyDialogInterfaces) {
        "use strict";

        return UIComponent.extend("ena.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                LoadingBusyDialogInterfaces.openBusyDialogLoadingViewBootstrap();

                // enable routing
                this.getRouter().initialize();

                //set component for BaseManager
			    BaseManager.setComponent(this);

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);