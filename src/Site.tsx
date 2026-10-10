import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { PrivacyPage } from './PrivacyPage'
import { LandingPage } from './LandingPage'
import { PageLink } from './PageLink'
import { ProductLinks } from './ProductLinks'
import { guides, type ProductGuide } from './content'
import './landing.css'
import './guides.css'

function GuideChrome({ children }: { children: ReactNode }) {
  return <div className="stilltyping-landing nl-guide">
    <a className="nl-skip" href="#main">Skip to content</a>
    <header className="nl-header"><div className="nl-header-inner">
      <a className="nl-wordmark" href="/" aria-label="stilltyping home"><img className="nl-brand-mark" src="/stilltyping.png" width="36" height="36" alt="" /><span>stilltyping</span></a>
      <PageLink className="nl-button nl-button-small nl-button-glass" to="/signup">Request your workspace<ArrowRight size={14} aria-hidden="true" /></PageLink>
    </div></header>
    {children}
    <footer className="nl-footer nl-container"><div className="nl-footer-top"><a href="/" className="nl-wordmark">stilltyping</a><nav aria-label="Footer navigation"><a href="/">Home</a><PageLink to="/login">Log in</PageLink><PageLink to="/privacy">Privacy policy</PageLink></nav></div></footer>
  </div>
}

function GuidePage({ guide }: { guide: ProductGuide }) {
  return <GuideChrome><main id="main" className="nl-container">
    <nav className="nl-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">{guide.label}</span></nav>
    <section className="nl-guide-hero">
      <div><h1>{guide.heading}</h1><p>{guide.intro}</p><PageLink className="nl-button nl-button-primary" to="/signup">Request your workspace<ArrowRight size={16} aria-hidden="true" /></PageLink><span className="nl-guide-note">Account approval and feature setup are required.</span></div>
      <aside className="nl-guide-conversation" aria-label="Example conversation"><span className="nl-guide-example-label">Example conversation</span><p className="nl-guide-question">{guide.example.question}</p><p className="nl-guide-answer">{guide.example.answer}</p><small>{guide.example.note}</small></aside>
    </section>
    <div className="nl-guide-body"><nav className="nl-guide-contents" aria-label="On this page"><span>On this page</span>{guide.sections.map(section => <a href={`#${section.id}`} key={section.id}>{section.heading}</a>)}<a href="#get-started">Get started</a><a href="#questions">Common questions</a></nav>
      <article className="nl-guide-copy">
        {guide.sections.map(section => <section key={section.id} id={section.id}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.items && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}</section>)}
        <section id="get-started"><h2>Get started with {guide.label.toLowerCase()}</h2><ol>{guide.steps.map(step => <li key={step}>{step}</li>)}</ol></section>
        <section id="questions"><h2>Common questions</h2>{guide.faqs.map(faq => <div className="nl-guide-faq" key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></div>)}</section>
      </article>
    </div>
    <section className="nl-guide-related" aria-labelledby="related-title"><h2 id="related-title">Explore your workspace</h2><ProductLinks exclude={guide.path} /></section>
  </main></GuideChrome>
}

export function Site({ pathname }: { pathname: string }) {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/') return <LandingPage />
  if (path === '/privacy') return <GuideChrome><PrivacyPage /></GuideChrome>
  const guide = guides.find(item => item.path === path)
  if (guide) return <GuidePage guide={guide} />
  return <GuideChrome><main id="main" className="nl-container nl-not-found"><h1>That page isn’t here.</h1><p>Find customer support, website chat, and appointment requests from the stilltyping homepage.</p><a href="/" className="nl-button nl-button-primary">Go to the homepage</a><ProductLinks /></main></GuideChrome>
}
