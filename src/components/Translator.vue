<template>
	<img
		src="../assets/translate.png"
		class="translator"
		:class="option"
		@click="translate"
	/>
</template>

<script>
import axios from 'axios';

export default {
	name: 'Translator',
	props: {
		target: {
			type: String,
			required: true,
		},
		position: {
			type: String,
			required: false,
		},
		apikey: {
			type: String,
			required: true,
		}
	},
	data() {
		return {
			isReady: true,
			isActive: false,
			originText: [],
		};
	},
	computed : {
		option: function() {
			return {
				disabled: !this.isActive,
				left: this.position === 'left',
				right: this.position !== 'left',
			}
		},
	},
	methods: {
		translate() {
			if(!this.isReady) return;
			this.loading();
			this.isReady = false;

			if (!this.isActive) this.recursiveSearch(document.body);
			else this.reset(document.body);

			setTimeout(() => {
				this.isReady = true;
				this.loading();
				this.isActive = !this.isActive;
			}, 2 * 1000);
		},
		loading() {
			const btn = document.getElementsByClassName('translator')[0].classList;

			if(btn.contains('rotating')) btn.remove('rotating');
			else btn.add('rotating');
		},
		reset(currentNode) {
			currentNode.childNodes.forEach(async child => {
				if (child.nodeName === '#text') {
					child.nodeValue = await this.originText.shift();
				} else {
					this.reset(child);
				}
			});
		},
		recursiveSearch(currentNode) {
			currentNode.childNodes.forEach(async child => {
				if (child.nodeName === '#text') {
					this.originText.push(child.nodeValue);
					child.nodeValue = await this.callAPI(child.nodeValue);
				} else {
					this.recursiveSearch(child);
				}
			});
		},
		callAPI(originText) {
			return new Promise((resolve, reject) => {
				axios
					.post(
						'https://translation.googleapis.com/language/translate/v2?key=' + this.apikey,
						{ q: originText, target: this.target, format: 'html' },
					)
					.then(function(response) {
						resolve(response.data.data.translations[0].translatedText);
					})
					.catch(function(error) {
						reject(error);
					});
			});
		},
	},
};
</script>

<style>
.translator {
	position: fixed;
	bottom: 15px;
	height: 64px;
	width: 64px;
	border-radius: 50px;
	cursor: pointer;
	z-index: 9999;
}
.left {
	left: 10px;
}
.right {
	right: 10px;
}
.disabled {
	filter: grayscale(100%);
}
@-webkit-keyframes rotating /* Safari and Chrome */ {
	from {
		-webkit-transform: rotate(0deg);
		-o-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	to {
		-webkit-transform: rotate(360deg);
		-o-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
@keyframes rotating {
	from {
		-ms-transform: rotate(0deg);
		-moz-transform: rotate(0deg);
		-webkit-transform: rotate(0deg);
		-o-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	to {
		-ms-transform: rotate(360deg);
		-moz-transform: rotate(360deg);
		-webkit-transform: rotate(360deg);
		-o-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
.rotating {
	-webkit-animation: rotating 2s linear infinite;
	-moz-animation: rotating 2s linear infinite;
	-ms-animation: rotating 2s linear infinite;
	-o-animation: rotating 2s linear infinite;
	animation: rotating 2s linear infinite;
}
</style>
