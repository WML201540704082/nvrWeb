import Vue from 'vue'
Vue.directive('ban-ctrl-r', {
	inserted(elem, vnode) {
		window.addEventListener('keydown', function (e) {
			var ev = window.event || e;
			var code = ev.keyCode || ev.which;
			if (ev.ctrlKey && code == 82) {  // 禁用 ctrl+R 刷新
				console.log('eeeeee',e.ctrlKey,code);
				event.preventDefault();
			}
		})
	}
})