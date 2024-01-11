import VueClicaptcha from './Clicaptcha'
import _Vue from 'vue'

VueClicaptcha.install = Vue => {
	if (!Vue) {
		window.Vue = Vue = _Vue
	}
	Vue.component(VueClicaptcha.name, VueClicaptcha)
}
export default VueClicaptcha;
