// Initialize a jQuery object
define([
	"../core",
	"../var/document",
	"../var/isFunction",
	"./var/rsingleTag",

	"../traversing/findFilter",
], function (jQuery, document, isFunction, rsingleTag) {
	"use strict";

	// A central reference to the root jQuery(document)
	var rootjQuery,
		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		// Shortcut simple #id case for speed
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
		// jquery的初始化
		init = (jQuery.fn.init = function (selector, context, root) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if (!selector) {
				return this;
			}

			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;

			// Handle HTML strings
			// 假如是字符串
			if (typeof selector === "string") {
				if (
					selector[0] === "<" &&
					selector[selector.length - 1] === ">" &&
					selector.length >= 3
				) {
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [null, selector, null];
				} else {
					match = rquickExpr.exec(selector);
				}

				// Match html or make sure no context is specified for #id
				if (match && (match[1] || !context)) {
					// HANDLE: $(html) -> $(array)
					if (match[1]) {
						context = context instanceof jQuery ? context[0] : context;

						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge(
							this,
							jQuery.parseHTML(
								match[1],
								context && context.nodeType
									? context.ownerDocument || context
									: document,
								true
							)
						);

						// HANDLE: $(html, props)
						if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
							for (match in context) {
								// Properties of context are called as methods if possible
								if (isFunction(this[match])) {
									this[match](context[match]);

									// ...and otherwise set as attributes
								} else {
									this.attr(match, context[match]);
								}
							}
						}

						return this;

						// HANDLE: $(#id)
					} else {
						elem = document.getElementById(match[2]);

						if (elem) {
							// Inject the element directly into the jQuery object
							this[0] = elem;
							this.length = 1;
						}
						return this;
					}

					// HANDLE: $(expr, $(...))
				} else if (!context || context.jquery) {
					return (context || root).find(selector);

					// HANDLE: $(expr, context)
					// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor(context).find(selector);
				}

				// HANDLE: $(DOMElement)
			} else if (selector.nodeType) {
				// html的直接选择元素
				this[0] = selector;
				this.length = 1;
				return this;

				// HANDLE: $(function)
				// Shortcut for document ready
			} else if (isFunction(selector)) {
				return root.ready !== undefined
					? root.ready(selector)
					: // Execute immediately if ready is not present
					  selector(jQuery);
			}

			return jQuery.makeArray(selector, this);
		});

	// Give the init function the jQuery prototype for later instantiation
	// 将init的原型赋值给jquery.fn
	// 因为我们实际上实例化的是jquery.fn.init 因此要把jquery.fn的扩展方法都赋予init.prototype
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery(document);

	return init;
});
