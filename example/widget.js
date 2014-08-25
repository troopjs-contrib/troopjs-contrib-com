define([
	"troopjs-compose/mixin/factory",
	"troopjs-dom/component/widget",
	"../node/component",
	"../node/config",
	"jquery"
], function (Factory, Widget, Component, config, $) {

	/**
	 * Base component for widgets attached to the node
	 * structure.
	 *
	 * @class com.component.widget
	 * @extend com.component.widget
	 */
	var $ELEMENT = "$element";
	var ELEMENTS = "elements";
	var NODE = "node";
	var TYPE = config.type;
	var ID = "id";

	return Factory(Component,

		/**
		 * Creates a new node widget
		 * @method constructor
		 * @param {Object} node Node containing data for this widget
		 * @param {Object} parent Parent node for node
		 * @inheritdoc
		 */
		function (node, parent) {
			var me = this;

			/**
			 * Data node
			 * @property {Object} node
			 * @readonly
			 * @protected
			 */
			me[NODE] = node;

			// Set ID if it does not already exist
			var id = node[ID] = node[ID] || new Date().getTime();

			// Extract type
			var type = node[TYPE];

			// Create element
			var $element = $("<div></div>");

			// Add attributes to $element
			$element.attr({
				"id": id,
				"data-type": type
			});

			/**
			 * Child elements
			 * @property {HTMLElement[]} elements
			 * @readonly
			 * @protected
			 */
			me[ELEMENTS] = $element.get();

			// Append $element to parent[$ELEMENT]
			if (parent && parent.hasOwnProperty($ELEMENT)) {
				$element.appendTo(parent[$ELEMENT]);
			}

			// Mutate arguments to next constructor
			return [ $element, type, node, parent ];
		},

		Widget,

		{
			/**
			 * @handler
			 * @inheritdoc
			 */
			"sig/finalize": function () {
				$(this[ELEMENTS]).remove();
			}
		});
});