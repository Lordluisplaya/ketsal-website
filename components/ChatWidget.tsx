'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react'

interface Msg { role: 'user'|'assistant'; content: string }

export default function ChatWidget({ propertyId }: { propertyId?: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente de Ketsal Real Estate. ¿En qué puedo ayudarte hoy?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottom = useRef<HTMLDivElement>(null)

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMsgs(m => [...m, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, propertyId }),
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'assistant', content: data.response || 'Lo siento, hubo un error.' }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: 'Error de conexión. Intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col" style={{height:'360px'}}>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-ketsal-cobalt flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-ketsal-cobalt text-white rounded-br-sm'
                : 'bg-ketsal-surface text-ketsal-black/80 rounded-bl-sm border border-gray-100'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-ketsal-cobalt flex items-center justify-center mr-2 flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-ketsal-surface rounded-2xl rounded-bl-sm px-4 py-3 border border-gray-100">
              <div className="flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-ketsal-cobalt/40 animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottom} />
      </div>
      <div className="border-t border-gray-100 p-3 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Escribe tu pregunta..."
          className="flex-1 bg-ketsal-surface border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ketsal-cobalt/30 text-ketsal-black placeholder-gray-300"
        />
        <button onClick={send} disabled={!input.trim() || loading}
          className="w-10 h-10 bg-ketsal-cobalt disabled:opacity-30 hover:bg-ketsal-navy text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}