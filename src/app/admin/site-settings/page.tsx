'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function SiteSettings() {
  const [settings, setSettings] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const sb = supabase()

  useEffect(() => {
    sb.from('site_settings').select('*').then(({ data }) => {
      const obj: any = {}
      data?.forEach(r => { obj[r.key] = r.value })
      setSettings(obj)
    })
  }, [])

  const save = async (key: string) => {
    setSaving(true)
    await sb.from('site_settings').update({ value: settings[key], updated_at: new Date().toISOString() }).eq('key', key)
    setSaving(false)
  }

  const update = (key: string, field: string, v: any) =>
    setSettings({ ...settings, [key]: { ...settings[key], [field]: v } })

  const input = "w-full bg-bg border border-ink/10 px-3 py-2 sub-en"
  const label = "sub-en uppercase text-xs text-ink/50 mb-1 block"

  if (!settings.hero) return <div>Loading...</div>

  return (
    <div className="space-y-10 max-w-3xl">
      <h1 className="headline-en text-5xl uppercase">Site Settings</h1>

      {/* HERO */}
      <section className="bg-surface p-6 space-y-3">
        <h2 className="headline-en text-2xl uppercase text-primary">Hero</h2>
        <div><label className={label}>Title (EN)</label>
          <input className={input} value={settings.hero.title_en}
                 onChange={e=>update('hero','title_en',e.target.value)}/></div>
        <div><label className={label}>Title (KR)</label>
          <input className={input} value={settings.hero.title_kr}
                 onChange={e=>update('hero','title_kr',e.target.value)}/></div>
        <div><label className={label}>Subtitle</label>
          <input className={input} value={settings.hero.subtitle}
                 onChange={e=>update('hero','subtitle',e.target.value)}/></div>
        <div><label className={label}>CTA</label>
          <input className={input} value={settings.hero.cta}
                 onChange={e=>update('hero','cta',e.target.value)}/></div>
        <button onClick={()=>save('hero')} disabled={saving}
                className="bg-primary text-bg px-4 py-2 sub-en uppercase">Save hero</button>
      </section>

      {/* BRAND */}
      <section className="bg-surface p-6 space-y-3">
        <h2 className="headline-en text-2xl uppercase text-primary">Brand</h2>
        <div><label className={label}>Name</label>
          <input className={input} value={settings.brand.name}
                 onChange={e=>update('brand','name',e.target.value)}/></div>
        <div><label className={label}>Logo play</label>
          <input className={input} value={settings.brand.logo_play}
                 onChange={e=>update('brand','logo_play',e.target.value)}/></div>
        <div><label className={label}>Tagline</label>
          <input className={input} value={settings.brand.tagline}
                 onChange={e=>update('brand','tagline',e.target.value)}/></div>
        <button onClick={()=>save('brand')} disabled={saving}
                className="bg-primary text-bg px-4 py-2 sub-en uppercase">Save brand</button>
      </section>

      {/* THEME */}
      <section className="bg-surface p-6 space-y-3">
        <h2 className="headline-en text-2xl uppercase text-primary">Theme colors</h2>
        {(['primary','bg','surface','text'] as const).map(k=>(
          <div key={k} className="flex items-center gap-3">
            <label className="sub-en uppercase text-xs w-24">{k}</label>
            <input type="color" value={settings.theme[k]}
                   onChange={e=>update('theme',k,e.target.value)} className="h-10 w-16"/>
            <input value={settings.theme[k]}
                   onChange={e=>update('theme',k,e.target.value)} className={input}/>
          </div>
        ))}
        <button onClick={()=>save('theme')} disabled={saving}
                className="bg-primary text-bg px-4 py-2 sub-en uppercase">Save theme</button>
        <p className="text-xs text-ink/40">
          ※ Theme colors are stored but Tailwind classes are precompiled. To apply changes site-wide without rebuild, inject as CSS variables in root layout.
        </p>
      </section>
    </div>
  )
}
