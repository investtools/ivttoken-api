import Head from 'next/head'

function PageHeader({ title }: { title: string }) {
    return (
        <Head>
            <meta name="description" content="By InvestTools" />
            <title>{title}</title>
            <link rel="icon" type="image/png" href="/favicon.png" />
        </Head>
    )
}

export default PageHeader