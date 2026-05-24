import type { ArchetypeSlug } from '../reveal/parse'

// Static feed-card artifact (Sprint 1.3, decision 2026-05-24): 60 idea-cards,
// exactly 6 per archetype (one of each kind). Authored by the architect; this is
// a content artifact (like the archetype taxonomy / images), not runtime LLM
// output — runtime LLM cost on the cards is zero. Two users of the same archetype
// see the same cards; the personalizing layer is the generated Volly comment (Ф2).
//
// `id` (<archetype>-NN) is stable and doubles as the key into
// user_feed_comments.comments jsonb and metadata.card_id of Ф4 likes.
// ArchetypeSlug is imported (not redefined) so the compiler keeps the card set
// consistent with the canonical 10-slug enum in ../reveal/parse.

export type FeedCardKind = 'свидание' | 'вечер' | 'вылазка' | 'кино' | 'музыка' | 'ритуал'

export interface FeedCard {
  id: string
  archetype: ArchetypeSlug
  kind: FeedCardKind
  title: string
  body: string
}

export const FEED_CARDS: readonly FeedCard[] = [
  { id: 'quiet_evenings-01', archetype: 'quiet_evenings', kind: 'свидание', title: 'Готовим ужин вдвоём', body: 'Никакой брони и дресс-кода: простой рецепт, бокал вина, кухня только ваша. Вечер, который никуда не торопится.' },
  { id: 'quiet_evenings-02', archetype: 'quiet_evenings', kind: 'вечер', title: 'Один свет, одна книга', body: 'Тёплая лампа, плед и роман, до которого давно не доходили руки — например, «Стоунер» Джона Уильямса, тихая книга про тихую жизнь.' },
  { id: 'quiet_evenings-03', archetype: 'quiet_evenings', kind: 'вылазка', title: 'Кофейня, где вас знают', body: 'Маленькое место в двух шагах от дома, где бариста помнит заказ. Уют — это когда не нужно ничего объяснять.' },
  { id: 'quiet_evenings-04', archetype: 'quiet_evenings', kind: 'кино', title: 'Медленное кино под дождь', body: '«Патерсон» Джима Джармуша — неделя из жизни водителя автобуса, который пишет стихи. Фильм-настроение, где тишина важнее сюжета.' },
  { id: 'quiet_evenings-05', archetype: 'quiet_evenings', kind: 'музыка', title: 'Вечер винила', body: 'Bill Evans, «Sunday at the Village Vanguard» — джаз, который не требует внимания, а составляет компанию. Поставить и не снимать с повтора.' },
  { id: 'quiet_evenings-06', archetype: 'quiet_evenings', kind: 'ритуал', title: 'Чай в один и тот же час', body: 'Каждый вечер — одна чашка, одно кресло, десять минут тишины перед сном. Повторяемость здесь не скука, а форма заботы о себе.' },

  { id: 'midnight_wanderer-01', archetype: 'midnight_wanderer', kind: 'свидание', title: 'Прогулка после полуночи', body: 'Город пустеет и становится вашим: маршрут наугад, круглосуточная пекарня по пути, никакой спешки до рассвета.' },
  { id: 'midnight_wanderer-02', archetype: 'midnight_wanderer', kind: 'вечер', title: 'Смена района', body: 'Выйти в часть города, где давно не были, и просто побродить. Поздний час делает знакомое незнакомым.' },
  { id: 'midnight_wanderer-03', archetype: 'midnight_wanderer', kind: 'вылазка', title: 'Бар, открытый допоздна', body: 'Маленькое место с приглушённым светом и барной стойкой, где засиживаются за разговором, а не за громкой музыкой.' },
  { id: 'midnight_wanderer-04', archetype: 'midnight_wanderer', kind: 'кино', title: 'Кино про ночной город', body: '«Соучастник» Майкла Манна — одна ночь, один город, который светится. Кино, где темнота не пугает, а завораживает.' },
  { id: 'midnight_wanderer-05', archetype: 'midnight_wanderer', kind: 'музыка', title: 'Саундтрек ночных улиц', body: 'Burial, «Untrue» — призрачная электроника, будто записанная в пустом ночном городе. Наушники — и улицы звучат иначе.' },
  { id: 'midnight_wanderer-06', archetype: 'midnight_wanderer', kind: 'ритуал', title: 'Последний выход дня', body: 'Перед сном — десять минут на улице, без телефона. Ночной воздух как точка, на которой закрывается день.' },

  { id: 'life_of_gathering-01', archetype: 'life_of_gathering', kind: 'свидание', title: 'Двойное свидание', body: 'Позвать ещё одну пару и превратить вечер в маленькое событие. Энергия компании — ваша стихия, так используйте её.' },
  { id: 'life_of_gathering-02', archetype: 'life_of_gathering', kind: 'вечер', title: 'Ужин на большом столе', body: 'Собрать друзей, с кем давно не виделись, заказать заметно больше еды, чем нужно, и не считать часы.' },
  { id: 'life_of_gathering-03', archetype: 'life_of_gathering', kind: 'вылазка', title: 'Туда, где шумно и живо', body: 'Рынок с уличной едой, фудкорт, оживлённая площадь — место, где много людей и движения, и вы в самом центре.' },
  { id: 'life_of_gathering-04', archetype: 'life_of_gathering', kind: 'кино', title: 'Кино для компании', body: '«Большой Лебовски» братьев Коэн — культовая комедия, которую смотрят вместе и потом цитируют годами.' },
  { id: 'life_of_gathering-05', archetype: 'life_of_gathering', kind: 'музыка', title: 'Концерт, снятый на плёнку', body: 'Talking Heads, «Stop Making Sense» — концерт-фильм, заряженный коллективной энергией. Включить громко, когда все в сборе.' },
  { id: 'life_of_gathering-06', archetype: 'life_of_gathering', kind: 'ритуал', title: 'Свой день недели', body: 'Назначить вечер, который всегда ваш и друзей. Регулярность превращает встречи из «когда-нибудь» в «как всегда».' },

  { id: 'horizon_seeker-01', archetype: 'horizon_seeker', kind: 'свидание', title: 'Свидание за городом', body: 'Сесть в электричку или машину и уехать туда, где заканчивается город. Горизонт как фон для разговора.' },
  { id: 'horizon_seeker-02', archetype: 'horizon_seeker', kind: 'вечер', title: 'Закат с высокой точки', body: 'Найти крышу, холм или мост с видом и встретить там закат. Открытое пространство меняет масштаб мыслей.' },
  { id: 'horizon_seeker-03', archetype: 'horizon_seeker', kind: 'вылазка', title: 'Маршрут, который не знаете', body: 'Тропа, парк или район, где ещё не были. Цель не дойти, а идти и смотреть по сторонам.' },
  { id: 'horizon_seeker-04', archetype: 'horizon_seeker', kind: 'кино', title: 'Кино про дорогу', body: '«Дикая» с Риз Уизерспун — 1700 километров пешком в одиночку. Кино про то, как движение лечит.' },
  { id: 'horizon_seeker-05', archetype: 'horizon_seeker', kind: 'музыка', title: 'Музыка для дороги', body: 'Bon Iver, «For Emma, Forever Ago» — альбом, записанный в зимней хижине вдали от всех. В пути звучит точнее всего.' },
  { id: 'horizon_seeker-06', archetype: 'horizon_seeker', kind: 'ритуал', title: 'Одна новая точка в неделю', body: 'Каждую неделю — одно место, где никогда не были, пусть даже соседняя улица. Маленькое исследование как привычка.' },

  { id: 'depth_seeker-01', archetype: 'depth_seeker', kind: 'свидание', title: 'Разговор без отвлечений', body: 'Тихое место, два кресла, телефоны убраны. Свидание, где главное событие — сам разговор.' },
  { id: 'depth_seeker-02', archetype: 'depth_seeker', kind: 'вечер', title: 'Вечер одной большой идеи', body: 'Взять тему, которая давно занимает, и провести вечер только с ней — книга, лекция, длинный текст. Глубина вместо ширины.' },
  { id: 'depth_seeker-03', archetype: 'depth_seeker', kind: 'вылазка', title: 'Тихий музей в будний день', body: 'Прийти, когда залы почти пусты, и задержаться у одной-двух работ. Не обойти всё, а вглядеться.' },
  { id: 'depth_seeker-04', archetype: 'depth_seeker', kind: 'кино', title: 'Кино, которое не отпускает', body: '«Перед закатом» Ричарда Линклейтера — два человека, один разговор длиной в фильм. Кино для тех, кто любит вглядываться в людей.' },
  { id: 'depth_seeker-05', archetype: 'depth_seeker', kind: 'музыка', title: 'Альбом целиком, без перемоток', body: 'Nils Frahm, «Spaces» — современная классика, которую слушают от начала до конца, как читают книгу.' },
  { id: 'depth_seeker-06', archetype: 'depth_seeker', kind: 'ритуал', title: 'Страницы перед сном', body: 'Каждый вечер — несколько страниц чего-то непростого, без цели «дочитать». Медленное чтение как разговор с собой.' },

  { id: 'impression_collector-01', archetype: 'impression_collector', kind: 'свидание', title: 'Выставка вдвоём', body: 'Сходить на экспозицию, о которой говорят, и потом за кофе разобрать, что зацепило. Впечатление, которое хочется обсудить.' },
  { id: 'impression_collector-02', archetype: 'impression_collector', kind: 'вечер', title: 'Вечер кураторского вкуса', body: 'Один тщательно выбранный фильм, одно вино, один альбом. Не количество, а точность выбора.' },
  { id: 'impression_collector-03', archetype: 'impression_collector', kind: 'вылазка', title: 'Район галерей и витрин', body: 'Прогулка по части города с галереями, концепт-сторами и красивыми витринами — как по музею под открытым небом.' },
  { id: 'impression_collector-04', archetype: 'impression_collector', kind: 'кино', title: 'Кино как визуальное искусство', body: '«Великая красота» Паоло Соррентино — Рим, снятый как живопись. Фильм, где каждый кадр хочется рассматривать.' },
  { id: 'impression_collector-05', archetype: 'impression_collector', kind: 'музыка', title: 'Альбом с безупречной атмосферой', body: 'Beach House, «Teen Dream» — дрим-поп, собранный до последней детали. Музыка как тщательно выстроенное настроение.' },
  { id: 'impression_collector-06', archetype: 'impression_collector', kind: 'ритуал', title: 'Одно впечатление в неделю', body: 'Каждую неделю — одно событие культуры: выставка, фильм в кино, концерт. Коллекция впечатлений, собранная вручную.' },

  { id: 'rhythm_architect-01', archetype: 'rhythm_architect', kind: 'свидание', title: 'Свидание по плану, который радует', body: 'Выбрать место и время заранее, забронировать, предвкушать. Предвкушение — половина удовольствия.' },
  { id: 'rhythm_architect-02', archetype: 'rhythm_architect', kind: 'вечер', title: 'Вечер с понятной структурой', body: 'Час на одно, час на другое, без хаоса. Размеченный вечер ощущается полным, а не убегающим.' },
  { id: 'rhythm_architect-03', archetype: 'rhythm_architect', kind: 'вылазка', title: 'Любимый маршрут снова', body: 'То же кафе, тот же парк, тот же порядок. Повторение здесь — не скука, а отлаженный ритм.' },
  { id: 'rhythm_architect-04', archetype: 'rhythm_architect', kind: 'кино', title: 'Кино про мастерство и систему', body: '«Джиро мечтает о суши» — документальный портрет мастера, для которого повторение одного дела стало путём к совершенству.' },
  { id: 'rhythm_architect-05', archetype: 'rhythm_architect', kind: 'музыка', title: 'Музыка с чётким пульсом', body: 'Steve Reich, «Music for 18 Musicians» — минимализм на повторяющихся паттернах. Структура, которую слышно.' },
  { id: 'rhythm_architect-06', archetype: 'rhythm_architect', kind: 'ритуал', title: 'Воскресное планирование', body: 'Каждое воскресенье — полчаса разметить неделю. Маленький ритуал, после которого дни складываются сами.' },

  { id: 'free_spirit-01', archetype: 'free_spirit', kind: 'свидание', title: 'Свидание без плана', body: 'Встретиться без брони и маршрута, сворачивать туда, куда захочется в моменте. План — это то, от чего вы отдыхаете.' },
  { id: 'free_spirit-02', archetype: 'free_spirit', kind: 'вечер', title: 'Вечер, решённый монеткой', body: 'Дать случаю выбрать: открыть карту наугад, бросить монетку, пойти на первый интересный звук.' },
  { id: 'free_spirit-03', archetype: 'free_spirit', kind: 'вылазка', title: 'Куда приведёт улица', body: 'Выйти из дома без цели и идти за тем, что цепляет взгляд. Лучшие места редко попадают в списки.' },
  { id: 'free_spirit-04', archetype: 'free_spirit', kind: 'кино', title: 'Кино, ломающее форму', body: '«Амели» Жан-Пьера Жёне — фантазийный, яркий, нелинейный Париж. Кино, которое разрешает себе всё.' },
  { id: 'free_spirit-05', archetype: 'free_spirit', kind: 'музыка', title: 'Музыка вне жанра', body: 'Камаси Вашингтон, «The Epic» — джаз, который не помещается в рамки. Три часа свободы.' },
  { id: 'free_spirit-06', archetype: 'free_spirit', kind: 'ритуал', title: 'Антиритуал', body: 'Раз в неделю сделать что-то впервые — еду, маршрут, занятие. Единственное правило: ничего не повторять дважды.' },

  { id: 'warm_circle-01', archetype: 'warm_circle', kind: 'свидание', title: 'Уютный ужин на двоих', body: 'Тёплое место с мягким светом, неспешная еда, разговор обо всём. Свидание как объятие, а не как событие.' },
  { id: 'warm_circle-02', archetype: 'warm_circle', kind: 'вечер', title: 'Вечер с самыми близкими', body: 'Позвать двух-трёх своих, сварить что-то простое и провести вечер так, будто времени бесконечно много.' },
  { id: 'warm_circle-03', archetype: 'warm_circle', kind: 'вылазка', title: 'Кафе с тёплым светом', body: 'Маленькое место, где не громко и не пусто, удобные кресла и пледы. Туда, где хочется задержаться.' },
  { id: 'warm_circle-04', archetype: 'warm_circle', kind: 'кино', title: 'Тёплое кино для своих', body: '«Маленькие женщины» Греты Гервиг — фильм про близость, дом и людей, которые держатся друг за друга.' },
  { id: 'warm_circle-05', archetype: 'warm_circle', kind: 'музыка', title: 'Музыка домашнего вечера', body: 'Norah Jones, «Come Away with Me» — мягкий тёплый альбом, под который хорошо разговаривать вполголоса.' },
  { id: 'warm_circle-06', archetype: 'warm_circle', kind: 'ритуал', title: 'Звонок без повода', body: 'Раз в неделю позвонить кому-то из близких просто так. Тёплые связи держатся на маленьких регулярных касаниях.' },

  { id: 'urban_romantic-01', archetype: 'urban_romantic', kind: 'свидание', title: 'Столик у окна', body: 'Маленький столик с видом на вечернюю улицу, неспешный ужин. Город как декорация, а не как суета.' },
  { id: 'urban_romantic-02', archetype: 'urban_romantic', kind: 'вечер', title: 'Вечерняя прогулка по центру', body: 'Пройтись по красивым улицам в час, когда зажигаются огни. Смаковать город, как смакуют хороший кофе.' },
  { id: 'urban_romantic-03', archetype: 'urban_romantic', kind: 'вылазка', title: 'Кафе с видом на улицу', body: 'Место у окна, где можно долго сидеть с чашкой и смотреть на прохожих. Городское наблюдение как тихое удовольствие.' },
  { id: 'urban_romantic-04', archetype: 'urban_romantic', kind: 'кино', title: 'Кино — признание городу', body: '«Полночь в Париже» Вуди Аллена — город как любовь и как мечта. Романтика улиц, переведённая в кадр.' },
  { id: 'urban_romantic-05', archetype: 'urban_romantic', kind: 'музыка', title: 'Саундтрек вечернего города', body: 'Chet Baker, «Chet Baker Sings» — хрупкий вокал и труба, под которые вечерний город становится чёрно-белым кино.' },
  { id: 'urban_romantic-06', archetype: 'urban_romantic', kind: 'ритуал', title: 'Кофе в том же кафе', body: 'Каждую неделю — чашка в любимом городском месте, всегда за тем же столиком. Маленький роман с городом длиною в привычку.' },
]
