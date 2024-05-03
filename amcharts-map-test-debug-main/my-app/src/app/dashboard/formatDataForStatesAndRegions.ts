import { formatCurrency } from "./formatCurrency"

// import { type IRegionAndStateData } from "../../services/api/billing/getBillingByRegionAndState"


export interface IRegionAndStateData {
  comp_id: number
  state: string
  region: string
  total_value: number
  percentage: number
  order_date: string
  [key: string]: string | number
}

const acronym = [
  "AC",
  "AL",
  "AM",
  "AP",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PE",
  "PI",
  "PR",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

export type TAllData = Record<string, { total: number }>

export interface StateData {
  id: string
  value: number
}

export interface RegionData {
  category: string
  value: number
  total: string
}

export default function formatDataForStatesAndRegions(
  data: IRegionAndStateData[],
  type: string,
  afterComma = 0,
  percentage: boolean,
): StateData[] | RegionData[] {
  let total = 0
  const allData: TAllData = {}
  const arr: StateData[] | RegionData[] = []
  if (data.length > 0) {
    data.forEach((item) => {
      total = item.total_value + total
      if (allData[item[type]] === undefined) {
        allData[item[type]] = { total: item.total_value }
      } else {
        allData[item[type]].total = item.total_value + allData[item[type]].total
      }
    })
    if (type === "state") {
      acronym.forEach((abbr) => {
        ;(arr as StateData[]).push({
          id: `BR-${abbr}`,
          value:
            percentage && allData[abbr] !== undefined
              ? Number(((allData[abbr].total * 100) / total).toFixed(afterComma))
              : allData[abbr]?.total !== undefined
                ? allData[abbr].total
                : 0,
        })
      })
    } else {
      Object.entries(allData).forEach(([key, obj]) => {
        ;(arr as RegionData[]).push({
          category: key,
          value: percentage ? Number(((obj.total * 100) / total).toFixed(afterComma)) : obj.total,
          total: formatCurrency(obj.total),
        })
      })
    }
  }

  return arr.sort((a, b) => a.value - b.value)
}
