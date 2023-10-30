import { Button } from "@/components/ui/button"
import Link from 'next/link'

type Props = {
  navLinks: { name: string, href: string }[],
  slug?: string | string[]
}

export default function MenuExpand({ navLinks, slug }: Props) {

  return (
    <div className='z-10 fixed top-[72px] right-0 bg-primary h-[672px] w-full flex animation slide-in 0.5s ease-out'>
      <ul className='p-8 space-y-8'>
        {navLinks.map(nav => (
          <li key={nav.name} className={`text-lg ${(slug && slug[0] === nav.href.slice(1)) ? 'text-secondary' : 'text-white'}`}>
            <Link href={nav.href}>{nav.name}</Link>
          </li>
        ))}
      </ul>
      <Button asChild className='bg-white text-primary rounded-full px-6 absolute left-[32px] bottom-[32px] hover:bg-white'>
        <Link href="/login">登入</Link>
      </Button>
    </div>
  )
}
