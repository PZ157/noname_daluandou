import { lib, game, ui, get, ai, _status } from './utils.js';

export function precontent(config, pack) {
	{
		let min = [17],
			noname = lib.version
				.split('.')
				.slice(2)
				.map((i) => Number(i)),
			len = Math.min(noname.length, min.length),
			status = false;
		if (lib.version.slice(0, 5) === '1.10.')
			for (let i = 0; i < len; i++) {
				if (noname[i] < min[i]) {
					status = '您的无名杀版本太低';
					break;
				}
			}
		else status = '检测到游戏大版本号与本扩展支持的版本号不同';
		if (typeof status === 'string') {
			alert(status + '，为避免版本不兼容产生不必要的问题，已为您关闭『大乱斗』扩展，稍后自动重启游戏');
			game.saveExtensionConfig('大乱斗', 'enable', false);
			game.reload();
		}
	}
	if (lib.config.extension_大乱斗_changelog !== lib.extensionPack.大乱斗.version)
		game.showChangeLog = function () {
			let str = [
				ui.joint`
					<center>
						<span style="color: #00FFFF">更新日期</span>：
						2025年<span style="color: #00FFB0">3</span>月<span style="color: #FF0000">21</span>日
					</center>
				`,
				'◆修缮编辑大乱斗技能池和［技能审批］的相关功能，现在通过扩展设置界面的编辑常驻/禁选/添头技能池时会自动标记为已批阅技能了',
				'◆一直点“取消”将不再继续询问是否继续批阅技能',
				'◆其他细节优化',
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
		let info = lib.skill[skill],
			mode = get.mode();
		if (!info) return true;
		if (info.sub || info.temp || info.fixed || info.vanish || info.forceunique || info.ruleSkill) return true;
		if (info.forbid && info.forbid.includes(mode)) return true;
		if (info.mode && !info.mode.includes(mode)) return true;
		if (info.available && info.available(mode) === false) return true;
		if (info.viewAs && typeof info.viewAs !== 'function') {
			if (typeof info.viewAs === 'string')
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
	if (!window.decadeUI)
		lib.element.Player = class extends lib.element.Player {
			/** 摘自《十周年UI》 */
			constructor() {
				let player = super(...arguments);
				Object.setPrototypeOf(player, lib.element.Player.prototype);
				return player;
			}
			addSkill() {
				const skill = super.addSkill(...arguments);
				if (Array.isArray(skill)) return skill;
				game.broadcastAll(
					(target, skill) => {
						if (!target.node.gainSkill)
							target.node.gainSkill = ui.create.div('.gain-skill', target, {
								position: 'absolute',
								left: '15px',
								right: '15px',
								'max-height': 'calc(97% - 81px)',
								bottom: 'calc(3% + 81px)',
								color: 'rgb(255, 255, 200)',
								'font-size': '13px',
								'text-align': 'center',
								background: ui.joint`
									linear-gradient(
										to right, 
										transparent 0%, 
										rgba(0, 0, 0, 0.4) 40%, 
										rgba(0, 0, 0, 0.4) 60%, 
										transparent 100%
									)
								`,
								'z-index': 87,
							});
						if (typeof target.node.gainSkill.gain !== 'function')
							target.node.gainSkill.gain = (skill) => {
								if (!this.skills) this.skills = [];
								if (this.skills.includes(skill) || !lib.translate[skill] || this.innerHTML.includes(lib.translate[skill]))
									return;
								const info = lib.skill[skill];
								if (
									!info ||
									info.sub ||
									info.temp ||
									info.ruleSkill ||
									info.fixed ||
									info.vanish ||
									!lib.translate[skill + '_info']
								)
									return;
								this.skills.push(skill);
								this.innerHTML = this.skills.reduce((html, senderSkill) => `${html}[${lib.translate[senderSkill]}]`, '');
							};
						target.node.gainSkill.gain(skill);
					},
					this,
					skill
				);
				return skill;
			}
			removeSkill() {
				const skill = super.removeSkill(...arguments);
				if (Array.isArray(skill)) return skill;
				game.broadcastAll(
					(target, skill) => {
						if (!target.node.gainSkill)
							target.node.gainSkill = ui.create.div('.gain-skill', target, {
								position: 'absolute',
								left: '15px',
								right: '15px',
								'max-height': 'calc(97% - 81px)',
								bottom: 'calc(3% + 81px)',
								color: 'rgb(255, 255, 200)',
								'font-size': '13px',
								'text-align': 'center',
								background: ui.joint`
									linear-gradient(
										to right, 
										transparent 0%, 
										rgba(0, 0, 0, 0.4) 40%, 
										rgba(0, 0, 0, 0.4) 60%, 
										transparent 100%
									)
								`,
								'z-index': 87,
							});
						if (typeof target.node.gainSkill.lose !== 'function')
							target.node.gainSkill.lose = (skill) => {
								if (!this.skills) return;
								const index = this.skills.indexOf(skill);
								if (index === -1) return;
								this.skills.splice(index, 1);
								this.innerHTML = this.skills.reduce(
									(html, senderSkill) => `${html}[${get.translation(senderSkill)}]`,
									''
								);
							};
						target.node.gainSkill.lose(skill);
					},
					this,
					skill
				);
				return skill;
			}
		};
	lib.init.js(
		lib.assetURL + 'extension/大乱斗/js/character.js',
		null,
		() => {
			lib.config.all.characters.push('dld');
		},
		() => {
			alert('Error:『大乱斗』扩展武将导入失败');
		}
	);
	lib.arenaReady.push(() => {
		if (!Array.isArray(lib.config.extension_大乱斗_check)) game.saveExtensionConfig('大乱斗', 'check', []);
		if (!Array.isArray(lib.config.extension_大乱斗_common)) game.saveExtensionConfig('大乱斗', 'common', []);
		if (!Array.isArray(lib.config.extension_大乱斗_disabled)) game.saveExtensionConfig('大乱斗', 'disabled', []);
		if (!Array.isArray(lib.config.extension_大乱斗_group)) game.saveExtensionConfig('大乱斗', 'group', []);
		if (!Array.isArray(lib.config.extension_大乱斗_tret)) game.saveExtensionConfig('大乱斗', 'tret', []);
		if (typeof lib.config.extension_大乱斗_ief !== 'string') {
			game.saveExtensionConfig(
				'大乱斗',
				'ief',
				game.dedent`
					func = async function (player, configs) {
						const mode = get.mode(),
							isZhu = function (current) {
								if (!current.identityShown) return false;
								if (mode !== 'identity' && mode !== 'versus' && mode !== 'doudizhu') return false;
								return (
									current === game.zhu ||
									current === game.rZhu ||
									current === game.bZhu ||
									current === game.trueZhu ||
									current === game.falseZhu
								);
							};
						if (configs.started) { //牌堆洗牌时
							player.storage.dld.tnsc = 7; //候选技能数改为7
							player.storage.dld.nsc = 1; //可选技能数改为1
							return;
						}
						if (isZhu(player)) { //主公加成
							player.storage.dld.nsc++;
							if (mode === 'doudizhu') await game.zhu.removeSkill('bahu');
						}
						if (_status.connectMode && !player.node.nameol.innerHTML.length) { //联机人机加成
							player.storage.dld.nsc++;
						} else if (!_status.connectMode && !game.me.isFriendsOf(player)) { //单机敌方加成
							//请自行发挥
							//if (mode === 'identity') player.showIdentity(); //亮明身份
						}
						if (configs.enableTret !== 'off') { //添头技加成
							if (mode === 'doudizhu' && player === game.zhu) {
								await player.removeSkill('feiyang');
								player.storage.dld.tret++;
							}
						}
					};
				`
			);
			alert('『大乱斗』配置载入成功！进入游戏后请手动重启游戏');
			return;
		}
		if (lib.config.extension_大乱斗_common.length < 2 * lib.config.extension_大乱斗_nrsc) {
			if (confirm('是否导入157的常驻技能池配置(2024年9月更新)？\n取消则自动关闭常驻技能池（可于扩展设置中重新开启）')) {
				const common = [
					'wangxi',
					'jianxiong',
					'fankui',
					'guicai',
					'luoyi',
					'tiandu',
					'olsbzhuri',
					'jyzongshi',
					'olxuanfeng',
					'olsbduoshou',
					'lunshi',
					'diezhang',
					'fazhu',
					'spshidi',
					'spyishi',
					'spqishe',
					'mbaosi',
					'rende',
					'paoxiao',
					'wusheng',
					'guanxing',
					'longdan',
					'zhiheng',
					'qixi',
					'keji',
					'kurou',
					'xiaoji',
					'reyicong',
					'xinfu_jiyuan',
					'olsbdouchan',
					'olsbhetao',
					'dclihuo',
					'olmiji',
					'olsbqiwu',
					'olenyuan',
					'olzongshi',
					'olganlu',
					'olrenxin',
					'oltousui',
					'bingxin',
					'ybzhuiji',
					'canmou',
					'congjian',
					'xianwan',
					'caozhao',
					'olxibing',
					'zhongyun',
					'shenpin',
					'ciwei',
					'qingleng',
					'jyishi',
					'tairan',
					'sanchen',
					'clanyunshen',
					'clanlianzhu',
					'jianchu',
					'xinkuanggu',
					'xinshensu',
					'guidao',
					'kanpo',
					'quhu',
					'jieming',
					'dimeng',
					'fangquan',
					'guzheng',
					'beige',
					'qizhi',
					'nzry_juzhan',
					'nzry_chenglve',
					'nzry_jianxiang',
					'drlt_qianjie',
					'drlt_xiongluan',
					'drlt_congjian',
					'dcwanglie',
					'olliangyin',
					'olkongsheng',
					'huituo',
					'remingjian',
					'olzhijian',
					'olguzheng',
					'rejiqiao',
					'qiangzhi',
					'reluoying',
					'dcjiushi',
					'dcfaen',
					'remingce',
					'reqice',
					'oljieming',
					'dcyicong',
					'reyanyu',
					'rewansha',
					'reweimu',
					'relongyin',
					'shifei',
					'changbiao',
					'rejueqing',
					'reshenduan',
					'reyonglve',
					'reduodao',
					'reanjian',
					'zhenlie',
					'miji',
					'reqianxi',
					'decadepojun',
					'hanzhan',
					'rezhiman',
					'rejiaojin',
					'xingongji',
					'decadezhenjun',
					'ollihuo',
					'xinyaoming',
					'ollianhuan',
					'xinganlu',
					'refankui',
					'reguicai',
					'reganglie',
					'new_qingjian',
					'ollongdan',
					'olyajiao',
					'new_rewusheng',
					'reyingzi',
					'new_yijue',
					'refanjian',
					'reguose',
					'new_liyu',
					'rerende',
					'reqingguo',
					'reguanxing',
					'xinguidao',
					'xinjiewei',
					'fenji',
					'rejianchu',
					'xinenyuan',
					'luoying',
					'jiushi',
					'xinjujian',
					'faen',
					'shibei',
					'olbingyi',
					'dangxian',
					'longyin',
					'mingjian',
					'lihuo',
					'jigong',
					'jishe',
					'qingxian',
					'jianzheng',
					'tianbian',
					'funan',
					'olkanpo',
					'oljiuchi',
					'dcshibei',
					'decadejingce',
					'reluanji',
					'shenxing',
					'reshenxing',
					'xinshenxing',
					'twgyshenxing',
					'jdsbzhiheng',
					'fumian',
					'olzhuyan',
					'yuanzi',
					'zengou',
					'zlshoufu',
					'yongsi',
					'shenxian',
					'qiangwu',
					'liangzhu',
					'kaikang',
					'mozhi',
					'yuhua',
					'twyuhua',
					'qirang',
					'twqirang',
					'remumu',
					'fentian',
					'jugu',
					'hongde',
					'sheyan',
					'olxiaoxi',
					'zlhuji',
					'jiangchi',
					'rejiangchi',
					'xinjiangchi',
					'new_jiangchi',
					'xinxuanbei',
					'xinfu_qinguo',
					'xinfu_weilu',
					'xinfu_duanfa',
					'xinfu_guanchao',
					'xinfu_xunxian',
					'lirang',
					'qinbao',
					'boyan',
					'dcjiexing',
					'dchuace',
					'dcpeiqi',
					'renzheng',
					'dcposuo',
					'dcpandi',
					'moukui',
					'dcmoukui',
					'twmoukui',
					'dczhengxu',
					'dcbeifen',
					'nifu',
					'fuqi',
					'refuqi',
					'rewenji',
					'xinhongyan',
					'rejuece',
					'xiaoxi_hansui',
					'xinjyzongshi',
					'rezongshi',
					'yingjian',
					'rongbei',
					'fengjie',
					'spyinju',
					'twqiaosi',
					'twrouke',
					'twzhenliang',
					'twkuanji',
					'twchungang',
					'zhenshan',
					'twxiangyu',
					'zhengfu',
					'dcfaqi',
					'psguanxing',
					'shushen',
					'stdshushen',
					'dcshushen',
					'spshude',
					'yjxuepin',
					'vtbyanli',
					'yjzhenlve',
					'zhenlue',
					'jsrgshenchong',
					'jie',
					'jsrgzhenqiao',
					'jsrgxundao',
					'jsrgzhiheng',
					'jsrgguanjue',
					'jsrgguiji',
					'liangji',
					'dddxuyu',
					'nslingying',
					'nsfuge',
					'nszhenyin',
					'yuiko_fenglun',
					'fuhun',
					'yanxiao',
					'fuji',
					'sptaoluan',
					'xinfu_limu',
					'xuxie',
					'xfenxin',
					'xianwei',
					'dcliying',
				];
				game.saveExtensionConfig('大乱斗', 'common', common);
				game.saveExtensionConfig('大乱斗', 'group', common);
				alert('157的常驻技能池配置已成功载入！这些技能将不会加入技能审批');
			} else game.saveExtensionConfig('大乱斗', 'nrsc', 0);
		}
		if (lib.config.extension_大乱斗_tempCache !== 'mergedCheck' && lib.config.extension_大乱斗_filterSkills > 0) {
			let configs = [];
			if (
				lib.config.extension_大乱斗_common.some((i) => {
					return !lib.config.extension_大乱斗_check.includes(i);
				})
			)
				configs.push('common');
			if (
				lib.config.extension_大乱斗_disabled.some((i) => {
					return !lib.config.extension_大乱斗_check.includes(i);
				})
			)
				configs.push('disabled');
			if (
				lib.config.extension_大乱斗_tret.some((i) => {
					return !lib.config.extension_大乱斗_check.includes(i);
				})
			)
				configs.push('tret');
			if (configs.length) {
				if (
					confirm(
						'检测到您的' +
							configs
								.map((config) => {
									if (config === 'common') return '常驻';
									if (config === 'disabled') return '禁选';
									if (config === 'tret') return '添头';
								})
								.join('、') +
							'技能池中有未被标记已批阅的技能，是否将这些技能进行标记？'
					)
				) {
					lib.config.extension_大乱斗_check.addArray(lib.config.extension_大乱斗_common);
					lib.config.extension_大乱斗_check.addArray(lib.config.extension_大乱斗_disabled);
					lib.config.extension_大乱斗_check.addArray(lib.config.extension_大乱斗_tret);
					game.saveExtensionConfig('大乱斗', 'check', lib.config.extension_大乱斗_check);
				}
				game.saveExtensionConfig('大乱斗', 'tempCache', 'mergedCheck');
			}
		}
		if (get.mode() === 'guozhan') return;
		_status.daluandou_characters = {};
		_status.daluandou_zhus = {};
		for (let i in lib.character) {
			if (i.startsWith('dld_')) continue;
			_status.daluandou_characters[i] = lib.character[i].skills.slice(0);
			lib.character[i].hasHiddenSkill = false;
			lib.character[i].initFilters = [];
			if (lib.character[i].isZhugong)
				_status.daluandou_zhus[i] = lib.character[i].skills.filter((s) => {
					return lib.skill[s]?.zhuSkill;
				});
			lib.character[i].skills = [];
		}
		if (lib.characterReplace)
			for (let i in lib.characterReplace) {
				delete lib.characterReplace[i];
			}
	});
	lib.skill._dld_start = {
		available(mode) {
			if (mode === 'guozhan' || typeof lib.config.extension_大乱斗_fixH !== 'string') return false;
			if (_status.connectMode && !game.me) return;
			game.broadcastAll(
				(fixH, obj) => {
					for (let i in lib.character) {
						if (i.startsWith('dld_')) continue;
						lib.character[i].hp = fixH[0];
						lib.character[i].maxHp = fixH[1];
						lib.character[i].hujia = fixH[2];
					}
					lib.skill._dld_start.toLoad(obj);
				},
				lib.config.extension_大乱斗_fixH.split('/').map((i) => {
					return Number(i);
				}),
				{
					started: false,
					allotSkills: {},
					group: lib.config.extension_大乱斗_group,
					tret: lib.config.extension_大乱斗_tret,
					zhuSkill: lib.config.extension_大乱斗_zhuSkill,
					neiBuff: lib.config.extension_大乱斗_neiBuff,
					enableTret: lib.config.extension_大乱斗_enableTret,
				}
			);
			if (mode !== 'identity' && (mode !== 'versus' || !game.trueZhu)) return;
			let zhuSkill = lib.config.extension_大乱斗_zhuSkill,
				zhus = {};
			if (zhuSkill === 'off') return;
			if (_status.connectMode) {
				let characters = get.charactersOL();
				for (let i in _status.daluandou_zhus) {
					if (!characters.includes(i)) delete _status.daluandou_zhus[i];
				}
			} else
				for (let i in _status.daluandou_zhus) {
					if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) delete _status.daluandou_zhus[i];
				}
			if (zhuSkill !== 'on') {
				for (let i in _status.daluandou_zhus) {
					let skills = _status.daluandou_zhus[i],
						group = lib.character[i].group;
					for (let j = 0; j < skills.length; j++) {
						let info = lib.skill[skills[j]];
						if (!info.ai || !info.ai.combo) {
							if (!zhus[group]) zhus[group] = ['dddqianlong'];
							zhus[group].add(skills[j]);
						}
					}
				}
				if (zhus['qun']) {
					if (zhus['qun'].includes('twzhuiting')) zhus['wei'].add('twzhuiting');
					if (zhus['qun'].includes('twqiushou')) zhus['shu'].add('twqiushou');
				}
			}
			if (zhuSkill === 'c')
				for (let i in _status.daluandou_zhus) {
					_status.daluandou_zhus[i] = [zhus[lib.character[i].group].randomGet()];
				}
			else if (zhuSkill === 's') _status.daluandou_zhus = {};
			game.broadcastAll(
				(zhus, allotSkills) => {
					lib.skill._dld_start.toLoad({
						zhus: zhus,
						allotSkills: allotSkills,
					});
				},
				zhus,
				_status.daluandou_zhus
			);
		},
		toLoad(configs) {
			if (!_status.postReconnect.dld_config) {
				_status.postReconnect.dld_config = [
					lib.skill._dld_start.toLoad,
					{
						allotSkills: {},
					},
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
				} else {
					_status.postReconnect.dld_config[1][name] = configs[name];
					_status.dld_config[name] = configs[name];
				}
			}
		},
		trigger: {
			player: 'enterGame',
			global: ['gameStart', 'washCard'],
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
			game.broadcastAll((player) => {
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
				alert('运行开局执行函数时出现错误：' + e + '\n请立即停止游戏检查错误');
				func = async function (player, configs) {};
			}
			game.me.addTempSkill('dld_init');
			if (_status.dld_config.started) {
				game.players.forEach(async (tar) => {
					await func(tar, _status.dld_config);
				});
				return;
			}
			game.me.addSkill('dld_allot');
			if (lib.config.extension_大乱斗_enableTret !== 'off') game.me.addTempSkill('dld_tret');
			game.players.forEach(async (tar) => {
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
			global: 'allotSkills',
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
			if (Object.keys(lists).length === 0) return;
			game.broadcastAll((lists) => {
				lib.skill._dld_start.toLoad({
					allotSkills: lists,
				});
			}, lists);
		},
		async content(event, trigger, player) {
			game.countPlayer((cur) => {
				game.broadcastAll(
					(current, skills) => {
						current.skills.addArray(skills);
					},
					cur,
					cur.skills
				);
			});
		},
		async allotSkills(event) {
			let evt,
				players = event.players;
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
			let ai_targets = [],
				results = [],
				skillsMap = {},
				withme = false,
				withol = false;
			event.results.forEach((arr) => {
				if (players.includes(arr[0])) skillsMap[arr[0].playerid] = arr[1].links;
			});
			for (const current of players) {
				if (_status.connectMode) current.showTimer();
				const skills = skillsMap[current.playerid];
				if (current.isOnline()) {
					withol = true;
					current.send(evt_send, skills, current);
					current.wait(evt_sendback);
				} else if (current === game.me) {
					withme = true;
					evt = evt_send(skills, current, true);
					if (_status.connectMode) game.me.wait(evt_sendback);
				} else ai_targets.push(current);
			}
			if (ai_targets.length)
				for (let target of ai_targets) {
					let skills = skillsMap[target.playerid],
						main = [],
						vice = skills.filter((j) => {
							return lib.skill[j]?.viceSkill;
						}),
						res = {};
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
			if (withol /*&&!event.resultOL*/) {
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
				for (const i of players) i.hideTimer();
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
				[
					event.skills.map((skill, i) => {
						return [
							skill,
							ui.joint`
								<div class="popup text" style="width: calc(100% - 10px); display: inline-block">
									<span class="greentext">
										${lib.translate[skill]}
									</span>
									：${get.skillInfoTranslation(skill, event.target)}
								</div>
							`,
						];
					}),
					'textbutton',
				],
			]);
			next.set('forced', true);
			next.set('ai', (button) => {
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
			event.result[names[1]] = event.skills.filter((i) => {
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
			else
				characterlist = Object.keys(_status.daluandou_characters).filter((i) => {
					return !lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i);
				});
			for (let i of characterlist) {
				if (!_status.daluandou_characters[i]) continue;
				for (let j = 0; j < _status.daluandou_characters[i].length; j++) {
					let skill = _status.daluandou_characters[i][j];
					if (lib.filter.skillDisabled(skill, null, true)) continue;
					let info = lib.skill[skill];
					if (!info || info.zhuSkill || info.hiddenSkill || (info.ai && (info.ai.combo || info.ai.neg))) continue;
					if (lib.config.extension_大乱斗_disabled.includes(skill)) continue;
					if (_status.daluandou_common.includes(skill)) continue;
					if (_status.daluandou_tret.includes(skill)) continue;
					_status.daluandou_skills.add(skill);
				}
			}
		},
		trigger: {
			player: 'enterGame',
			global: ['gameStart', 'washCard'],
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
				trans = common.map((i) => lib.translate[i] || i);
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
			switch (lib.config.extension_大乱斗_skillAI) {
				case 'random':
					skills.randomSort();
				case 'skillRank':
					skills.sort((a, b) => get.skillRank(b) - get.skillRank(a));
			}
			for (let i of skills) {
				let can = true;
				for (let arr of lib.config.extension_大乱斗_group) {
					if (!arr.includes(i)) continue;
					let other = arr[0] === i ? arr[1] : arr[0];
					if (choice.some((b) => b === other)) can = false;
				}
				if (!can) continue;
				choice.push(i);
				if (choice.length === num) break;
			}
			if (choice.length < num) game.dldLessAlert();
			return {
				links: choice,
				max: target.storage.dld.nsc,
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
			let ai_targets = [],
				results = [],
				players = game.players.filter((tar) => {
					if (_status.dld_config.started) return true;
					let pack = lib.characterPack['mode_' + get.mode()] || {};
					for (let name of [tar.name, tar.name1, tar.name2]) {
						if (!name) continue;
						if (pack[name] || name.startsWith('dld_')) return false;
					}
					return true;
				}),
				skillsMap = {};
			let withme = false,
				withol = false;
			let oldtime = lib.configOL.choose_timeout,
				time = Number(lib.config.extension_大乱斗_fixTime.slice(1));
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
				} else if (current === game.me) {
					withme = true;
					next = send(skills, current, current.storage.dld.nsc, true);
					if (_status.connectMode) game.me.wait(sendback);
				} else ai_targets.push(current);
			}
			if (ai_targets.length)
				for (let target of ai_targets) {
					sendback(lib.skill.dld_init.selectSkills(target, skillsMap[target.playerid]), target);
				}
			if (withme) {
				let result = await next.forResult();
				if (_status.connectMode) {
					game.me.unwait(result, game.me);
				} else {
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
			if (ai_targets.length > 0)
				await new Promise((resolve) => {
					const interval = setInterval(() => {
						if (results.length === players.length) {
							resolve();
							clearInterval(interval);
						}
					}, 4);
				});
			if (_status.connectMode) {
				for (const i of players) i.hideTimer();
			}
			let obj = {};
			results.sort((a, b) => lib.sort.seat(a[0], b[0]));
			for (const res of results) {
				const target = res[0],
					result = res[1] || lib.skill.dld_init.selectSkills(target, skillsMap[target.playerid]);
				if (!target || !result) continue;
				let skills = result.links;
				if (lib.config.extension_大乱斗_enableTret !== 'off') {
					target.storage.dld.tret += 2 * (result.max - skills.length);
				}
				if (!skills.length) continue;
				target.popup(skills);
				await target.addSkills(skills);
				if (lib.config.extension_大乱斗_allotSkills === 'off') continue;
				let names = [],
					lists = [],
					temp = skills.slice(0);
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
						} else ss = temp;
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
					started: true,
				});
			});
		},
		async contentx(event) {
			_status.noclearcountdown = true;
			let max = Math.min(event.skills[0].length + event.skills[1].length, event.nsc),
				extintro = '';
			if (!_status.dld_config.started && _status.dld_config.enableTret !== 'off') {
				extintro = '<br><span style="color: #00FFB0">你可以少选任意个技能，稍后额外选择二倍数量的添头技</span>';
			}
			let list = event.skills[0]
				.map((skill, i) => {
					return [
						skill,
						ui.joint`
							<div class="popup text" style="width: calc(100% - 10px); display: inline-block">
								<span style="color: #FFFF00; font-weight: bold">
									${lib.translate[skill]}
								</span>
								：${lib.translate[skill + '_info']}
							</div>
						`,
					];
				})
				.concat(
					event.skills[1].map((skill, i) => {
						return [skill, get.dldSkillButton(skill, 'normal')];
					})
				);
			if (!list.length) {
				event.result = { links: [] };
				return;
			}
			let next = event.target.chooseButton([
				(_status.dld_config.started ? '鏖战：' : '') + '选择获得' + get.cnNumber(max) + '项技能' + extintro,
				[list, 'textbutton'],
			]);
			next.set('forced', true);
			next.set(
				'ai',
				(() => {
					switch (lib.config.extension_大乱斗_skillAI) {
						case 'random':
							return () => Math.random();
						case 'skillRank':
							return (button) => get.skillRank(button.link);
						default:
							return () => 1;
					}
				})()
			);
			next.set('selectButton', [_status.dld_config.started || _status.dld_config.enableTret === 'off' ? max : 0, max]);
			next.set('filterButton', (button) => {
				for (let arr of get.event('group')) {
					if (!arr.includes(button.link)) continue;
					let other = arr[0] === button.link ? arr[1] : arr[0];
					if (ui.selected.buttons.some((b) => b.link === other)) return false;
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
				max: event.nsc,
			};
		},
	};
	lib.skill.dld_tret = {
		trigger: {
			player: 'enterGame',
			global: 'gameStart',
		},
		filter(event, player) {
			return game.players.some((tar) => {
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
			let num = lib.config.extension_大乱斗_tretNum,
				count;
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
		selectSkills(target, skills, num) {
			switch (lib.config.extension_大乱斗_skillAI) {
				case 'random':
					return () => skills.randomGets(num);
				case 'skillRank':
					return skills
						.map((i) => [i, get.skillRank(i)])
						.sort((a, b) => b[1] - a[1])
						.slice(0, num);
				default:
					return skills.slice(0, num);
			}
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
			let ai_targets = [],
				results = [],
				players = game.players.filter((tar) => {
					return tar.storage.dld.tret > 0;
				}),
				skillsMap = {};
			let withme = false,
				withol = false;
			let oldtime = lib.configOL.choose_timeout,
				time = Number(lib.config.extension_大乱斗_fixTime.slice(1));
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
				} else if (target === game.me) {
					withme = true;
					next = send(skills, target, target.storage.dld.tret, true);
					if (_status.connectMode) game.me.wait(sendback);
				} else ai_targets.push(target);
			}
			if (ai_targets.length)
				for (let target of ai_targets) {
					sendback(
						{
							links: lib.skill.dld_tret.selectSkills(target, skillsMap[target.playerid], target.storage.dld.tret),
							ai: true,
						},
						target
					);
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
			if (withol && !event.resultOL)
				await new Promise((resolve) => {
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
				const target = res[0],
					result = res[1];
				if (!target || !result) continue;
				let skills = result.links;
				if (!skills.length) continue;
				target.popup(skills);
				await target.addSkills(skills);
				if (lib.config.extension_大乱斗_allotSkills === 'off') continue;
				let names = [],
					lists = [],
					temp = skills.slice(0);
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
				else
					for (let i = 0; i < names.length && temp.length; i++) {
						let ss;
						if (i < names.length - 1) {
							ss = temp.randomGets(get.rand(0, names.length));
							temp.removeArray(ss);
						} else ss = temp;
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
			let next = event.target.chooseButton(['选择获得至多' + get.cnNumber(max) + '项添头技', [list, 'textbutton']]);
			next.set(
				'ai',
				(() => {
					switch (lib.config.extension_大乱斗_skillAI) {
						case 'random':
							return () => Math.random();
						case 'skillRank':
							return (button) => get.skillRank(button.link);
						default:
							return () => 1;
					}
				})()
			);
			next.set('selectButton', [1, max]);
			next.set('filterButton', (button) => {
				for (let arr of get.event('group')) {
					if (!arr.includes(button.link)) continue;
					let other = arr[0] === button.link ? arr[1] : arr[0];
					if (ui.selected.buttons.some((b) => b.link === other)) return false;
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
				max: max,
			};
		},
	};
	lib.skill.dld_zhuBuff = {
		mode: ['identity', 'versus'],
		trigger: {
			player: 'enterGame',
			global: ['gameStart', 'phaseEnd'],
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
			let list = _status.dld_config.zhus[player.group].randomGets(trigger.name === 'phase' ? 3 : 1),
				result;
			if (list.length === 1) result = { control: list[0] };
			else if (list.length > 0)
				result = await player
					.chooseControl(list)
					.set(
						'choiceList',
						list.map((i) => get.dldSkillButton(i, 'zhu'))
					)
					.set('prompt', '选择要获得的一项主公技')
					.set('displayIndex', false)
					.set('ai', () => get.event('idx'))
					.set(
						'idx',
						(() => {
							switch (lib.config.extension_大乱斗_skillAI) {
								case 'skillRank':
									const skillRank = list.map((i) => get.skillRank(i));
									return skillRank.indexOf(Math.max(...skillRank));
								default:
									return () => 0;
							}
						})()
					)
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
		},
	};
	lib.skill.dld_neiBuff1 = {
		mode: ['identity'],
		enable: 'phaseUse',
		filter(event, player) {
			if (
				player.identity !== 'nei' ||
				player.identityShown ||
				!game.hasPlayer((cur) => {
					return cur.identityShown && lib.skill._dld_start.isZhu(cur);
				})
			)
				return false;
			return _status.dld_config.neiBuff.includes('1');
		},
		charlotte: true,
		superCharlotte: true,
		ruleSkill: true,
		skillAnimation: true,
		animationColor: 'thunder',
		async content(event, trigger, player) {
			lib.skill._dld_start.showYe(player);
			lib.skill.dld_neiBuff2.prompt = '移除一名其他角色的一项技能';
			player.removeSkill('dld_neiBuff1');
			await player.gainMaxHp();
			const result = await player
				.chooseBool('是否令你和主公各回复1点体力？')
				.set(
					'ai',
					() =>
						game.zhu.isHealthy() ||
						player.hp <= 2 ||
						game.zhu.hp <= 1 ||
						!game.hasPlayer((current) => {
							return current.identity === 'zhong' || current.identity === 'mingzhong';
						})
				)
				.forResult();
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
						!game.hasPlayer((cur) => {
							return cur.identity === 'zhong' || cur.identity === 'mingzhong';
						}) ||
						(player.hp <= 1 && !player.countCards('hs', 'tao') && !player.countCards('hs', 'jiu'))
					)
						return 1;
					if (
						!game.hasPlayer((cur) => {
							return cur.identity === 'fan';
						})
					) {
						if (get.attitude(game.zhu, player) < -1) return 1;
						if (get.attitude(game.zhu, player) < 0 && player.ai.shown >= 0.95) return 1;
						return -3;
					}
					if (
						(player.hp <= 2 && game.zhu.hp <= 2) ||
						(game.zhu.isHealthy() && lib.config.extension_AI优化_sfjAi) ||
						(game.zhu.hp <= 1 && !player.countCards('hs', 'tao'))
					)
						return 1;
					return -3;
				},
			},
		},
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
			let skills = target.getSkills(null, false, false).filter((i) => {
					return lib.translate[i] && lib.translate[i + '_info'] && lib.skill[i] && !lib.skill[i].fixed;
				}),
				result;
			if (skills.length)
				result = await player
					.chooseControl(skills)
					.set(
						'choiceList',
						skills.map(
							(i) => ui.joint`
								<div class="skill" style="color:#FFFF00">${lib.translate[i]}</div>
								<div>${get.skillInfoTranslation(i, target)}</div>
							`
						)
					)
					.set('prompt', '选择要移除的一项技能')
					.set('displayIndex', false)
					.set('ai', () => get.event('idx'))
					.set(
						'idx',
						(() => {
							if (skills.length === 1) return 0;
							let good = [],
								normal = [],
								half = [],
								less = [];
							for (let i = 0; i < skills.length; i++) {
								let info = lib.skill[skills[i]];
								if (!info.ai) {
									if (_status.dld_config.tret.includes(skills[i])) less.add(skills[i]);
									else normal.add(skills[i]);
								} else if (info.ai.combo) {
									if (!target.hasSkill(info.ai.combo, null, null, false)) less.add(skills[i]);
									else if (!good.includes(info.ai.combo)) good.add(info.ai.combo);
									else normal.add(skills[i]);
								} else if (info.ai.neg);
								else if (info.ai.halfneg) half.add(skills[i]);
								else if (_status.dld_config.tret.includes(skills[i])) less.add(skills[i]);
								else normal.add(skills[i]);
							}
							if (good.length) return skills.indexOf(good.randomGet());
							if (normal.length) return skills.indexOf(normal.randomGet());
							if (half.length) return skills.indexOf(half.randomGet());
							if (less.length) return skills.indexOf(less.randomGet());
							return get.rand(skills.length);
						})()
					)
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
						dif =
							game.countPlayer((current) => {
								if (current.identity === 'zhong' || current.identity === 'mingzhong') {
									return current.hp + current.hujia + current.countCards('hs') / 12;
								}
							}) -
							game.countPlayer((current) => {
								if (current.identity === 'zhong') return current.hp + current.hujia + current.countCards('hs') / 12;
							});
					if (num * num + num + dif < 0) return 1;
					if (dif > player.hp + player.hujia + player.countCards('hes') / 4) return 1;
					if (
						!game.hasPlayer((current) => current.identity === 'fan') &&
						(get.attitude(game.zhu, player) < -0.5 || (get.attitude(game.zhu, player) < 0 && player.ai.shown >= 0.95))
					)
						return 1;
					return -1024;
				},
				target(player, target) {
					return -Math.pow(get.threaten(target), 2) * (target.hp + 1);
				},
			},
		},
	};
	lib.translate.dld_neiBuff2 = '野心毕露';
	lib.skill._dld_filterSkills = {
		trigger: {
			player: 'enterGame',
			global: 'gameStart',
		},
		filter(event, player) {
			return !_status.connectMode && player === game.me && lib.config.extension_大乱斗_filterSkills > 0;
		},
		log: false,
		firstDo: true,
		priority: 48,
		charlotte: true,
		superCharlotte: true,
		ruleSkill: true,
		async content(event, trigger, player) {
			let allSkills = _status.daluandou_skills.filter((i) => {
					return !lib.config.extension_大乱斗_check.includes(i);
				}),
				trans = {
					common: '<span style="color: #FFFF00">常驻技能池</span>',
					disabled: '<span style="color: #FF0000">禁选技能池</span>',
					tret: '<span style="color: #8DFDD8">添头技能池</span>',
				},
				bool;
			if (!allSkills.length) {
				alert('当前将池技能已批阅完毕！');
				return;
			}
			do {
				let skills = allSkills.splice(0, lib.config.extension_大乱斗_filterSkills);
				bool = false;
				for (let name of ['common', 'disabled', 'tret']) {
					const result = await player
						.chooseButton([
							ui.joint`
								选择要添加到${trans[name]}的技能，剩余技能将${name === 'tret' ? '作为普通技能' : '进行其他技能池的筛选'}
								<br>一直点“取消”则暂不批阅
							`,
							[
								skills.map((s, i) => {
									return [s, get.dldSkillButton(s, name)];
								}),
								'textbutton',
							],
						])
						.set('ai', () => 0)
						.set('selectButton', [!bool && name === 'tret' ? 0 : 1, skills.length])
						.set('complexSelect', false)
						.forResult();
					if (result.bool) {
						bool = true;
						skills.removeArray(result.links);
						lib.config['extension_大乱斗_' + name].addArray(result.links);
						game.saveExtensionConfig('大乱斗', name, lib.config['extension_大乱斗_' + name]);
						if (!skills.length) break;
					}
				}
				if (bool) {
					lib.config.extension_大乱斗_check.addArray(skills);
				}
				if (!allSkills.length) {
					alert('当前将池技能已全部批阅完毕！');
					break;
				}
			} while (bool && confirm('是否继续批阅？（剩余' + allSkills.length + '项技能未批阅）'));
			game.saveExtensionConfig('大乱斗', 'check', lib.config.extension_大乱斗_check);
		},
	};
}
