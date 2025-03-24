import { lib, game, ui, get, ai, _status } from '../../../noname.js';

/**
 * 复制文本内容到剪贴板
 * @param { string } text - 要复制的文本
 * @param { string | false } [success] - 成功提示语
 * @param { string | false } [fail] - 失败提示语
 * @returns { boolean }
 */
game.copy = (text, success = '已成功复制到剪贴板', fail = '复制失败') => {
	if (typeof text !== 'string') return;
	let copied = false;
	const textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.style.position = 'fixed';
	textarea.style.left = '-9999px';
	textarea.style.width = '1px';
	document.body.appendChild(textarea);
	textarea.focus();
	textarea.select();
	try {
		copied = document.execCommand('copy');
		if (copied) {
			success && alert(success);
		} else {
			fail && alert(fail);
		}
	} catch (e) {
		console.error('execCommand失败:', e);
		fail && alert(fail);
	}
	document.body.removeChild(textarea);
	return copied;
};

/**
 * 去除模板字符串的公共缩进
 * @param { TemplateStringsArray } strings 模板字符串
 * @param  { ...any } values 插值
 * @returns { string }
 */
game.dedent = function (strings, ...values) {
	// 将模板字符串和插值值组合成一个完整的字符串
	let str = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
	// 将字符串按行分割
	let lines = str.split('\n');
	// 找到最小的非空行缩进
	let minIndent = null;
	lines.forEach((line) => {
		if (line.trim() === '') return; // 跳过空行
		let indent = line.length - line.trimStart().length;
		if (minIndent === null || indent < minIndent) {
			minIndent = indent;
		}
	});
	// 如果没有找到非空行，直接返回原字符串
	if (minIndent === null) return str;
	// 去除每行的最小公共缩进
	lines = lines.map((line) => line.slice(minIndent));
	// 重新组合成一个字符串
	return lines.join('\n').trim();
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
	let tnsc = lib.config.extension_大乱斗_tnsc,
		nsc = lib.config.extension_大乱斗_nsc;
	if (_status.daluandou_skills.length < game.players.length * tnsc) alert('技能池太小，建议增加武将或减少候选技能数');
	else if (tnsc / nsc > 0.7) alert('可选技能数过多，建议减少可选技能数');
	else if (tnsc < 8) alert('候选技能数太少，建议增加候选技能数');
	else alert('禁配技能对过多，建议删除不必要的禁配或增加候选技能数');
};

/**
 * 获取技能在type技能池下的按钮内容
 * @param { string } skill 技能ID
 * @param { string } [type] 技能池类型
 * @returns { string }
 */
get.dldSkillButton = (skill, type) => {
	let info,
		color =
			{
				normal: 'color: #00FF00',
				common: 'color: #FFFF00',
				disabled: 'color: #FF0000',
				tret: 'color: #8DFDD8',
				zhu: 'color: #E983FF',
			}[type] || '';
	if (type === 'zhu')
		info = ui.joint`
            <div class="skill">${lib.translate[skill]}</div>
            <div>${lib.translate[skill + '_info']}
        `;
	else
		info = ui.joint`
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
			info += ui.joint`
                <br><span class="thundertext">
                    ${lib.translate[der]}：${lib.translate[der + '_info']}
                </span>
            `;
		}
	}
	return info + '</div>';
};

/**
 * 编辑大乱斗技能池
 * @param { HTMLDivElement } temp 当前HTML
 * @param { string } config 配置名
 * @param { string } name 技能池名称
 */
game.editDldList = (temp, config, name) => {
	const two = config === 'group';
	game.prompt(`请输入要加入/移出${name}的${two ? '两个' : ''}技能ID${two ? '（用空格分开）' : ''}`, (str) => {
		if (typeof str !== 'string') return;
		let show = (info) => {
				temp.innerHTML = ui.joint`${info}`;
				temp.ready = true;
				setTimeout(() => {
					temp.innerHTML = '编辑' + name;
					delete temp.ready;
				}, 1600);
			},
			skills = str.split(' ').slice(0, two ? 2 : 1);
		if (!skills.length) return;
		for (let i of skills) {
			if (!lib.skill[i])
				return show(`
                    <div style="color: rgb(255,0,0); font-family: xinwei; font-size: 113%">
                        未找到${i}对应技能
                    </div>
                `);
			if (lib.filter.skillDisabled(i, null, true))
				return show(`
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
				if (skills[0] === skills[1])
					return show(`
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
			} else if (skills.length === 1 || skills[0] === skills[1])
				show(`
                    <div style="color: rgb(210,210,000); font-family: xinwei; font-size: 113%">
                        已将【${lib.translate[skills[0]]}】相关的技能对移出${name}
                    </div>
                `);
			else
				show(`
                    <div style="color: rgb(210,210,000); font-family: xinwei; font-size: 113%">
                        已将【${lib.translate[skills[0]]}】＋【${lib.translate[skills[1]]}】移出${name}
                    </div>
                `);
		} else if (lists.includes(skills[0])) {
			lists.remove(skills[0]);
			show(`
                <div style="color: rgb(210,210,000); font-family: xinwei; font-size: 113%">
                    已将【${lib.translate[skills[0]]}】移出${name}
                </div>
            `);
		} else {
			lists.push(skills[0]);
			lib.config.extension_大乱斗_check.add(skills[0]);
			game.saveExtensionConfig('大乱斗', 'check', lib.config.extension_大乱斗_check);
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
	if (lists.length > 0)
		for (let i = 0; i < lists.length; i++) {
			if (i) skills += '、';
			if (two) {
				if (lib.translate[lists[i][0]]) skills += lib.translate[lists[i][0]];
				skills += '[' + lists[i][0] + ']＋';
				if (lib.translate[lists[i][1]]) skills += lib.translate[lists[i][1]];
				skills += '[' + lists[i][1] + ']';
			} else skills += (lib.translate[lists[i]] || '无名技能') + '[' + lists[i] + ']';
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
	const List = ui.create.div(
		'',
		ui.joint`
            <div style="z-index:114514">
                <iframe width="${w}px" height="${h}px" srcdoc="<!DOCTYPE html>${info}"></iframe>
            </div>
        `,
		ui.window
	);
	ui.create.div(
		'',
		ui.joint`
            <div style="height: 10px; width: ${w}px; text-align: center; z-index: 114514">
                <font size="5em">关闭</font>
            </div>
        `,
		List,
		function () {
			List.delete();
		}
	);
};

/**
 * 伪连接字符串，去掉换行和行前空串
 * @param { TemplateStringsArray } strings 模板字符串
 * @param  { ...any } values 插值
 * @returns { string }
 */
ui.joint = function (strings, ...values) {
	let str = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
	let lines = str.split('\n').map((line) => line.trimStart());
	return lines.join('').trim();
};

export { lib, game, ui, get, ai, _status };
