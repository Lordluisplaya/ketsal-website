'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`header ${scrolled ? 'header--solid' : 'header--transparent'}`}>
        <Link href="/" className="header__logo">
          Kets<span>al</span>
        </Link>
        <nav className="header__nav">
          <Link href="/propiedades">Propiedades</Link>
          <Link href="/propiedades?tipo=venta">Comprar</Link>
          <Link href="/propiedades?tipo=renta">Rentar</Link>
          <Link href="/propiedades?tipo=vacacional">Vacacional</Link>
          <a href="#contacto">Contacto</a>
        </nav>
        <div className="header__actions">
          <a
            href="https://wa.me/529841234567"
            className="btn btn--gold"
            target="_blank"
            rel="noopener"
            style={{ padding: '10px 20px', fontSize: '13px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <button
            className="header__menu"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
            style={{ color: scrolled ? 'var(--text)' : '#fff' }}
          >
            <span style={menuOpen ? { transform: 'rotate(45deg) translate(5px,5px)' } : {}} />
            <span style={menuOpen ? { opacity: 0 } : {}} />
            <span style={menuOpen ? { transform: 'rotate(-45deg) translate(5px,-5px)' } : {}} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '40px',
        }}>
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute', top: '24px', right: '24px',
              color: '#fff', fontSize: '24px', background: 'none', border: 'none',
              cursor: 'pointer', width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
          <Link href="/" className="header__logo" onClick={() => setMenuOpen(false)} style={{ fontSize: '36px', color: '#fff' }}>
            Kets<span style={{ color: 'var(--gold)' }}>al</span>
          </Link>
          {[
            ['/', 'Inicio'],
            ['/propiedades', 'Propiedades'],
            ['/propiedades?tipo=venta', 'Comprar'],
            ['/propiedades?tipo=renta', 'Rentar'],
            ['/propiedades?tipo=vacacional', 'Vacacional'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-serif)', fontSize: '32px',
                color: '#fff', letterSpacing: '-0.02em',
              }}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://wa.me/529841234567"
            className="btn btn--gold"
            target="_blank"
            rel="noopener"
            onClick={() => setMenuOpen(false)}
          >
            Contactar por WhatsApp
          </a>
        </div>
      )}
    </>
  )
}
