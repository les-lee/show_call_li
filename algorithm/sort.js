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
    var totalLength = args.length;
    // 无序数组的循环.
    for (var i = 1; i < totalLength; i++) {
        
        for (var j = 0; j < i; j++) {
            if (args[j] > args[i]) {
                //  1, 2, 3, 45, 6, 7, 8, 9
                //     j     i
                args.splice(j, 0, args[i]);
                args.splice(i + 1, 1);
                break;
            }
        }
    }
    return args;
}
console.log('insert---', insert());

/**
 * shell sort (希尔)
 * 
 * 希尔排序的关键是分步的策略.
 * 从维基百科中查阅到,最优解是由两个多项式决定的(这里涉水有点深,以后用到再了解不迟).
 * 为了简单,这里采用原始的二分策略.
 */
function shellsort (args = [1, 2, 3, 45, 6, 7, 8, 9]) {
    // 首先定义一个步伐
    var length = args.length;
    var gap;;
    for (var gap = length >> 1 ; gap > 0; gap >>= 1 ) {
        for (var i = gap ; i < length; i++) {
            for (var j = i - gap ; j < length; j = j + gap) {
                
                if (args[i - gap] > args[j]) {
                    args.splice(i - gap, 0, args[j])
                    args.splice(j + 1 , 1);
                    break;
                }
            }
        }
    }

    return args;
}

console.log('shellsort---', shellsort());

/**
 * merge sort 归并排序
 * 递归实现
 */

function mergesort (args = [4, 99, 22, -7, 5, 33, 7, 35]) {
    if (args.length === 1) return args;
    var middle = args.length/2;
    // 分治法, 一分为二.
    var args1 = mergesort(args.slice(0, middle));
    var args2 = mergesort(args.slice(middle));

    var result = [];
    var temp1 = undefined;
    var temp2 = undefined;
    // 这下面是一个最快的选择排序,因为第一个就是最小的.不用遍历.
    while (args1.length != 0 && args2.length != 0) {
        temp1 = temp1 || args1.shift();
        temp2 = temp2 || args2.shift();
        
        if (temp1 > temp2) {
            result.push(temp2);
            // 如果是引用类型,这里不能直接赋值.
            temp2 = undefined;
        } else {
            result.push(temp1);
            temp1 = undefined;
        }
    }
    var rest;
    args1.length ? rest = args1.shift() : rest = args2.shift();
    // 如果没有剩下的,代表全部OK.把最后一个比较的值加在最后即可,因为他一定是最大的.
    if (!rest) return result.concat(temp1 || temp2);
    // 如果有剩下的, 就要考虑是否剩下的跟最后一个比较的值得大小.有可能最后一个比较的不是最大的.
    rest > temp1 || temp2 ? result = result.concat(temp1 || temp2, rest) :  result = result.concat(rest, temp1 || temp2);

    return result;
}

console.log('merge---', mergesort());