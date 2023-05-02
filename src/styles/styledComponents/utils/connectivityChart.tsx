import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import ErrorMessageComponent from './errorMessage'
import { Translate } from 'translate'
import { connectivityQualityMap, monthMap } from '~/utils/functions/adminFunctions'
import { getFullYear, getMonth, getTwoDigitsYear } from '~/utils/functions/ispFunctions'
import { Fragment, useState } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Listbox, Transition } from '@headlessui/react'

type Reports = {
    month: string
    noInternetDays: number
    connectionQuality: string
    averageSpeed: number
    connectivityPercentage: string
    createdAt: string
}

type ConnectivityChartProps = {
    locale: string
    data: Reports[]
}

const ConnectivityChart: React.FC<ConnectivityChartProps> = ({ locale, data }) => {
    const t = new Translate(locale)

    const years = [
        { year: t.t("Year") },
        { year: "2023" },
        { year: "2024" },
        { year: "2025" },
        { year: "2026" },
        { year: "2027" },
        { year: "2028" },
        { year: "2029" },
        { year: "2030" }
    ]

    const [selectedYear, setSelectedYear] = useState(years[1])

    const getBarColor = (connectionQuality: string) => {
        switch (connectionQuality) {
            case 'LOW': return '#A93232'
            case 'MEDIUM': return '#285966'
            case 'HIGH': return '#02B5A5'
        }
    }

    const renderLegend = () => (
        <div className='bg-white p-2 rounded drop-shadow-lg text-ivtcolor2 font-bold text-2xl mt-4 mb-4 w-1/4'>
            <div className='flex justify-center mb-2'>{t.t("Connection Quality")} </div>
            <div className="flex justify-between ">
                <div className="flex items-center">
                    <div style={{ width: 24, height: 24 }} className="rounded border-2 border-[#000000] mr-1 bg-[#A93232]" />
                    <span className="text-base font-bold">{t.t("Low")}</span>
                </div>
                <div className="flex items-center">
                    <div style={{ width: 24, height: 24 }} className="rounded border-2 border-[#000000] mr-1 bg-ivtcolor2" />
                    <span className="text-base font-bold ">{t.t("Medium")}</span>
                </div>
                <div className="flex items-center">
                    <div style={{ width: 24, height: 24 }} className="rounded border-2 border-[#000000] mr-1 bg-ivtcolor" />
                    <span className="text-base font-bold">{t.t("High")}</span>
                </div>
            </div>
        </div>
    )

    const renderConnectivityChart = () => {
        if (!data) return <ErrorMessageComponent locale={locale} />

        function dataByYear(): Reports[] {
            if (selectedYear?.year === "Year" || selectedYear?.year === "Ano") {
                return [{
                    month: "NONE",
                    noInternetDays: -1,
                    connectionQuality: "NONE",
                    averageSpeed: -1,
                    connectivityPercentage: "NONE",
                    createdAt: ""
                }]
            }

            const newData = []
            for (const report of data) {
                const reportFullYear = getFullYear(report.createdAt)
                if (reportFullYear === selectedYear?.year) {
                    newData.push(report)
                }
            }

            const sorted = newData.sort((a, b) => {
                return getMonth(a.createdAt) - getMonth(b.createdAt)
            })

            return sorted
        }

        const newData = dataByYear()

        return (
            <ResponsiveContainer width="100%" height={600}>
                <BarChart
                    data={newData.map((report) => ({
                        month: `${t.t(monthMap(report.month))} ${getTwoDigitsYear(report.createdAt)}`,
                        connectivityPercentage: report.connectivityPercentage === "NONE" ? t.t("No Reports Available") : report.connectivityPercentage.replace('%', ''),
                        connectionQuality: connectivityQualityMap(report.connectionQuality),
                    }))}
                    margin={{
                        top: 15, left: -25, bottom: 5, right: 20
                    }} barCategoryGap={10}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="connectivityPercentage">
                        {
                            data.map((report) => (
                                <Cell key={`cell-${report.month}`} stroke="#565656" fill={getBarColor(report.connectionQuality)} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        )
    }

    return (
        <>
            <h2 className="bg-white p-2 rounded drop-shadow-lg text-ivtcolor2 font-bold text-2xl mt-4 mb-4">{t.t("Connectivity Chart")}</h2>
            <div className="flex justify-start items-center">
                <div className='w-1/8'>
                    <Listbox value={selectedYear} onChange={(e) => setSelectedYear(e)}>
                        <div className="relative">
                            <Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-ivtcolor sm:text-sm">
                                <span className="text-gray-900 block truncate">{selectedYear === undefined ? t.t("Select year") : selectedYear.year}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="text-gray-900 absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                    {years.map((year, yearIdx) => (
                                        <Listbox.Option
                                            key={yearIdx}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-ivtcolor text-white' : 'text-gray-900'
                                                }`
                                            }
                                            value={year}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                            }`}
                                                    >
                                                        {t.t(year.year)}
                                                    </span>
                                                    {selected.valueOf() ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ivtcolor2">
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
                <div className='flex justify-center w-full'>
                    {renderLegend()}
                </div>
            </div>
            {renderConnectivityChart()}
        </>
    )
}

export default ConnectivityChart