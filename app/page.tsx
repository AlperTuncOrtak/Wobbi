'use client'

import { useState } from 'react'
import { BookOpen, ChevronRight, Home, Sparkles, UserRound } from 'lucide-react'

const characters = [
  {
    name: 'Bilge Baykuş',
    role: 'Rehber',
    tone: 'bg-[#d9e9e8]',
    icon: '🦉',
  },
  {
    name: 'Cesur Tilki',
    role: 'Kaşif',
    tone: 'bg-[#f7dfc8]',
    icon: '🦊',
  },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState('Keşfet')

  return (
    <main className="min-h-screen bg-[#f3eee7] px-3 py-5 text-slate-800 sm:px-6">
      <div className="relative mx-auto flex h-[850px] max-w-[400px] flex-col overflow-hidden rounded-[3rem] border-[12px] border-slate-900 bg-[#fbf8f3] shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_5%,rgba(250,221,187,0.5),transparent_28%),radial-gradient(circle_at_0%_45%,rgba(216,234,232,0.55),transparent_30%)]" />

        <div className="relative flex min-h-0 flex-1 flex-col px-5 pb-5 pt-8">
          <header className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Hoş geldin, Ada</p>
              <h1 className="text-[25px] font-black tracking-[-0.04em] text-slate-800">Günün Masalları <span aria-hidden="true">🦊</span></h1>
            </div>
            <button aria-label="Profilini aç" className="grid size-11 place-items-center rounded-full border-4 border-white bg-[#f3c9a5] text-xl shadow-[0_6px_15px_rgba(109,77,47,0.12)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800">🧒</button>
          </header>

          <section className="mt-6" aria-labelledby="story-heading">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Bugünün seçkisi</p>
                <h2 id="story-heading" className="mt-1 text-lg font-extrabold tracking-tight">Birlikte keşfet</h2>
              </div>
              <button className="flex items-center gap-1 pb-1 text-xs font-bold text-[#d78358]">Tümü <ChevronRight className="size-3.5" /></button>
            </div>

            <div className="relative mx-1 h-[322px]">
              <div className="absolute inset-x-3 top-3 h-[295px] rotate-2 rounded-[2rem] bg-[#e8d4c0] shadow-sm" />
              <div className="absolute inset-x-1 top-1 h-[302px] -rotate-2 rounded-[2rem] bg-[#cddfdd] shadow-sm" />
              <article className="absolute inset-0 z-10 flex h-[306px] flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-3 shadow-[0_18px_35px_rgba(111,85,59,0.16)] backdrop-blur-xl">
                <div className="relative flex h-[176px] shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#c9dddc]">
                  <div className="absolute -right-5 -top-8 size-28 rounded-full bg-[#f5dfc8] opacity-90" />
                  <div className="absolute -bottom-10 -left-5 size-32 rounded-full bg-[#a9c9c3] opacity-80" />
                  <div className="relative text-center">
                    <div className="mb-1 text-6xl drop-shadow-sm" aria-hidden="true">🌙</div>
                    <div className="text-4xl" aria-hidden="true">🛸</div>
                  </div>
                  <span className="absolute right-3 top-3 rounded-full bg-white/75 px-3 py-1.5 text-[9px] font-black tracking-[0.16em] text-slate-600 backdrop-blur-sm">5 DK</span>
                </div>
                <div className="flex flex-1 items-end justify-between gap-3 px-2 pb-1 pt-3">
                  <div>
                    <span className="inline-flex rounded-full bg-[#f9e0c9] px-2.5 py-1 text-[9px] font-black tracking-[0.16em] text-[#c16f46]">MACERA</span>
                    <h3 className="mt-2 max-w-[245px] text-[21px] font-black leading-[1.08] tracking-[-0.04em]">Uzaylı Zumi ve Yıldız Tozu</h3>
                  </div>
                  <button aria-label="Masalı dinlemeye başla" className="mb-1 grid size-11 shrink-0 place-items-center rounded-full bg-slate-800 text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"><BookOpen className="size-5" /></button>
                </div>
              </article>
            </div>
          </section>

          <section className="mt-1" aria-labelledby="characters-heading">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Masal dostların</p>
                <h2 id="characters-heading" className="mt-1 text-lg font-extrabold tracking-tight">Karakterler</h2>
              </div>
              <Sparkles className="size-5 text-[#df9b6f]" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {characters.map((character) => (
                <button key={character.name} className={`${character.tone} group flex min-h-[101px] items-center justify-between overflow-hidden rounded-3xl border border-white/70 p-3 text-left shadow-[0_8px_20px_rgba(111,85,59,0.08)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800`}>
                  <span><span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">{character.role}</span><strong className="mt-1 block max-w-[80px] text-sm font-extrabold leading-tight">{character.name}</strong></span>
                  <span className="text-4xl drop-shadow-sm transition-transform group-hover:scale-110" aria-hidden="true">{character.icon}</span>
                </button>
              ))}
            </div>
          </section>

          <nav aria-label="Ana menü" className="mt-auto flex items-center justify-around rounded-full border border-white/80 bg-white/75 px-3 py-2.5 shadow-[0_10px_28px_rgba(80,65,49,0.14)] backdrop-blur-xl">
            {[['Keşfet', Home], ['Kitaplık', BookOpen], ['Profil', UserRound]].map(([label, Icon]) => {
              const isActive = activeTab === label
              return <button key={label as string} onClick={() => setActiveTab(label as string)} aria-current={isActive ? 'page' : undefined} className={`flex min-w-[76px] flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[9px] font-bold transition-colors ${isActive ? 'bg-[#f9e0c9] text-[#c16f46]' : 'text-slate-400 hover:bg-slate-100'}`}><Icon className="size-[18px]" /><span>{label as string}</span></button>
            })}
          </nav>
        </div>
      </div>
    </main>
  )
}
 
