export type Data = {
  sno: string,
  sna: string,
  tot: number,
  sbi: number,
  sarea: string,
  mday: string,
  lat: number,
  lng: number,
  ar: string,
  sareaen: string,
  snaen: string,
  aren: string,
  bemp: number,
  act: string,
  srcUpdateTime: string,
  updateTime: string,
  infoTime: string,
  infoDate: string
}

export default async function getYoubikeData() {
  const apiData = await fetch('https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json', { cache: 'no-cache' })
  const data: Data[] = await apiData.json()

  return data
}
