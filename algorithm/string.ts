
/**
 * 大树相加算法,使用最短的字符串执行循环,这是我能想到的最优解了.
 */
function addBignum (num1: string, num2: string) : string { 
    var result = []; 
    var arr1 = num1.split('').slice(); 
    var arr2 = num2.split('').slice(); 
    var shortarr = arr1.length < arr2.length ? arr1 : arr2; 
    var longarr = arr1.length > arr2.length ? arr1 : arr2; 
    // 缓存值 
    var temp = 0; 
    var needadd = false; 
    var lastadd = false; 
    while (shortarr.length > 0) { 
        lastadd = false; 
        temp = Number(shortarr.pop()) + Number(longarr.pop());
        if (temp !== temp) throw new Error('参数必须是数字字符串');
        if (needadd) { 
            temp++; 
            lastadd = true; 
        } 
        needadd = temp > 9; 
        temp = temp % 10; 
        result.push(temp); 
    } 
    if (lastadd) { 
        longarr.push((Number(longarr.pop()) + 1) + ''); 
    } 
    return longarr.concat(result.reverse()).join(''); 
}