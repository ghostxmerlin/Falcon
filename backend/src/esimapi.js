// esimapi.js
const fs = require('fs');

// 读取 JSON 文件的方法
function readJsonFileSync(filepath) {
    const data = fs.readFileSync(filepath);
    return JSON.parse(data);
}

// 写入 JSON 文件的方法
function writeJsonFileSync(filepath, data) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// 获取 eSIM 列表的函数
function get_esim(tid) {
    const esimData = readJsonFileSync('../database/esim.json');
    const userEsims = esimData.filter((esim) => esim.tid === tid);
    if (userEsims.length === 0) {
        return { status: 404, data: 'No eSIMs found for the provided tid.' };
    }
    return { status: 200, data: userEsims };
}

// 根据 opid 获取 eSIM 列表的函数
function get_esim_opid(opid) {
    const esimData = readJsonFileSync('../database/esim.json');
    const operatorEsims = esimData.filter((esim) => esim.opid === opid);
    if (operatorEsims.length === 0) {
        return { status: 404, data: 'No eSIMs found for the provided opid.' };
    }
    return { status: 200, data: operatorEsims };
}

// 根据 uid 获取 eSIM 列表的函数
function get_esim_uid(uid) {
    const esimData = readJsonFileSync('../database/esim.json');
    const userEsims = esimData.filter((esim) => esim.opid === uid);
    if (userEsims.length === 0) {
        return { status: 404, data: 'No eSIMs found for the provided uid.' };
    }
    return { status: 200, data: userEsims };
}

// 售卖 eSIM 的函数
function sell_esim(tid, uid) {
    const dplusData = readJsonFileSync('../database/dplus.json');
    const esimData = readJsonFileSync('../database/esim.json');

    // 找到最小的未售出的 dpid
    const availableEsim = dplusData.find((esim) => esim.issold === false);
    if (!availableEsim) {
        return { status: 404, data: 'No available eSIMs to sell.' };
    }

    // 更新 dplus.json 中的 eSIM 为已售出
    availableEsim.issold = true;
    writeJsonFileSync('../database/dplus.json', dplusData);

    // 在 esim.json 中添加新记录
    const newRecord = {
        sequ: esimData.length + 1,
        tid: tid,
        opid: uid,
        dpid: availableEsim.dpid,
        rtime: new Date().toISOString(),
        isact: false,
        isreward: false,
        iccid: null
    };
    esimData.push(newRecord);
    writeJsonFileSync('../database/esim.json', esimData);

    return { status: 200, data: newRecord };
}

// 根据 eSIM 的 sequ 获取 dplink
function get_dp(dpid) {
    const dplusData = readJsonFileSync('../database/dplus.json');
    console.log(`dpid ${dpid}`);
    // 查找对应的 eSIM 记录
    const dpRecord = dplusData.find((dp) => dp.dpid === dpid);
    if (!dpRecord) {
        return { status: 404, data: 'No eSIM found for the provided sequ.' };
    }
    console.log(`dpRecord ${dpRecord.dplink} `);
    return { status: 200, data: dpRecord.dplink };
    // 根据 dpid 查找对应的 dplink
}

// 激活 eSIM 的函数
function act_esim(sequ, opid, devid, iccid) {
    const esimData = readJsonFileSync('../database/esim.json');

    // 查找对应的 eSIM 记录
    const esimRecord = esimData.find((esim) => esim.sequ === sequ);
    if (!esimRecord) {
        return { status: 404, data: 'No eSIM found for the provided sequ.' };
    }

    // 更新 eSIM 记录
    esimRecord.opid = opid;
    esimRecord.devid = devid;
    esimRecord.iccid = iccid;
    esimRecord.isact = true;
    esimRecord.isreward = true;

    writeJsonFileSync('../database/esim.json', esimData);

    return { status: 200, data: esimRecord };
}

module.exports = { get_esim, get_esim_opid, get_esim_uid, sell_esim, get_dp, act_esim };

// 测试代码
function runTests() {
    // console.log("Running tests...");
    // console.log("Running tests...");

    // // Test get_esim with existing tid
    // let testTid = '11111111';
    // let testResult = get_esim(testTid);
    // console.log(`Test get_esim with tid=${testTid}:`, testResult);

    //   let testOpid = '22222222';
    //   let testOpResult = get_esim_opid(testOpid);
    //   console.log(`Test get_esim_opid with opid=${testOpid}:`, testOpResult);


    //   let testUid = '22222222';
    //   let testUidResult = get_esim_uid(testUid);
    //   console.log(`Test get_esim_uid with uid=${testUid}:`, testUidResult);


    //   let sellTid = '12345678';
    //   let sellUid = '87654321';
    //   let sellResult = sell_esim(sellTid, sellUid);
    //   console.log(`Test sell_esim with tid=${sellTid} and uid=${sellUid}:`, sellResult);

    // Test get_dp with existing sequ
    //   let testSequ = 2;
    //   let dpResult = get_dp(testSequ);
    //   console.log(`Test get_dp with sequ=${testSequ}:`, dpResult);



    // Test act_esim with existing sequ
    // let testSequ = 1;
    // let testOpid = '22222222';
    // let testDevid = '77778888';
    // let testIccid = '7777888999000';
    // let actResult = act_esim(testSequ, testOpid, testDevid, testIccid);
    // console.log(`Test act_esim with sequ=${testSequ}:`, actResult);
}

runTests();
