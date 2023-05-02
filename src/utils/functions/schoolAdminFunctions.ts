import { ConnectionQuality, Months } from "@prisma/client"

export const getMaxDays = (month: string | undefined): number => {
  const year: number = new Date().getFullYear()
  switch (month) {
    case 'January':
    case 'March':
    case 'May':
    case 'July':
    case 'August':
    case 'October':
    case 'December':
      return 31
    case 'April':
    case 'June':
    case 'September':
    case 'November':
      return 30
    case 'February':
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return 29
      }
      return 28
    default:
      return 31
  }
}

export function mapMonthsEnglish(month: string) {
  month = month.toLowerCase()

  switch (month) {
    case "january": return Months.JAN
    case "february": return Months.FEB
    case "march": return Months.MAR
    case "april": return Months.APR
    case "may": return Months.MAY
    case "june": return Months.JUN
    case "july": return Months.JUL
    case "august": return Months.AUG
    case "september": return Months.SEP
    case "october": return Months.OCT
    case "november": return Months.NOV
    case "december": return Months.DEC
  }
}

export function translateMonthToEnglish(month: string) {
  month = month.toLowerCase()

  switch (month) {
    case "janeiro": return "january"
    case "fevereiro": return "february"
    case "março": return "march"
    case "abril": return "april"
    case "maio": return "may"
    case "junho": return "june"
    case "julho": return "july"
    case "agosto": return "august"
    case "setembro": return "september"
    case "outubro": return "october"
    case "novembro": return "november"
    case "dezembro": return "december"
    default: return "-"
  }
}

export function translateConnectionQualityToEnglish(connectionQuality: string) {
  connectionQuality = connectionQuality.toLowerCase()

  switch (connectionQuality) {
    case "baixa": return "low"
    case "mediana": return "medium"
    case "alta": return "high"
    default: return "-"
  }
}

export function mapConnectionQuality(connectionQuality: string) {
  connectionQuality = connectionQuality.toLowerCase()

  switch (connectionQuality) {
    case "low": return ConnectionQuality.LOW
    case "high": return ConnectionQuality.HIGH
    case "medium": return ConnectionQuality.MEDIUM
  }
}

export const translateSchoolKey = (key: string) => {
  const translationMap = {
    Name: 'Name',
    State: 'State',
    City: 'City',
    ZipCode: 'Zip Code',
    Address: 'Address',
    CNPJ: 'Cnpj',
    InepCode: 'Inep Code',
    Admnistrator: 'Administrator',
    EMail: 'E-Mail',
    Tokens: "Tokens",
    Provider: 'Provider',
    Reports: 'Reports'
  }

  return translationMap[key as keyof typeof translationMap] || key
}