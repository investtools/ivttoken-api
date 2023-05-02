import { Administrators, Role, PrismaClient } from "@prisma/client"
import { CreateSchool } from "../src/service/schools/interfaces/interfaces"

const prisma = new PrismaClient()

async function main() {
    const schoolA: CreateSchool = {
        name: "Escola A",
        state: "SP",
        city: "São Paulo",
        zipCode: "00000-000",
        address: "Rua A, 123",
        cnpj: "000000000000000",
        inepCode: "12345678",
        email: "escolaA@example.com",
        role: Role.SCHOOL,
        administrator: Administrators.STATE
    }

    const schoolB: CreateSchool = {
        name: "Escola B",
        state: "SP",
        city: "São Paulo",
        zipCode: "00000-000",
        address: "Rua A, 123",
        cnpj: "1111111111",
        inepCode: "87654321",
        email: "escolaB@example.com",
        role: Role.SCHOOL,
        administrator: Administrators.MUNICIPALITY
    }

    const schools = [schoolA, schoolB]
    const createdSchools = []

    for (const school of schools) {
        const create = await prisma.schools.create({
            data: {
                name: school.name,
                state: school.state,
                city: school.city,
                zipCode: school.zipCode,
                address: school.address,
                cnpj: school.cnpj,
                inepCode: school.inepCode,
                email: school.email,
                role: school.role,
                administrator: school.administrator
            }
        }) 
        createdSchools.push(create)
    }
    console.log(createdSchools)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
