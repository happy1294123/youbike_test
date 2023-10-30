'use client'
import useCheckMobile from '@/lib/useCheckMobile'
import Image from 'next/image'
import { FiMenu } from 'react-icons/fi'
import { AiOutlineClose } from 'react-icons/ai'
import Link from 'next/link'
import { useState } from 'react'
import MenuExpand from './MenuExpand'
import { Button } from './ui/button'

const navLinks = [
  {
    name: '使用說明',
    href: '/intro'
  },
  {
    name: '收費方式',
    href: '/price'
  },
  {
    name: '站點資訊',
    href: '/position'
  },
  {
    name: '最新消息',
    href: '/news'
  },
  {
    name: '活動專區',
    href: '/event'
  },
]

type Props = {
  slug: string
}

export default function Navbar({ slug }: Props) {
  const [openExpend, setOpendExpend] = useState(false)
  const isMobile = useCheckMobile()

  return (
    <div className='px-8 md:px-[124px] h-[72px] md:h-[104px] flex justify-between items-center border border-b-1'>
      <div className='flex items-center'>
        <Link href="/">
          <Image src="/logo.svg" alt='logo' width={isMobile ? 65 : 95} height={isMobile ? 65 : 95} />
        </Link>
        <ul className='hidden md:flex ml-[60px] space-x-10 whitespace-nowrap'>
          {navLinks.map(nav => (
            <li key={nav.name} className={`text-lg ${(slug && slug[0] === nav.href.slice(1)) ? 'text-primary' : 'text-secondary'}`}>
              <Link href={nav.href}>{nav.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <Button asChild className='bg-primary text-white rounded-full px-6 hidden md:block hover:bg-primary'>
        <Link href="/login">登入</Link>
      </Button>
      <div className='cursor-pointer md:hidden' onClick={() => setOpendExpend(!openExpend)}>
        {openExpend
          ? <AiOutlineClose color='#B5CC22' fontSize={24} />
          : <FiMenu color='#B5CC22' fontSize={24} />
        }
      </div>
      {openExpend && <MenuExpand navLinks={navLinks} slug={slug} />}
    </div>
  )
}
