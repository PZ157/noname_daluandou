import { lib, game, ui, get, ai, _status } from '../../../noname.js'

export function precontent(config, pack) {
	{
		let min = [15],
			noname = lib.version.split('.').slice(2).map(i => {
				return Number(i);
			}),
			len = Math.min(noname.length, min.length),
			status = false;
		if (lib.version.slice(0, 5) === '1.10.') for (let i = 0; i < len; i++) {
			if (noname[i] < min[i]) {
				status = '您的无名杀版本太低';
				break;
			}
		}
		else status = '检测到游戏大版本号与本扩展支持的版本号不同';
		if (typeof status === 'string') {
			alert(status + '，为避免版本不兼容产生不必要的问题，已为您关闭《大乱斗》扩展，稍后自动重启游戏');
			game.saveExtensionConfig('大乱斗', 'enable', false);
			game.reload();
		}
	}
	if (lib.config.extension_大乱斗_changelog !== lib.extensionPack.大乱斗.version) lib.game.showChangeLog = function () {
		let str = [
			`<center>
				<span style="color: #00FFFF">更新日期</span>：
				24年<span style="color: #00FFB0">9</span>月<span style="color: #FF0000">2</span>日
			</center>`,
			'◆调整候选技能显示文本',
			'◆删除冗余检测',
			'◆修复提示内容',
			'◆代码规范',
		];
		let ul = document.createElement('ul');
		ul.style.textAlign = 'left';
		for (let i = 0; i < str.length; i++) {
			let li = document.createElement('test');
			li.innerHTML = str[i] + '<br>';
			ul.appendChild(li);
		}
		game.saveExtensionConfig('大乱斗', 'changelog', lib.extensionPack.大乱斗.version);
		let dialog = ui.create.dialog('大乱斗 ' + lib.extensionPack.大乱斗.version + ' 更新内容：', 'hidden');
		let lic = ui.create.div(dialog.content);
		lic.style.display = 'block';
		ul.style.display = 'inline-block';
		ul.style.marginLeft = '-40px';
		lic.appendChild(ul);
		dialog.open();
		let hidden = false;
		if (!ui.auto.classList.contains('hidden')) {
			ui.auto.hide();
			hidden = true;
		}
		game.pause();
		let control = ui.create.control('确定', function () {
			dialog.close();
			control.close();
			if (hidden) ui.auto.show();
			game.resume();
		});
		lib.init.onfree();
	};
	/**
	 * 判断skill是否被弃用
	 * @param { string } skill 所检查技能ID
	 * @param { string | string[] } [names] 角色拥有的武将名单
	 * @param { boolean } [unique] 是否检测其专属性
	 * @returns { boolean }
	 */
	lib.filter.skillDisabled = function (skill, names, unique) {
		if (!lib.translate[skill]) return true;
		let translate = lib.translate[skill + '_info'];
		if (!translate || translate.endsWith('不可用')) return true;
		let info = lib.skill[skill], mode = get.mode();
		if (!info) return true;
		if (info.sub || info.temp || info.fixed || info.vanish || info.forceunique || info.ruleSkill) return true;
		if (info.forbid && info.forbid.includes(mode)) return true;
		if (info.mode && !info.mode.includes(mode)) return true;
		if (info.available && info.available(mode) === false) return true;
		if (info.viewAs && typeof info.viewAs != 'function') {
			if (typeof info.viewAs == 'string')
				info.viewAs = {
					name: info.viewAs,
				};
			if (!lib.card[info.viewAs.name]) return true;
		}
		if (info.unique && !unique) {
			if (!names) {
				let player = _status.event.player;
				if (get.itemtype(player) !== 'player') return true;
				names = get.nameList(player);
			}
			if (!Array.isArray(names)) names = [names];
			if (typeof info.unique === 'function') return !info.unique(names);
			for (let name of names) {
				if (get.character(name, 3).includes(skill)) return false;
			}
			return true;
		}
		return false;
	};
	if (!window.decadeUI) lib.element.Player = class extends lib.element.Player {
		/** 摘自《十周年UI》 */
		constructor() {
			let player = super(...arguments);
			Object.setPrototypeOf(player, lib.element.Player.prototype);
			return player;
		}
		addSkill() {
			const skill = super.addSkill(...arguments);
			if (Array.isArray(skill)) return skill;
			game.broadcastAll((target, skill) => {
				if (!target.node.gainSkill) target.node.gainSkill = ui.create.div('.gain-skill', target, {
					position: "absolute",
					left: "15px",
					right: "15px",
					"max-height": "calc(97% - 81px)",
					bottom: "calc(3% + 81px)",
					color: "rgb(255, 255, 200)",
					"font-size": "13px",
					"text-align": "center",
					background: "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)",
					"z-index": 87,
				});
				if (typeof target.node.gainSkill.gain !== 'function') target.node.gainSkill.gain = function (skill) {
					if (!this.skills) this.skills = [];
					if (this.skills.includes(skill) || !lib.translate[skill] || this.innerHTML.includes(lib.translate[skill])) return;
					const info = lib.skill[skill];
					if (!info || info.sub || info.temp || info.fixed || info.vanish || !lib.translate[skill + '_info']) return;
					this.skills.push(skill);
					this.innerHTML = this.skills.reduce((html, senderSkill) => `${html}[${lib.translate[senderSkill]}]`, '');
				};
				target.node.gainSkill.gain(skill);
			}, this, skill);
			return skill;
		}
		removeSkill() {
			const skill = super.removeSkill(...arguments);
			if (Array.isArray(skill)) return skill;
			game.broadcastAll((target, skill) => {
				if (!target.node.gainSkill) target.node.gainSkill = ui.create.div('.gain-skill', target, {
					position: "absolute",
					left: "15px",
					right: "15px",
					"max-height": "calc(97% - 81px)",
					bottom: "calc(3% + 81px)",
					color: "rgb(255, 255, 200)",
					"font-size": "13px",
					"text-align": "center",
					background: "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)",
					"z-index": 87,
				});
				if (typeof target.node.gainSkill.lose !== 'function') target.node.gainSkill.lose = function (skill) {
					if (!this.skills) return;
					const index = this.skills.indexOf(skill);
					if (index === -1) return;
					this.skills.splice(index, 1);
					this.innerHTML = this.skills.reduce((html, senderSkill) => `${html}[${get.translation(senderSkill)}]`, '');
				};
				target.node.gainSkill.lose(skill);
			}, this, skill);
			return skill;
		}
	};
	/**
	 * 大乱斗技能不足弹窗
	 * @param { string } [str] 弹窗内容
	 */
	game.dldLessAlert = (str) => {
		if (_status.dld_less) return;
		_status.dld_less = true;
		if (str) {
			alert(str);
			return;
		}
		let tnsc = lib.config.extension_大乱斗_tnsc, nsc = lib.config.extension_大乱斗_nsc;
		if (_status.daluandou_skills.length < game.players.length * tnsc) alert('技能池太小，建议增加武将或减少候选技能数');
		else if (tnsc / nsc > 0.7) alert('可选技能数过多，建议减少可选技能数');
		else if (tnsc < 8) alert('候选技能数太少，建议增加候选技能数');
		else alert('禁配技能对过多，建议删除不必要的禁配或增加候选技能数');
	};
	/**
	 * 编辑大乱斗技能池
	 * @param { HTMLDivElement } temp 当前HTML
	 * @param { string } config 配置名
	 * @param { string } name 技能池名称
	 */
	game.editDldList = (temp, config, name) => {
		let two = config === 'group';
		game.prompt(`请输入要加入/移出${name}的${two ? '两个' : ''}技能ID${two ? '（用空格分开）' : ''}`, str => {
			if (typeof str !== 'string') return;
			let show = (info) => {
				temp.innerHTML = info;
				temp.ready = true;
				setTimeout(() => {
					temp.innerHTML = '编辑' + name;
					delete temp.ready;
				}, 1600);
			}, skills = str.split(' ').slice(0, 2);
			if (!skills.length) return;
			for (let i of skills) {
				if (!lib.skill[i]) return show(`
					<div style="color: rgb(255,0,0); font-family: xinwei; font-size: 113%">
						未找到${i}对应技能
					</div>
				`);
				if (lib.filter.skillDisabled(i, null, true)) return show(`
					<div style="color: rgb(255,0,0); font-family: xinwei; font-size: 113%">
						${i}已被禁用
					</div>
				`);
			}
			let lists = lib.config['extension_大乱斗_' + config] || [];
			if (two) {
				let find = false;
				for (let i = 0; i < lists.length; i++) {
					if (skills.includes(lists[i][0]) && (skills.length === 1 || skills.includes(lists[i][1]))) {
						lists.splice(i--, 1);
						find = true;
					}
				}
				if (!find && skills.length === 2) {
					if (skills[0] === skills[1]) return show(`
						<div style="color: rgb(255,255,0); font-family: xinwei; font-size: 113%">
							请输入两个不同的技能ID！
						</div>
					`);
					lists.push(skills);
					show(`
						<div style="color: rgb(210,210,000); font-family: xinwei; font-size: 113%">
							已将【${lib.translate[skills[0]]}】＋【${lib.translate[skills[1]]}】加入${name}
						</div>
					`);
				}
				else if (skills.length === 1 || skills[0] === skills[1]) show(`
					<div style="color: rgb(210,210,000); font-family: xinwei; font-size: 113%">
						已将【${lib.translate[skills[0]]}】相关的技能对移出${name}
					</div>
				`);
				else show(`
					<div style="color: rgb(210,210,000); font-family: xinwei; font-size: 113%">
						已将【${lib.translate[skills[0]]}】＋【${lib.translate[skills[1]]}】移出${name}
					</div>
				`);
			}
			else if (lists.includes(skills[0])) {
				lists.remove(skills[0]);
				show(`
					<div style="color: rgb(210,210,000); font-family: xinwei; font-size: 113%">
						已将【${lib.translate[skills[0]]}】移出${name}
					</div>
				`);
			}
			else {
				lists.push(skills[0]);
				show(`
					<div style="color: rgb(255,97,3); font-family: xinwei; font-size: 113%">
						已将【${lib.translate[skills[0]]}】加入${name}
					</div>
				`);
			}
			game.saveExtensionConfig('大乱斗', config, lists);
		});
	};
	/**
	 * 查看大乱斗技能池
	 * @param { string } config 配置名
	 * @param { string } name 技能池名称
	 */
	game.viewDldList = (config, name) => {
		/** 改自《手杀UI》和《群英荟萃》 */
		let h = document.body.offsetHeight,
			w = document.body.offsetWidth,
			lists = lib.config['extension_大乱斗_' + config] || [],
			skills = '',
			two = config === 'group';
		if (lists.length > 0) for (let i = 0; i < lists.length; i++) {
			if (i) skills += '、';
			if (two) {
				if (lib.translate[lists[i][0]]) skills += lib.translate[lists[i][0]];
				skills += '[' + lists[i][0] + ']＋';
				if (lib.translate[lists[i][1]]) skills += lib.translate[lists[i][1]];
				skills += '[' + lists[i][1] + ']';
			}
			else skills += (lib.translate[lists[i]] || '无名技能') + '[' + lists[i] + ']';
		}
		else skills = '暂无技能';
		let info = `<html><head>
			<meta charset='utf-8'>
			<style type='text/css'>
				body {
					background-image: url('${lib.assetURL}extension/大乱斗/image/beijing.png');
					background-size: 100% 100%;
					background-position: center;
					--w: 560px;
					--h: calc(var(--w) * 610/1058);
					width: var(--w);
					height: var(--h);
					background-repeat: no-repeat;
					background-attachment: fixed;
				}
				h1 {
					text-shadow:1px 1px 1PX #000000,1px -1px 1PX #000000,-1px 1px 1PX #000000,-1px -1px 1PX #000000;
					font-size:20px
				}
				div {
					width: 160vmin;
					height: 80vmin;
					border: 0 solid black;
					border-radius: 9px;
					padding: 15px;
					margin: 6.3vmin 5.5vmin 5.5vmin 15.5vmin;
				}
				div.ex1 {
					width: 160vmin;
					height: 80vmin;
					overflow: auto;
					font-size: 24px
				}
			</style>
			</head>
			<body>
				<div class='ex1'>
					<center><b>${name}</b></center>
					${skills}
				</div>
			</body>
		</html>`;
		const List = ui.create.div('', `
			<div style="z-index:114514">
				<iframe width="${w}px" height="${h}px" srcdoc="<!DOCTYPE html>${info}"></iframe>
			</div>
		`, ui.window);
		ui.create.div('', `
			<div style="height: 10px; width: ${w}px; text-align: center; z-index: 114514">
				<font size="5em">关闭</font>
			</div>
		`, List, function () {
			List.delete();
		});
	};
	/**
	 * 获取技能在type技能池下的按钮内容
	 * @param { string } skill 技能ID
	 * @param { string } [type] 技能池类型
	 * @returns { string }
	 */
	get.dldSkillButton = (skill, type) => {
		let info, color = {
			normal: 'color: #00FF00',
			common: 'color: #FFFF00',
			disabled: 'color: #FF0000',
			tret: 'color: #8DFDD8',
			zhu: 'color: #E983FF',
		}[type] || '';
		if (type === 'zhu') info = `
			<div class="skill">${lib.translate[skill]}</div>
			<div>${lib.translate[skill + '_info']}
		`
		else info = `
			<div class="popup text" style="width: calc(100% - 10px); display: inline-block">
				<span style="font-weight: bold; ${color}">
					${lib.translate[skill]}
				</span>
				：${lib.translate[skill + '_info']}
		`;
		if (lib.translate[skill + '_append']) {
			info += `<br><span class="firetext">${lib.translate[skill + '_append']}</span>`;
		}
		if (lib.skill[skill].derivation) {
			let derivation;
			if (Array.isArray(lib.skill[skill].derivation)) derivation = lib.skill[skill].derivation;
			else derivation = [lib.skill[skill].derivation];
			for (let der of derivation) {
				info += `
					<br><span class="thundertext">
						${lib.translate[der]}：${lib.translate[der + '_info']}
					</span>
				`;
			}
		}
		return info + '</div>';
	};
	lib.init.js(lib.assetURL + 'extension/大乱斗/js/character.js', null, () => {
		lib.config.all.characters.push('dld');
	}, () => {
		alert('error:〈大乱斗〉扩展武将导入失败');
	});
	lib.arenaReady.push(function () {
		if (!Array.isArray(lib.config.extension_大乱斗_check)) game.saveExtensionConfig('大乱斗', 'check', []);
		if (Object.prototype.toString.call(lib.config.extension_大乱斗_ief) !== '[object AsyncFunction]') game.saveExtensionConfig(
			'大乱斗',
			'ief',
			(
				"func = async function (player, configs) {" +
				"\r\tlet mode = get.mode(), isZhu = function (current) {" +
				"\r\t\tif (!current.identityShown) return false;" +
				"\r\t\tif (mode !== 'identity' && mode !== 'versus' && mode !== 'doudizhu') return false;" +
				"\r\t\treturn (" +
				"\r\t\t\tcurrent === game.zhu ||" +
				"\r\t\t\tcurrent === game.rZhu ||" +
				"\r\t\t\tcurrent === game.bZhu ||" +
				"\r\t\t\tcurrent === game.trueZhu ||" +
				"\r\t\t\tcurrent === game.falseZhu" +
				"\r\t\t);" +
				"\r\t};" +
				"\r\tif (configs.started) { //牌堆洗牌时" +
				"\r\t\tplayer.storage.dld.tnsc = 7; //候选技能数改为7" +
				"\r\t\tplayer.storage.dld.nsc = 1; //可选技能数改为1" +
				"\r\t\treturn;" +
				"\r\t}" +
				"\r\tif (isZhu(player)) { //主公加成" +
				"\r\t\tplayer.storage.dld.nsc++;" +
				"\r\t\tif (mode === 'doudizhu') await game.zhu.removeSkill('bahu');" +
				"\r\t}" +
				"\r\tif (_status.connectMode && !player.node.nameol.innerHTML.length) { //联机人机加成" +
				"\r\t\tplayer.storage.dld.nsc++;" +
				"\r\t}" +
				"\r\telse if (!_status.connectMode && !game.me.isFriendsOf(player)) { //单机敌方加成" +
				"\r\t\t//请自行发挥" +
				"\r\t}" +
				"\r\tif (configs.enableTret !== 'off') { //添头技加成" +
				"\r\t\tif (get.mode() === 'doudizhu' && player === game.zhu) {" +
				"\r\t\t\tawait player.removeSkill('feiyang');" +
				"\r\t\t\tplayer.storage.dld.tret++;" +
				"\r\t\t}" +
				"\r\t}" +
				"\r};"
			)
		);
		if (!Array.isArray(lib.config.extension_大乱斗_common)) game.saveExtensionConfig('大乱斗', 'common', []);
		if (!Array.isArray(lib.config.extension_大乱斗_disabled)) game.saveExtensionConfig('大乱斗', 'disabled', []);
		if (!Array.isArray(lib.config.extension_大乱斗_group)) game.saveExtensionConfig('大乱斗', 'group', []);
		if (!Array.isArray(lib.config.extension_大乱斗_tret)) game.saveExtensionConfig('大乱斗', 'tret', []);
		if (get.mode() === 'guozhan') return;
		_status.daluandou_characters = {};
		_status.daluandou_zhus = {};
		for (let i in lib.character) {
			if (i.startsWith('dld_')) continue;
			_status.daluandou_characters[i] = lib.character[i].skills.slice(0);
			lib.character[i].hasHiddenSkill = false;
			lib.character[i].initFilters = [];
			if (lib.character[i].isZhugong) _status.daluandou_zhus[i] = lib.character[i].skills.filter(s => {
				return lib.skill[s]?.zhuSkill;
			});
			lib.character[i].skills = [];
		}
		if (lib.characterReplace) for (let i in lib.characterReplace) {
			delete lib.characterReplace[i];
		}
	});
	lib.skill._dld_start = {
		available(mode) {
			if (mode === 'guozhan') return false;
			if (_status.connectMode && !game.me) return;
			game.broadcastAll((fixH, obj) => {
				for (let i in lib.character) {
					if (i.startsWith('dld_')) continue;
					lib.character[i].hp = fixH[0];
					lib.character[i].maxHp = fixH[1];
					lib.character[i].hujia = fixH[2];
				}
				lib.skill._dld_start.toLoad(obj);
			}, lib.config.extension_大乱斗_fixH.split('/').map(i => {
				return Number(i);
			}), {
				started: false,
				allotSkills: {},
				group: lib.config.extension_大乱斗_group,
				tret: lib.config.extension_大乱斗_tret,
				zhuSkill: lib.config.extension_大乱斗_zhuSkill,
				neiBuff: lib.config.extension_大乱斗_neiBuff,
				enableTret: lib.config.extension_大乱斗_enableTret
			});
			if (mode !== 'identity' && (mode !== 'versus' || !game.trueZhu)) return;
			let zhuSkill = lib.config.extension_大乱斗_zhuSkill, zhus = {};
			if (zhuSkill === 'off') return;
			if (_status.connectMode) {
				let characters = get.charactersOL();
				for (let i in _status.daluandou_zhus) {
					if (!characters.includes(i)) delete _status.daluandou_zhus[i];
				}
			}
			else for (let i in _status.daluandou_zhus) {
				if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) delete _status.daluandou_zhus[i];
			}
			if (zhuSkill !== 'on') {
				for (let i in _status.daluandou_zhus) {
					let skills = _status.daluandou_zhus[i], group = lib.character[i].group;
					for (let j = 0; j < skills.length; j++) {
						let info = lib.skill[skills[j]];
						if (!info.ai || !info.ai.combo) {
							if (!zhus[group]) {
								zhus[group] = ['dddqianlong'];
								//if (group === 'wu') zhus[group].addArray(['xinjiuyuan', 'dddguiying', 'rezhaofu']);
							}
							zhus[group].add(skills[j]);
						}
					}
				}
				if (zhus['qun']) {
					if (zhus['qun'].includes('twzhuiting')) zhus['wei'].add('twzhuiting');
					if (zhus['qun'].includes('twqiushou')) zhus['shu'].add('twqiushou');
				}
			}
			if (zhuSkill === 'c') for (let i in _status.daluandou_zhus) {
				_status.daluandou_zhus[i] = [zhus[lib.character[i].group].randomGet()];
			}
			else if (zhuSkill === 's') _status.daluandou_zhus = {};
			game.broadcastAll((zhus, allotSkills) => {
				lib.skill._dld_start.toLoad({
					zhus: zhus,
					allotSkills: allotSkills
				});
			}, zhus, _status.daluandou_zhus);
		},
		toLoad(configs) {
			if (!_status.postReconnect.dld_config) {
				_status.postReconnect.dld_config = [
					lib.skill._dld_start.toLoad,
					{
						allotSkills: {}
					}
				];
			}
			if (!_status.dld_config) _status.dld_config = {};
			for (let name in configs) {
				if (name === 'allotSkills') {
					for (let i in configs.allotSkills) {
						if (!_status.postReconnect.dld_config[1].allotSkills[i]) _status.postReconnect.dld_config[1].allotSkills[i] = [];
						_status.postReconnect.dld_config[1].allotSkills[i].addArray(configs.allotSkills[i]);
						lib.character[i].skills.addArray(configs.allotSkills[i]);
					}
					_status.event.trigger('allotSkills');
				}
				else {
					_status.postReconnect.dld_config[1][name] = configs[name];
					_status.dld_config[name] = configs[name];
				}
			}
		},
		trigger: {
			player: 'enterGame',
			global: ['gameStart', 'washCard']
		},
		filter(event, player) {
			if (player !== game.me) return false;
			if (event.name === 'washCard') return lib.config.extension_大乱斗_addSkill;
			return true;
		},
		forced: true,
		popup: false,
		firstDo: true,
		forceDie: true,
		priority: 157,
		charlotte: true,
		ruleSkill: true,
		isZhu(current) {
			if (!current.identityShown) return false;
			if (get.mode() !== 'identity' && get.mode() !== 'versus' && get.mode() !== 'doudizhu') return false;
			return (
				current === game.zhu ||
				current === game.rZhu ||
				current === game.bZhu ||
				current === game.trueZhu ||
				current === game.falseZhu
			);
		},
		showYe(target) {
			if (target.identityShown) return;
			game.log(target, '亮明了身份');
			game.broadcastAll(function (player) {
				player.node.identity.classList.remove('guessing');
				player.identityShown = true;
				player.ai.shown = 1;
				player.setIdentity('野', 'nei');
			}, target);
			game.log(target, '的身份是<span style="color: #8D9CFF">野心家</span>');
		},
		async content(event, trigger, player) {
			let func;
			try {
				eval(lib.config.extension_大乱斗_ief);
			} catch (e) {
				alert('运行开局执行函数时出现错误：' + e + '请立即停止游戏检查错误');
				func = async function (player, configs) { };
			}
			game.me.addTempSkill('dld_init');
			if (_status.dld_config.started) {
				game.players.forEach(async tar => {
					await func(tar, _status.dld_config);
				});
				return;
			}
			game.me.addSkill('dld_allot');
			if (lib.config.extension_大乱斗_enableTret !== 'off') game.me.addTempSkill('dld_tret');
			game.players.forEach(async tar => {
				tar.storage.dld = {
					tnsc: lib.config.extension_大乱斗_tnsc,
					nsc: lib.config.extension_大乱斗_nsc,
					tret: Number(lib.config.extension_大乱斗_enableTret) || 0,
				};
				if (get.mode() === 'identity') tar.addSkill(['dld_zhuBuff', 'dld_neiBuff1', 'dld_neiBuff2']);
				else if (get.mode() === 'versus' && game.trueZhu) tar.addSkill('dld_zhuBuff');
				await func(tar, _status.dld_config);
			});
			await _status.event.trigger('allotSkills');
		},
	};
	lib.skill.dld_allot = {
		trigger: {
			global: 'allotSkills'
		},
		silent: true,
		locked: true,
		popup: false,
		forceDie: true,
		unique: true,
		charlotte: true,
		superCharlotte: true,
		ruleSkill: true,
		async setAllotSkills(lists) {
			if (Object.keys(lists).length == 0) return;
			game.broadcastAll(lists => {
				lib.skill._dld_start.toLoad({
					allotSkills: lists
				});
			}, lists);
		},
		async content(event, trigger, player) {
			game.countPlayer(cur => {
				game.broadcastAll((current, skills) => {
					current.skills.addArray(skills);
				}, cur, cur.skills);
			});
		},
		async allotSkills(event) {
			let evt, players = event.players;
			if (lib.config.extension_大乱斗_allotSkills !== 'c' || !players.length) return;
			const evt_send = (skills, target, stop) => {
				let evt = game.createEvent('dld_allotSkills', false);
				evt.setContent(lib.skill.dld_allot.contentx);
				evt.set('target', target);
				evt.set('skills', skills);
				evt.set('includeOut', true);
				if (!stop) game.resume();
				return evt;
			};
			const evt_sendback = (result, player) => {
				if (!result) result = {};
				results.push([player, result]);
			};
			let ai_targets = [], results = [], skillsMap = {}, withme = false, withol = false;
			event.results.forEach(arr => {
				if (players.includes(arr[0])) skillsMap[arr[0].playerid] = arr[1].links;
			});
			for (const current of players) {
				if (_status.connectMode) current.showTimer();
				const skills = skillsMap[current.playerid];
				if (current.isOnline()) {
					withol = true;
					current.send(evt_send, skills, current);
					current.wait(evt_sendback);
				}
				else if (current === game.me) {
					withme = true;
					evt = evt_send(skills, current, true);
					if (_status.connectMode) game.me.wait(evt_sendback);
				}
				else ai_targets.push(current);
			}
			if (ai_targets.length) for (let target of ai_targets) {
				let skills = skillsMap[target.playerid], main = [], vice = skills.filter(j => {
					return lib.skill[j]?.viceSkill;
				}), res = {};
				for (let i of skills) {
					if (vice.includes(i)) continue;
					if (!main.length || lib.skill[i]?.mainSkill) main.push(i);
					else if (!vice.length) vice.push(i);
					else if (Math.random() < 0.5) main.push(i);
					else vice.push(i);
				}
				res[target.name1] = main;
				res[target.name2] = vice;
				evt_sendback(res, target);
			}
			if (withme) {
				let result = await evt.forResult();
				if (_status.connectMode) game.me.unwait(result, game.me);
				else {
					if (!result) result = {};
					results.push([game.me, result]);
				}
			}
			if (withol/*&&!event.resultOL*/) {
				await new Promise((resolve) => {
					const interval = setInterval(() => {
						if (results.length === players.length) {
							resolve();
							clearInterval(interval);
						}
					}, 4);
				});
			}
			if (_status.connectMode) {
				for (var i of players) i.hideTimer();
			}
			let result = {};
			for (const res of results) {
				if (!res[0] || !res[1]) continue;
				for (let i in res[1]) {
					if (i && lib.character[i]) result[i] = res[1][i];
				}
			}
			await lib.skill.dld_allot.setAllotSkills(result);
			await game.delay();
		},
		async contentx(event) {
			_status.noclearcountdown = true;
			let names = [];
			for (let name of [event.target.name1, event.target.name2]) {
				if (!name || !lib.character[name]) continue;
				names.push(name);
			}
			event.result = {};
			if (!event.skills.length || names.length < 2) {
				delete _status.noclearcountdown;
				game.stopCountChoose();
				event.result[names[0]] = event.skills;
				return;
			}
			let next = event.target.chooseButton([
				'选择要加到主将牌上的技能（其余技能将加到副将牌上）',
				[event.skills.map((skill, i) => {
					return [
						skill,
						`<div class="popup text" style="width: calc(100% - 10px); display: inline-block">
							<span class="greentext">
								${lib.translate[skill]}
							</span>
							：${get.skillInfoTranslation(skill, event.target)}
						</div>`
					];
				}), 'textbutton']
			]);
			next.set('forced', true);
			next.set('ai', function (button) {
				if (lib.skill[button.link]) {
					if (lib.skill[button.link].mainSkill) return true;
					if (lib.skill[button.link].viceSkill) return false;
				}
				return Math.random() > 0.5;
			});
			next.set('selectButton', [0, event.skills.length]);
			next.set('complexSelect', false);
			let result = await next.forResult();
			delete _status.noclearcountdown;
			game.stopCountChoose();
			event.result[names[0]] = result.links;
			event.result[names[1]] = event.skills.filter(i => {
				return !result.links.includes(i);
			});
		},
	};
	lib.skill.dld_init = {
		init() {
			if (_status.dld_config.started) return;
			_status.daluandou_common = lib.config.extension_大乱斗_common.slice(0);
			_status.daluandou_skills = [];
			_status.daluandou_tret = lib.config.extension_大乱斗_tret.slice(0);
			let characterlist = [];
			if (_status.connectMode) characterlist = get.charactersOL();
			else characterlist = Object.keys(_status.daluandou_characters).filter(i => {
				return !lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i);
			});
			for (let i of characterlist) {
				if (!_status.daluandou_characters[i]) continue;
				for (let j = 0; j < _status.daluandou_characters[i].length; j++) {
					let skill = _status.daluandou_characters[i][j];
					if (lib.filter.skillDisabled(skill, null, true)) continue;
					let info = lib.skill[skill];
					if (!info || info.zhuSkill || info.hiddenSkill || info.ai && (info.ai.combo || info.ai.neg)) continue;
					if (lib.config.extension_大乱斗_disabled.includes(skill)) continue;
					if (_status.daluandou_common.includes(skill)) continue;
					if (_status.daluandou_tret.includes(skill)) continue;
					_status.daluandou_skills.add(skill);
				}
			}
		},
		trigger: {
			player: 'enterGame',
			global: ['gameStart', 'washCard']
		},
		filter(event, player) {
			if (event.name === 'washCard') return lib.config.extension_大乱斗_addSkill;
			return true;
		},
		silent: true,
		locked: true,
		popup: false,
		firstDo: true,
		forceDie: true,
		priority: 21,
		unique: true,
		charlotte: true,
		superCharlotte: true,
		ruleSkill: true,
		getSkills(target) {
			let common = [],
				skills = [],
				count,
				trans = [],
				trymax;
			if (get.mode() === 'doudizhu') {
				if (target === game.zhu && !target.hasSkill('bahu', null, null, false)) common.push('bahu');
			}
			if (!_status.dld_config.started) {
				count = lib.config.extension_大乱斗_nrsc - common.length;
				trans = common.map(i => lib.translate[i] || i);
				trymax = _status.daluandou_common.length;
				while (count--) {
					let skill = _status.daluandou_common.randomGet();
					if (!lib.translate[skill] || trans.includes(lib.translate[skill])) {
						if (--trymax < 0) {
							game.dldLessAlert('常驻技能池太小，建议增加常驻技能或减少候选技能数');
							break;
						}
						count++;
						continue;
					}
					common.push(skill);
					trans.push(lib.translate[skill] || skill);
					_status.daluandou_common.remove(skill);
				}
			}
			count = target.storage.dld.tnsc - common.length;
			trymax = _status.daluandou_skills.length;
			while (count--) {
				let skill = _status.daluandou_skills.randomGet();
				if (trans.includes(lib.translate[skill])) {
					if (--trymax < 0) {
						game.dldLessAlert();
						break;
					}
					count++;
					continue;
				}
				let info = lib.skill[skill];
				if (typeof info.groupSkill === 'string' && target.group !== info.groupSkill) continue;
				skills.push(skill);
				trans.push(lib.translate[skill] || skill);
				_status.daluandou_skills.remove(skill);
			}
			return [common, skills];
		},
		selectSkills(target, skills) {
			let choice = [];
			let num = Math.min(skills.length, target.storage.dld.nsc);
			//skills.sort((a, b) => get.skillRank(b) - get.skillRank(a));
			for (let i of skills) {
				let can = true;
				for (let arr of lib.config.extension_大乱斗_group) {
					if (!arr.includes(i)) continue;
					let other = arr[0] === i ? arr[1] : arr[0];
					if (choice.some(b => b === other)) can = false;
				}
				if (!can) continue;
				choice.push(i);
				if (choice.length === num) break;
			}
			if (choice.length < num) game.dldLessAlert();
			return {
				links: choice,
				max: target.storage.dld.nsc
			};
		},
		async content(event, trigger, player) {
			let next;
			const send = (skills, target, num, stop) => {
				let next = game.createEvent('dld_init', false);
				next.setContent(lib.skill.dld_init.contentx);
				next.set('target', target);
				next.set('skills', skills);
				next.set('nsc', num);
				next.set('includeOut', true);
				if (!stop) game.resume();
				return next;
			};
			const sendback = (result, player) => {
				if (!result) result = {};
				if (!result.links) result.links = [];
				results.push([player, result]);
			};
			let ai_targets = [], results = [], players = game.players.filter(tar => {
				if (_status.dld_config.started) return true;
				let pack = lib.characterPack['mode_' + get.mode()] || {};
				for (let name of [tar.name, tar.name1, tar.name2]) {
					if (!name) continue;
					if (pack[name] || name.startsWith('dld_')) return false;
				}
				return true;
			}), skillsMap = {};
			let withme = false, withol = false;
			let oldtime = lib.configOL.choose_timeout, time = Number(lib.config.extension_大乱斗_fixTime.slice(1));
			if (_status.connectMode) {
				let type = lib.config.extension_大乱斗_fixTime[0];
				if (time === 'off') time = oldtime;
				else if (type === 'x') time *= Number(oldtime);
				else time += Number(oldtime);
				game.broadcastAll((time) => {
					lib.configOL.choose_timeout = time;
				}, time);
			}
			for (const current of players) {
				if (_status.connectMode) current.showTimer();
				const skills = lib.skill.dld_init.getSkills(current);
				skillsMap[current.playerid] = skills[0].concat(skills[1]);
				if (current.isOnline()) {
					withol = true;
					current.send(send, skills, current, current.storage.dld.nsc);
					current.wait(sendback);
				}
				else if (current === game.me) {
					withme = true;
					next = send(skills, current, current.storage.dld.nsc, true);
					if (_status.connectMode) game.me.wait(sendback);
				}
				else ai_targets.push(current);
			}
			if (ai_targets.length) for (let target of ai_targets) {
				sendback(lib.skill.dld_init.selectSkills(target, skillsMap[target.playerid]), target);
			}
			if (withme) {
				let result = await next.forResult();
				if (_status.connectMode) {
					game.me.unwait(result, game.me);
				}
				else {
					if (!result) result = {};
					if (!result.links) result.links = [];
					results.push([game.me, result]);
				}
			}
			if (withol && !event.resultOL) {
				await new Promise((resolve) => {
					const interval = setInterval(() => {
						if (results.length === players.length) {
							resolve();
							clearInterval(interval);
						}
					}, 4);
				});
			}
			if (ai_targets.length > 0) await new Promise((resolve) => {
				const interval = setInterval(() => {
					if (results.length === players.length) {
						resolve();
						clearInterval(interval);
					}
				}, 4);
			});
			if (_status.connectMode) {
				for (var i of players) i.hideTimer();
			}
			let obj = {};
			results.sort((a, b) => lib.sort.seat(a[0], b[0]));
			for (const res of results) {
				const target = res[0], result = res[1] || lib.skill.dld_init.selectSkills(target, skillsMap[target.playerid]);
				if (!target || !result) continue;
				let skills = result.links;
				if (lib.config.extension_大乱斗_enableTret !== 'off') {
					target.storage.dld.tret += 2 * (result.max - skills.length);
				}
				if (!skills.length) continue;
				target.popup(skills);
				await target.addSkills(skills);
				if (lib.config.extension_大乱斗_allotSkills === 'off') continue;
				let names = [], lists = [], temp = skills.slice(0);
				for (let name of [target.name1, target.name2]) {
					if (!name || !lib.character[name]) continue;
					names.push(name);
					lists.push([]);
				}
				if (!names.length) {
					players.remove(target);
					continue;
				}
				if (lib.config.extension_大乱斗_allotSkills !== 'r' && names.length > 1) continue;
				if (names.length === 1) lists[0] = temp;
				else {
					for (let i = 0; i < names.length && temp.length; i++) {
						let ss;
						if (i < names.length - 1) {
							ss = temp.randomGets(get.rand(0, names.length));
							temp.removeArray(ss);
						}
						else ss = temp;
						lists[i] = ss.slice(0);
					}
				}
				for (let i = 0; i < names.length; i++) {
					obj[names[i]] = lists[i];
				}
				players.remove(target);
			}
			await lib.skill.dld_allot.setAllotSkills(obj);
			await game.delay();
			game.broadcastAll((time) => {
				lib.configOL.choose_timeout = time;
			}, oldtime);
			var evt = game.createEvent('dld_allotSkills', false);
			evt.player = game.me;
			evt.set('players', players);
			evt.set('results', results);
			evt.setContent(lib.skill.dld_allot.allotSkills);
			game.broadcastAll(() => {
				lib.skill._dld_start.toLoad({
					started: true
				});
			});
		},
		async contentx(event) {
			_status.noclearcountdown = true;
			let max = Math.min(event.skills[0].length + event.skills[1].length, event.nsc), extintro = '';
			if (!_status.dld_config.started && _status.dld_config.enableTret !== 'off') {
				extintro = '<br><span style="color: #00FFB0">你可以少选任意个技能，稍后额外选择二倍数量的添头技</span>';
			}
			let list = event.skills[0].map((skill, i) => {
				return [
					skill,
					`<div class="popup text" style="width: calc(100% - 10px); display: inline-block">
						<span style="color: #FFFF00; font-weight: bold">
							${lib.translate[skill]}
						</span>
						：${lib.translate[skill + '_info']}
					</div>`
				];
			}).concat(event.skills[1].map((skill, i) => {
				return [skill, get.dldSkillButton(skill, 'normal')];
			}));
			if (!list.length) {
				event.result = { links: [] };
				return;
			}
			let next = event.target.chooseButton([
				(_status.dld_config.started ? '鏖战：' : '') + '选择获得' + get.cnNumber(max) + '项技能' + extintro,
				[list, 'textbutton']
			]);
			next.set('forced', true);
			next.set('ai', function (button) {
				return get.skillRank(button.link);
			});
			next.set('selectButton', [((_status.dld_config.started || _status.dld_config.enableTret === 'off') ? max : 0), max]);
			next.set('filterButton', button => {
				for (let arr of get.event('group')) {
					if (!arr.includes(button.link)) continue;
					let other = arr[0] === button.link ? arr[1] : arr[0];
					if (ui.selected.buttons.some(b => b.link === other)) return false;
				}
				return true;
			});
			next.set('group', _status.dld_config.group);
			next.set('complexSelect', false);
			let result = await next.forResult();
			delete _status.noclearcountdown;
			game.stopCountChoose();
			event.result = {
				links: result.links,
				max: event.nsc
			};
		},
	};
	lib.skill.dld_tret = {
		trigger: {
			player: 'enterGame',
			global: 'gameStart'
		},
		filter(event, player) {
			return game.players.some(tar => {
				return tar.storage.dld.tret > 0;
			});
		},
		silent: true,
		locked: true,
		popup: false,
		firstDo: true,
		forceDie: true,
		priority: 18,
		unique: true,
		charlotte: true,
		superCharlotte: true,
		ruleSkill: true,
		getSkills(target) {
			let num = lib.config.extension_大乱斗_tretNum, count;
			if (num[0] === 'x') count = target.storage.dld.tret * Number(num.slice(1));
			else count = Number(num);
			let skills = [],
				info = [],
				trymax = _status.daluandou_tret.length;
			if (get.mode() === 'doudizhu') {
				if (target === game.zhu && !target.hasSkill('feiyang', null, null, false)) skills.push('feiyang');
			}
			count -= skills.length;
			while (count--) {
				let skill = _status.daluandou_tret.randomGet();
				if (!lib.translate[skill] || info.includes(lib.translate[skill])) {
					if (--trymax < 0) {
						game.dldLessAlert('添头技能池太小，建议减少候选技能数或关闭添头技');
						break;
					}
					count++;
					continue;
				}
				skills.push(skill);
				info.push(lib.translate[skill] || skill);
				_status.daluandou_tret.remove(skill);
			}
			return skills;
		},
		async content(event, trigger, player) {
			let next;
			const send = (skills, target, num, stop) => {
				let next = game.createEvent('dld_tret', false);
				next.setContent(lib.skill.dld_tret.contentx);
				next.set('num', num);
				next.set('target', target);
				next.set('skills', skills);
				next.set('includeOut', true);
				if (!stop) game.resume();
				return next;
			};
			const sendback = (result, player) => {
				if (!result) result = {};
				if (!result.links) result.links = [];
				results.push([player, result]);
			};
			let ai_targets = [], results = [], players = game.players.filter(tar => {
				return tar.storage.dld.tret > 0;
			}), skillsMap = {};
			let withme = false, withol = false;
			let oldtime = lib.configOL.choose_timeout, time = Number(lib.config.extension_大乱斗_fixTime.slice(1));
			if (_status.connectMode) {
				let type = lib.config.extension_大乱斗_fixTime[0];
				if (time === 'off') time = oldtime;
				else if (type === 'x') time *= Number(oldtime);
				else time += Number(oldtime);
				game.broadcastAll((time) => {
					lib.configOL.choose_timeout = time;
				}, time);
			}
			for (const target of players) {
				if (_status.connectMode) target.showTimer();
				const skills = lib.skill.dld_tret.getSkills(target);
				skillsMap[target.playerid] = skills;
				if (target.isOnline()) {
					withol = true;
					target.send(send, skills, target, target.storage.dld.tret);
					target.wait(sendback);
				}
				else if (target === game.me) {
					withme = true;
					next = send(skills, target, target.storage.dld.tret, true);
					if (_status.connectMode) game.me.wait(sendback);
				}
				else ai_targets.push(target);
			}
			if (ai_targets.length) for (let target of ai_targets) {
				sendback({
					links: skillsMap[target.playerid].randomGets(target.storage.dld.tret),
					ai: true
				}, target);
			}
			if (withme) {
				let result = await next.forResult();
				if (_status.connectMode) game.me.unwait(result, game.me);
				else {
					if (!result) result = {};
					if (!result.links) result.links = [];
					results.push([game.me, result]);
				}
			}
			if (withol && !event.resultOL) await new Promise((resolve) => {
				const interval = setInterval(() => {
					if (results.length === players.length) {
						resolve();
						clearInterval(interval);
					}
				}, 4);
			});
			if (_status.connectMode) for (let i of players) i.hideTimer();
			let obj = {};
			results.sort((a, b) => lib.sort.seat(a[0], b[0]));
			for (const res of results) {
				const target = res[0], result = res[1];
				if (!target || !result) continue;
				let skills = result.links;
				if (!skills.length) continue;
				target.popup(skills);
				await target.addSkills(skills);
				if (lib.config.extension_大乱斗_allotSkills === 'off') continue;
				let names = [], lists = [], temp = skills.slice(0);
				for (let name of [target.name1, target.name2]) {
					if (!name || !lib.character[name]) continue;
					names.push(name);
					lists.push([]);
				}
				if (!names.length) {
					players.remove(target);
					continue;
				}
				if (lib.config.extension_大乱斗_allotSkills !== 'r' && names.length > 1) continue;
				if (names.length === 1) lists[0] = temp;
				else for (let i = 0; i < names.length && temp.length; i++) {
					let ss;
					if (i < names.length - 1) {
						ss = temp.randomGets(get.rand(0, names.length));
						temp.removeArray(ss);
					}
					else ss = temp;
					lists[i] = ss.slice(0);
				}
				for (let i = 0; i < names.length; i++) {
					obj[names[i]] = lists[i];
				}
				players.remove(target);
			}
			await lib.skill.dld_allot.setAllotSkills(obj);
			await game.delay();
			game.broadcastAll((time) => {
				lib.configOL.choose_timeout = time;
			}, oldtime);
			var evt = game.createEvent('dld_allotSkills', false);
			evt.player = game.me;
			evt.set('players', players);
			evt.set('results', results);
			evt.setContent(lib.skill.dld_allot.allotSkills);
		},
		async contentx(event) {
			_status.noclearcountdown = true;
			let max = Math.min(event.num, event.skills.length);
			let list = event.skills.map((skill, i) => {
				return [skill, get.dldSkillButton(skill, 'tret')];
			});
			if (!list.length) {
				event.result = { links: [] };
				return;
			}
			let next = event.target.chooseButton([
				'选择获得至多' + get.cnNumber(max) + '项添头技',
				[list, 'textbutton']
			]);
			next.set('ai', function (button) {
				return get.skillRank(button.link);
			});
			next.set('selectButton', [1, max]);
			next.set('filterButton', button => {
				for (let arr of get.event('group')) {
					if (!arr.includes(button.link)) continue;
					let other = arr[0] === button.link ? arr[1] : arr[0];
					if (ui.selected.buttons.some(b => b.link === other)) return false;
				}
				return true;
			});
			next.set('group', _status.dld_config.group);
			next.set('complexSelect', false);
			let result = await next.forResult();
			delete _status.noclearcountdown;
			game.stopCountChoose();
			event.result = {
				links: result.links,
				max: max
			};
		},
	};
	lib.skill.dld_zhuBuff = {
		mode: ['identity', 'versus'],
		trigger: {
			player: 'enterGame',
			global: ['gameStart', 'phaseEnd']
		},
		filter(event, player) {
			if (_status.dld_config.zhuSkill !== 's' || !player.identityShown) return false;
			return _status.dld_config.zhus[player.group] && lib.skill._dld_start.isZhu(player);
		},
		silent: true,
		firstDo: true,
		priority: 36,
		charlotte: true,
		superCharlotte: true,
		ruleSkill: true,
		async content(event, trigger, player) {
			switch (player.group) {
				case 'shu':
					if (lib.skill.qinwang) lib.skill.qinwang.derivation = 'rejijiang';
					break;
				case 'qun':
					if (lib.skill.staraoshi) lib.skill.staraoshi.derivation = 'starzongshi';
					break;
			}
			let list = _status.dld_config.zhus[player.group].randomGets(trigger.name === 'phase' ? 3 : 1), result;
			if (list.length === 1) result = { control: list[0] };
			else if (list.length > 0) result = await player
				.chooseControl(list)
				.set('choiceList', list.map(i => {
					return get.dldSkillButton(i, 'zhu');
				}))
				.set('prompt', '选择要获得的一项主公技')
				.set('displayIndex', false)
				.set('ai', () => 0)
				.forResult();
			else return;
			player.popup(result.control);
			await player.addSkills(result.control);
			player.removeSkill('dld_zhuBuff');
			if (lib.character[player.name1]) {
				let obj = {};
				obj[player.name1] = [result.control];
				await lib.skill.dld_allot.setAllotSkills(obj);
			}
			await game.delay();
		}
	};
	lib.skill.dld_neiBuff1 = {
		mode: ['identity'],
		enable: 'phaseUse',
		filter(event, player) {
			if (player.identity !== 'nei' || player.identityShown || !game.hasPlayer(cur => {
				return cur.identityShown && lib.skill._dld_start.isZhu(cur);
			})) return false;
			return _status.dld_config.neiBuff.includes('1');
		},
		log: false,
		charlotte: true,
		superCharlotte: true,
		ruleSkill: true,
		async content(event, trigger, player) {
			lib.skill._dld_start.showYe(player);
			lib.skill.dld_neiBuff2.prompt = '移除一名其他角色的一项技能';
			player.removeSkill('dld_neiBuff1');
			await player.gainMaxHp();
			const result = await player.chooseBool('是否令你和主公各回复1点体力？').set('ai', () => (
				game.zhu.isHealthy() ||
				player.hp <= 2 ||
				game.zhu.hp <= 1 ||
				!game.hasPlayer(function (current) {
					return current.identity == 'zhong' || current.identity == 'mingzhong';
				})
			)).forResult();
			if (result.bool) {
				await player.recover();
				await game.zhu.recover();
			}
			await game.delay();
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					if (
						!game.hasPlayer(cur => {
							return cur.identity === 'zhong' || cur.identity === 'mingzhong';
						}) ||
						player.hp <= 1 && !player.countCards('hs', 'tao') && !player.countCards('hs', 'jiu')
					) return 1;
					if (!game.hasPlayer(cur => {
						return cur.identity === 'fan';
					})) {
						if (get.attitude(game.zhu, player) < -1) return 1;
						if (get.attitude(game.zhu, player) < 0 && player.ai.shown >= 0.95) return 1;
						return -3;
					}
					if (
						player.hp <= 2 && game.zhu.hp <= 2 ||
						game.zhu.isHealthy() && lib.config.extension_AI优化_sfjAi ||
						game.zhu.hp <= 1 && !player.countCards('hs', 'tao')
					) return 1;
					return -3;
				}
			}
		}
	};
	lib.translate.dld_neiBuff1 = '<span style="color: #8D9CFF">不臣之心</span>';
	lib.skill.dld_neiBuff2 = {
		mode: ['identity'],
		enable: 'phaseUse',
		filter(event, player) {
			if (player.identity !== 'nei') return false;
			return _status.dld_config.neiBuff.includes('2');
		},
		filterTarget: lib.filter.notMe,
		prompt: '亮明身份并移除一名其他角色的一项技能',
		charlotte: true,
		superCharlotte: true,
		ruleSkill: true,
		skillAnimation: true,
		animationColor: 'thunder',
		async content(event, trigger, player) {
			player.removeSkill('dld_neiBuff2');
			lib.skill._dld_start.showYe(player);
			const target = event.targets[0];
			let skills = target.getSkills(null, false, false).filter(i => {
				return lib.translate[i] && lib.translate[i + '_info'] && lib.skill[i] && !lib.skill[i].fixed;
			}), result;
			if (skills.length) result = await player
				.chooseControl(skills)
				.set('choiceList', skills.map(i => `
					<div class="skill" style="color:#FFFF00">${lib.translate[i]}</div>
					<div>${get.skillInfoTranslation(i, target)}</div>
				`))
				.set('prompt', '选择要移除的一项技能')
				.set('displayIndex', false)
				.set('ai', () => get.event('idx'))
				.set('idx', function () {
					if (skills.length === 1) return 0;
					let good = [], normal = [], half = [], less = [];
					for (let i = 0; i < skills.length; i++) {
						let info = lib.skill[skills[i]];
						if (!info.ai) {
							if (_status.dld_config.tret.includes(skills[i])) less.add(skills[i]);
							else normal.add(skills[i]);
						}
						else if (info.ai.combo) {
							if (!target.hasSkill(info.ai.combo, null, null, false)) less.add(skills[i]);
							else if (!good.includes(info.ai.combo)) good.add(info.ai.combo);
							else normal.add(skills[i]);
						}
						else if (info.ai.neg);
						else if (info.ai.halfneg) half.add(skills[i]);
						else if (_status.dld_config.tret.includes(skills[i])) less.add(skills[i]);
						else normal.add(skills[i]);
					}
					if (good.length) return skills.indexOf(good.randomGet());
					if (normal.length) return skills.indexOf(normal.randomGet());
					if (half.length) return skills.indexOf(half.randomGet());
					if (less.length) return skills.indexOf(less.randomGet());
					return get.rand(skills.length);
				}())
				.forResult();
			if (result && result.control) {
				player.popup(result.control);
				await target.removeSkills(result.control);
			}
			await game.delay();
		},
		ai: {
			order: 0.5,
			result: {
				player(player, target) {
					if (game.players.length === 2) return 1;
					let num = game.zhu.hp + game.zhu.hujia + player.countCards('hs', 'tao'),
						dif = game.countPlayer(current => {
							if (current.identity === 'zhong' || current.identity === 'mingzhong') {
								return current.hp + current.hujia + current.countCards('hs') / 12;
							}
						}) - game.countPlayer(current => {
							if (current.identity === 'zhong') return current.hp + current.hujia + current.countCards('hs') / 12;
						});
					if (num * num + num + dif < 0) return 1;
					if (dif > player.hp + player.hujia + player.countCards('hes') / 4) return 1;
					if (
						!game.hasPlayer(current => current.identity === 'fan') &&
						(
							get.attitude(game.zhu, player) < -0.5 ||
							get.attitude(game.zhu, player) < 0 && player.ai.shown >= 0.95
						)
					) return 1;
					return -1024;
				},
				target(player, target) {
					return -Math.pow(get.threaten(target), 2) * (target.hp + 1);
				}
			}
		}
	};
	lib.translate.dld_neiBuff2 = '野心毕露';
	lib.skill._dld_filterSkills = {
		trigger: {
			player: 'enterGame',
			global: 'gameStart'
		},
		filter(event, player) {
			return !_status.connectMode && player === game.me && lib.config.extension_大乱斗_filterSkills > 0;
		},
		direct: true,
		firstDo: true,
		priority: 48,
		charlotte: true,
		superCharlotte: true,
		ruleSkill: true,
		async content(event, trigger, player) {
			let allSkills = _status.daluandou_skills.filter(i => {
				return !lib.config.extension_大乱斗_check.includes(i);
			}), trans = {
				common: '<span style="color: #FFFF00">常驻技能池</span>',
				disabled: '<span style="color: #FF0000">禁选技能池</span>',
				tret: '<span style="color: #8DFDD8">添头技能池</span>'
			};
			if (!allSkills.length) {
				alert('当前将池技能已批阅完毕！');
				return;
			}
			do {
				let skills = allSkills.splice(0, lib.config.extension_大乱斗_filterSkills);
				lib.config.extension_大乱斗_check.addArray(skills);
				for (let name of ['common', 'disabled', 'tret']) {
					let result = await player
						.chooseButton([
							'选择要添加到' + trans[name] + '的技能，剩余技能将' + (name === 'tret' ? '作为普通技能' : '进行其他技能池的筛选'),
							[skills.map((s, i) => {
								return [s, get.dldSkillButton(s, name)];
							}), 'textbutton']
						])
						.set('ai', () => 0)
						.set('selectButton', [1, skills.length])
						.set('complexSelect', false)
						.forResult();
					if (result.bool) {
						lib.config['extension_大乱斗_' + name].addArray(result.links);
						game.saveExtensionConfig('大乱斗', name, lib.config['extension_大乱斗_' + name]);
						skills.removeArray(result.links);
						if (!skills.length) break;
					}
				}
				if (!allSkills.length) {
					alert('当前将池技能已批阅完毕！');
					break;
				}
			} while (confirm('是否继续批阅？（剩余' + allSkills.length + '项技能未批阅）'));
			game.saveExtensionConfig('大乱斗', 'check', lib.config.extension_大乱斗_check);
		}
	};
}
