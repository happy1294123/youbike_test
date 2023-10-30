import PosInput from "@/components/PosInput";
import getYoubikeData, { Data } from "@/lib/getYoubikeData";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false })
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const headerStyle = 'text-white text-center text-lg whitespace-nowrap my-auto '

export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const data: Data[] = await getYoubikeData()

  const filtedData = data.filter(d => {
    if (searchParams?.position) {
      return d.sna === searchParams.position
    }
    if (searchParams?.region) {
      return searchParams.region.includes(d.sarea)
    }
    return false
  })

  return (<>
    <Navbar slug={params.slug || ''} />
    <div className="md:px-[124px]">
      <div className="text-primary text-lg md:text-2xl p-6">站點資訊</div>
      <PosInput data={data} />
      {(searchParams?.city === '台北市' && filtedData.length > 0) ? (
        <div className="overflow-auto rounded-xl md:rounded-3xl border border-[#AEAEAE] max-h-[500px] mb-20 relative mx-10 md:mx-0">
          <Table>
            <TableHeader className="bg-primary h-[66px]">
              <TableRow>
                <TableHead className={`${headerStyle}`}>縣市</TableHead>
                <TableHead className={`${headerStyle}`}>區域</TableHead>
                <TableHead className={`${headerStyle}`}>站點名稱</TableHead>
                <TableHead className={`${headerStyle}`}>可借車輛</TableHead>
                <TableHead className={`${headerStyle}`}>可還空位</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtedData.map((d: Data, i: number) => (
                <TableRow key={d.sno} className={`${i % 2 === 1 && 'bg-[#F6F6F6]'} text-center text-[14px] md:text-[16px] md:whitespace-nowrap`}>
                  <TableCell className="whitespace-nowrap">台北市</TableCell>
                  <TableCell className="whitespace-nowrap">{d.sarea}</TableCell>
                  <TableCell>{d.sna.slice(11)}</TableCell>
                  <TableCell className="text-primary font-bold">{d.tot}</TableCell>
                  <TableCell className="text-primary font-bold">{d.bemp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )
        : <span className="text-primary text-3xl flex justify-center">無資料 </span>
      }
    </div >
  </>
  )
}
