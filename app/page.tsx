'use client'

import { useState } from 'react'
import { BookOpen, Library, Moon, ShieldCheck, Sparkles } from 'lucide-react'

const tabs = [
  { label: 'Keşfet', icon: BookOpen },
  { label: 'Kitaplık', icon: Library },
  { label: 'Karakterler', icon: Sparkles },
  { label: 'Ebeveyn', icon: ShieldCheck },
]

const adventures = [
  { title: 'Kayıp Ay Işığı', tag: 'Sakin bir masal', tone: 'bg-[#fff3c9]', art: '🌙' },
  { title: 'Ormanın Sırrı', tag: 'Merak dolu', tone: 'bg-[#dcefe9]', art: '🌿' },
  { title: 'Bulutların Üstünde', tag: 'Uyku öncesi', tone: 'bg-[#f8dfd5]', art: '☁️' },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState('Keşfet')
  const [saved, setSaved] = useState(false)

  return (
    <main className="min-h-screen bg-white px-3 py-5 text-slate-800 sm:px-6">
      <div className="relative mx-auto flex h-[850px] max-w-[400px] flex-col overflow-hidden rounded-[3rem] border-[12px] border-slate-900 bg-white shadow-2xl">
        <header className="z-20 flex shrink-0 items-center justify-between bg-white px-5 pb-4 pt-8">
          <h1 className="text-[23px] font-black tracking-[-0.055em] text-slate-800">Merhaba Can! <span aria-hidden="true">👋</span></h1>
          <button aria-label="Profilini aç" className="grid size-11 place-items-center rounded-full bg-[#f6d4bd] text-xl shadow-[0_5px_15px_rgba(80,80,70,0.12)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">🧒</button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <section aria-labelledby="hero-heading" className="pt-2">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#49a99a]">Bugünün seçkisi</p>
                <h2 id="hero-heading" className="mt-1 text-[21px] font-black tracking-[-0.045em]">Günün Masalı</h2>
              </div>
              <span className="rounded-full bg-[#fff3cf] px-3 py-1.5 text-[10px] font-black text-[#c28b3c]">5 DK</span>
            </div>
            <article className="relative min-h-[370px] overflow-hidden rounded-[1.65rem] bg-[#b9dcd6] shadow-[0_14px_28px_rgba(45,65,62,0.12)]">
              <div className="absolute -right-10 -top-12 size-48 rounded-full bg-[#f7dba8]" />
              <div className="absolute -bottom-12 -left-10 size-52 rounded-full bg-[#8dbdb6]" />
              <div className="absolute left-8 top-16 text-2xl opacity-80">✦</div>
              <div className="absolute right-16 top-28 text-sm opacity-80">✦</div>
              <div className="relative flex h-[245px] items-center justify-center">
                <div className="flex flex-col items-center drop-shadow-sm"><Moon className="mb-1 size-20 fill-[#fff4bd] text-[#fff4bd]" strokeWidth={1.2} /><span className="text-[70px] leading-none">🛸</span></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 rounded-t-[1.5rem] bg-white px-5 pb-5 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#e58c62]">MACERA</p><h3 className="mt-1 text-[28px] font-black leading-none tracking-[-0.06em]">Uzaylı Zumi</h3><p className="mt-2 text-xs font-medium text-slate-400">Yıldızların arasındaki küçük gezgin</p></div>
                  <button className="mt-2 rounded-full bg-[#efa268] px-4 py-2 text-xs font-black text-white shadow-sm transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500">Oku</button>
                </div>
              </div>
            </article>
          </section>

          <section aria-labelledby="adventures-heading" className="pt-7">
            <div className="mb-3 flex items-center justify-between"><h2 id="adventures-heading" className="text-[21px] font-black tracking-[-0.045em]">Yeni Maceralar</h2><span className="text-xs font-bold text-[#49a99a]">Tümünü gör</span></div>
            <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {adventures.map((item) => <article key={item.title} className={`min-w-[142px] flex-1 rounded-2xl ${item.tone} p-3`}><div className="grid h-[92px] place-items-center rounded-xl bg-white/45 text-[48px]">{item.art}</div><p className="mt-3 text-[13px] font-black leading-tight">{item.title}</p><p className="mt-1 text-[10px] font-semibold text-slate-500">{item.tag}</p></article>)}
            </div>
          </section>

          <section aria-labelledby="characters-heading" className="pt-7"><h2 id="characters-heading" className="mb-3 text-[21px] font-black tracking-[-0.045em]">Karakterler</h2><div className="grid grid-cols-2 gap-3"><article className="rounded-2xl bg-[#f8e7bc] p-3"><div className="grid h-24 place-items-center rounded-xl bg-[#ffeecb] text-[58px]">🦉</div><p className="mt-2 text-[13px] font-black">Bilge Baykuş</p></article><article className="rounded-2xl bg-[#f7d5c7] p-3"><div className="grid h-24 place-items-center rounded-xl bg-[#fbe3d9] text-[58px]">🦊</div><p className="mt-2 text-[13px] font-black">Cesur Tilki</p></article></div></section>

          <p className="py-9 text-center text-xs font-semibold leading-relaxed text-slate-400">Bugünlük önerilerimiz bu kadar! <span aria-hidden="true">🦊</span><br /><span className="text-[#49a99a]">Kitaplığına göz at.</span></p>
        </div>

        <nav aria-label="Ana menü" className="z-20 flex shrink-0 items-center justify-around border-t border-slate-100 bg-white px-1 pb-5 pt-3">
          {tabs.map(({ label, icon: Icon }) => { const isActive = activeTab === label; return <button key={label} onClick={() => setActiveTab(label)} aria-current={isActive ? 'page' : undefined} className={`flex min-w-[72px] flex-col items-center gap-1 rounded-xl px-1 py-1 text-[9px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${isActive ? 'text-[#39a391]' : 'text-slate-300 hover:text-slate-500'}`}><Icon className="size-[21px]" strokeWidth={isActive ? 2.5 : 2} /><span>{label}</span></button> })}
        </nav>
      </div>
    </main>
  )
}
