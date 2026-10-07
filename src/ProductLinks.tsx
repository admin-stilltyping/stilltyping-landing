import { ArrowRight } from 'lucide-react'
import { guides } from './content'

export function ProductLinks({ exclude }: { exclude?: string }) {
  return <nav className="nl-product-links" aria-label="Explore stilltyping">
    {guides.filter(guide => guide.path !== exclude).map(guide => <a key={guide.path} href={guide.path}>
      <span><strong>{guide.label}</strong><span>{guide.description}</span></span><ArrowRight size={20} aria-hidden="true" />
    </a>)}
  </nav>
}
