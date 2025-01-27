export const YandexMapsApiKey = 'd717dceb-63dc-41b9-8868-b4a77acb6f12'
export const CDEKWidgetServicePath = `${import.meta.env.SHOP_API_URL}/api/cdek`

interface CDEKFromPoint {
    country_code: string,
    city: string,
    postal_code: number,
    code: number,
    address: string,
};

export const CDEKFromPoint: CDEKFromPoint = {
    country_code: 'RU',
    city: 'Москва',
    postal_code: 115280,
    code: 44,
    address: 'Автозаводская улица, дом 15',
};
