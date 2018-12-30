/**
 * 欧几里得算法
 * 两个整数的最大公约数,就是较小的数与两数相除的余数的最大公约数.
 */
function euclid(x, y) {
    if (x === void 0) { x = 377; }
    if (y === void 0) { y = 319; }
    var t = x % y;
    console.log(y);
    if (t == 0) {
        return y;
    }
    return euclid(y, t);
}
console.log('euclid---', euclid());
/**
 * 大数添加
 */
function addBignum(num1, num2) {
    var result = [];
    var arr1 = num1.split("").slice();
    var arr2 = num2.split("").slice();
    var shortarr = arr1.length < arr2.length ? arr1 : arr2;
    var longarr = arr1.length > arr2.length ? arr1 : arr2;
    // 缓存值
    var temp = 0;
    var needadd = false;
    while (longarr.length > 0) {
        temp = Number(shortarr.pop() || 0) + Number(longarr.pop());
        if (temp !== temp)
            throw new Error("参数必须是数字字符串");
        if (needadd) {
            temp++;
        }
        needadd = temp > 9;
        temp = temp % 10;
        result.push(temp);
    }
    return result.reverse().join("");
}
console.log('addbigunm---', addBignum("65498", "154654"));
/**
 * 冒泡排序
 * 交换位置,把大的(小的)位置换到左边(右边)去.
 */
function bubbling(args) {
    if (args === void 0) { args = [4, 99, 22, 7, 5, 33, 7]; }
    var temp;
    for (var i = 0; i < args.length; i++) {
        for (var j = i + 1; j < args.length; j++) {
            if (args[i] > args[j]) {
                temp = args[i];
                args[i] = args[j];
                args[j] = temp;
            }
        }
    }
    return args;
}
console.log('bubbling----', bubbling());
/**
 * 选择排序
 * 每次都从无序的数组中选择一个最大(最小)的数放到有序的一边去.
 */
function selection(args) {
    if (args === void 0) { args = [4, 99, 22, 7, 5, 33, 7]; }
    var originArrarr = args.slice();
    var result = [];
    var bigest = originArrarr[0];
    var index = -1;
    var totallength = originArrarr.length;
    for (var j = 0; j < totallength; j++) {
        for (var i = 0; i < originArrarr.length; i++) {
            if (originArrarr[i] >= bigest) {
                bigest = originArrarr[i];
                index = i;
            }
        }
        // 可以不删除,但是这样的话,要做多很多的操作.
        originArrarr.splice(index, 1);
        result.push(bigest);
        bigest = originArrarr[0];
    }
    return result;
}
console.log('selection---', selection());
/**
 * 快排
 * 选一个基准,比基准小的放一边,比基准大的放一边.最后整合.
 */
function quick(args) {
    if (args === void 0) { args = [4, 99, 22, 7, 5, 33, 7]; }
    var l = args.length;
    if (l < 2)
        return args;
    var left = [];
    var right = [];
    var basic = args[0];
    for (var i = 1; i < args.length; i++) {
        args[i] > basic ? left.push(args[i]) : right.push(args[i]);
    }
    return quick(left).concat(basic, quick(right));
}
console.log('quick---', quick());
/**
 * 插入排序
 * 在无序的数组中一个一个的挑选,然后插入到有序的数组中,关键在,有序的数组要扩容.
 */
function insert(args) {
    if (args === void 0) { args = [1, 2, 3, 45, 6, 7, 8, 9]; }
    // 首先拿一个出来作为有序数组的开头.
    var result = [args[0]];
    var totalLength = args.length;
    // 无序数组的循环.
    for (var i = 1; i < totalLength; i++) {
        var current = args[i];
        // 有序数组的循环,从后往前.
        var secondMaxIndex = -1;
        for (var j = result.length; j > 0; j--) {
            var last = j - 1;
            if (current > result[last]) {
                secondMaxIndex = last;
                break;
            }
        }
        if (secondMaxIndex >= 0) {
            result = result.slice(0, secondMaxIndex + 1).concat(current, result.slice(secondMaxIndex + 1));
        }
        else {
            result.unshift(current);
        }
    }
    return result;
}
console.log('insert---', insert());
