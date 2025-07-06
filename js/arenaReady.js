import { lib, game, ui, get, ai, _status } from './utils.js';

export function arenaReady() {
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
	if (lib.config.extension_大乱斗_filterSkills > 0) {
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
	if (lib.characterReplace) {
		for (let i in lib.characterReplace) {
			delete lib.characterReplace[i];
		}
	}
}
