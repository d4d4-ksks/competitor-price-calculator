import { useMemo, useState } from 'react'
import {
  Boxes, BriefcaseBusiness, Calculator, ChevronDown, ChevronLeft, ChevronRight,
  CircleGauge, Download, Filter, Gift, LayoutGrid, MapPin, Menu, Pencil,
  Percent, Sparkles, Truck, Upload, X,
} from 'lucide-react'

type Row = {
  product: string; regular: number; competitorRegular: number; promo: number;
  competitorPromo: number; pi: string; discount: number; city: string; stores: number;
}

const rows: Row[] = [
  { product: 'Колбаса вареная Папа может сочная, 400 г', regular: 290, competitorRegular: 285, promo: 225, competitorPromo: 216, pi: '1,04', discount: 22, city: 'Москва', stores: 296 },
  { product: 'Колбаса вареная Сагуны Эстонская 250 г', regular: 219, competitorRegular: 220, promo: 145, competitorPromo: 136, pi: '1,07', discount: 33, city: 'Москва', stores: 296 },
  { product: 'Колбаса вареная Клинский Молочная нарезка, 190 г', regular: 449, competitorRegular: 420, promo: 275, competitorPromo: 259, pi: '1,06', discount: 38, city: 'Москва', stores: 296 },
  { product: 'Колбаса вареная Окраина Докторская 400 г', regular: 479, competitorRegular: 260, promo: 385, competitorPromo: 334, pi: '1,15', discount: 19, city: 'Москва', stores: 296 },
]

const nav = [
  [LayoutGrid, 'Рабочее место'], [Truck, 'Поставщики'], [BriefcaseBusiness, 'Заявки'],
  [Sparkles, 'Кампании'], [MapPin, 'Кластеры'], [Percent, 'Параметры скидок'],
  [Calculator, 'Калькулятор промо'], [Gift, 'Промо'],
] as const

const filters = ['Товар', 'География', 'Категория 4', 'Поставщик', 'Маржа товара акц.', 'Сеть', 'PI']

function Sidebar() {
  return <aside className="sidebar">
    <div className="brand"><span className="brand-mark"><span /></span><b>Промотрон</b></div>
    <nav>{nav.map(([Icon, label]) => <button className={label === 'Калькулятор промо' ? 'active' : ''} key={label}><Icon size={17}/><span>{label}</span></button>)}</nav>
    <div className="account"><span>eaterekhova@ecom.tech</span><ChevronLeft size={16}/></div>
  </aside>
}

function EditPanel({ row, onClose }: { row: Row; onClose: () => void }) {
  const [tab, setTab] = useState<'manual' | 'competitors'>('manual')
  const [regular, setRegular] = useState(String(row.regular))
  const [promo, setPromo] = useState(String(row.promo))
  return <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
    <section className="drawer">
      <header><div><span className="eyebrow">Редактирование параметров</span><h2>{row.product}</h2></div><button aria-label="Закрыть" onClick={onClose}><X size={22}/></button></header>
      <div className="drawer-tabs">
        <button className={tab === 'manual' ? 'active' : ''} onClick={() => setTab('manual')}>Ручное редактирование</button>
        <button className={tab === 'competitors' ? 'active' : ''} onClick={() => setTab('competitors')}>Расчёт под конкурентов</button>
      </div>
      <div className="drawer-body">
        {tab === 'manual' ? <>
          <h3>Цена и параметры промо</h3>
          <div className="field-grid">
            <label>Цена полки рег., ₽<input value={regular} onChange={e => setRegular(e.target.value)}/></label>
            <label>Цена полки акц., ₽<input value={promo} onChange={e => setPromo(e.target.value)}/></label>
            <label>Скидка, %<input value={row.discount} readOnly/></label>
            <label>Коэффициент эластичности<input defaultValue="1,5"/></label>
          </div>
          <h3>Закупочные цены</h3>
          <div className="field-grid"><label>Цена закупки рег., ₽<input defaultValue="200"/></label><label>Цена закупки акц., ₽<input defaultValue="190"/></label></div>
        </> : <>
          <div className="info">Укажите ценовой эшелон и позицию относительно конкурентов — промо-цена рассчитается автоматически.</div>
          <h3>Регулярная цена</h3>
          <label>Ценовой эшелон<select defaultValue="1"><option value="1">1 эшелон</option><option value="2">2 эшелон</option><option value="3">3 эшелон</option></select></label>
          <div className="comparison"><span>Цена конкурента</span><b>{row.competitorRegular} ₽</b></div>
          <h3>Промо-цена</h3>
          <label>Ценовой эшелон<select defaultValue="1"><option value="1">1 эшелон</option><option value="2">2 эшелон</option><option value="3">3 эшелон</option></select></label>
          <div className="comparison"><span>Цена конкурента</span><b>{row.competitorPromo} ₽</b></div>
        </>}
      </div>
      <footer><button className="secondary" onClick={onClose}>Отменить</button><button className="primary" onClick={onClose}>Сохранить</button></footer>
    </section>
  </div>
}

export function App() {
  const [scope, setScope] = useState<'cities' | 'network'>('cities')
  const [selected, setSelected] = useState<Row | null>(null)
  const [query, setQuery] = useState('')
  const visibleRows = useMemo(() => rows.filter(r => r.product.toLowerCase().includes(query.toLowerCase())), [query])
  return <div className="app">
    <Sidebar />
    <main>
      <div className="topbar"><h1>Калькулятор параметров промо</h1><button className="upload"><Upload size={18}/>Загрузить шаблон для расчёта</button></div>
      <div className="scope-tabs"><button className={scope === 'cities' ? 'active' : ''} onClick={() => setScope('cities')}>По городам</button><button className={scope === 'network' ? 'active' : ''} onClick={() => setScope('network')}>Сеть</button></div>
      <section className="card">
        <div className="card-title"><b>Параметры промо</b><div className="actions"><button className="icon-button"><Filter size={18}/></button><button><Download size={18}/>Скачать {scope === 'cities' ? '(с разбивкой по городам)' : '(по сети)'}</button><button className="chevron"><ChevronDown size={17}/></button></div></div>
        <div className="filter-row">{filters.map((f, i) => <button key={f} className={i === 0 && query ? 'selected' : ''} onClick={() => i === 0 && setQuery(query ? '' : 'Папа')}>{f}<ChevronDown size={15}/></button>)}</div>
        <div className="table-scroll"><table>
          <thead><tr><th className="check"><input type="checkbox"/></th><th className="product">Товар</th><th>Цена полки рег., ₽</th><th>Конкуренты рег., ₽</th><th>Цена полки акц., ₽</th><th>Конкуренты акц., ₽</th><th>PI</th><th>Скидка, %</th><th>География</th><th>Кол-во ЦФЗ</th><th>Категория 4</th><th>Поставщик</th></tr></thead>
          <tbody>{visibleRows.map(row => <tr key={row.product}><td className="check"><input type="checkbox"/></td><td className="product">{row.product}</td><td>{row.regular}<button className="edit" aria-label={`Редактировать ${row.product}`} onClick={() => setSelected(row)}><Pencil size={17}/></button></td><td><a>{row.competitorRegular}</a> <small>1 эшелон</small></td><td>{row.promo}<button className="edit" onClick={() => setSelected(row)}><Pencil size={17}/></button></td><td><a>{row.competitorPromo}</a> <small>1 эшелон</small></td><td>{row.pi}</td><td>{row.discount}</td><td>{row.city}</td><td>{row.stores}</td><td>Колбаса</td><td>ООО Антарктида</td></tr>)}</tbody>
        </table></div>
        <div className="pagination"><span>1–{visibleRows.length} из {visibleRows.length}</span><div><ChevronLeft size={17}/><b>1</b><ChevronRight size={17}/></div></div>
      </section>
    </main>
    {selected && <EditPanel row={selected} onClose={() => setSelected(null)}/>} 
  </div>
}
