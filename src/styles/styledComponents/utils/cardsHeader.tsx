type CardsHeaderProps = {
    title: string
}

const CardsHeader: React.FC<CardsHeaderProps> = ({ title }) => {
    return (
        <h2 className="text-ivtcolor2 font-bold text-2xl mb-4 bg-white">{title}</h2>
    )
}

export default CardsHeader