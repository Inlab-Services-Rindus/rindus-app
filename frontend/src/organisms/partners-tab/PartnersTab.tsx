import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { StoreContext } from '@/context/store/Store'
import Tab from '@/molecules/tab/Tab'
import '@/organisms/partners-tab/PartnersTab.scss'

export function PartnersTab() {
    const {
        partners: { data, isLoading },
        getPartners,
    } = useContext(StoreContext)

    const navigate = useNavigate()

    useEffect(() => {
        getPartners()
    }, [])

    return (
        <Tab
            isLoading={isLoading}
            className="partners-tab__container"
            dataTestId="partners-tab"
        >
            {data?.map((partner, index) => (
                <div
                    className="partner-card"
                    key={index}
                    onClick={() => navigate(`/partner/${partner.id}`)}
                >
                    <img
                        className="partner-image"
                        src={partner.logoUrl}
                        loading="lazy"
                    ></img>
                </div>
            ))}
        </Tab>
    )
}
