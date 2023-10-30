'use client'
import Select, { components } from 'react-select'
import style from './PosInputStyle.module.scss'
import { AiFillCaretDown, AiOutlineSearch } from 'react-icons/ai'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import Image from 'next/image'

const cityOpts = [
  { value: '台北市', label: '台北市' },
  { value: '新北市', label: '新北市' },
  { value: '台中市', label: '台中市' },
  { value: '高雄市', label: '高雄市' },
]

const regionAry = [
  '大安區',
  '大同區',
  '士林區',
  '文山區',
  "中正區",
  "中山區",
  "內湖區",
  "北投區",
  "松山區",
  "南港區",
  "信義區",
  "萬華區",
  "臺大公館校區"
]

const regionOpts = regionAry.map(region => ({ value: region, label: region }))


const CityDropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <AiFillCaretDown />
    </components.DropdownIndicator>
  );
};

const PositionDropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <AiOutlineSearch />
    </components.DropdownIndicator>
  );
};

type Props = {
  data: Record<string, string | number>[]
}

export default function PositinDropdown({ data }: Props) {
  const router = useRouter()
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = useMemo(() => new URLSearchParams(Array.from(searchParams.entries())), [searchParams])

  // set ciry
  const handelUpdateQuery = (field: string, value?: string) => {
    if (field === 'city') {
      query.delete('position')
    }
    if (value) {
      query.set(field, value)
    } else {
      query.delete(field)
    }
    if (!query.toString()) {
      router.push(pathname)
      return
    }
    router.push(`${pathname}?${query.toString()}`)
  }

  // set position
  const [positionOpts, setPositionOpts] = useState<{ value: string, label: string }[]>()
  useEffect(() => {
    if (query.get('city') === '台北市') {
      const positionOpts = data.map((d: Record<string, string | number>) => {
        return { value: (d.sna as string), label: (d.sna as string).slice(11) }
      })
      setPositionOpts(positionOpts)
    } else {
      setPositionOpts([])
    }

    document.querySelector('#city-select .react-select__clear-indicator')?.addEventListener('click', () => {
      query.delete('city')
      query.delete('position')
      router.push(`${pathname}?${query.toString()}`)
    })
    document.querySelector('#position-select .react-select__clear-indicator')?.addEventListener('click', () => {
      query.delete('position')
      router.push(`${pathname}?${query.toString()}`)
    })
  }, [data, pathname, query, router])

  // set region
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [reginCheck, setReginCheck] = useState<Record<string, boolean>>(() => {
    const reginCheck: Record<string, boolean> = {}
    regionAry.forEach((region: string) => { reginCheck[region] = true })
    return reginCheck
  })
  const checkBoxRef = useRef<HTMLButtonElement[]>([])

  useEffect(() => {
    setIsCheckAll(true)

  }, [])

  useEffect(() => {
    checkBoxRef.current.forEach(ref => {
      const checkVal = isCheckAll ? 'checked' : 'unchecked'
      if (ref.dataset.state !== checkVal) {
        ref.dataset.state = checkVal
        ref.click()
      }
    })
  }, [isCheckAll])

  useEffect(() => {
    if (query.get('city') === '台北市') {
      const filtedData = data.filter(d => reginCheck[d.sarea] === true)
      const newPositionOpts = filtedData.map((d: Record<string, string | number>) => {
        return { value: (d.sna as string), label: (d.sna as string).slice(11) }
      })
      setPositionOpts(newPositionOpts)
    }

  }, [data, query, reginCheck])

  useEffect(() => {
    if (query.get('city') !== '台北市') return
    const regionQuery = []
    for (let key in reginCheck) {
      if (reginCheck[key] === true) {
        regionQuery.push(key)
      }
    }
    if (regionQuery.length) {
      query.set('region', regionQuery.join(','));
    } else {
      query.delete('region');

    }
    router.push(`${pathname}?${query.toString()}`)
  }, [pathname, query, reginCheck, router])

  const handleReginCheckbox = (region: string, val: boolean) => {
    setReginCheck(prev => ({ ...prev, [region]: val }))
    query.delete('position')
    router.push(`${pathname}?${query.toString()}`)
  }

  return (
    <>
      <div className={`px-8 ${style.myReactSelect} md:flex`}>
        <Select
          id="city-select"
          // key={`city-select_${query.get('city')}`}
          options={cityOpts}
          isClearable={true}
          placeholder="選擇縣市"
          classNamePrefix="react-select"
          className='md:w-[175px] md:mr-4 mb-2'
          components={{ DropdownIndicator: CityDropdownIndicator }}
          value={query.get('city') ? { value: query.get('city'), label: query.get('city') } : undefined}
          onChange={opt => opt?.value && handelUpdateQuery('city', opt?.value)}
        />
        <Select
          id="position-select"
          key={`city-select_${query.get('position')}`}
          options={positionOpts}
          isClearable={true}
          placeholder="搜尋站點"
          classNamePrefix="react-select"
          className='md:w-[277px]'
          components={{ DropdownIndicator: PositionDropdownIndicator }}
          value={query.get('position') ? { value: query.get('position'), label: query.get('position')?.slice(11) } : undefined}
          onChange={opt => opt?.value && handelUpdateQuery('position', opt?.value)}
          styles={{
            singleValue: (styles) => {
              return {
                ...styles,
                color: '#B5CC22'
              }
            },
            option: (styles, { isSelected }) => {
              return {
                ...styles,
                color: isSelected ? '#B5CC22' : 'black',
                backgroundColor: isSelected ? 'white' : 'white',
              }
            }
          }}
        />
      </div>
      <div className='flex'>
        <div className='px-10 py-9 md:w-[575px] w-full'>
          {(query.get('city') === '台北市') && (<>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkAll"
                checked={isCheckAll}
                onCheckedChange={(val: boolean) => setIsCheckAll(val)}
              />
              <label
                htmlFor="checkAll"
                className="text-[16px] md:text-[18px] font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                全部勾選
              </label>
            </div>
            <div className='grid grid-cols-3 md:grid-cols-4 gap-6 mt-6'>
              {regionOpts.map((opt, i) => (
                <div className="flex items-center space-x-2 md:mt-3" key={opt.value}>
                  <Checkbox
                    id={opt.value}
                    ref={(ele: HTMLButtonElement) => checkBoxRef.current[i] = ele}
                    checked={reginCheck[opt.value]}
                    onCheckedChange={(val: boolean) => handleReginCheckbox(opt.value, val)}
                  />
                  <label
                    htmlFor={opt.value}
                    className="text-[16px] md:text-[18px] font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap"
                  >
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
          </>)
          }
        </div>
        <div className='hidden md:block mt-auto mb-10'>
          <Image src="/img.svg" alt="img" width={500} height={171} />
        </div>
      </div>
    </>
  )
}
