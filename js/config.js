import { lib, game, ui, get, ai, _status } from '../../../noname.js'
export let config = {
	bd1: {
		name: '<hr>',
		clear: true
	},
	extIntro: {
		name: '<font color=#00FFFF>玩法介绍</font>',
		init: 'wfjs',
		unfrequent: true,
		item: {
			wfjs: '点击查看',
		},
		textMenu: (node, link) => {
			lib.setScroll(node.parentNode);
			node.parentNode.style.transform = 'translateY(-100px)';
			node.parentNode.style.height = '300px';
			node.parentNode.style.width = '300px';
			if (link === 'wfjs') node.innerHTML = `<br><span style="font-family: xingkai">开启本扩展后，进入游戏时会将所有武将（模式专属武将除外）改为4血白板（默认值，可自行调整）。
			<br><br>游戏开始时，主公随机获得一项所属势力的主公技，然后所有非模式专属武将的玩家从随机技能池中（默认15个，每个人技能池中的技能均不一样）选取2个（默认值，主公可选数+1）作为武将技能。
			其中一部分从常驻技能池单独抽取（建议将容易搭配且单独使用不超模的技能加入），AI默认抽取此类技能。
			<br><br>不建议开启本扩展的同时游玩替补模式、塔防模式等；由于本扩展开启时会清空所有武将牌上的技能，请关闭此扩展后重启游戏以查看武将牌上的技能ID。
			<br><br>bug反馈、功能建议、技能池反馈、联机游玩等可加<font color=#FFFF00>Q群392157644</font>。获取本体最新测试包、素材分享、扩展分享等也可以加。
			</span><br><br>非常感谢您对本扩展的认可和支持！`
		}
	},
	banned: {
		name: '<font color=#00FFFF>默认禁选技能</font>',
		init: 'ban',
		unfrequent: true,
		item: {
			ban: '点击查看',
		},
		textMenu: (node, link) => {
			lib.setScroll(node.parentNode);
			node.parentNode.style.transform = 'translateY(-100px)';
			node.parentNode.style.height = '300px';
			node.parentNode.style.width = '300px';
			if (link === 'ban') {
				let characterlist = [], skills = [], context = '<br>';
				if (!_status.daluandou_characters) {
					node.innerHTML = '<br><center><font color=#FF0000>加载失败！请于其他模式查看</font></center>';
					return;
				}
				if (_status.connectMode) context = '<br><font color=#FFFF00>所有主公技、隐匿技、组合技和负面技能</font><br>';
				else for (let i in lib.character) {
					if (!lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i)) characterlist.push(i);
				}
				for (let i of characterlist) {
					if (!_status.daluandou_characters[i]) continue;
					for (let j = 0; j < _status.daluandou_characters[i].length; j++) {
						let skill = _status.daluandou_characters[i][j], info = lib.skill[skill];
						if (!info || lib.filter.skillDisabled(skill)) continue;
						if (info.zhuSkill || info.hiddenSkill || info.ai && (info.ai.combo || info.ai.neg)) skills.add(skill);
					}
				}
				//skills.addArray(_status.daluandou_banlist);
				for (let i = 0; i < skills.length; i++) {
					if (i) context += '、';
					context += (lib.translate[skills[i]] || '无名技能') + '[' + skills[i] + ']';
				}
				node.innerHTML = context;
			}
		}
	},
	tip: {
		clear: true,
		name: '<hr><center><font color=#00FFB0>以下部分选项长按有提示</font>！</center>'
	},
	ncs: {
		name: '候选技能总数',
		init: 15,
		input: true,
		onblur: function (e) {
			let text = e.target, num = Number(text.innerText);
			if (isNaN(num)) num = 15;
			else if (num < 1) num = 1;
			else if (!Number.isInteger(num)) num = Math.round(num);
			text.innerText = num;
			game.saveExtensionConfig('大乱斗', 'ncs', num);
			if (Number(lib.config.extension_大乱斗_ncrs) > num) game.saveExtensionConfig('大乱斗', 'ncrs', num);
		}
	},
	nsa: {
		name: '可选技能数',
		init: 2,
		input: true,
		onblur: function (e) {
			let text = e.target, num = Number(text.innerText);
			if (isNaN(num)) num = 2;
			else if (num < 1) num = 1;
			else if (!Number.isInteger(num)) num = Math.round(num);
			text.innerText = num;
			game.saveExtensionConfig('大乱斗', 'nsa', num);
		}
	},
	ncrs: {
		name: '常驻技能候选数量',
		init: 5,
		input: true,
		onblur: function (e) {
			let text = e.target, num = Number(text.innerText);
			if (isNaN(num)) num = 5;
			else if (num < 0) num = 0;
			else if (!Number.isInteger(num)) num = Math.round(num);
			num = Math.min(num, Number(lib.config.extension_大乱斗_ncs));
			text.innerText = num;
			game.saveExtensionConfig('大乱斗', 'ncrs', num);
		}
	},
	hpFix: {
		name: '默认体力调整',
		intro: '请以“体力值/体力上限”或“体力值/体力上限/护甲值”的格式填写',
		init: '4/4',
		input: true,
		onblur: function (e) {
			let text = e.target, arr = text.innerText.split('/');
			for (let i = 0; i < arr.length; i++) {
				if (i > 2) break;
				arr[i] = Number(arr[i]);
				if (isNaN(arr[i])) arr[i] = i < 2 ? 4 : 0;
				else if (arr[i] < 1 && i < 2) arr[i] = 1;
				else if (!Number.isInteger(arr[i])) arr[i] = Math.round(arr[i]);
			}
			if (!arr.length) arr = '4/4';
			else if (arr.length === 1) arr = arr[0] + '/' + arr[0];
			else {
				arr[0] = Math.min(arr[0], arr[1]);
				arr = arr.join('/');
			}
			text.innerText = arr;
			game.saveExtensionConfig('大乱斗', 'hpFix', arr);
		}
	},
	enableTret: {
		name: '添头技',
		intro: '开启后，开局每名玩家可额外获得所选项数量的添头技，此外还可以少选X项技能获得2X项添头技',
		init: 'off',
		item: {
			on: '开启',
			off: '关闭',
			1: '一项',
			2: '两项',
			3: '三项'
		}
	},
	tretNum: {
		name: '添头技候选数',
		intro: '其中“×N”是目标可获得的添头技数量乘以N',
		init: 'x5',
		item: {
			'x2': '×2',
			'x3': '×3',
			'x4': '×4',
			'x5': '×5',
			'5': '5',
			'10': '10',
			'15': '15',
			'20': '20'
		}
	},
	enableGroup: {
		name: '势力技',
		intro: '启用势力技',
		init: false
	},
	zhuSkill: {
		name: '主公技',
		intro: `开局随机分配：
			<br>明主身份局，选初始技能前，系统会随机分配一个主公所选势力的主公技。
			<br>暗主身份局，一名角色的回合结束时，若主公已亮明身份，主公从至多三项同势力主公技中选择一项获得之。
			<br><br>将面随机分配：
			同一势力的每个主公武将上均随机分配相同的主公技`,
		init: 'on',
		item: {
			on: '正常持有',
			off: '全部移除',
			s: '开局随机分配',
			c: '将面随机分配',
		}
	},
	zhuBuff: {
		name: '主公加成',
		intro: '主公开局可选技能数+1。',
		init: false
	},
	neiBuff: {
		name: '内奸加成',
		intro: `填写“1”“2”“3”等字符，即可激活对应序号技能。
			<br>每局各限一次：
			<br>①<font color=#8D9CFF>不臣之心</font>：内奸于出牌阶段可以亮明身份加1点体力上限，然后可以选择与主公各回复1点体力。
			<br>②<font color=#8D9CFF>野心毕露</font>：出牌阶段，内奸可以移除场上一名其他角色的一项技能。
			<br>③内奸开局可以多选一个技能、亮明身份<font color=#FFFF00>并放弃①②效果</font>`,
		init: '123',
		input: true,
		onblur: function (e) {
			let text = e.target, count = [];
			if (!text.innerText.length) text.innerText = 'off';
			else if (text.innerText === 'true' || text.innerText === 'on') text.innerText = '123';
			game.saveExtensionConfig('大乱斗', 'neiBuff', text.innerText);
		}
	},
	changeDizhu: {
		name: '地主调整',
		intro: '开启后，地主开局失去〖跋扈〗并可以多选一项技能，且〖跋扈〗必然会出现在技能池中。',
		init: true
	},
	aiBuff: {
		name: '人机加成',
		intro: '选择技能后，联机模式下所有人机获得额外加成；单机模式下所有角色亮明身份，敌方角色获得额外加成',
		init: 'off',
		item: {
			off: '关闭',
			j1: '护甲+1',
			j2: '护甲+2',
			j3: '护甲+3',
			m1: '体力上限+1',
			m2: '体力上限+2',
			s1: '可选技能数+1',
			s2: '可选技能数+2',
			s3: '可选技能数+3',
		}
	},
	enableGuozhan: {
		name: '国战启用',
		intro: '开启后，国战模式专属武将也会改为白板',
		init: false,
		onclick: function (item) {
			if (item && !lib.config.extension_大乱斗_guozhan_alerted) {
				alert('开启本扩展游玩国战模式前请务必将默认体力改为3、4或5（护甲值随意）。否则没有候选武将！');
				game.saveExtensionConfig('大乱斗', 'guozhan_alerted', true);
			}
			game.saveExtensionConfig('大乱斗', 'enableGuozhan', item);
		}
	},
	notGuozhan: {
		name: '国战启用非国战武将技能',
		intro: '开启后，国战模式技能池将加入开启的非国战武将技能',
		init: false
	},
	allotSkills: {
		name: '技能添加到武将牌上',
		intro: '开启后，会将通过大乱斗规则获得的技能添加到你的武将牌上，以便于某些技能发挥正常效果。国战大乱斗建议开启此功能',
		init: 'c',
		item: {
			off: '关闭',
			r: '随机分配',
			c: '自行分配',
		}
	},
	viewGoods: {
		name: '查看常驻技能池',
		clear: true,
		onclick: function () {
			game.viewDldList('common', '常驻技能池');
		}
	},
	editGoods: {
		name: '编辑常驻技能池',
		clear: true,
		onclick: function () {
			game.editDldList(this, 'common', '常驻技能池');
		}
	},
	viewUseless: {
		name: '查看禁选技能池',
		clear: true,
		onclick: function () {
			game.viewDldList('disabled', '禁选技能池');
		}
	},
	editUseless: {
		name: '编辑禁选技能池',
		clear: true,
		onclick: function () {
			game.editDldList(this, 'disabled', '禁选技能池');
		}
	},
	viewGroup: {
		name: '查看禁配技能对',
		clear: true,
		onclick: function () {
			game.viewDldList('group', '禁配技能对');
		}
	},
	editGroup: {
		name: '编辑禁配技能对',
		clear: true,
		onclick: function () {
			game.editDldList(this, 'group', '禁配技能对');
		}
	},
	viewTret: {
		name: '查看添头技能池',
		clear: true,
		onclick: function () {
			game.viewDldList('tret', '添头技能池');
		}
	},
	editTret: {
		name: '编辑添头技能池',
		clear: true,
		onclick: function () {
			game.editDldList(this, 'tret', '添头技能池');
		}
	},
	extendTime: {
		name: '延长选技能时长',
		intro: '将联机模式按照大乱斗规则选择技能时的时长按照对应选项延长，避免看不过来。均以出牌时限为基准调整',
		init: 'x3',
		item: {
			'off': '默认',
			'x2': '×2',
			'x3': '×3',
			'x4': '×4',
			'a15': '+15',
			'a30': '+30',
			'a45': '+45',
		}
	},
	preList: {
		name: '预制技能池更新方式',
		init: 'off',
		item: {
			load: '直接覆盖',
			update: '增量补充',
			off: '不更新'
		}
	},
	addSkill: {
		name: '鏖战',
		intro: '开启后，每次洗牌后所有角色额外获得一项技能（不再提供常驻技能）',
		init: false,
	},
	addNum: {
		name: '鏖战技能候选数量',
		init: 7,
		input: true,
		onblur: function (e) {
			let text = e.target, num = Number(text.innerText);
			if (isNaN(num)) num = 7;
			else if (num < 0) num = 0;
			else if (!Number.isInteger(num)) num = Math.round(num);
			text.innerText = num;
			game.saveExtensionConfig('大乱斗', 'addNum', num);
		}
	},
	exportPz: {
		name: '复制本扩展配置',
		clear: true,
		onclick: function () {
			let txt = '{';
			for (let i in lib.config) {
				if (!i.indexOf('extension_大乱斗_')) txt += '\r	' + i.slice(14) + ' : ' + JSON.stringify(lib.config[i]).replace('\n', '\r') + ',';
			}
			txt += '\r}';
			let textarea = document.createElement('textarea');
			textarea.setAttribute('readonly', 'readonly');
			textarea.value = txt;
			document.body.appendChild(textarea);
			textarea.select();
			if (document.execCommand('copy')) {
				document.execCommand('copy');
				alert('大乱斗配置已成功复制到剪切板，请您及时粘贴保存');
			}
			else alert('复制失败，建议稍后重试');
			document.body.removeChild(textarea);
		}
	},
	loadPz: {
		name: '载入本扩展配置',
		clear: true,
		onclick: function () {
			let container = ui.create.div('.popup-container.editor');
			let editorpage = ui.create.div(container);
			let node = container;
			let str = '//完整粘贴你保存的大乱斗配置到等号右端\r_status.dld_config = ';
			node.code = str;
			ui.window.classList.add('shortcutpaused');
			ui.window.classList.add('systempaused');
			let saveInput = function () {
				let code, j;
				if (container.editor) code = container.editor.getValue();
				else if (container.textarea) code = container.textarea.value;
				try {
					eval(code);
					if (Object.prototype.toString.call(_status.dld_config) !== '[object Object]') throw ('typeError');
				} catch (e) {
					if (e === 'typeError') alert('类型错误');
					else alert('代码语法有错误，请仔细检查（' + e + '）');
					return;
				}
				for (let i in _status.dld_config) {
					game.saveConfig('extension_大乱斗_' + i, _status.dld_config[i]);
				}
				ui.window.classList.remove('shortcutpaused');
				ui.window.classList.remove('systempaused');
				container.delete();
				container.code = code;
				delete window.saveNonameInput;
				alert('配置已成功载入！即将重启游戏');
				game.reload();
			};
			window.saveNonameInput = saveInput;
			let editor = ui.create.editor(container, saveInput);
			if (node.aced) {
				ui.window.appendChild(node);
				node.editor.setValue(node.code, 1);
			}
			else if (lib.device == 'ios') {
				ui.window.appendChild(node);
				if (!node.textarea) {
					let textarea = document.createElement('textarea');
					editor.appendChild(textarea);
					node.textarea = textarea;
					lib.setScroll(textarea);
				}
				node.textarea.value = node.code;
			}
			else {
				if (!window.CodeMirror) {
					import('../../../game/codemirror.js').then(() => {
						lib.codeMirrorReady(node, editor);
					});
					lib.init.css(lib.assetURL + 'layout/default', 'codemirror');
				}
				else lib.codeMirrorReady(node, editor);
			}
		}
	},
	bd2: {
		name: '<hr>',
		clear: true
	},
}
