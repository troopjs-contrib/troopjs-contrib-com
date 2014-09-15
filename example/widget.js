define([
	"troopjs-compose/mixin/factory",
	"troopjs-dom/component/widget",
	"../component",
	"../config",
	"jquery"
], function (Factory, Widget, Component, config, $) {

	var $ELEMENT = "$element";
	var TYPE = config.type;
	var COMPONENT = config.component;
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
			// Set ID if it does not already exist
			var id = node[ID] = node[ID] || new Date().getTime();

			// Extract type
			var type = node[TYPE];

			// Create element and add attributes
			var $element = $("<div></div>")
				.attr({
					"id": id,
					"data-type": type
				});

			// Append $element to parent[COMPONENT]()[$ELEMENT]
			if (parent) {
				$element.appendTo(parent[COMPONENT]()[$ELEMENT]);
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
				this[$ELEMENT].remove();
			}
		});
});