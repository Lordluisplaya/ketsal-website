'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: '¡Hola! 👋 Soy el asistente de Ketsal Real Estate. ¿Buscas propiedad en Riviera Maya? Cuéntame qué necesitas.\n\nHi! Looking for a property in the Riviera Maya? Tell me what you need.' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: updated }) })
      const data = await res.json()
      setMessages([...updated, { role: 'assistant', content: data.message }])
    } catch {
      setMessages([...updated, { role: 'assistant', content: 'Hubo un error. Escríbenos por WhatsApp.' }])
    } finally { setLoading(false) }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col" style={{height:'480px'}}>
          <div className="gradient-hero text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div><p className="font-semibold">Ketsal Assistant</p><p className="text-xs text-green-200">Online · ES / EN</p></div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-ketsal-green text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>{msg.content}</div>
              </div>
            ))}
            {loading && <div className="flex justify-start"><div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2"><Loader2 className="w-4 h-4 animate-spin text-gray-400" /></div></div>}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Escribe tu mensaje..." className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ketsal-green" />
            <button onClick={send} disabled={loading || !input.trim()} className="bg-ketsal-green text-white p-2 rounded-xl hover:bg-ketsal-green-light transition-colors disabled:opacity-50"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-4 bg-ketsal-green text-white w-14 h-14 rounded-full shadow-lg hover:bg-ketsal-green-light transition-colors z-50 flex items-center justify-center">
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  )
}