sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/GenericTile"
  ], function(Control) {
    "use strict";
    return Control.extend("_Custom.controls.CustomTile", {
        /**
        *    Metadata:
        *    Where properties, aggregations and events
        *    are declared
        */
        metadata: {
              properties: {

                  id: {
                    type: "string",
                    defaultValue: "auto"
                  },

                  noData: {
                        type: "string",
                        defaultValue: "No data"
                  },
                  width: {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "auto"
                  },
                  height: {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "auto"
                  },
                  padding: {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "1rem"
                  }
              },
              defaultAggregation: "content",
              aggregations: {
                  content: {
                        type: "sap.ui.core.Control",
                        multiple: false,    // 1:1
                        singularName: "content"
                  }
              },
              events: {
				/**
				 * The event is triggered when the user presses the tile.
				 */
				press: {
					parameters: {
						/**
						 * The current scope the GenericTile was in when the event occurred.
						 * @since 1.46.0
						 */
						scope: {type: "sap.m.GenericTileScope"},

						/**
						 * The action that was pressed on the tile. In the Actions scope, the available actions are Press and Remove.
						 * In Display scope, the parameter value is only Press.
						 * @since 1.46.0
						 */
						action: {type: "string"},

						/**
						 * The pressed DOM Element pointing to the GenericTile's DOM Element in Display scope.
						 * In Actions scope it points to the more icon, when the tile is pressed, or to the DOM Element of the remove button, when the remove button is pressed.
						 * @since 1.46.0
						 */
						domRef: {type: "any"}
					}
				}
			}
        },
        /**
          *      Init: Called when object is being created
          *      @public
          */
        init: function() {
              this._oNoDataLabel = new sap.m.Label().addStyleClass("cockpitPanelContainerNoData");
        },
        /**
          *    Exit: Garbage collector
          *      @public
          */
        exit: function() {
              this._oNoDataLabel.destroy();
              delete  this._oNoDataLabel;
        },
        renderer: {
            /**
              *    Main method for custom objects.
              *    In order to display the object with properties
              *    and aggregations defined, the method below
              *    treat them, and allows the developer to insert
              *    css classes or styles
              *
              *    @public
              *    @param {object} oRm
              *    @param {object} oControl
              */
              render: function(oRm, oControl) {
                  oRm.write("<div tabindex=\"0\"");
                  oRm.writeControlData(oControl);
                  // write classes
                  oRm.addClass("tileLayout");
                  oRm.writeClasses();
                  // write styles
                  oRm.addStyle("padding", oControl.getPadding());
                  oRm.addStyle("height", oControl.getHeight());
                  oRm.addStyle("width", oControl.getWidth());
                  oRm.addStyle("id", oControl.getId());
                  oRm.writeStyles();
                  oRm.write(">");
                  this._renderContent(oRm, oControl); //
                  oRm.write("</div>");
              },
              /**
                *    Render each object of content aggregation
                *    to the main object
                *    @private
                *    @param {object} oRm
                *    @param {object} oControl
                */
              _renderContent: function(oRm, oControl) {
                  var oContent = oControl.getAggregation("content");
                  if (!oContent || oContent.length === 0) {
                        // no data found on content aggregation
                        this._renderNoData(oRm, oControl);
                  } else {
                        oRm.renderControl(oControl.getContent());
                  }
              },
              /**
                *    Render 'noData' property to the main object
                *    @private
                *    @param {object} oRm
                *    @param {object} oControl
                */
              _renderNoData: function(oRm, oControl) {
                  if (!oControl._oNoDataLabel.getText()) {
                        // force "no data" text in case of empty container
                        oControl._oNoDataLabel.setText("Empty Tile");
                  }
                  oRm.write("<div");
                  oRm.writeClasses();
                  oRm.write(">");
                  oRm.renderControl(oControl._oNoDataLabel);
                  oRm.write("</div>");
                  }
              }
              
      });
      
  });
  