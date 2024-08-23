import { lib, game, ui, get, ai, _status } from '../../../noname.js'

export function precontent(config, pack) {
	if (lib.config.extension_大乱斗_changelog !== lib.extensionPack.大乱斗.version) lib.game.showChangeLog = function () {
		let str = [
			'<center><font color=#00FFFF>更新日期</font>：24年<font color=#00FFB0>8</font>月<font color=fire>15</font>日</center>',
			'◆移除部分武将',
			'◆添头技预选池不再重复',
			'◆技能候选框支持显示技能提示',
			'◆细节优化',
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
	lib.filter.skillDisabled = function (skill, names, unique) {
		if (!lib.translate[skill] || !lib.translate[skill + "_info"] || lib.translate[skill + "_info"] === "此模式下不可用") return true;
		let info = lib.skill[skill], mode = get.mode();
		if (!info) return true;
		if (info.sub || info.temp || info.fixed || info.vanish || info.forceunique || info.ruleSkill) return true;
		if (info.forbid && info.forbid.includes(mode)) return true;
		if (info.mode && !info.mode.includes(mode)) return true;
		if (info.available && info.available(mode) === false) return true;
		if (info.viewAs && typeof info.viewAs != "function") {
			if (typeof info.viewAs == "string")
				info.viewAs = {
					name: info.viewAs,
				};
			if (!lib.card[info.viewAs.name]) return true;
		}
		if (info.unique && !unique) {
			if (!names) {
				let player = _status.event.player;
				if (get.itemtype(player) !== "player") return true;
				names = [player.name, player.name1, player.name2];
			}
			if (!Array.isArray(names)) names = [names];
			if (typeof info.unique === "function") return !info.unique(names);
			for (let name of names) {
				if (get.character(name, 3).includes(skill)) return false;
			}
			return true;
		}
		return false;
	};
	if (!window.decadeUI) lib.element.Player = class extends lib.element.Player {
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
	game.dldLessAlert = () => {
		if (_status.dld_less) return;
		let ncs = get.dld_config('ncs'), nsa = get.dld_config('nsa');
		if (_status.daluandou_skills.length < game.players.length * ncs) alert('技能池太小，建议增加武将或减少候选技能数');
		else if (ncs < 6) alert('候选技能数太少，建议增加候选技能数');
		else if (ncs < 8) {
			if (ncs / nsa > 0.7) alert('可选技能数过多，建议减少可选技能数');
			else alert('候选技能数太少，建议增加候选技能数');
		}
		else if (ncs / nsa > 0.7) alert('可选技能数过多，建议减少可选技能数');
		else alert('禁配技能对过多，建议删除不必要的禁配或增加候选技能数');
		_status.dld_less = true;
	};
	game.loadDldList = (config, name, list, version) => {
		if (!Array.isArray(lib.config['extension_大乱斗_' + config])) game.saveExtensionConfig('大乱斗', config, []);
		if (!list.length || lib.config['extension_大乱斗_initlist_' + config] === version) return;
		if (confirm('是否载入预制' + name + '（' + version + '更新）？')) {
			game.saveExtensionConfig('大乱斗', config, list);
			alert('载入成功！（共载入' + list.length + (config === 'group' ? '组' : '项') + '技能）');
		}
		game.saveExtensionConfig('大乱斗', 'initlist_' + config, version);
	};
	game.updateDldList = (config, name, add, rem, version) => {
		let list = lib.config['extension_大乱斗_' + config];
		if (!Array.isArray(list) || typeof lib.config['extension_大乱斗_initlist_' + config] !== 'string') return game.loadDldList(config, name, add, version);
		if (lib.config['extension_大乱斗_initlist_' + config] === version) return;
		if (config === 'group') {
			let arr2 = rem.slice(0);
			rem = [];
			for (let i = 0; i < list.length; i++) {
				for (let j = 0; j < add.length; j++) {
					if (list[i].includes(add[j][0]) && list[i].includes(add[j][1])) {
						add.splice(j, 1);
						break;
					}
				}
				for (let j = 0; j < arr2.length; j++) {
					if (list[i].includes(arr2[j][0]) && list[i].includes(arr2[j][1])) {
						arr2.splice(j, 1);
						rem.push(i);
						break;
					}
				}
			}
			rem.sort((a, b) => b - a);
		}
		else {
			add.removeArray(list);
			for (let i = 0; i < rem.length; i++) {
				if (!list.includes(rem[i])) rem.splice(i--, 1);
			}
		}
		if (!add.length && !rem.length) return;
		let str = '是否更新预制' + name + '（增' + add.length + (config === 'group' ? '组' : '项') + '，删' + rem.length + (config === 'group' ? '组' : '项') + '）？';
		if (confirm(str)) {
			if (config === 'group') for (let i of rem) {
				list.splice(i, 1);
			}
			else list.removeArray(rem);
			list.addArray(add);
			game.saveExtensionConfig('大乱斗', config, list);
			alert('载入成功！（共变更' + (add.length + rem.length) + (config === 'group' ? '组' : '项') + '技能）');
		}
		game.saveExtensionConfig('大乱斗', 'initlist_' + config, version);
	};
	game.editDldList = (temp, config, name) => {
		let two = config === 'group';
		game.prompt('请输入要加入/移出' + name + '的' + (two ? '两个' : '') + '技能ID' + (two ? '（用空格分开）' : '') + '<br>技能ID可通过<span style="font-family: shousha">菜单(→选项)→选项→显示→显示技能名注解</span>选择“代码ID”相关样式后在武将详情内查看', function (str) {
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
				if (!lib.skill[i]) return show('<div style="color:rgb(255,0,0);font-family:xinwei"><font size="4">未找到' + i + '对应技能</font></div>');
				if (lib.filter.skillDisabled(i, null, true)) return show('<div style="color:rgb(255,0,0);font-family:xinwei"><font size="4">无法操作' + i + '</font></div>');
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
					//if(skills[0]===skills[1]) return show('<div style="color:rgb(255,255,0);font-family:xinwei"><font size="4">输入的俩技能ID相同</font></div>');
					lists.push(skills);
					show('<div style="color:rgb(210,210,000);font-family:xinwei"><font size="4">已将' + (lib.translate[skills[0]] || skills[0]) + '＋' + (lib.translate[skills[1]] || skills[1]) + '加入' + name + '</font></div>');
				}
				else if (skills.length === 1 || skills[0] === skills[1]) show('<div style="color:rgb(210,210,000);font-family:xinwei"><font size="4">已将' + (lib.translate[skills[0]] || skills[0]) + '相关的技能对移出' + name + '</font></div>');
				else show('<div style="color:rgb(210,210,000);font-family:xinwei"><font size="4">已将' + (lib.translate[skills[0]] || skills[0]) + '＋' + (lib.translate[skills[1]] || skills[1]) + '移出' + name + '</font></div>');
			}
			else if (lists.includes(skills[0])) {
				lists.remove(skills[0]);
				show('<div style="color:rgb(210,210,000);font-family:xinwei"><font size="4">已将' + (lib.translate[skills[0]] || skills[0]) + '移出' + name + '</font></div>');
			}
			else {
				lists.push(skills[0]);
				show('<div style="color:rgb(255,97,3);font-family:xinwei"><font size="4">已将' + (lib.translate[skills[0]] || skills[0]) + '加入' + name + '</font></div>');
			}
			game.saveExtensionConfig('大乱斗', config, lists);
		});
	};
	game.viewDldList = (config, name) => {
		//改自手杀ui和群英荟萃
		let h = document.body.offsetHeight;
		let w = document.body.offsetWidth;
		let lists = lib.config['extension_大乱斗_' + config] || [];
		let SRr = `<html><head>
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
					border: 0px solid black;
					border-radius: 9px;
					padding: 15px;
					margin-top: 6.3vmin;
					margin-bottom: 5.5vmin;
					margin-left: 15.5vmin;
					margin-right: 5.5vmin;
					position: center;
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
				<center><b>${name}</b></center>`;
		let two = config === 'group';
		if (lists.length > 0) {
			for (let i = 0; i < lists.length; i++) {
				if (i) SRr += '、';
				if (two) {
					if (lib.translate[lists[i][0]]) SRr += lib.translate[lists[i][0]];
					SRr += '[' + lists[i][0] + ']＋';
					if (lib.translate[lists[i][1]]) SRr += lib.translate[lists[i][1]];
					SRr += '[' + lists[i][1] + ']';
				}
				else SRr += (lib.translate[lists[i]] || '无名技能') + '[' + lists[i] + ']';
			}
			SRr += '</div></body></html>';
		}
		else SRr += '暂无技能</div></body></html>';
		var List = ui.create.div('', `<div style='z-index:114514'>
			<iframe width='${w}px' height='${h}px' srcdoc="<!DOCTYPE html>${SRr}"></iframe>
		</div>`, ui.window);
		var List_close = ui.create.div('', `<div style="height:10px; width:${w}px; text-align:center; z-index:114514">
			<font size='5em'>关闭</font></div>`, List, function () {
			List.delete();
		});
	};
	get.dld_config = (name) => {
		if (name === true) game.broadcastAll((config, names, trytry) => {
			_status.dld_config = config;
			for (let i in names) {
				lib.character[i].skills.addArray(names[i][1]);
				names[i][0].skills.addArray(names[i][1]);
			}
			if (typeof trytry === 'string') try {
				eval(trytry);
			} catch (e) {
				alert(e);
			}
		}, {
			started: (_status.dld_started || false),
			zhus: (_status.dld_zhus || {}),
			ncs: lib.config.extension_大乱斗_ncs,
			nsa: lib.config.extension_大乱斗_nsa,
			group: lib.config.extension_大乱斗_group,
			tret: lib.config.extension_大乱斗_tret,
			zhuSkill: lib.config.extension_大乱斗_zhuSkill,
			zhuBuff: lib.config.extension_大乱斗_zhuBuff,
			neiBuff: lib.config.extension_大乱斗_neiBuff,
			changeDizhu: lib.config.extension_大乱斗_changeDizhu,
			enableTret: lib.config.extension_大乱斗_enableTret
		}, function () {
			let allotSkills = (_status.dld_allotSkills || {}), names = {};
			for (let cur of game.players) {
				for (let i in allotSkills) {
					if ([cur.name1, cur.name2].includes(i)) names[i] = [cur, allotSkills[i].filter(j => {
						return cur.hasSkill(j, null, null, false);
					})];
				}
			}
			return names;
		}(), lib.config.extension_大乱斗_trytry);
		else {
			if (!_status.dld_config || _status.dld_config[name] === undefined) get.dld_config(true);
			return _status.dld_config[name];
		}
	};
	lib.init.js(lib.assetURL + 'extension/大乱斗/js/character.js', null, () => {
		lib.config.all.characters.push('dld');
	}, () => {
		alert('error 〈大乱斗〉扩展武将导入失败');
	});
	lib.arenaReady.push(function () {
		if (!Array.isArray(lib.config.extension_大乱斗_common)) game.saveExtensionConfig('大乱斗', 'common', []);
		if (!Array.isArray(lib.config.extension_大乱斗_disabled)) game.saveExtensionConfig('大乱斗', 'disabled', []);
		if (!Array.isArray(lib.config.extension_大乱斗_group)) game.saveExtensionConfig('大乱斗', 'group', []);
		if (!Array.isArray(lib.config.extension_大乱斗_tret)) game.saveExtensionConfig('大乱斗', 'tret', []);
		if (lib.config.extension_大乱斗_preList === 'load') {
			game.loadDldList('common', '常驻技能池', [
				'tiandu', 'wusheng', 'paoxiao', 'jizhi', 'kurou', 'xiaoji', 'zhiheng', 'qixi',
				'olzhijian', 'reluoying', 'remingce', 'dcshibei', 'relongyin', 'changbiao', 'reyonglve', 'reduodao', 'zhenlie', 'rezhiman', 'xingongji', 'decadezhenjun', 'decadejingce', 'ollianhuan', 'xinganlu', 'refankui', 'reguicai', 'ollongdan', 'olyajiao', 'reyingzi', 'refanjian', 'reguose', 'new_liyu', 'junkqicai', 'reqingguo', 'xinleiji', 'xinkuanggu', 'fenji', 'oljiuchi',
				'luanji', 'dimeng', 'jiang', 'qizhi', 'drlt_congjian', 'nzry_jianxiang', 'dcwanglie',
				'liandui', 'xiansi', 'shenxing', 'olbingyi', 'qiangzhi', 'dangxian', 'jianzheng', 'funan', 'fumian', 'jishe', 'huomo', 'refenli',
				'olzhuyan', 'yuanzi', 'zengou', 'zlshoufu', 'yongsi', 'shenxian', 'qiangwu', 'liangzhu', 'kaikang', 'lizhan', 'mozhi', 'yuhua', 'new_meibu', 'remumu', 'fentian', 'jugu', 'hongde', 'sheyan', 'olxiuhao', 'olxiaoxi', 'zlhuji', 'olchongshen',
				'oljiangchi', 'olxuanfeng', 'olsbduoshou', 'ollihuo', 'olsbdulie',
				'xinxuanbei', 'xianwan', 'olxibing', 'ciwei', 'sanchen', 'oltousui', 'canmou',
				'clanguixiang',
				'xinfu_qinguo', 'xinfu_weilu', 'xinfu_duanfa', 'xinfu_guanchao', 'mpbishi',
				'lirang', 'qinbao', 'boyan',
				'dcjiexing', 'dchuace', 'dcpeiqi', 'dckaiji', 'renzheng', 'dcposuo', 'dcpandi', 'dcmoukui', 'dczhengxu', 'dcbeifen',
				'nifu', 'refuqi', 'gangzhi', 'rewenji', 'xinfu_pdgyingshi', 'sptunjiang',
				'xinhongyan', 'mbaosi', 'rejuece', 'xingtu', 'retiaoxin', 'xiaoxi_hansui', 'rezongshi', 'yingjian', 'rongbei',
				'sptaoluan', 'fengjie', 'spyinju', 'spshidi',
				'twqiaosi', 'twrouke', 'twqirang', 'twzhenliang', 'twkuanji', 'zhenshan', 'twxiangyu', 'zhengfu',
				'dcfaqi',
				'psguanxing', 'shushen', 'spshude', 'yjxuepin', 'vtbyanli', 'yjzhenlve', 'jie',
				'jsrgshenchong', 'jsrgzhenqiao', 'jsrgxundao', 'jsrgzhiheng', 'jsrgguanjue', 'jsrgguiji',
				'feiying', 'liangji',
				'dddxuyu',
				'nslingying', 'nsfuge', 'nszhenyin',
				'yuiko_fenglun', 'hisako_zhuanyun',
			], '6月26日22时');
			game.loadDldList('disabled', '禁选技能池', [
				'huandao', 'huashen', 'rehuashen', 'bolan', 'pingjian', 'dcbenxi',
				'xuanbei', 'wanyi', 'hina_xingzhi',

				'fenyong', 'spfangzong', 'boss_juejing', 'shencai', 'clanzhongliu',
				'zhichi', 'sbzhichi', 'nsjihui', 'vtbtaoyan', 'twsidao', 'zybishi', 'nsxiuxin',
				'shangshi', 'reshangshi', 'zishu', 'xinfu_songsang', 'dezhang', 'lianying', 'relianying', 'pianchong', 'jsrgpianchong', 'pshengwu', 'qingbei', 'fenyin', 'xinbenxi', 'qinzheng', 'neifa', 'dcneifa', 'twfupan', 'zhuosheng', 'nsqiyue', 'kangli', 'dcniji',
				'buyi', 'xinbuyi', 'spyuejian', 'jijiu', 'dcjinjian',
				'luoshen', 'reluoshen', 'yjluoshen', 'mengqing', 'iriya_yinji', 'rebotu', 'zhaxiang', 'oldcihuai', 'xinfu_tushe', 'jsrgtushe', 'yjyibing', 'olxiaofan',

				'fangzhu', 'xinfu_lingren', 'taoluan', 'chuanshu', 'nschangshi', 'regushe', 'zhukou', 'shiyuan', 'lihun', 'jinghe', 'nzry_shicai', 'junkshicai', 'pyzhuren', 'dcanjing', 'hongyi', 'olzhenlie', 'starsujun', 'tongli', 'zhongzuo', 'zylianji', 'xindanshou', 'shiki_omusubi', 'xinfu_yanyu', 'jingyu', 'mbqianlong', 'luanfeng', 'dcsbquanmou', 'olfushi', 'xinzhengnan', 'nsxuezhu', 'yufeng', 'kuangcai', 'dcditing', 'qiaosi', 'repojun',
				'dcjijie', 'dcjianxiong', 'dcrende', 'dcshuangbi', 'dccibei', 'dcshixian', 'dchuiwan', 'dcgeyuan', 'spolzhouxuan', 'sbanguo', 'dcjigu',
				'dccaixia', 'qingman', 'dccaisi', 'olqingyuan', 'sbbenxi', 'zhengnan', 'kujian', 'dcchongwang', 'xingchong', 'dcsbyingmou', 'noname_duocai', 'xinfu_pingcai',
				'chengxiang', 'rechengxiang', 'wangong', 'rejingce', 'noname_zhuyuan', 'umi_lunhui', 'olsbshenli', 'chuanxin', 'dcshuaiyan', 'luochong', 'dclibang', 'olshengong', 'olbeige', 'spjiedao', 'starliangyan', 'dczhanyi',

				'guanzong', 'jueqing',
				'tuntian', 'retuntian', 'oltuntian', 'quanji', 'zyquanji', 'requanji', 'xinquanji', 'xinfu_shajue', 'recangchu', 'bizhuan', 'rebizhuan', 'dczhangcai',
				'olfusong', 'jiuchi', 'rejiuchi', 'juexiang', 'mjdingyi', 'fenxin_old', 'dcaichen', 'dclingkong', 'yidian', 'juesheng',
			], '7月2日10时');
			game.loadDldList('group', '禁配技能对', [
			], '6月7日20时');
			game.loadDldList('tret', '添头技能池', [
				'reshizhi', 'renshi', 'dcdeshi', 'nzry_zhizheng', 'xinzhizheng', 'nsgongjian', 'jsrgfuni', 'xunzhi', 'xinfu_gongqing', 'new_reyaowu', 'lianzhou', 'jsrgshishou', 'qiongshou', 'juedao', 'olzeyue', 'dcfozong', 'yjyaoling', 'noda_fengcheng', 'olchuming', 'dcgangu', 'lxzhuixi', 'spyanhuo', 'jsrgyanhuo', 'oldianjun', 'roulin', 'dushi', 'juanjia', 'gzsuishi',
				'weilie',
				'jsrgshacheng', 'drlt_zhenrong', 'xinzhoufu', 'zyshilu',
				'dcanliao', 'yanzhu', 'jiefan', 'xinjiefan', 'twjiefan',

				'chijie', 'twyanqin',
				'jsrgyingshi', 'shebian', 'jsrgzhangdeng', 'jiewei',
				'twenchou', 'tuxing', 'xianwang', 'kengo_guidui', 'sakuya_junbu',
				'mbhuiyao', 'manji', 'dczhongjie',
				'junkdili', 'jsrgjuxia',

				'spjincui', 'olsbyufeng', 'xinfu_qiai', 'clanxumin', 'nzry_cunmu', 'qicai', 'jinjiu',
				'qljsuiren', 'juyi', 'rejuyi', 'mashu', 'jimeng', 'jiezhong', 'qiluan', 'retongxin', 'decadejinjiu', 'yingfeng', 'redaoji', 'mouni', 'zhanjiang', 'hongyan', 'dclima', 'cangzhuo', 'zongxuan', 'tuiyan', 'smyyingshi', 'zhoulin', 'shejian', 'huoshou',
				'sunohara_chengshuang', 'huaizi', 'clanjianji', 'dangzai', 'moon_jushou', 'manyi', 'jiezi', 'fenwei',
				'xinfu_denglou', 'remoshi',
				'xiefang', 'dcwujie', 'dczecai', 'olxinggu', 'twqueshi', 'twhanyu', 'juetao', 'huaiyuan', 'spchizhong', 'xingshang', 'yechou', 'kuimang', 'zhuide', 'dcjuexiang', 'xinfu_xiaode', 'pszhonghu', 'new_juexiang', 'zhuiyi', 'huilei', 'yjzhuiji', 'repolu', 'rexingshang', 'dczhuiyi', 'nsxingchu', 'nsyunxing', 'shizuku_sanhua', 'olyanhuo', 'twyanhuo', 'twylyanshi', 'zhafu', 'stdxiongyi', 'clanbaozu', 'xinfu_zengdao', 'luanwu', 'xinjuxiang', 'duanbi', 'xiongzhi', 'yjweiquan', 'psjianwei', 'fencheng', 'wulie', 'resghuishi', 'sbfenwei', 'wanlan', 'bihuo', 'spdaizui', 'sidai', 'jsrgcuifeng', 'jsrgfusha', 'nswulie', 'jianshu', 'twsidai', 'dcxunbie', 'fengying',
				'fenxun', 'refenxun', 'olzongxuan', 'xinzongxuan', 'rezongxuan', 'clanhuanjia', 'reqicai', 'reliewei', 'twliewei',
				'yijie', 'sbjinjiu', 'rejinjiu', 'olhongyan', 'clanfangzhen', 'olcuorui', 'dbchoujue', 'lianpo', 'zhongjie', 'diychanyuan',
				'qimou', 'reqimou', 'jijing', 'vtbyuanli', 'dczhangcai', 'xinfu_yingshi', 'clandaojie', 'clanmuyin', 'danji', 'ziqu', 'dcduanxie', 'kuanshi',
				'pingkou', 'repingkou', 'xinpingkou', 'shizuku_biyi', 'liunian', 'duwang', 'zhuitao',
			], '6月29日3时');
		}
		else if (lib.config.extension_大乱斗_preList === 'update') {
			game.updateDldList('common', '常驻技能池', [

			], [
				'recaiwang',
			], '6月26日22时');
			game.updateDldList('disabled', '禁选技能池', [
				'wanyi',
			], [

			], '7月2日10时');
			game.updateDldList('group', '禁配技能对', [

			], [
				['jishe', 'mengqing'],
			], '6月7日20时');
			game.updateDldList('tret', '添头技能池', [
				'zhuitao',
			], [
				'juesheng',
			], '6月29日3时');
		}
		_status.daluandou_characters = {};
		_status.dld_zhus = {};
		for (let i in lib.character) {
			if (i.startsWith('dld_')) continue;
			lib.character[i][2] = lib.config.extension_大乱斗_hpFix;
			_status.daluandou_characters[i] = lib.character[i].skills.slice(0);
			lib.character[i].hasHiddenSkill = false;
			lib.character[i].initFilters = [];
			if (lib.character[i].isZhugong) _status.dld_zhus[i] = lib.character[i].skills;
			lib.character[i].skills = [];
		}
		if (_status.connectMode) ui.create.system('刷新大乱斗', function () {
			if (game.me) get.dld_config(true);
			if (!game.online && game.me !== undefined) ui.connectShareButton = ui.create.div(
				".menubutton.large.highlight.connectbutton.connectbutton2.pointerdiv",
				"分享房间",
				ui.window,
				function () {
					let text = `无名杀-联机-大乱斗${lib.translate[get.mode()]}模式-${game.connectPlayers.filter((p) => p.avatar).length
						}/${game.connectPlayers.filter(
							(p) => !p.classList.contains("unselectable2")
						).length
						}\n${get.connectNickname()}邀请你加入${game.roomId
						}房间\n联机地址:${game.ip
						}\n请先通过游戏内菜单-开始-联机中启用“读取邀请链接”选项`;
					window.focus();
					let input = ui.create.node("textarea", ui.window, {
						opacity: "0",
					});
					input.value = text;
					input.focus();
					input.select();
					let result = document.execCommand("copy");
					input.blur();
					ui.window.removeChild(input);
					if (result) game.alert("分享内容复制成功");
					else game.alert(`分享内容复制失败，请稍后重试`);
				}
			);
		}, true);
	});
	lib.skill._dld_start = {
		available(mode) {
			if (mode === 'guozhan') {
				if (!lib.config.extension_大乱斗_enableGuozhan) return false;
				if (!_status.connectMode || !game.me) return true;
				let pack = lib.characterPack['mode_guozhan'] || {};
				for (let i in pack) {
					_status.daluandou_characters[i] = pack[i].skills.slice(0);
					pack[i][2] = lib.config.extension_大乱斗_hpFix;
					pack[i].skills = [];
				}
				game.broadcastAll((pack) => {
					for (let i in pack) {
						lib.character[i] = pack[i];
					}
				}, pack);
				get.dld_config(true);
				return true;
			}
			if (!game.me) return true;
			let zhus = {}, zhuSkill = lib.config.extension_大乱斗_zhuSkill;
			if (zhuSkill === 'off') _status.dld_zhus = {};
			if (_status.connectMode) {
				let characters = get.charactersOL();
				for (let i in _status.dld_zhus) {
					if (!characters.includes(i)) delete _status.dld_zhus[i];
				}
			}
			else for (let i in _status.dld_zhus) {
				if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) delete _status.dld_zhus[i];
			}
			for (let i in _status.dld_zhus) {
				let skills = _status.dld_zhus[i], group = lib.character[i].group;
				for (let j = 0; j < skills.length; j++) {
					let info = lib.skill[skills[j]];
					if (info.zhuSkill) {
						if (zhuSkill === 'on') continue;
						if (!info.ai || !info.ai.combo) {
							if (!zhus[group]) {
								if (group === 'wei') zhus[group] = ['twzhuiting'];
								else if (group === 'shu') zhus[group] = ['twqiushou'];
								else if (group === 'wu') zhus[group] = ['xinjiuyuan', 'dddguiying', 'rezhaofu'];
								else zhus[group] = [];
								zhus[group].push('dddqianlong');
							}
							zhus[group].add(skills[j]);
						}
					}
					skills.splice(j--, 1);
				}
			}
			if (zhuSkill === 'c') for (let i in _status.dld_zhus) {
				_status.dld_zhus[i] = [zhus[lib.character[i].group].randomGet()];
			}
			game.broadcastAll(zhus => {
				for (let i in zhus) {
					lib.character[i].skills = zhus[i].slice(0);
				}
				lib.characterReplace = {};
			}, _status.dld_zhus);
			_status.dld_zhus = zhus;
			get.dld_config(true);
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
		isZhu(current) {
			if (!current.identityShown || get.mode() !== 'identity' && get.mode() !== 'versus' && get.mode() !== 'doudizhu') return false;
			return current === game.zhu || current === game.rZhu || current === game.bZhu || current === game.trueZhu || current === game.falseZhu;
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
			game.log(target, '的身份是<font color=#8D9CFF>野心家</font>');
		},
		setAllotSkills(name, skills) {
			if (!_status.dld_allotSkills) _status.dld_allotSkills = {};
			if (!_status.dld_allotSkills[name]) _status.dld_allotSkills[name] = [];
			_status.dld_allotSkills[name].addArray(skills);
		},
		async content(event, trigger, player) {
			game.me.addTempSkill('dld_init');
			if (_status.dld_started) return;
			if (get.mode() === 'doudizhu') {
				if (lib.config.extension_大乱斗_enableTret !== 'off') game.zhu.removeSkill('feiyang');
				if (lib.config.extension_大乱斗_changeDizhu) game.zhu.removeSkill('bahu');
			}
			game.players.forEach(tar => {
				tar.storage.dld_tret = Number(lib.config.extension_大乱斗_enableTret) || 0;
			});
			if (lib.config.extension_大乱斗_enableTret !== 'off') game.me.addTempSkill('dld_tret');
		},
		async allotSkills(event) {
			let evt, players = event.players;
			if (lib.config.extension_大乱斗_allotSkills !== 'c' || !players.length) return get.dld_config(true);
			const evt_send = (skills, target, stop) => {
				let evt = game.createEvent('dld_allotSkills', false);
				evt.setContent(lib.skill._dld_start.contentx);
				evt.set('target', target);
				evt.set('skills', skills);
				evt.set('includeOut', true);
				if (!stop) game.resume();
				return evt;
			};
			const evt_sendback = (result, player) => {
				if (!result) result = {};
				if (!result.main) result.main = [];
				if (!result.vice) result.vice = [];
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
					return lib.skill[j] && lib.skill[j].viceSkill;
				});
				for (let i of skills) {
					if (vice.includes(i)) continue;
					if (!main.length || lib.skill[i] && lib.skill[i].mainSkill) main.push(i);
					else if (!vice.length) vice.push(i);
					else if (Math.random() < 0.5) main.push(i);
					else vice.push(i);
				}
				evt_sendback({
					main: main,
					vice: vice
				}, target);
			}
			if (withme) {
				let result = await evt.forResult();
				if (_status.connectMode) game.me.unwait(result, game.me);
				else {
					if (!result) result = {};
					if (!result.main) result.main = [];
					if (!result.vice) result.vice = [];
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
			for (const res of results) {
				const target = res[0], result = res[1];
				if (!target || !result) continue;
				let names = [target.name1, target.name2], lists = [result.main, result.vice];
				for (let i = 0; i < names.length; i++) {
					if (!names[i] || !lib.character[names[i]]) continue;
					lib.skill._dld_start.setAllotSkills(names[i], lists[i]);
				}
			}
			await game.asyncDelay();
			get.dld_config(true);
		},
		async contentx(event) {
			_status.noclearcountdown = true;
			let names = [], min = 0;
			for (let name of [event.target.name1, event.target.name2]) {
				if (!name || !lib.character[name]) continue;
				names.push(name);
			}
			if (!event.skills.length || names.length < 2) {
				delete _status.noclearcountdown;
				game.stopCountChoose();
				event.result = {
					main: event.skills,
					vice: []
				};
				return;
			}
			let next = event.target.chooseButton([
				'选择要加到主将牌上的技能（其余技能将加到副将牌上）',
				[event.skills.map((skill, i) => {
					let str = '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><b><font color=#00FF00>' + (lib.translate[skill] || '无名技能') + '</font></b>：' + get.skillInfoTranslation(skill, event.target);
					if (lib.skill[skill].derivation) {
						let derivation;
						if (Array.isArray(lib.skill[skill].derivation)) derivation = lib.skill[skill].derivation.slice(0);
						else derivation = [lib.skill[skill].derivation];
						for (let j of derivation) {
							str += '<br><span class="thundertext"><b>' + (lib.translate[j] || '无名技能') + '</b>：' + get.skillInfoTranslation(j, event.target) + '</span>';
						}
					}
					return [skill, str + '</div>'];
				}), 'textbutton']
			]);
			next.set('dialog', event.videoId);
			next.set('forced', true);
			next.set('ai', function (button) {
				if (lib.skill[button.link]) {
					if (lib.skill[button.link].mainSkill) return true;
					if (lib.skill[button.link].viceSkill) return false;
				}
				return Math.random() > 0.5;
			});
			next.set('selectButton', [min, event.skills.length]);
			next.set('complexSelect', false);
			let result = await next.forResult();
			delete _status.noclearcountdown;
			game.stopCountChoose();
			event.result = {
				main: result.links,
				vice: event.skills.filter(i => {
					return !result.links.includes(i);
				})
			};
		},
	};
	lib.skill.dld_init = {
		init() {
			if (_status.dld_started) return;
			_status.daluandou_common = lib.config.extension_大乱斗_common.slice(0);
			_status.daluandou_skills = [];
			_status.daluandou_tret = lib.config.extension_大乱斗_tret.slice(0);
			let characterlist = [], skills = [];
			if (get.mode() === 'guozhan') {
				let pack = lib.characterPack['mode_guozhan'] || {};
				if (lib.config.extension_大乱斗_notGuozhan) {
					if (_status.connectMode) characterlist = get.charactersOL().concat(Object.keys(pack));
					else characterlist = Object.keys(_status.daluandou_characters).filter(i => {
						return !lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i);
					});
				}
				else {
					if (_status.connectMode) characterlist = Object.keys(pack);
					else characterlist = Object.keys(pack).filter(i => {
						return !lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i);
					});
				}
			}
			else {
				if (_status.connectMode) characterlist = get.charactersOL();
				else characterlist = Object.keys(_status.daluandou_characters).filter(i => {
					return !lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i);
				});
			}
			for (let i of characterlist) {
				if (!_status.daluandou_characters[i]) continue;
				for (let j = 0; j < _status.daluandou_characters[i].length; j++) {
					let skill = _status.daluandou_characters[i][j], info = lib.skill[skill];
					if (lib.filter.skillDisabled(skill, null, true)) continue;
					if (!info || info.zhuSkill || info.hiddenSkill || info.ai && (info.ai.combo || info.ai.neg)) continue;
					if (info.groupSkill && !lib.config.extension_大乱斗_enableGroup) continue;
					if (lib.config.extension_大乱斗_disabled.includes(skill) || _status.daluandou_common.includes(skill) || _status.daluandou_tret.includes(skill)) continue;
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
		forceunique: true,
		charlotte: true,
		superCharlotte: true,
		getSkills(target) {
			let num, common = [], skills = [];
			if (_status.dld_started) num = lib.config.extension_大乱斗_addNum;
			else {
				common = _status.daluandou_common.randomGets(lib.config.extension_大乱斗_ncrs);
				_status.daluandou_common.removeArray(common);
				num = get.dld_config('ncs') - common.length;
			}
			if (get.mode() === 'doudizhu' && target === game.zhu && lib.config.extension_大乱斗_changeDizhu && !target.hasSkill('bahu', null, null, false)) common.unshift('bahu');
			let count = num,
				trans = common.map(i => lib.translate[i] || i),
				trymax = _status.daluandou_skills.length;
			while (count--) {
				let skill = _status.daluandou_skills.randomGet();
				if (!lib.translate[skill] || trans.includes(lib.translate[skill])) {
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
			let aiBuff = lib.config.extension_大乱斗_aiBuff, buffNum = Number(aiBuff[1]), choice = [];
			let num, max = 1;
			if (_status.dld_started) num = 1;
			else {
				num = get.dld_config('nsa');
				if (lib.config.extension_大乱斗_zhuBuff && lib.skill._dld_start.isZhu(target)) num++;
				if (get.mode() === 'doudizhu' && lib.config.extension_大乱斗_changeDizhu && event.target === game.zhu) num++;
				if (aiBuff[0] === 's' && (_status.connectMode && !target.node.nameol.innerHTML.length || !game.me.isFriendsOf(target))) num += buffNum;
				max = num;
				if (target.identity === 'nei' && lib.config.extension_大乱斗_neiBuff.includes('3') && !target.identityShown && Math.random() < 0.36) num++;
				num = Math.min(skills.length, num);
			}
			//skills.sort((a,b)=>get.skillRank(b)-get.skillRank(a));
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
				nei: choice.length > max ? max = choice.length : false,
				max: max,
				ai: true
			};
		},
		async content(event, trigger, player) {
			let next;
			const send = (skills, target, stop) => {
				let next = game.createEvent('daluandou_init', false);
				next.setContent(lib.skill.dld_init.contentx);
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
				if (_status.dld_started || get.mode() === 'guozhan') return true;
				let pack = lib.characterPack['mode_' + get.mode()] || {};
				for (let name of [tar.name, tar.name1, tar.name2]) {
					if (!name) continue;
					if (pack[name] || name.startsWith('dld_')) return false;
				}
				return true;
			}), skillsMap = {};
			let withme = false, withol = false;
			let aiBuff = lib.config.extension_大乱斗_aiBuff, buffNum = Number(aiBuff[1]);
			let oldtime = lib.configOL.choose_timeout, time = Number(lib.config.extension_大乱斗_extendTime.slice(1));
			if (_status.connectMode) {
				let type = lib.config.extension_大乱斗_extendTime[0];
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
					current.send(send, skills, current);
					current.wait(sendback);
				}
				else if (current === game.me) {
					withme = true;
					next = send(skills, current, true);
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
			results.sort((a, b) => lib.sort.seat(a[0], b[0]));
			for (const res of results) {
				const target = res[0], result = res[1] || lib.skill.dld_init.selectSkills(target, skillsMap[target.playerid]);
				if (!target || !result) continue;
				let skills = result.links;
				if (lib.config.extension_大乱斗_enableTret !== 'off') {
					target.storage.dld_tret = 2 * (result.max - skills.length) + (Number(lib.config.extension_大乱斗_enableTret) || 0);
					if (get.mode() === 'doudizhu' && target === game.zhu) target.storage.dld_tret++;
				}
				if (aiBuff !== 'off') {
					if (!_status.connectMode) {
						if (get.mode() === 'identity') target.showIdentity();
						else if (get.mode() === 'guozhan') target.showCharacter(1);
					}
					if (result.ai && (_status.connectMode || !game.me.isFriendsOf(target))) {
						if (aiBuff[0] === 'j') target.hujia += buffNum;
						else if (aiBuff[0] === 'm') {
							target.maxHp += buffNum;
							target.hp += buffNum;
						}
					}
					target.update();
				}
				if (result.nei) {
					target.logSkill('_dld_neiBuff2');
					lib.skill._dld_start.showYe(target);
					target.storage.dld_neiBuff = true;
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
					lib.skill._dld_start.setAllotSkills(names[i], lists[i]);
				}
				players.remove(target);
			}
			await game.asyncDelay();
			game.broadcastAll((time) => {
				lib.configOL.choose_timeout = time;
			}, oldtime);
			var evt = game.createEvent('dld_allotSkills', false);
			evt.player = game.me;
			evt.set('players', players);
			evt.set('results', results);
			evt.setContent(lib.skill._dld_start.allotSkills);
			_status.dld_started = true;
		},
		async contentx(event) {
			_status.noclearcountdown = true;
			let max, extra = 0, extintro = '';
			if (get.dld_config('started')) max = 1;
			else {
				max = get.dld_config('nsa');
				if (get.dld_config('zhuBuff') && lib.skill._dld_start.isZhu(event.target)) max++;
				if (get.mode() === 'doudizhu' && get.dld_config('changeDizhu') && event.target === game.zhu) max++;
				max = Math.min(event.skills[0].length + event.skills[1].length, max);
				if (event.target.identity === 'nei' && !event.target.identityShown && get.dld_config('neiBuff').includes('3')) {
					extra++;
					extintro = '<br><font color=#00FFB0>你可以多选1个技能，然后亮明身份并舍弃身份加成</font>';
				}
				else if (get.dld_config('enableTret') !== 'off') extintro = '<br><font color=#00FFB0>你可以少选任意个技能，稍后额外选择二倍数量的添头技</font>';
			}
			let list = event.skills[0].map((skill, i) => {
				if (!lib.skill[skill]) alert('未找到技能' + skill + '，' + (_status.connectMode ? '房主' : '您') + '可能往常驻技能池添加了一个该模式不存在的技能。请立即停止游戏' + (_status.connectMode ? '并检查是否与房主游戏版本保持一致、扩展保持一致等' : '') + '排查问题！');
				return [skill, '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><b><font color=#FFFF00>' + (lib.translate[skill] || '无名技能') + '</font></b>：' + get.skillInfoTranslation(skill, event.target) + '</div>'];
			}).concat(event.skills[1].map((skill, i) => {
				if (!lib.skill[skill]) alert('未找到技能' + skill + '，请立即停止游戏' + (_status.connectMode ? '并检查是否与房主游戏版本保持一致、扩展保持一致等' : '') + '排查问题！');
				let str = '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><b><font color=#00FF00>' + (lib.translate[skill] || '无名技能') + '</font></b>：' + get.skillInfoTranslation(skill, event.target);
				if (lib.translate[skill + '_append']) str += '<br><span class="yellowtext">' + lib.translate[skill + '_append'] + '</span>';
				if (lib.skill[skill].derivation) {
					let derivation;
					if (Array.isArray(lib.skill[skill].derivation)) derivation = lib.skill[skill].derivation.slice(0);
					else derivation = [lib.skill[skill].derivation];
					for (let j of derivation) {
						str += '<br><span class="thundertext"><b>' + (lib.translate[j] || '无名技能') + '</b>：' + get.skillInfoTranslation(j, event.target) + '</span>';
					}
				}
				return [skill, str + '</div>'];
			}));
			if (!list.length) {
				event.result = { links: [] };
				return;
			}
			let next = event.target.chooseButton([
				(get.dld_config('started') ? '鏖战：' : '') + '选择获得' + get.cnNumber(max) + '项技能' + extintro,
				[list, 'textbutton']
			]);
			next.set('dialog', event.videoId);
			next.set('forced', true);
			next.set('ai', function (button) {
				return get.skillRank(button.link);
			});
			next.set('selectButton', [(get.dld_config('enableTret') === 'off' ? max : 0), max + extra]);
			next.set('filterButton', button => {
				for (let arr of get.dld_config('group')) {
					if (!arr.includes(button.link)) continue;
					let other = arr[0] === button.link ? arr[1] : arr[0];
					if (ui.selected.buttons.some(b => b.link === other)) return false;
				}
				return true;
			});
			next.set('complexSelect', false);
			let result = await next.forResult();
			delete _status.noclearcountdown;
			game.stopCountChoose();
			event.result = {
				links: result.links,
				nei: result.links.length > max ? max = result.links.length : false,
				max: max
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
				return tar.storage.dld_tret > 0;
			});
		},
		silent: true,
		locked: true,
		popup: false,
		firstDo: true,
		forceDie: true,
		priority: 18,
		unique: true,
		forceunique: true,
		charlotte: true,
		superCharlotte: true,
		getSkills(target) {
			let num = lib.config.extension_大乱斗_tretNum, skills = [];
			if (num[0] === 'x') num = target.storage.dld_tret * Number(num.slice(1));
			else num = Number(num);
			let count = num,
				info = [],
				trymax = _status.daluandou_tret.length;
			while (count--) {
				let skill = _status.daluandou_tret.randomGet();
				if (!lib.translate[skill] || info.includes(lib.translate[skill])) {
					if (--trymax < 0) {
						game.dldLessAlert();
						break;
					}
					count++;
					continue;
				}
				skills.push(skill);
				info.push(lib.translate[skill] || skill);
				_status.daluandou_tret.remove(skill);
			}
			if (get.mode() === 'doudizhu' && target === game.zhu && lib.config.extension_大乱斗_changeDizhu && !target.hasSkill('feiyang', null, null, false)) skills[0] = 'feiyang';
			return skills;
		},
		async content(event, trigger, player) {
			let next;
			const send = (num, skills, target, stop) => {
				let next = game.createEvent('daluandou_tret', false);
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
				return tar.storage.dld_tret > 0;
			}), skillsMap = {};
			let withme = false, withol = false;
			let oldtime = lib.configOL.choose_timeout, time = Number(lib.config.extension_大乱斗_extendTime.slice(1));
			if (_status.connectMode) {
				let type = lib.config.extension_大乱斗_extendTime[0];
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
					target.send(send, target.storage.dld_tret, skills, target);
					target.wait(sendback);
				}
				else if (target === game.me) {
					withme = true;
					next = send(target.storage.dld_tret, skills, target, true);
					if (_status.connectMode) game.me.wait(sendback);
				}
				else ai_targets.push(target);
			}
			if (ai_targets.length) for (let target of ai_targets) {
				sendback({
					links: skillsMap[target.playerid].randomGets(target.storage.dld_tret),
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
					lib.skill._dld_start.setAllotSkills(names[i], lists[i]);
				}
				players.remove(target);
			}
			await game.asyncDelay();
			game.broadcastAll((time) => {
				lib.configOL.choose_timeout = time;
			}, oldtime);
			var evt = game.createEvent('dld_allotSkills', false);
			evt.player = game.me;
			evt.set('players', players);
			evt.set('results', results);
			evt.setContent(lib.skill._dld_start.allotSkills);
		},
		async contentx(event) {
			_status.noclearcountdown = true;
			let max = Math.min(event.num, event.skills.length), me = (!_status.connectMode || event.target !== game.me);
			let list = event.skills.map((skill, i) => {
				if (!lib.skill[skill]) alert('未找到技能' + skill + '，' + (_status.connectMode ? '房主' : '您') + '可能往添头技能池添加了一个该模式不存在的技能。请立即停止游戏' + (_status.connectMode ? '并检查是否与房主游戏版本保持一致、扩展保持一致等' : '') + '排查问题！');
				let str = '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><b><font color=#00FF00>' + (lib.translate[skill] || '无名技能') + '</font></b>：' + get.skillInfoTranslation(skill, event.target);
				if (lib.translate[skill + '_append']) str += '<br><span class="yellowtext">' + lib.translate[skill + '_append'] + '</span>';
				if (lib.skill[skill].derivation) {
					let derivation;
					if (Array.isArray(lib.skill[skill].derivation)) derivation = lib.skill[skill].derivation.slice(0);
					else derivation = [lib.skill[skill].derivation];
					for (let j of derivation) {
						str += '<br><span class="thundertext"><b>' + (lib.translate[j] || '无名技能') + '</b>：' + get.skillInfoTranslation(j, event.target) + '</span>';
					}
				}
				return [skill, str + '</div>'];
			});
			if (!list.length) {
				event.result = { links: [] };
				return;
			}
			let next = event.target.chooseButton([
				'选择获得至多' + get.cnNumber(max) + '项添头技',
				[list, 'textbutton']
			]);
			next.set('dialog', event.videoId);
			next.set('ai', function (button) {
				return get.skillRank(button.link);
			});
			next.set('selectButton', [1, max]);
			next.set('filterButton', button => {
				for (let arr of get.dld_config('group')) {
					if (!arr.includes(button.link)) continue;
					let other = arr[0] === button.link ? arr[1] : arr[0];
					if (ui.selected.buttons.some(b => b.link === other)) return false;
				}
				return true;
			});
			next.set('complexSelect', false);
			let result = await next.forResult();
			delete _status.noclearcountdown;
			game.stopCountChoose();
			event.result = {
				links: result.links
			};
		},
	};
	lib.skill._dld_zhuBuff = {
		mode: ['identity', 'versus'],
		trigger: {
			player: 'enterGame',
			global: ['gameStart', 'phaseEnd']
		},
		filter(event, player) {
			if (get.dld_config('zhuSkill') !== 's' || !player.identityShown || player.storage.dld_zhuBuff) return false;
			return get.dld_config('zhus')[player.group] && lib.skill._dld_start.isZhu(player);
		},
		silent: true,
		firstDo: true,
		priority: 36,
		charlotte: true,
		superCharlotte: true,
		async content(event, trigger, player) {
			switch (player.group) {
				case 'shu':
					if (lib.skill.qinwang) lib.skill.qinwang.derivation = 'rejijiang';
					break;
				case 'qun':
					if (lib.skill.staraoshi) lib.skill.staraoshi.derivation = 'starzongshi';
					break;
			}
			let list = get.dld_config('zhus')[player.group].randomGets(trigger.name === 'phase' ? 3 : 1), result;
			if (list.length === 1) result = { control: list[0] };
			else if (list.length) result = await player.chooseControl(list).set('choiceList', list.map(i => {
				if (!lib.skill[i]) alert('未找到技能' + i + '，请立即停止游戏' + (_status.connectMode ? '并检查是否与房主游戏版本保持一致、扩展保持一致等' : '') + '排查问题！');
				let info = '<div class="skill">' + (lib.translate[i] || '无名技能') + '</div><div>' + get.skillInfoTranslation(i, player);
				if (lib.translate[i + '_append']) str += '<br><span class="yellowtext">' + lib.translate[i + '_append'] + '</span>';
				if (lib.skill[i].derivation) {
					let derivation;
					if (Array.isArray(lib.skill[skill].derivation)) derivation = lib.skill[skill].derivation.slice(0);
					else derivation = [lib.skill[skill].derivation];
					for (let j of derivation) {
						info += '<br><span class="thundertext"><b>' + (lib.translate[j] || '无名技能') + '</b>：' + get.skillInfoTranslation(j, player) + '</span>';
					}
				}
				return info + '</div>';
			})).set('prompt', '选择要获得的一项主公技').set('displayIndex', false).set('ai', () => 0).forResult();
			else return;
			player.popup(result.control);
			await player.addSkills(result.control);
			if (lib.character[player.name1]) lib.skill._dld_start.setAllotSkills(player.name1, [result.control]);
			player.storage.dld_zhuBuff = true;
			await game.asyncDelay();
		}
	};
	lib.skill._dld_neiBuff1 = {
		mode: ['identity'],
		enable: 'phaseUse',
		filter(event, player) {
			if (player.identity !== 'nei' || player.identityShown || !game.hasPlayer(cur => {
				return cur.identityShown && lib.skill._dld_start.isZhu(cur);
			})) return false;
			return get.dld_config('neiBuff').includes('1');
		},
		log: false,
		forceDie: true,
		charlotte: true,
		superCharlotte: true,
		async content(event, trigger, player) {
			lib.skill._dld_start.showYe(player);
			lib.skill._dld_neiBuff2.prompt = '移除一名其他角色的一项技能';
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
				player.recover();
				game.zhu.recover();
			}
			await game.asyncDelay();
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					if (
						!game.hasPlayer(function (current) {
							return current.identity == 'zhong' || current.identity == 'mingzhong';
						}) ||
						(player.hp <= 1 && !player.countCards('hs', 'tao') && !player.countCards('hs', 'jiu'))
					)
						return 1;
					if (
						!game.hasPlayer(function (current) {
							return current.identity == 'fan';
						})
					) {
						if (get.attitude(game.zhu, player) < -1 || (get.attitude(game.zhu, player) < 0 && player.ai.shown >= 0.95)) return 1;
						return -3;
					}
					if (player.hp <= 2 && game.zhu.hp <= 2 || game.zhu.isHealthy() && lib.config.extension_AI优化_sfjAi ||
						game.zhu.hp <= 1 && !player.countCards('hs', 'tao')) return 1;
					return -3;
				}
			}
		}
	};
	lib.translate._dld_neiBuff1 = '<font color=#8D9CFF>不臣之心</font>';
	lib.skill._dld_neiBuff2 = {
		mode: ['identity'],
		enable: 'phaseUse',
		filter(event, player) {
			if (player.identity !== 'nei' || player.storage.dld_neiBuff) return false;
			return get.dld_config('neiBuff').includes('2');
		},
		filterTarget: lib.filter.notMe,
		prompt: '亮明身份并移除一名其他角色的一项技能',
		forceDie: true,
		charlotte: true,
		superCharlotte: true,
		skillAnimation: true,
		animationColor: 'thunder',
		async content(event, trigger, player) {
			player.storage.dld_neiBuff = true;
			lib.skill._dld_start.showYe(player);
			const target = event.targets[0];
			let skills = target.getSkills(null, false, false).filter(i => {
				return lib.translate[i] && lib.translate[i + '_info'] && lib.skill[i] && !lib.skill[i].fixed;
			}), result;
			if (skills.length) result = await player.chooseControl(skills).set('choiceList', skills.map(i => {
				let info = '<div class="skill" style="color:#FFFF00">' + (lib.translate[i] || '无名技能') + '</div><div>' + get.skillInfoTranslation(i, target);
				return info + '</div>';
			})).set('prompt', '选择要移除的一项技能').set('displayIndex', false).set('ai', () => get.event('idx')).set('idx', function () {
				if (skills.length == 1) return 0;
				let good = [], half = [], less = [], bad = [];
				for (let i = 0; i < skills.length; i++) {
					let info = lib.skill[skills[i]];
					if (!info.ai) continue;
					if (info.ai.neg) bad.add(skills[i]);
					else if (info.ai.combo) {
						if (!target.hasSkill(info.ai.combo, null, null, false)) less.add(skills[i]);
						else if (!good.includes(info.ai.combo)) good.add(info.ai.combo);
					}
					else if (info.ai.halfneg) half.add(skills[i]);
					else if (get.dld_config('tret').includes(skills[i])) less.add(skills[i]);
				}
				if (good.length) return skills.indexOf(good.randomGet());
				if (half.length + less.length + bad.length < skills.length) {
					let dis = [];
					for (let i = 0; i < skills.length; i++) {
						if (!less.includes(skills[i]) && !bad.includes(skills[i])) dis.add(skills[i]);
					}
					return skills.indexOf(dis.randomGet());
				}
				if (half.length) return skills.indexOf(half.randomGet());
				if (less.length) return skills.indexOf(less.randomGet());
				return skills.map((val, idx) => idx).randomGet();
			}()).forResult();
			if (result && result.control) {
				player.popup(result.control);
				await target.removeSkills(result.control);
			}
			await game.asyncDelay();
		},
		ai: {
			order: 0.5,
			result: {
				player(player, target) {
					if (game.players.length === 2) return 1;
					let num = game.zhu.hp + game.zhu.hujia + player.countCards('hs', 'tao'), dif = game.countPlayer(current => {
						if (current.identity == 'zhong' || current.identity == 'mingzhong') return current.hp + current.hujia + current.countCards('hs') / 12;
					}) - game.countPlayer(current => {
						if (current.identity == 'zhong') return current.hp + current.hujia + current.countCards('hs') / 12;
					});
					if (num * num + num + dif < 0) return 1;
					if (dif > player.hp + player.hujia + player.countCards('hes') / 4) return 1;
					if (!game.hasPlayer(current => current.identity == 'fan') && (get.attitude(game.zhu, player) < -0.5 || get.attitude(game.zhu, player) < 0 && player.ai.shown >= 0.95)) return 1;
					return -1024;
				},
				target(player, target) {
					return -Math.pow(get.threaten(target), 2) * (target.hp + 1);
				}
			}
		}
	};
	lib.translate._dld_neiBuff2 = '野心毕露';
}
