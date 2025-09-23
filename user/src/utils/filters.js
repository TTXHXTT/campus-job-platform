import dayjs from 'dayjs'
/*
* 模拟过滤器
* */

//普通时间戳转
export function time_filter(num, form = "YYYY-MM-DD HH:mm:ss") {
    if (num) {
        if (num.toString().length == 10) {
            num = num * 1000;
        }
        return dayjs(num).format(form);
    }
    return "-";
}

export function datetime_filter(num) {
    console.log(num)
    if (num && num != "1970-01-01 00:00:00") {
        return num
    }
    return "-";
}

// 小数点前
export function radixPointBefore(prices) {
    let price = String(prices);
    if (price && price.indexOf(".") != -1) {
        return price.substring(0, price.indexOf("."));
    } else {
        return "00";
    }
}

// 小数点后
export function radixPointAfter(prices) {
    let price = String(prices);
    if (price && price.indexOf(".") != -1) {
        return price.substring(price.indexOf("."), price.length);
    } else {
        return ".00";
    }
}

// 数据合法性验证
export function data_validate(row, column, cellValue, index) {
    if (cellValue == 'None' || cellValue == 'none' || cellValue == 'undefined' || cellValue == undefined || cellValue == 'Null' || cellValue == null || cellValue == '') {
        return '-'
    }
    return cellValue
}

// 号码加密
export function encryption(tal, first = 3, last = 4) {
    if (typeof tal == 'number') {
        tal = tal.toString()
    }
    if (!tal) return '-';
    let one = new RegExp("^\\d{" + first + "}");
    let two = new RegExp("\\d{" + last + "}$");
    let firstLength = one.exec(tal)[0];
    let lastLength = two.exec(tal)[0];
    let StarLength = tal.length - firstLength.length - lastLength.length;
    let star = '';
    do {
        star += '*'
    } while (star.length < StarLength)
    return firstLength + star + lastLength;
}

// 周格式化

export function week(week) {
    switch (week) {
        case 0:
            return 'Sun';
        case 1:
            return 'Mon';
        case 2:
            return 'Tue';
        case 3:
            return 'Wed';
        case 4:
            return 'Thu';
        case 5:
            return 'Fri';
        case 6:
            return 'Sat';
    }
}

export function filter_final_appointment_time(time, title = '立即预约') {
    if (time) {
        let one = time.split(' ')
        let two = one[0].split('-')
        let three = one[1].split(':')
        return `${two[1]}-${two[2]} ${three[0]}:${three[1]}`
    } else {
        return title
    }
}
