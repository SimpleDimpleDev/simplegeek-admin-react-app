export const YandexMapsApiKey = 'd717dceb-63dc-41b9-8868-b4a77acb6f12'
export const CDEKWidgetServicePath = 'https://api.simplegeek.ru/api/cdek'

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
