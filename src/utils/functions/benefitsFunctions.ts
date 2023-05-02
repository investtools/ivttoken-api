import { Benefits } from "@prisma/client";

export const benefits = [
    {
        id: "01",
        benefit: Benefits.TAX_BREAK,
        benefitPrice: "500"
    }
]

export function mapBenefits(benefits: string) {
    switch (benefits) {
        case "TAX_BREAK": return "Tax Break"
    }
}

export function mapBenefitType(benefit: string) {
    switch (benefit) {
        case "TAX_BREAK": return Benefits.TAX_BREAK
    }
}

export function benefitPriceByName(benefit: string) {
    switch (benefit) {
        case "TAX_BREAK": return "500"
    }
}