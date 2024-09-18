export const getRuGoodsWord = (count: number) => {
    if (count % 10 === 1 && count % 100 !== 11) {
        return "Товар";
    }
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
        return "Товара";
    }
    return "Товаров";
};

export class DateFormatter {
    private static cyrillicMonthNames = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ];

    static DDMMYYYY(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    static CyrillicMonthNameYYYY(date: Date): string {
        const monthIndex = date.getMonth();
        const cyrillicMonth = this.cyrillicMonthNames[monthIndex];
        return `${cyrillicMonth} ${date.getFullYear()}`;
    }

    static HHMMSS(rawTime: number): string {
        // Calculate hours, minutes, and seconds
        const hours = Math.floor(rawTime / (1000 * 60 * 60));
        const minutes = Math.floor((rawTime / (1000 * 60)) % 60);
        const seconds = Math.floor((rawTime / 1000) % 60);
        const hoursString = hours > 0
            ? `${hours.toString().padStart(2, '0')}:`
            : '';
        const minutesString = minutes.toString().padStart(2, '0');
        const secondsStrng = seconds.toString().padStart(2, '0');
        return `${hoursString}${minutesString}:${secondsStrng}`
    }
};