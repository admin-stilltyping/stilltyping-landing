import { useEffect, useRef, useState } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import {
  ArrowDown, ArrowRight, BookOpen, Check, CheckCheck, ChevronDown,
  CircleHelp, FileText, Layers3, LayoutDashboard, Menu, MessageCircle,
  MoreHorizontal, Package, Pause, Play, Plus, Settings2,
  ShieldCheck, Sparkles, TicketCheck, Users, X,
} from 'lucide-react'
import './landing.css'


/** Leave the long landing page at the top of the destination, including footer links. */
function PageLink({ children, onClick, ...props }: LinkProps) {
  const portalUrl = import.meta.env.VITE_PUBLIC_PORTAL_URL?.replace(/\/$/, '')
  const to = portalUrl && typeof props.to === 'string' && ['/login', '/signup', '/privacy'].includes(props.to)
    ? `${portalUrl}${props.to}`
    : props.to
  return (
    <Link {...props} to={to} onClick={event => {
      onClick?.(event)
      if (!event.defaultPrevented && event.button === 0 && !event.metaKey &&
          !event.ctrlKey && !event.shiftKey && !event.altKey &&
          (!props.target || props.target === '_self')) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    }}>{children}</Link>
  )
}

function NivasoMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="30" height="34" viewBox="0 0 30 34" fill="none" aria-hidden="true">
      <path d="M4 26V9.5C4 6.5 7.4 4.8 9.8 6.6L21 15V5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 8V24.5C26 27.5 22.6 29.2 20.2 27.4L9 19V29" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LightField() {
  return (
    <div className="nl-light-field" aria-hidden="true">
      <div className="nl-nebula" />
      <svg className="nl-grid" viewBox="0 0 1440 470" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="nl-grid-fade" x1="720" y1="0" x2="720" y2="470" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B7A4FB" stopOpacity="0" />
            <stop offset=".47" stopColor="#B7A4FB" stopOpacity=".28" />
            <stop offset="1" stopColor="#B7A4FB" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g stroke="url(#nl-grid-fade)">
          {Array.from({ length: 17 }, (_, i) => {
            const top = 460 + i * 32.5
            const bottom = -640 + i * 170
            return <path key={i} d={`M${top} 0 C${top} 180 ${bottom} 185 ${bottom} 360 V470`} />
          })}
          {[120, 155, 202, 265, 349, 452].map(y => <path key={y} d={`M0 ${y} H1440`} />)}
        </g>
      </svg>
      <div className="nl-stars">
        {Array.from({ length: 24 }, (_, i) => <i key={i} style={{ left: `${(i * 37 + 7) % 100}%`, top: `${(i * 23 + 11) % 88}%`, opacity: .15 + (i % 4) * .12 }} />)}
      </div>
    </div>
  )
}

const examples = [
  {
    label: 'Product question', question: 'Is the Everyday Tote available in olive?',
    answer: 'Yes! The Everyday Tote comes in olive. It’s made from recycled cotton and has a roomy inside pocket.',
    source: 'Product catalog', detail: 'Everyday Tote', meta: 'Olive / Recycled cotton', price: '₹1,290',
  },
  {
    label: 'Store information', question: 'What time does your store open on Saturday?',
    answer: 'Our store is open from 10 am to 7 pm on Saturdays. You’ll find us at 24 Garden Street. We’d love to see you!',
    source: 'Business knowledge', detail: 'Saturday opening hours', meta: '10:00 am – 7:00 pm', price: 'Open',
  },
  {
    label: 'Human support', question: 'I received the wrong item. Can someone help?',
    answer: 'I’ve created a support ticket for our team to help with your order. Your reference is TKT-1042. They can review the details and help you with the next steps.',
    source: 'Support ticket', detail: 'Incorrect item received', meta: 'TKT-1042 / Awaiting team', price: 'Created',
  },
]

const previewTabs = [
  { id: 'conversations', label: 'Conversations', icon: MessageCircle },
  { id: 'knowledge', label: 'Knowledge base', icon: BookOpen },
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
] as const
type PreviewTab = typeof previewTabs[number]['id']

function ProductPreview() {
  const [tab, setTab] = useState<PreviewTab>('conversations')
  const [example, setExample] = useState(0)
  const [replyVisible, setReplyVisible] = useState(true)
  const replyTimer = useRef<ReturnType<typeof setTimeout>>()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => () => clearTimeout(replyTimer.current), [])

  const chooseExample = (index: number) => {
    clearTimeout(replyTimer.current)
    setExample(index)
    setReplyVisible(false)
    replyTimer.current = setTimeout(() => setReplyVisible(true), 650)
  }
  const current = examples[example]

  return (
    <div className="nl-product-wrap" id="demo">
      <div className="nl-preview-caption"><span className="nl-status-dot" /> A closer look at your workspace <span>Interactive preview · Sample data</span></div>
      <div className="nl-product">
        <aside className="nl-product-sidebar">
          <div className="nl-preview-brand"><NivasoMark /><span>nivaso<span className="nl-workspace-label">Your workspace</span></span><ChevronDown size={14} /></div>
          <div className="nl-preview-workspace"><span className="nl-store-avatar">F</span><span>Fern & Co.<small>Business workspace</small></span></div>
          <p className="nl-sidebar-label">Workspace preview</p>
          <div className="nl-preview-tabs" role="tablist" aria-label="Explore the workspace">
            {previewTabs.map(({ id, label, icon: Icon }, index) => (
              <button key={id} ref={el => { tabRefs.current[index] = el }} id={`nl-tab-${id}`} type="button" role="tab" aria-selected={tab === id} aria-controls={`nl-panel-${id}`} tabIndex={tab === id ? 0 : -1}
                onClick={() => setTab(id)} onKeyDown={event => {
                  let next = index
                  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % previewTabs.length
                  else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + previewTabs.length - 1) % previewTabs.length
                  else if (event.key === 'Home') next = 0
                  else if (event.key === 'End') next = previewTabs.length - 1
                  else return
                  event.preventDefault()
                  setTab(previewTabs[next].id)
                  tabRefs.current[next]?.focus()
                }}>
                <Icon size={16} /><span>{label}</span>{id === 'conversations' && <span className="nl-nav-count">3</span>}
              </button>
            ))}
          </div>
          <div className="nl-preview-decoration" aria-hidden="true"><span><Package size={16} /> Products</span><span><Users size={16} /> Customers</span><span><TicketCheck size={16} /> Support tickets</span></div>
          <div className="nl-sidebar-bottom"><span className="nl-avatar">JD</span><span>Jamie Davis<small>Workspace admin</small></span><Settings2 size={15} /></div>
        </aside>
        <div className="nl-product-main">
          <div className="nl-product-toolbar"><span>{previewTabs.find(item => item.id === tab)?.label}</span><span className="nl-sample-label">Sample workspace</span><MoreHorizontal size={18} /></div>
          <div className="nl-preview-panel" key={tab} role="tabpanel" id={`nl-panel-${tab}`} aria-labelledby={`nl-tab-${tab}`} tabIndex={0}>
            {tab === 'conversations' ? (
              <div className="nl-conversation">
                <div className="nl-conversation-heading"><span className="nl-chat-avatar">AL</span><div><strong>Alex Lee</strong><span>Website conversation</span></div><span className="nl-ai-tag"><Sparkles size={12} /> Nivaso assistant</span></div>
                <div className="nl-messages">
                  <div className="nl-message-date">Example conversation</div>
                  <div className="nl-question" key={`question-${example}`}>{current.question}<span>Just now <CheckCheck size={13} /></span></div>
                  <div className="nl-answer-row"><div className="nl-bot-avatar"><NivasoMark /></div><div className="nl-answer" aria-live="polite" aria-atomic="true">
                    {replyVisible ? <><p>{current.answer}</p><div className="nl-answer-source"><Check size={12} /> {current.source}</div></> : <span className="nl-typing" aria-label="Preparing sample reply"><i /><i /><i /></span>}
                  </div></div>
                  <div className={`nl-product-result ${replyVisible ? '' : 'nl-result-pending'}`} aria-hidden={!replyVisible}>
                    <div className="nl-result-icon">{example === 0 ? <ShoppingBagArt /> : example === 1 ? <BookOpen size={25} /> : <TicketCheck size={25} />}</div>
                    <div><strong>{current.detail}</strong><span>{current.meta}</span></div><b>{current.price}</b>
                  </div>
                </div>
                <div className="nl-example-picker"><span>Try a conversation</span><div>{examples.map((item, index) => <button type="button" key={item.label} aria-pressed={example === index} onClick={() => chooseExample(index)}>{item.label}<ArrowRight size={12} /></button>)}</div></div>
              </div>
            ) : tab === 'knowledge' ? (
              <div className="nl-knowledge-preview">
                <div className="nl-panel-title"><BookOpen size={23} /><div><h3>Business knowledge</h3><p>The context behind every helpful answer.</p></div></div>
                {[
                  ['About Fern & Co.', 'Our story, store location and opening hours', 'Business'],
                  ['Product guide', 'Materials, colors and care instructions', 'Products'],
                  ['Delivery & returns', 'Shipping regions and return policies', 'Policies'],
                  ['How we help', 'When to create a ticket for the team', 'Support'],
                ].map(([title, description, category]) => <div className="nl-knowledge-row" key={title}><FileText size={19} /><div><strong>{title}</strong><span>{description}</span></div><span className="nl-document-tag">{category}</span></div>)}
                <p className="nl-preview-note"><ShieldCheck size={15} /> Your knowledge gives the assistant business-specific context.</p>
              </div>
            ) : (
              <div className="nl-overview-preview">
                <div className="nl-panel-title"><LayoutDashboard size={23} /><div><h3>A view of your business</h3><p>Illustrative activity for the last 7 days.</p></div></div>
                <div className="nl-mini-stats">{[['Conversations', '128'], ['Products', '32'], ['Open tickets', '6']].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
                <div className="nl-preview-chart"><div><strong>Conversations this week</strong><span>Sample activity</span></div><div className="nl-chart-bars">{[38, 57, 45, 78, 62, 90, 74].map((height, index) => <div key={index}><i style={{ height: `${height}%` }} /><span>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</span></div>)}</div></div>
              </div>
            )}
          </div>
        </div>
        <aside className="nl-context-panel"><div className="nl-context-title"><Sparkles size={16} /> A little context.<br />A better conversation.</div><div className="nl-context-orbit"><span /><span /><NivasoMark /></div><p>Nivaso brings your business knowledge into the conversation.</p><div className="nl-context-item"><BookOpen size={15} /><span>Business knowledge</span><Check size={13} /></div><div className="nl-context-item"><Package size={15} /><span>Product information</span><Check size={13} /></div><div className="nl-context-item"><TicketCheck size={15} /><span>Human handoff</span><Check size={13} /></div><span className="nl-context-footer">Your business. In the loop.</span></aside>
      </div>
    </div>
  )
}

function ShoppingBagArt() {
  return <svg width="44" height="48" viewBox="0 0 44 48" fill="none" aria-hidden="true"><path d="M9 15H35L38 43H6L9 15Z" fill="#89946C" /><path d="M15 18V11C15 1 29 1 29 11V18" stroke="#BDC6A1" strokeWidth="3" /><path d="M12 19L10 39H34" stroke="#B4BE94" strokeOpacity=".5" /><path d="M20 25L24 32M24 25L20 32" stroke="#E1E6D2" strokeWidth="1.5" /></svg>
}

const faqs = [
  ['What is Nivaso?', 'Nivaso brings an AI customer assistant and your business tools into one workspace. Give it your business knowledge, manage your product catalog, and help your team handle customer questions.'],
  ['How does the assistant learn about my business?', 'You add and maintain your business information in the knowledge base. The assistant uses relevant information from that knowledge and connected tools to respond. You can also set instructions for how it should help your customers.'],
  ['What happens when a question needs a person?', 'When the assistant cannot find enough information to answer, it can create a support ticket. Your team can review and resolve the request from the business portal.'],
  ['Can I choose which business tools I use?', 'Yes. Select the modules you need when you request an account. Your platform administrator reviews the request and enables the tools for your business. You can ask your administrator to enable more tools later.'],
  ['How do I get started?', 'Create a business account and choose your requested features. After your account is approved, sign in to your business portal, add your knowledge, and try the assistant with questions your customers ask.'],
]

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [motionPaused, setMotionPaused] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const page = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const oldTitle = document.title
    document.title = 'Nivaso — A little less busy. A lot more business.'
    return () => { document.title = oldTitle }
  }, [])

  useEffect(() => {
    const nodes = page.current?.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!nodes || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('nl-revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: .08 })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="nivaso-landing" ref={page} data-motion={motionPaused ? 'paused' : 'running'}>
      <a className="nl-skip" href="#main">Skip to content</a>
      <header className="nl-header" onKeyDown={event => { if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus() } }}>
        <div className="nl-header-inner">
          <PageLink className="nl-wordmark" to="/" aria-label="Nivaso home"><NivasoMark /><span>nivaso</span></PageLink>
          <nav className="nl-desktop-nav" aria-label="Main navigation"><a href="#features">Platform</a><a href="#how-it-works">How it works</a><a href="#faq">FAQs</a></nav>
          <div className="nl-header-actions"><PageLink className="nl-login" to="/login">Log in</PageLink><PageLink className="nl-button nl-button-small nl-button-glass" to="/signup">Get started<ArrowRight size={14} /></PageLink><button ref={menuButton} className="nl-menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="nl-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></div>
        </div>
        {menuOpen && <nav id="nl-mobile-menu" className="nl-mobile-menu" aria-label="Mobile navigation"><a href="#features" onClick={() => setMenuOpen(false)}>Platform</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><a href="#faq" onClick={() => setMenuOpen(false)}>FAQs</a><PageLink to="/login">Log in</PageLink></nav>}
      </header>
      <main id="main">
        <section className="nl-hero" aria-labelledby="nl-hero-title">
          <LightField />
          <div className="nl-hero-copy">
            <a href="#demo" className="nl-announcement"><span><NivasoMark /></span>Meet your business’s new teammate<ArrowRight size={14} /></a>
            <h1 id="nl-hero-title">A little less busy.<br />A lot more business.</h1>
            <p>Your knowledge. Your customers. One helpful AI.<br className="nl-desktop-break" /> Turn everyday questions into conversations that move your business forward.</p>
            <div className="nl-hero-actions"><PageLink className="nl-button nl-button-primary" to="/signup">Get started with Nivaso<ArrowRight size={17} /></PageLink><a className="nl-watch-link" href="#demo"><span><Play size={12} fill="currentColor" /></span>See it in action</a></div>
            <span className="nl-hero-footnote">Made for your business. Ready to make it easier.</span>
          </div>
          <div className="nl-container"><ProductPreview /></div>
        </section>

        <div className="nl-business-types nl-container"><p>A little help, for every kind of business.</p><div><span><Package />Retail & commerce</span><span><Users />Service businesses</span><span><MessageCircle />Customer support</span><span><Layers3 />Growing teams</span></div></div>

        <section className="nl-features nl-container" id="features" aria-labelledby="nl-features-title">
          <div className="nl-section-heading" data-reveal><span className="nl-section-symbol"><Sparkles size={21} /></span><h2 id="nl-features-title">Everything comes together.<br />So you can move forward.</h2><p>Give your assistant the context. Give your team the space.<br className="nl-desktop-break" /> Keep the details of your business connected.</p></div>
          <div className="nl-feature-grid" data-reveal>
            <article className="nl-feature nl-feature-knowledge">
              <div className="nl-knowledge-art" aria-hidden="true"><div className="nl-art-doc nl-art-doc-back"><FileText size={18} /><span>Product information</span><i /><i /><i /></div><div className="nl-art-doc nl-art-doc-front"><BookOpen size={19} /><span>Your business knowledge</span><i /><i /><i /><b><Check size={11} /> Connected to your assistant</b></div><div className="nl-art-beam" /><div className="nl-art-node"><NivasoMark /></div></div>
              <div className="nl-feature-copy"><BookOpen size={19} /><h3>It starts with what you know.</h3><p>Bring your business information into one knowledge base. Help your assistant answer with the context that makes your business yours.</p><a href="#demo">Explore the workspace<ArrowRight size={15} /></a></div>
            </article>
            <article className="nl-feature nl-feature-support"><div className="nl-support-art" aria-hidden="true"><div className="nl-art-message"><MessageCircle size={16} /><span>Could I speak with your team?</span></div><div className="nl-handoff-line"><i /><ArrowDown size={15} /></div><div className="nl-art-ticket"><span><TicketCheck size={17} /> Support ticket created</span><small>Your team can take it from here.</small><div><span className="nl-avatar">JD</span><span>Ready for a human touch</span><Check size={14} /></div></div></div><div className="nl-feature-copy"><TicketCheck size={19} /><h3>AI helps. Your team takes care.</h3><p>Some questions need a person. Turn those moments into support tickets, with a clear next step for your team.</p></div></article>
            <article className="nl-feature nl-feature-modules"><div className="nl-modules-copy"><span className="nl-section-symbol"><Layers3 size={21} /></span><div><h3>Your business doesn’t fit a box.<br />Your workspace shouldn’t either.</h3><p>Start with the tools you need. Request more as you grow.</p></div></div><div className="nl-module-pills">{[[Package, 'Products'], [Users, 'Customers'], [BookOpen, 'Knowledge'], [TicketCheck, 'Support'], [MessageCircle, 'AI chat'], [Plus, 'Your next chapter']].map(([Icon, label], index) => { const ModuleIcon = Icon as typeof Package; return <span key={index}><ModuleIcon size={17} />{label as string}</span> })}</div></article>
          </div>
        </section>

        <section className="nl-how nl-container" id="how-it-works" aria-labelledby="nl-how-title">
          <div className="nl-how-heading" data-reveal><h2 id="nl-how-title">A thoughtful assistant.<br />A simple beginning.</h2><p>You bring the business.<br />We’ll help you connect the dots.</p></div>
          <div className="nl-steps" data-reveal>{[
            { icon: Layers3, title: 'Make yourself at home', copy: 'Request your workspace and choose the modules your business needs.' },
            { icon: BookOpen, title: 'Add a little context', copy: 'Add your business knowledge, product details and assistant instructions.' },
            { icon: MessageCircle, title: 'Start a conversation', copy: 'Try real customer questions, review the answers and refine your knowledge.' },
          ].map(({ icon: Icon, title, copy }, index) => <article key={title}><div className="nl-step-top"><span><Icon size={23} /></span><b>0{index + 1}</b></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </section>

        <section className="nl-faq nl-container" id="faq" aria-labelledby="nl-faq-title"><div data-reveal><span className="nl-section-symbol"><CircleHelp size={22} /></span><h2 id="nl-faq-title">A few things<br />you might wonder.</h2><p>A little clarity before you get started.</p></div><div className="nl-faq-list" data-reveal>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} /></summary><p>{answer}</p></details>)}</div></section>

        <section className="nl-final-cta" aria-labelledby="nl-cta-title"><div className="nl-final-glow" aria-hidden="true" /><div className="nl-container" data-reveal><span className="nl-final-mark"><NivasoMark /></span><h2 id="nl-cta-title">Make room for<br />what’s next.</h2><p>Your next chapter starts with a little help.</p><PageLink className="nl-button nl-button-primary" to="/signup">Get started with Nivaso<ArrowRight size={17} /></PageLink><span className="nl-cta-note">Create your account. We’ll help you get set up.</span></div></section>
      </main>
      <footer className="nl-footer nl-container"><div className="nl-footer-top"><div><PageLink className="nl-wordmark" to="/" aria-label="Nivaso home"><NivasoMark /><span>nivaso</span></PageLink><p>A little help. A world of possibilities.</p></div><nav aria-label="Footer navigation"><a href="#features">Platform</a><a href="#how-it-works">How it works</a><a href="#faq">FAQs</a><PageLink to="/login">Log in</PageLink></nav></div><div className="nl-footer-bottom"><span>© {new Date().getFullYear()} Nivaso</span><div><button className="nl-motion-toggle" type="button" aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>{motionPaused ? <Play size={12} /> : <Pause size={12} />}{motionPaused ? 'Resume animations' : 'Pause animations'}</button><PageLink to="/privacy">Privacy policy</PageLink></div></div></footer>
    </div>
  )
}
