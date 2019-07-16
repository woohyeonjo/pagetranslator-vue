import Translator from './components/Translator.vue'

const install = (Vue) => {
    Vue.component(Translator.name, Translator)
}

// auto install if used in browser
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export {
    Translator
}

export default install