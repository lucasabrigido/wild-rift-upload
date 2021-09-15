export function longStringReplacer(key, value) {
    if (typeof value === 'string') {
        if (value.length < 512) {
            return value;
        }

        return value.substring(0, 200) + '...' + value.substring(value.length - 200);
    }

    return value;
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function comparer(otherArray) {
    return function(current) {
        return otherArray.filter(other => other === current).length === 0;
    };
}

export function maskedCardNumber(number) {
    if (!number) {
        return number;
    }
    return number
        .toString()
        .replace(/(\d+)(\d{4})$/g, (_, prefix, suffix) => ''.padStart(prefix.length, 'X') + suffix);
}

export function maskedSecurityCode(number) {
    if (!number) {
        return number;
    }
    return number
        .toString()
        .replace(/./g, 'X');
}

export function maskedData(data = {}) {
    let stringData = JSON.stringify(data);
    if (stringData && typeof stringData === 'string') {
        const newData = JSON.parse(
            stringData
                .replace(/(security_?code[^\d]+)(\d+)/igms, (_, prefix, number) => prefix + maskedSecurityCode(number))
                .replace(/(credit.*card.*number[^\d]+)(\d+)/igms, (_, prefix, number) => prefix + maskedCardNumber(number)),
        );
        return newData;
    }
    return data;
}
