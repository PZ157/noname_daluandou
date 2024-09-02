game.import('character', (lib, game, ui, get, ai, _status) => {
	let xutou = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp', dld = {
		name: 'dld',
		connect: true,
		character: {
			dld_quyuan: {
				sex: 'male',
				group: 'qun',
				hp: 3,
				skills: ['dlds_wentian', 'dlds_zhaohun'],
				dieAudios: ['quyuan'],
				trashBin: ['ext:大乱斗/image/dld_quyuan.jpg']
			},
		},
		characterSort: {
			dld: {
				dragon_boat: [
					'dld_quyuan',
				],
			}
		},
		characterIntro: {
			dld_quyuan: `
				${xutou}屈原（约前340年～前278年），芈姓（一作嬭姓），屈氏，名平，字原，又自云名正则，字灵均，
				出生于楚国丹阳秭归（今湖北省宜昌市），战国时期楚国诗人、政治家。楚武王熊通之子屈瑕的后代（一说屈氏的来源是西周前期的楚国人屈紃）。
				<br>${xutou}屈原少年时受过良好的教育，博闻强识，志向远大。早年受楚怀王信任，任左徒、三闾大夫，兼管内政外交大事。
				提倡“美政”，主张对内举贤任能，修明法度，对外力主联齐抗秦。因遭贵族排挤诽谤，被先后流放至汉北和沅湘流域。
				前278年，楚国郢都被秦军攻破后，自沉于汨罗江，以身殉楚国。
				<br>${xutou}屈原是中国历史上一位伟大的爱国诗人，中国浪漫主义文学的奠基人，“楚辞”的创立者和代表作家，开辟了“香草美人”的传统，
				被誉为“楚辞之祖”，楚国有名的辞赋家宋玉、唐勒、景差都受到屈原的影响。
				屈原作品的出现，标志着中国诗歌进入了一个由大雅歌唱到浪漫独创的新时代，其主要作品有《离骚》《九歌》《九章》《天问》等。
				以屈原作品为主体的《楚辞》是中国浪漫主义文学的源头之一，对后世诗歌产生了深远影响。成为中国文学史上的璀璨明珠，
				“逸响伟辞，卓绝一世”。“路漫漫其修远兮，吾将上下而求索”，屈原的“求索”精神，成为后世仁人志士所信奉和追求的一种高尚精神。
				<br>${xutou}1953年，在屈原逝世2230周年之际，世界和平理事会通过决议，确定屈原为当年纪念的世界四大文化名人之一。
			`,
		},
		characterTitle: {
		},
		characterFilter: {},
		skill: {
			dlds_wentian: {
				audio: 'dcqiusuo2.mp3',
				works: {
					'离骚': `
		帝高阳之苗裔兮，朕皇考曰伯庸。
		摄提贞于孟陬兮，惟庚寅吾以降。
		皇览揆余初度兮，肇锡余以嘉名。
		名余曰正则兮，字余曰灵均。
		纷吾既有此内美兮，又重之以修能。
		扈江离与辟芷兮，纫秋兰以为佩。
		汩余若将不及兮，恐年岁之不吾与。
		朝搴阰之木兰兮，夕揽洲之宿莽。
		日月忽其不淹兮，春与秋其代序。
		惟草木之零落兮，恐美人之迟暮。
		不抚壮而弃秽兮，何不改此度？
		乘骐骥以驰骋兮，来吾道夫先路！
		昔三后之纯粹兮，固众芳之所在。
		杂申椒与菌桂兮，岂惟纫夫蕙茝！
		彼尧、舜之耿介兮，既遵道而得路。
		何桀纣之猖披兮，夫唯捷径以窘步。
		惟夫党人之偷乐兮，路幽昧以险隘。
		岂余身之惮殃兮，恐皇舆之败绩！
		忽奔走以先后兮，及前王之踵武。
		荃不查余之中情兮，反信谗而齌怒。
		余固知謇謇之为患兮，忍而不能舍也。
		指九天以为正兮，夫唯灵修之故也。
		曰黄昏以为期兮，羌中道而改路！
		初既与余成言兮，后悔遁而有他。
		余既不难夫离别兮，伤灵修之数化。
		余既滋兰之九畹兮，又树蕙之百亩。
		畦留夷与揭车兮，杂杜衡与芳芷。
		冀枝叶之峻茂兮，愿俟时乎吾将刈。
		虽萎绝其亦何伤兮，哀众芳之芜秽。
		众皆竞进以贪婪兮，凭不厌乎求索。
		羌内恕己以量人兮，各兴心而嫉妒。
		忽驰骛以追逐兮，非余心之所急。
		老冉冉其将至兮，恐修名之不立。
		朝饮木兰之坠露兮，夕餐秋菊之落英。
		苟余情其信姱以练要兮，长顑颔亦何伤。
		掔木根以结茝兮，贯薜荔之落蕊。
		矫菌桂以纫蕙兮，索胡绳之纚纚。
		謇吾法夫前修兮，非世俗之所服。
		虽不周于今之人兮，愿依彭咸之遗则。
		长太息以掩涕兮，哀民生之多艰。
		余虽好修姱以鞿羁兮，謇朝谇而夕替。
		既替余以蕙纕兮，又申之以揽茝。
		亦余心之所善兮，虽九死其犹未悔。
		怨灵修之浩荡兮，终不察夫民心。
		众女嫉余之蛾眉兮，谣诼谓余以善淫。
		固时俗之工巧兮，偭规矩而改错。
		背绳墨以追曲兮，竞周容以为度。
		忳郁邑余侘傺兮，吾独穷困乎此时也。
		宁溘死以流亡兮，余不忍为此态也。
		鸷鸟之不群兮，自前世而固然。
		何方圜之能周兮，夫孰异道而相安？
		屈心而抑志兮，忍尤而攘诟。
		伏清白以死直兮，固前圣之所厚。
		悔相道之不察兮，延伫乎吾将反。
		回朕车以复路兮，及行迷之未远。
		步余马于兰皋兮，驰椒丘且焉止息。
		进不入以离尤兮，退将复修吾初服。
		制芰荷以为衣兮，集芙蓉以为裳。
		不吾知其亦已兮，苟余情其信芳。
		高余冠之岌岌兮，长余佩之陆离。
		芳与泽其杂糅兮，唯昭质其犹未亏。
		忽反顾以游目兮，将往观乎四荒。
		佩缤纷其繁饰兮，芳菲菲其弥章。
		民生各有所乐兮，余独好修以为常。
		虽体解吾犹未变兮，岂余心之可惩。
		女嬃之婵媛兮，申申其詈予，曰：
		鲧婞直以亡身兮，终然夭乎羽之野。
		汝何博謇而好修兮，纷独有此姱节？
		薋菉葹以盈室兮，判独离而不服。
		众不可户说兮，孰云察余之中情？
		世并举而好朋兮，夫何茕独而不予听？
		依前圣以节中兮，喟凭心而历兹。
		济沅、湘以南征兮，就重华而陈词：
		启《九辩》与《九歌》兮，夏康娱以自纵。
		不顾难以图后兮，五子用失乎家衖。
		羿淫游以佚畋兮，又好射夫封狐。
		固乱流其鲜终兮，浞又贪夫厥家。
		浇身被服强圉兮，纵欲而不忍。
		日康娱而自忘兮，厥首用夫颠陨。
		夏桀之常违兮，乃遂焉而逢殃。
		后辛之菹醢兮，殷宗用而不长。
		汤、禹俨而祗敬兮，周论道而莫差。
		举贤才而授能兮，循绳墨而不颇。
		皇天无私阿兮，览民德焉错辅。
		夫维圣哲以茂行兮，苟得用此下土。
		瞻前而顾后兮，相观民之计极。
		夫孰非义而可用兮？孰非善而可服？
		阽余身而危死兮，览余初其犹未悔。
		不量凿而正枘兮，固前修以菹醢。
		曾歔欷余郁邑兮，哀朕时之不当。
		揽茹蕙以掩涕兮，沾余襟之浪浪。
		跪敷衽以陈辞兮，耿吾既得此中正。
		驷玉虬以椉鹥兮，溘埃风余上征。
		朝发轫于苍梧兮，夕余至乎县圃。
		欲少留此灵琐兮，日忽忽其将暮。
		吾令羲和弭节兮，望崦嵫而勿迫。
		路曼曼其修远兮，吾将上下而求索。
		饮余马于咸池兮，总余辔乎扶桑。
		折若木以拂日兮，聊逍遥以相羊。
		前望舒使先驱兮，后飞廉使奔属。
		鸾皇为余先戒兮，雷师告余以未具。
		吾令凤鸟飞腾兮，继之以日夜。
		飘风屯其相离兮，帅云霓而来御。
		纷总总其离合兮，斑陆离其上下。
		吾令帝阍开关兮，倚阊阖而望予。
		时暧暧其将罢兮，结幽兰而延伫。
		世溷浊而不分兮，好蔽美而嫉妒。
		朝吾将济于白水兮，登阆风而绁马。
		忽反顾以流涕兮，哀高丘之无女。
		溘吾游此春宫兮，折琼枝以继佩。
		及荣华之未落兮，相下女之可诒。
		吾令丰隆乘云兮，求宓妃之所在。
		解佩纕以结言兮，吾令謇修以为理。
		纷总总其离合兮，忽纬繣其难迁。
		夕归次于穷石兮，朝濯发乎洧盘。
		保厥美以骄傲兮，日康娱以淫游。
		虽信美而无礼兮，来违弃而改求。
		览相观于四极兮，周流乎天余乃下。
		望瑶台之偃蹇兮，见有娀之佚女。
		吾令鸩为媒兮，鸩告余以不好。
		雄鸠之鸣逝兮，余犹恶其佻巧。
		心犹豫而狐疑兮，欲自适而不可。
		凤皇既受诒兮，恐高辛之先我。
		欲远集而无所止兮，聊浮游以逍遥。
		及少康之未家兮，留有虞之二姚。
		理弱而媒拙兮，恐导言之不固。
		世溷浊而嫉贤兮，好蔽美而称恶。
		闺中既以邃远兮，哲王又不寤。
		怀朕情而不发兮，余焉能忍而与此终古？
		索琼茅以筳篿兮，命灵氛为余占之。
		曰：两美其必合兮，孰信修而慕之？
		思九州之博大兮，岂惟是其有女？
		曰：勉远逝而无狐疑兮，孰求美而释女？
		何所独无芳草兮，尔何怀乎故宇？
		世幽昧以昡曜兮，孰云察余之善恶？
		民好恶其不同兮，惟此党人其独异！
		户服艾以盈要兮，谓幽兰其不可佩。
		览察草木其犹未得兮，岂珵美之能当？
		苏粪壤以充帏兮，谓申椒其不芳。
		欲从灵氛之吉占兮，心犹豫而狐疑。
		巫咸将夕降兮，怀椒糈而要之。
		百神翳其备降兮，九疑缤其并迎。
		皇剡剡其扬灵兮，告余以吉故。
		曰：勉升降以上下兮，求矩矱之所同。
		汤、禹俨而求合兮，挚、咎繇而能调。
		苟中情其好修兮，又何必用夫行媒？
		说操筑于傅岩兮，武丁用而不疑。
		吕望之鼓刀兮，遭周文而得举。
		宁戚之讴歌兮，齐桓闻以该辅。
		及年岁之未晏兮，时亦犹其未央。
		恐鹈鴂之先鸣兮，使夫百草为之不芳。
		何琼佩之偃蹇兮，众薆然而蔽之。
		惟此党人之不谅兮，恐嫉妒而折之。
		时缤纷其变易兮，又何可以淹留？
		兰芷变而不芳兮，荃蕙化而为茅。
		何昔日之芳草兮，今直为此萧艾也？
		岂其有他故兮，莫好修之害也！
		余以兰为可恃兮，羌无实而容长。
		委厥美以从俗兮，苟得列乎众芳。
		椒专佞以慢慆兮，樧又欲充夫佩帏。
		既干进而务入兮，又何芳之能祗？
		固时俗之流从兮，又孰能无变化？
		览椒兰其若兹兮，又况揭车与江离？
		惟兹佩之可贵兮，委厥美而历兹。
		芳菲菲而难亏兮，芬至今犹未沬。
		和调度以自娱兮，聊浮游而求女。
		及余饰之方壮兮，周流观乎上下。
		灵氛既告余以吉占兮，历吉日乎吾将行。
		折琼枝以为羞兮，精琼爢以为粻。
		为余驾飞龙兮，杂瑶象以为车。
		何离心之可同兮？吾将远逝以自疏。
		邅吾道夫昆仑兮，路修远以周流。
		扬云霓之晻蔼兮，鸣玉鸾之啾啾。
		朝发轫于天津兮，夕余至乎西极。
		凤皇翼其承旗兮，高翱翔之翼翼。
		忽吾行此流沙兮，遵赤水而容与。
		麾蛟龙使梁津兮，诏西皇使涉予。
		路修远以多艰兮，腾众车使径待。
		路不周以左转兮，指西海以为期。
		屯余车其千乘兮，齐玉轪而并驰。
		驾八龙之婉婉兮，载云旗之委蛇。
		抑志而弭节兮，神高驰之邈邈。
		奏《九歌》而舞《韶》兮，聊假日以媮乐。
		陟升皇之赫戏兮，忽临睨夫旧乡。
		仆夫悲余马怀兮，蜷局顾而不行。
		乱曰：已矣哉！
		国无人莫我知兮，又何怀乎故都！
		既莫足与为美政兮，吾将从彭咸之所居！
					`,
					'天问': `
		曰：遂古之初，谁传道之？
		上下未形，何由考之？
		冥昭瞢暗，谁能极之？
		冯翼惟象，何以识之？
		明明暗暗，惟时何为？
		阴阳三合，何本何化？
		圜则九重，孰营度之？
		惟兹何功，孰初作之？
		斡维焉系，天极焉加？
		八柱何当，东南何亏？
		九天之际，安放安属？
		隅隈多有，谁知其数？
		天何所沓？十二焉分？
		日月安属？列星安陈？
		出自汤谷，次于蒙汜。
		自明及晦，所行几里？
		夜光何德，死则又育？
		厥利维何，而顾菟在腹？
		女岐无合，夫焉取九子？
		伯强何处？惠气安在？
		何阖而晦？何开而明？
		角宿未旦，曜灵安藏？
		不任汩鸿，师何以尚之？
		佥曰“何忧，何不课而行之？”
		鸱龟曳衔，鲧何听焉？
		顺欲成功，帝何刑焉？
		永遏在羽山，夫何三年不施？
		伯禹愎鲧，夫何以变化？
		纂就前绪，遂成考功。
		何续初继业，而厥谋不同？
		洪泉极深，何以窴之？
		地方九则，何以坟之？
		应龙何画？河海何历？
		鲧何所营？禹何所成？
		康回冯怒，墬何故以东南倾？
		九州安错？川谷何洿？
		东流不溢，孰知其故？
		东西南北，其修孰多？
		南北顺椭，其衍几何？
		昆仑悬圃，其凥安在？
		增城九重，其高几里？
		四方之门，其谁从焉？
		西北辟启，何气通焉？
		日安不到？烛龙何照？
		羲和之未扬，若华何光？
		何所冬暖？何所夏寒？
		焉有石林？何兽能言？
		焉有虬龙，负熊以游？
		雄虺九首，倏忽焉在？
		何所不死？长人何守？
		靡蓱九衢，枲华安居？
		灵蛇吞象，厥大何如？
		黑水玄趾，三危安在？
		延年不死，寿何所止？
		鲮鱼何所？鬿堆焉处？
		羿焉彃日？乌焉解羽？
		禹之力献功，降省下土四方。
		焉得彼嵞山女，而通之於台桑？
		闵妃匹合，厥身是继。
		胡维嗜不同味，而快鼌饱？
		启代益作后，卒然离蠥。
		何启惟忧，而能拘是达？
		皆归射鞫，而无害厥躬。
		何后益作革，而禹播降？
		启棘宾商，《九辨》《九歌》。
		何勤子屠母，而死分竟地？
		帝降夷羿，革孽夏民。
		胡射夫河伯，而妻彼雒嫔？
		冯珧利决，封豨是射。
		何献蒸肉之膏，而后帝不若？
		浞娶纯狐，眩妻爰谋。
		何羿之射革，而交吞揆之？
		阻穷西征，岩何越焉？
		化而为黄熊，巫何活焉？
		咸播秬黍，莆雚是营。
		何由并投，而鲧疾修盈？
		白蜺婴茀，胡为此堂？
		安得夫良药，不能固臧？
		天式从横，阳离爰死。
		大鸟何鸣，夫焉丧厥体？
		蓱号起雨，何以兴之？
		撰体协胁，鹿何膺之？
		鳌戴山抃，何以安之？
		释舟陵行，何之迁之？
		惟浇在户，何求于嫂？
		何少康逐犬，而颠陨厥首？
		女歧缝裳，而馆同爰止。
		何颠易厥首，而亲以逢殆？
		汤谋易旅，何以厚之？
		覆舟斟寻，何道取之？
		桀伐蒙山，何所得焉？
		妺嬉何肆，汤何殛焉？
		舜闵在家，父何以鳏？
		尧不姚告，二女何亲？
		厥萌在初，何所亿焉？
		璜台十成，谁所极焉？
		登立为帝，孰道尚之？
		女娲有体，孰制匠之？
		舜服厥弟，终然为害。
		何肆犬豕，而厥身不危败？
		吴获迄古，南岳是止。
		孰期去斯，得两男子？
		缘鹄饰玉，后帝是飨。
		何承谋夏桀，终以灭丧？
		帝乃降观，下逢伊挚。
		何条放致罚，而黎服大说？
		简狄在台，喾何宜？
		玄鸟致贻，女何喜？
		该秉季德，厥父是臧。
		胡终弊于有扈，牧夫牛羊？
		干协时舞，何以怀之？
		平胁曼肤，何以肥之？
		有扈牧竖，云何而逢？
		击床先出，其命何从？
		恒秉季德，焉得夫朴牛？
		何往营班禄，不但还来？
		昏微循迹，有狄不宁。
		何繁鸟萃棘，负子肆情？
		眩弟并淫，危害厥兄。
		何变化以作诈，而后嗣逢长？
		成汤东巡，有莘爰极。
		何乞彼小臣，而吉妃是得？
		水滨之木，得彼小子。
		夫何恶之，媵有莘之妇？
		汤出重泉，夫何辠尤？
		不胜心伐帝，夫谁使挑之？
		会朝争盟，何践吾期？
		苍鸟群飞，孰使萃之？
		列击纣躬，叔旦不嘉。
		何亲揆发足，周之命以咨嗟？
		授殷天下，其位安施？
		反成乃亡，其罪伊何？
		争遣伐器，何以行之？
		并驱击翼，何以将之？
		昭后成游，南土爰底。
		厥利惟何，逢彼白雉？
		穆王巧梅，夫何为周流？
		环理天下，夫何索求？
		妖夫曳炫，何号于市？
		周幽谁诛？焉得夫褒姒？
		天命反侧，何罚何佑？
		齐桓九会，卒然身杀。
		彼王纣之躬，孰使乱惑？
		何恶辅弼，谗谄是服？
		比干何逆，而抑沈之？
		雷开阿顺，而赐封之？
		何圣人之一德，卒其异方？
		梅伯受醢，箕子详狂？
		稷维元子，帝何竺之？
		投之于冰上，鸟何燠之？
		何冯弓挟矢，殊能将之？
		既惊帝切激，何逢长之？
		伯昌号衰，秉鞭作牧。
		何令彻彼岐社，命有殷国？
		迁藏就岐，何能依？
		殷有惑妇，何所讥？
		受赐兹醢，西伯上告。
		何亲就上帝罚，殷之命以不救？
		师望在肆，昌何识？
		鼓刀扬声，后何喜？
		武发杀殷，何所悒？
		载尸集战，何所急？
		伯林雉经，维其何故？
		何感天抑墬，夫谁畏惧？
		皇天集命，惟何戒之？
		受礼天下，又使至代之？
		初汤臣挚，后兹承辅。
		何卒官汤，尊食宗绪？
		勋阖梦生，少离散亡。
		何壮武历，能流厥严？
		彭铿斟雉，帝何飨？
		受寿永多，夫何久长？
		中央共牧，后何怒？
		蜂蛾微命，力何固？
		惊女采薇，鹿何佑？
		北至回水，萃何喜？
		兄有噬犬，弟何欲？
		易之以百两，卒无禄？
		薄暮雷电，归何忧？
		厥严不奉，帝何求？
		伏匿穴处，爰何云？
		荆勋作师，夫何长？
		悟过改更，我又何言？
		吴光争国，久余是胜。
		何环穿自闾社丘陵，爰出子文？
		吾告堵敖以不长。
		何试上自予，忠名弥彰？
					`,
					'九歌': `
		东皇太一
		吉日兮辰良，穆将愉兮上皇；
		抚长剑兮玉珥，璆锵鸣兮琳琅；
		瑶席兮玉瑱，盍将把兮琼芳；
		蕙肴蒸兮兰藉，奠桂酒兮椒浆；
		扬枹兮拊鼓，疏缓节兮安歌；
		陈竽瑟兮浩倡；
		灵偃蹇兮姣服，芳菲菲兮满堂；
		五音纷兮繁会，君欣欣兮乐康。
		
		云中君
		浴兰汤兮沐芳，华采衣兮若英；
		灵连蜷兮既留，烂昭昭兮未央；
		謇将憺兮寿宫，与日月兮齐光；
		龙驾兮帝服，聊翱游兮周章；
		灵皇皇兮既降，猋远举兮云中；
		览冀洲兮有余，横四海兮焉穷；
		思夫君兮太息，极劳心兮忡忡；
		
		湘君
		君不行兮夷犹，蹇谁留兮中洲；
		美要眇兮宜修，沛吾乘兮桂舟；
		令沅湘兮无波，使江水兮安流；
		望夫君兮未来，吹参差兮谁思；
		驾飞龙兮北征，邅吾道兮洞庭；
		薜荔柏兮蕙绸，荪桡兮兰旌；
		望涔阳兮极浦，横大江兮扬灵；
		扬灵兮未极，女婵媛兮为余太息；
		横流涕兮潺湲，隐思君兮陫侧；
		桂棹兮兰枻，斵冰兮积雪；
		采薜荔兮水中，搴芙蓉兮木末；
		心不同兮媒劳，恩不甚兮轻绝；
		石濑兮浅浅，飞龙兮翩翩；
		交不忠兮怨长，期不信兮告余以不闲；
		朝骋骛兮江皋，夕弭节兮北渚；
		鸟次兮屋上，水周兮堂下；
		捐余玦兮江中，遗余佩兮醴浦；
		采芳洲兮杜若，将以遗兮下女；
		时不可兮再得，聊逍遥兮容与。
		
		湘夫人
		帝子降兮北渚，目眇眇兮愁予；
		袅袅兮秋风，洞庭波兮木叶下；
		登白薠兮骋望，与佳期兮夕张；
		鸟何萃兮苹中，罾何为兮木上？
		沅有茝兮醴有兰，思公子兮未敢言；
		荒忽兮远望，观流水兮潺湲；
		麋何食兮庭中，蛟何为兮水裔；
		朝驰余马兮江皋，夕济兮西澨；
		闻佳人兮召余，将腾驾兮偕逝；
		筑室兮水中，葺之兮荷盖；
		荪壁兮紫坛，播芳椒兮成堂；
		桂栋兮兰橑，辛夷楣兮药房；
		罔薜荔兮为帷，擗蕙櫋兮既张；
		白玉兮为镇，疏石兰兮为芳；
		芷葺兮荷屋，缭之兮杜衡；
		合百草兮实庭，建芳馨兮庑门；
		九嶷缤兮并迎，灵之来兮如云；
		捐余袂兮江中，遗余褋兮醴浦；
		搴汀洲兮杜若，将以遗兮远者；
		时不可兮骤得，聊逍遥兮容与！
		
		大司命
		广开兮天门，纷吾乘兮玄云；
		令飘风兮先驱，使涷雨兮洒尘；
		君回翔兮以下，逾空桑兮从女；
		纷总总兮九州，何寿夭兮在予；
		高飞兮安翔，乘清气兮御阴阳；
		吾与君兮齐速，导帝之兮九坑；
		灵衣兮被被，玉佩兮陆离；
		一阴兮一阳，众莫知兮余所为；
		折疏麻兮瑶华，将以遗兮离居；
		老冉冉兮既极，不寖近兮愈疏；
		乘龙兮辚辚，高驰兮冲天；
		结桂枝兮延伫，羌愈思兮愁人；
		愁人兮奈何，愿若今兮无亏；
		固人命兮有当，孰离合兮何为？
		
		少司命
		秋兰兮麋芜，罗生兮堂下；
		绿叶兮素华，芳菲菲兮袭予；
		夫人兮自有美子，荪何以兮愁苦；
		秋兰兮青青，绿叶兮紫茎；
		满堂兮美人，忽独与余兮目成；
		入不言兮出不辞，乘回风兮载云旗；
		悲莫悲兮生别离，乐莫乐兮新相知；
		荷衣兮蕙带，儵而来兮忽而逝；
		夕宿兮帝郊，君谁须兮云之际；
		与女沐兮咸池，曦女发兮阳之阿；
		望美人兮未来，临风怳兮浩歌；
		孔盖兮翠旌，登九天兮抚彗星；
		竦长剑兮拥幼艾，荪独宜兮为民正。
		
		东君
		暾将出兮东方，照吾槛兮扶桑；
		抚余马兮安驱，夜皎皎兮既明；
		驾龙輈兮乘雷，载云旗兮委蛇；
		长太息兮将上，心低徊兮顾怀；
		羌声色兮娱人，观者儋兮忘归；
		縆瑟兮交鼓，萧钟兮瑶簴；
		鸣篪兮吹竽，思灵保兮贤姱；
		翾飞兮翠曾，展诗兮会舞；
		应律兮合节，灵之来兮敝日；
		青云衣兮白霓裳，举长矢兮射天狼；
		操余弧兮反沦降，援北斗兮酌桂浆；
		撰余辔兮高驰翔，杳冥冥兮以东行。
		
		河伯
		与女游兮九河，冲风起兮水扬波；
		乘水车兮荷盖，驾两龙兮骖螭；
		登昆仑兮四望，心飞扬兮浩荡；
		日将暮兮怅忘归，惟极浦兮寤怀；
		鱼鳞屋兮龙堂，紫贝阙兮珠宫；
		灵何惟兮水中；
		乘白鼋兮逐文鱼，与女游兮河之渚；
		流澌纷兮将来下；
		子交手兮东行，送美人兮南浦；
		波滔滔兮来迎，鱼鳞鳞兮媵予。
		
		山鬼
		若有人兮山之阿，被薜荔兮带女萝；
		既含睇兮又宜笑，子慕予兮善窈窕；
		乘赤豹兮从文狸，辛夷车兮结桂旗；
		被石兰兮带杜衡，折芬馨兮遗所思；
		余处幽篁兮终不见天，路险难兮独后来；
		表独立兮山之上，云容容兮而在下；
		杳冥冥兮羌昼晦，东风飘兮神灵雨；
		留灵修兮憺忘归，岁既晏兮孰华予；
		采三秀兮于山间，石磊磊兮葛蔓蔓；
		怨公子兮怅忘归，君思我兮不得闲；
		山中人兮芳杜若，饮石泉兮荫松柏；
		君思我兮然疑作；
		雷填填兮雨冥冥，猿啾啾兮狖夜鸣；
		风飒飒兮木萧萧，思公子兮徒离忧。
		
		国殇
		操吴戈兮被犀甲，车错毂兮短兵接；
		旌蔽日兮敌若云，矢交坠兮士争先；
		凌余阵兮躐余行，左骖殪兮右刃伤；
		霾两轮兮絷四马，援玉枹兮击鸣鼓；
		天时怼兮威灵怒，严杀尽兮弃原野；
		出不入兮往不反，平原忽兮路超远；
		带长剑兮挟秦弓，首身离兮心不惩；
		诚既勇兮又以武，终刚强兮不可凌；
		身既死兮神以灵，魂魄毅兮为鬼雄。
		
		礼魂
		成礼兮会鼓，传芭兮代舞；
		姱女倡兮容与；
		春兰兮秋菊，长无绝兮终古。
					`,
				},
				init(player) {
					player.storage.dlds_wentian = {};
					let works = ['离骚', '天问', '九歌'], names = get.nameList(player);
					lib.translate.dlda_wentian_info = '';
					for (let work of works) {
						let skills = [];
						lib.translate.dlda_wentian_info += '<br>《' + work + '》：';
						for (let k in lib.skill) {
							let info = lib.translate[k];
							if (info && lib.skill.dlds_wentian.works[work].includes(info) && !lib.filter.skillDisabled(k, names)) {
								skills.push(k);
								if (lib.translate.dlda_wentian_info.at(-1) != '：') lib.translate.dlda_wentian_info += '、';
								lib.translate.dlda_wentian_info += info + '[' + k + ']';
							}
						}
						player.storage.dlds_wentian[work] = skills;
					}
				},
				trigger: { player: 'useCard1' },
				filter(event, player) {
					return !event.targets || !event.targets.some(i => player !== i);
				},
				forced: true,
				derivation: 'dlda_wentian',
				async content(event, trigger, player) {
					let list = ['离骚'];
					if (get.isLuckyStar(player) || get.rand(3) < 2) list.push('天问');
					if (get.isLuckyStar(player) || get.rand(3) < 1) list.push('九歌');
					const result = await player.chooseControl(list).set('prompt', '问天：请选择一部作品').set('ai', () => {
						return get.event('choice');
					}).set('choice', list.at(-1)).forResult();
					if (result.control) {
						player.popup(result.control);
						await game.asyncDelayx();
						let skill = player.storage.dlds_wentian[result.control].randomGet();
						if (!skill || player.hasSkill(skill)) {
							player.chat('无计可施吗');
							game.log(player, '#y问天失败');
						}
						else {
							player.popup(skill);
							player.addTempSkill(skill, { player: 'phaseUseBegin' });
						}
					}
				}
			},
			dlds_zhaohun: {
				audio: ['dclisao1.mp3', 'dcqiusuo1.mp3'],
				init() {
					_status.dld_zhaohun = [
						'yxs_baosi', 'yxs_bole', 'yxs_goujian', 'yxs_guiguzi', 'yxs_luban', 'yxs_meixi', 'yxs_mozi', 'yxs_sunwu'
					];
					game.broadcastAll((list) => {
						for (let i in list) {
							lib.character[i] = lib.characterPack.yxs[i];
						}
					}, lib.characterPack.yxs);
				},
				trigger: {
					global: ['loseAfter', 'loseAsyncAfter', 'cardsDiscardAfter', 'equipAfter'],
				},
				filter(event, player) {
					let cards = event.getd();
					for (let i of cards) {
						let num = get.number(i, false);
						if (num && num < 10 && !player.getStorage('dlds_zhaohun').includes(num)) return true;
					}
					return false;
				},
				forced: true,
				priority: -1,
				async content(event, trigger, player) {
					const cards = trigger.getd();
					for (let card of cards) {
						let num = get.number(card, false);
						if (num && num < 10 && !player.getStorage('dlds_zhaohun').includes(num)) {
							player.markAuto('dlds_zhaohun', [num]);
						}
					}
					if (player.getStorage('dlds_zhaohun').length < 9) return;
					player.storage.dlds_zhaohun = [];
					player.markSkill('dlds_zhaohun');
					let name = _status.dld_zhaohun.filter(i => {
						return !game.hasPlayer(cur => {
							return [cur.name1, cur.name2].includes(i);
						});
					}).randomGet();
					if (!name) {
						player.chat('无魂可招吗');
						game.log(player, '#y招魂失败');
						return;
					}
					game.log(player, '招回了', '#y' + get.translation(name), '的魂魄');
					let result = await player.chooseTarget('招魂：选择' + get.translation(name) + '要附身的角色', true)
						.set('prompt2', get.character(name, 3).map(i => {
							return (lib.translate[i] || '无名技能') + '：' + get.skillInfoTranslation(i);
						}).join('<br>'))
						.set('ai', target => {
							let att = get.attitude(get.event('player'), target), th = get.threaten(target);
							if (att * (get.event('ss') - target.getSkills(null, false, false).filter(i => {
								return lib.translate[i] && lib.translate[i + '_info'] && lib.skill[i] && !lib.skill[i].fixed;
							}).length) < 0) return -100;
							if (att > 0) return att / (1 + Math.abs(th - 1));
							return (1 - att) * (1 + Math.abs(th - 1));
						})
						.set('ss', get.character(name, 3).length)
						.forResult();
					if (result.bool) {
						let target = result.targets[0];
						player.logSkill('dlds_zhaohun_fushen', target);
						if (target.name2 != undefined) result = await target.chooseControl(target.name1, target.name2)
							.set('prompt', '请选择要更换为' + get.translation(name) + '的武将牌')
							.forResult();
						else result = { control: target.name1 };
						target.addSkill('dlds_zhaohun_relieved');
						if (target.storage.dlds_zhaohun_relieved[result.control]) {
							target.storage.dlds_zhaohun_relieved[name] = [
								game.countPlayer(),
								target.storage.dlds_zhaohun_relieved[result.control][1]
							];
							delete target.storage.dlds_zhaohun_relieved[result.control];
						}
						else target.storage.dlds_zhaohun_relieved[name] = [game.countPlayer(), result.control];
						await target.reinitCharacter(result.control, name);
					}
				},
				intro: {
					mark(dialog, storage, player) {
						dialog.content.style['overflow-x'] = 'visible';
						if (!storage || !storage.length) return '（尚不存在）';
						let list = player.getStorage('dlds_zhaohun');
						let core = document.createElement('div');
						core.style.width = '0';
						let centerX = -15,
							centerY = 80,
							radius = 80,
							radian = (Math.PI * 2) / 9,
							fulllist = ['壹', '貳', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
						for (let i = 0; i < 9; i++) {
							let td = document.createElement('div');
							if (list.includes(i + 1)) td.innerHTML = '<span class="greentext">' + fulllist[i];
							else td.innerHTML = '<span>' + fulllist[i] + '</span>';
							td.style.position = 'absolute';
							core.appendChild(td);
							td.style.left = centerX + radius * Math.sin(radian * i) + 'px';
							td.style.top = centerY - radius * Math.cos(radian * i) + 'px';
						}
						dialog.content.appendChild(core);
					},
				},
				group: ['dlds_zhaohun_die', 'dlds_zhaohun_fushen'],
				subSkill: {
					die: {
						trigger: {
							global: 'dieAfter'
						},
						silent: true,
						charlotte: true,
						content() {
							if (lib.character[trigger.player.name1]) _status.dld_zhaohun.add(trigger.player.name1);
							if (lib.character[trigger.player.name2]) _status.dld_zhaohun.add(trigger.player.name2);
						},
						sub: true
					},
					fushen: {
						audio: 'dclisao2.mp3',
						charlotte: true,
						skillAnimation: true,
						animationColor: 'water'
					},
					relieved: {
						init(player) {
							player.storage.dlds_zhaohun_relieved = {};
						},
						onremove(player) {
							delete player.storage.dlds_zhaohun_relieved;
						},
						trigger: {
							global: 'phaseEnd'
						},
						silent: true,
						charlotte: true,
						async content(event, trigger, player) {
							let have = 0;
							for (let name in player.storage.dlds_zhaohun_relieved) {
								player.storage.dlds_zhaohun_relieved[name][0]--;
								if (player.storage.dlds_zhaohun_relieved[name][0] > 0) have++;
								else {
									await player.reinitCharacter(name, player.storage.dlds_zhaohun_relieved[name][1]);
									delete player.storage.dlds_zhaohun_relieved[name];
								}
							}
							if (!have) player.removeSkill('dlds_zhaohun_relieved');
						}
					}
				}
			},
			dlds_juanlv: {
				inherit: 'cixiong_skill',
				equipSkill: false,
				filter(event, player) {
					return player.differentSexFrom(event.target);
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (player.differentSexFrom(target)) return [1, 1];
						}
					}
				}
			}
		},
		dynamicTranslate: {
		},
		translate: {
			dld: '大乱斗',
			dragon_boat: '<font color=#008000>端午节专属</font>',

			dld_quyuan: '屈平',
			dld_quyuan_ab: '屈原',
			dlds_wentian: '问天',
			dlds_wentian_info: `
				锁定技，你使用牌时，若此牌没有指定其他角色为目标，你从系统随机给出的作品中选择一部作品，
				你随机获得一项该作品中包含的技能名的技能直到你下个出牌阶段开始。
			`,
			dlda_wentian: '〖问天〗技能池',
			dlda_wentian_info: `
				<br>《<font color=#FFFF00>离骚</font>》：
				八龙[clanbalong]、调度[diaodu]、调度[spdiaodu]、调度[mbdiaodu]、调度[xindiaodu]、苟得[olgoude]、吉占[oljizhan]、
				兰芷[lanzhi]、论道[nhlundao]、落英[luoying]、落英[reluoying]、求索[dcqiusuo]、先驱[xianqu]、谣诼[scsyaozhuo]、
				<font color=#FF0000>止息[rezhixi]、止息[new_zhixi]、止息[mbzhixi]</font>、
				<font color=#8DD8FF>乱[luan]、圣[sheng]、风[feng]</font>
				<br>《<font color=#FFFF00>天问</font>》：
				朝争[jsrgchaozheng]、天命[tianming]、阴阳[yinyang]、
				<font color=#FF0000>伏匿[jsrgfuni]</font>、
				<font color=#FFFF00>辅弼[mjfubi]、辅弼[refubi]、辅弼[fubi]</font>、
				<font color=#8DD8FF>不死[busi]、乱[luan]、圣[sheng]</font>
				<br>《<font color=#FFFF00>九歌</font>》：
				蔽日[biri]、短兵[duanbing]、短兵[reduanbing]、短兵[dddduanbing]、飞扬[olfeiyang]、飞扬[jsrgfeiyang]、灵怒[lingnu]、
				灵偃[lingyan]、霓裳[nichang]、先驱[xianqu]、媵予[dcyingyu]、阴阳[yinyang]、
				<font color=#8DD8FF>风[feng]</font>
				<br>其中，<font color=#FF0000>红字技能</font>有负面效果，<font color=#FFFF00>黄字技能</font>为无效技能，
				<font color=#8DD8FF>蓝字技能</font>单机时可能不会遇到。
			`,
			dlds_zhaohun: '招魂',
			dlds_zhaohun_info: `
				锁定技，有点数的牌进入弃牌堆后，若其中包含你未记录过的小于10的点数，你记录之。
				然后若你记录了至少9个点数，清除所有记录并随机“招魂”一张武将牌，你令一名角色将一张武将牌更换为此武将牌直至下X个回合结束
				（X为存活角色数+1）。
			`,
			dlds_zhaohun_append: `
				<span style="font-family:yuanli">可“招魂”武将：褒姒、伯乐、勾践、鬼谷子、鲁班、妺喜、墨子、孙武和阵亡武将</span>
			`,
			dlds_zhaohun_fushen: '招魂',
		},
	}
	return dld;
});
