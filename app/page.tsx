'use client'

import { useState } from 'react'
import { BookOpen, Heart, Library, UserRound, X } from 'lucide-react'

const tabs = [
  { label: 'Keşfet', icon: BookOpen },
  { label: 'Kitaplık', icon: Library },
  { label: 'Profil', icon: UserRound },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState('Keşfet')
  const [saved, setSaved] = useState(false)

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-3 py-5 text-slate-800 sm:px-6">
      <div className="relative mx-auto flex h-[850px] max-w-[400px] flex-col overflow-hidden rounded-[3rem] border-[12px] border-slate-900 bg-white shadow-2xl">
        <header className="flex items-center justify-between px-6 pb-3 pt-8">
          <h1 className="text-[23px] font-black tracking-[-0.045em] text-slate-800">Merhaba Can! <span aria-hidden="true">👋</span></h1>
          <button aria-label="Profilini aç" className="grid size-11 place-items-center rounded-full border-4 border-white bg-[#f5c9a6] text-xl shadow-[0_5px_15px_rgba(80,80,70,0.12)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">🧒</button>
        </header>

        <section className="relative flex min-h-0 flex-1 flex-col px-5 pb-3" aria-labelledby="story-title">
          <div className="flex items-center justify-between pb-3 pt-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-slate-400">Bugünün hikayesi</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">Yeni bir macera seni bekliyor</p>
            </div>
            <span className="rounded-full bg-[#fff2d4] px-3 py-1.5 text-[10px] font-black tracking-[0.12em] text-[#c7883d]">5 DK</span>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center pb-20">
            <div className="absolute top-4 h-[86%] w-[87%] rotate-[5deg] rounded-[1.8rem] bg-[#f5dec6] shadow-sm" />
            <div className="absolute top-2 h-[89%] w-[91%] -rotate-[4deg] rounded-[1.8rem] bg-[#d7e8e5] shadow-sm" />

            <article className="relative z-10 flex h-[91%] w-full max-w-[330px] flex-col overflow-hidden rounded-[1.8rem] bg-white shadow-[0_18px_38px_rgba(45,65,62,0.16)]">
              <div className="relative flex min-h-0 flex-[7] items-center justify-center overflow-hidden bg-[#b8d9d5]">
                <div className="absolute -right-9 -top-10 size-40 rounded-full bg-[#f9dcae]/90" />
                <div className="absolute -bottom-16 -left-12 size-48 rounded-full bg-[#8ebdb7]/80" />
                <div className="absolute left-8 top-12 size-3 rounded-full bg-white/70" />
                <div className="absolute right-16 top-24 size-2 rounded-full bg-white/70" />
                <div className="relative flex flex-col items-center gap-1 drop-shadow-sm">
                  <span className="text-[76px] leading-none" aria-hidden="true">🌙</span>
                  <span className="text-[58px] leading-none" aria-hidden="true">🛸</span>
                </div>
                <span className="absolute bottom-4 left-5 rounded-full bg-white/70 px-3 py-1 text-[9px] font-black tracking-[0.15em] text-slate-600 backdrop-blur-sm">UYKU ÖNCESİ</span>
              </div>
              <div className="flex flex-[3] flex-col justify-center px-6">
                <span className="w-fit rounded-full bg-[#fff0d8] px-3 py-1.5 text-[9px] font-black tracking-[0.17em] text-[#c7793e]">MACERA</span>
                <h2 id="story-title" className="mt-3 text-[27px] font-black leading-[1.04] tracking-[-0.055em] text-slate-800">Uzaylı Zumi</h2>
                <p className="mt-2 text-xs font-medium text-slate-400">Yıldızların arasındaki küçük gezgin</p>
              </div>
            </article>

            <div className="absolute bottom-1 z-20 flex items-center gap-5">
              <button aria-label="Masalı geç" className="grid size-[58px] place-items-center rounded-full border border-white/90 bg-white/80 text-[#e58270] shadow-[0_10px_24px_rgba(55,70,65,0.14)] backdrop-blur-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                <X className="size-7" strokeWidth={2.5} />
              </button>
              <button aria-label={saved ? 'Favorilerden çıkar' : 'Favorilere ekle'} onClick={() => setSaved(!saved)} className={`grid size-[66px] place-items-center rounded-full border border-white/90 shadow-[0_10px_24px_rgba(55,70,65,0.14)] backdrop-blur-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${saved ? 'bg-[#f7c5b9] text-[#d96f5d]' : 'bg-[#d6eee9]/90 text-[#42a493]'}`}>
                <Heart className="size-8" fill={saved ? 'currentColor' : 'none'} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </section>

        <nav aria-label="Ana menü" className="flex items-center justify-around border-t border-slate-100 bg-white px-5 pb-5 pt-3">
          {tabs.map(({ label, icon: Icon }) => {
            const isActive = activeTab === label
            return <button key={label} onClick={() => setActiveTab(label)} aria-current={isActive ? 'page' : undefined} className={`relative flex min-w-[74px] flex-col items-center gap-1.5 rounded-2xl px-3 py-1.5 text-[10px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${isActive ? 'text-[#32a08e]' : 'text-slate-300 hover:text-slate-500'}`}><Icon className="size-[21px]" strokeWidth={isActive ? 2.5 : 2} /><span>{label}</span>{isActive && <span className="absolute -bottom-1 size-1 rounded-full bg-[#32a08e]" />}</button>
          })}
        </nav>
      </div>
    </main>
  )
}
