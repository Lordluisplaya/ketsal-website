import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer" id="contacto">
      <div className="footer__grid container" style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <div className="footer__brand">
          <h3>Kets<span>al</span></h3>
          <p>
            Especialistas en bienes raíces en la Riviera Maya.
            Conectamos sueños con propiedades únicas en el paraíso.
          </p>
          <div className="footer__social" style={{ marginTop: '24px' }}>
            <a href="https://instagram.com/ketsal" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://facebook.com/ketsal" target="_blank" rel="noopener" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://wa.me/529841234567" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Propiedades</h4>
          <Link href="/propiedades?tipo=venta">En venta</Link>
          <Link href="/propiedades?tipo=renta">En renta</Link>
          <Link href="/propiedades?tipo=vacacional">Vacacional</Link>
          <Link href="/propiedades?kind=casa">Casas</Link>
          <Link href="/propiedades?kind=departamento">Departamentos</Link>
        </div>

        <div className="footer__col">
          <h4>Zonas</h4>
          <Link href="/propiedades?zona=playa-del-carmen">Playa del Carmen</Link>
          <Link href="/propiedades?zona=tulum">Tulum</Link>
          <Link href="/propiedades?zona=cancun">Cancún</Link>
          <Link href="/propiedades?zona=akumal">Akumal</Link>
          <Link href="/propiedades?zona=cozumel">Cozumel</Link>
        </div>

        <div className="footer__col">
          <h4>Contacto</h4>
          <a href="https://wa.me/529841234567" target="_blank" rel="noopener">+52 984 123 4567</a>
          <a href="mailto:hola@ketsal.mx">hola@ketsal.mx</a>
          <a href="/admin" style={{ marginTop: '16px', opacity: 0.4, fontSize: '12px' }}>Admin ↗</a>
        </div>
      </div>

      <div className="footer__bottom container" style={{ maxWidth: '1320px', margin: '0 auto' }}>
        <p>© {new Date().getFullYear()} Ketsal Bienes Raíces · Riviera Maya, México</p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
          Diseñado con pasión por el paraíso
        </p>
      </div>
    </footer>
  )
}
