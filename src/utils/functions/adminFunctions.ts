import { Administrators, Role } from "@prisma/client"

export function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

export interface ViaCEPAddress {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    ibge: string
    gia: string
    ddd: string
    siafi: string
    erro?: boolean
}


export function entityMap(entity: string) {
    switch (entity) {
        case "GIGA": return "Giga"
        case "UNICEF": return "Unicef"
        case "GOVERNMENT": return "Government"
        case "INVESTTOOLS": return "InvestTools"
    }
}

export function mapAdministrator(administrator: string) {
    administrator = administrator.toLowerCase()
    switch (administrator) {
        case 'state': return Administrators.STATE
        case 'estado': return Administrators.STATE
        case 'municipality': return Administrators.MUNICIPALITY
        case 'município': return Administrators.MUNICIPALITY
    }
}

export function monthMap(month: string) {
    switch (month) {
        case "JAN": return "January"
        case "FEB": return "February"
        case "MAR": return "March"
        case "APR": return "April"
        case "MAY": return "May"
        case "JUN": return "June"
        case "JUL": return "July"
        case "AUG": return "August"
        case "SEP": return "September"
        case "OCT": return "October"
        case "NOV": return "November"
        case "DEC": return "December"
        case "LOADING": return "Loading..."
        default: return "No Reports Available"
    }
}

export function connectivityQualityMap(connectivityQuality: string) {
    switch (connectivityQuality) {
        case "LOW": return "Low"
        case "HIGH": return "High"
        case "MEDIUM": return "Medium"
        case "LOADING": return "Loading..."
        default: return "No Reports Available"
    }
}

export function administratorNameMapping(name: string): string {
    switch (name) {
        case Administrators.STATE: return "State"
        case Administrators.MUNICIPALITY: return "Municipality"
        default: return "-"
    }
}

export function mapRole(role: string) {
    role = role.toLowerCase()

    switch (role) {
        case "admin": return Role.ADMIN
        case "internet service provider": return Role.ISP
        case "school administrator": return Role.SCHOOL
    }
}