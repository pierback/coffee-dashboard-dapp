export default {
	bind: function (el, binding, vnode) {
		let children = vnode.children;
		children.forEach(child => {
			if (child.tag === 'input') {
				child.elm.onfocus = function () {
					setTimeout(function () {
						updateAllInputs(vnode);
					});
				};
			}
		});
	}
}
function updateAllInputs(vnode) {
	vnode.children.forEach(child => {
		if (child.tag === 'input') {
			vnode.context[child.data.directives['0'].expression] = child.elm.value;
		}
	});
}