const { dockStart } = require('@nlpjs/basic')
const { prosesOpenAI } = require('./openAI')
const { ayatSekianSampaiSekian, informasiSurat, ayatAcak, cariTeks, nomorSurahAyatTertentu, nomorSurahTafsirAyatTertentu, nomorSurahInfoSurah, shareAyat, getNomorSurah, selfLog } = require('./fungsi')
const infoSurah = require('./data/context-informasi.json')
const alquran = require('./data/alquran.json')
const { json } = require('express')

async function ProsesNlp(inputUser, language, tipe) {
    const dock = await dockStart();
    const nlp = dock.get('nlp');
    await nlp.train()

    var Step = 0;
    try {
        Step = 1; // Variabel simpan jawaban dari user        
        var isi = '', input = inputUser; 1
        if (input != undefined) {
            Step = 2; // Proses nlp 
            const resN = await nlp.process(input.toLowerCase().replace(/(?<![a-z])\s+(?=\W|\d)/gi, '').replace(/(\s+|)-(\s+|)(?!\d)/gi, '').replace(/(\s+|)('|-)(\s+(?!aya(t|h|y))|)(?!\d)/gi, ''));
            console.log(resN);
            // selfLog(`utterance: ${resN.utterance}\n|\nintent: ${resN.intent}\n|\nanswer: ${resN.answer}\n|\nlanguage: ${language}\n|\ntipe: ${tipe}`);
            if (resN.intent == 'qurani.ayat') {
                Step = 3; // Ayat tertentu

                var arrSurah = Object.keys(alquran);
                var noSurah = getNomorSurah(resN);
                var surahKey = arrSurah[noSurah - 1];
                var noAyat = Number(resN.entities[resN.entities.length - 1].option) + 1;
                var nmSurah = alquran[surahKey].nama;
                var artiNm = alquran[surahKey].arti;
                var arrAyat = alquran[surahKey].ayat;
                console.log(arrAyat.length);
                if (noAyat <= arrAyat.length) {
                    var ayat = arrAyat[noAyat-1]; // kurangi 1 karena ngambil pakai index
                    var juz = ayat.juz;
                    var hal = ayat.page_num;
                    var terjemah = ayat.indonesia;
                    var arab = ayat.indopak;
                    console.log(`*${nmSurah}* (${artiNm}) surat ke ${Number(noSurah)} ayat *${Number(noAyat)}* juz ${juz} halaman ${hal}\n \n${arab}\n \n${terjemah}`);
                    var obj = {
                        "answer": `*${nmSurah}* (${artiNm}) surat ke ${Number(noSurah)} ayat *${Number(noAyat)}* juz ${juz} halaman ${hal}\n \n${arab}\n \n${terjemah}`,
                        "actions": [
                            { "action": `Tafsir Kemenag ${noSurah}:${noAyat}` },
                            { "action": `Tafsir Muyassar ${noSurah}:${noAyat}` },
                            { "action": `Tafsir Jalalain ${noSurah}:${noAyat}` },
                            { "action": `Tafsir Ringkas ${noSurah}:${noAyat}` },
                            { "action": `Share ${noSurah}:${noAyat}` }
                        ],
                        "intent": resN.intent
                    }

                    return obj
                }
                else {
                    var obj = {
                        "answer": `Ayat tidak ditemukan. Surat *${nmSurah}** berjumlah **${arrAyat.length}** ayat saja.`,
                        "actions": [
                            { "action": `Tentang ${nmSurah}` },
                            { "action": `Acak Ayat` },
                            { "action": `Share Acak` },
                            { "action": `Bantuan` }
                        ],
                        "intent": resN.intent
                    }

                    return obj
                }
            }
            else if (resN.intent == 'nomorSurah.ayatTertentu') {
                Step = 4; // NomorSurah ayat tertentu
                var noSurah = Number(resN.entities[0].option) + 1
                var noAyat = Number(resN.entities[resN.entities.length - 1].option) + 1
                var arrSurah = Object.keys(alquran),
                    entitySurah = arrSurah[noSurah-1],
                    jsonQuran = alquran[entitySurah],
                    nmSurah = jsonQuran.nama
                var arrAyat = jsonQuran.ayat;
                if (noAyat <= arrAyat.length) {
                    var obj = {
                        "answer": nomorSurahAyatTertentu(noSurah - 1, noAyat - 1),
                        "actions": [
                            { "action": `Tafsir Kemenag ${noSurah}:${noAyat}` },
                            { "action": `Tafsir Muyassar ${noSurah}:${noAyat}` },
                            { "action": `Tafsir Jalalain ${noSurah}:${noAyat}` },
                            { "action": `Tafsir Ringkas ${noSurah}:${noAyat}` },
                            { "action": `Share ${noSurah}:${noAyat}` }
                        ],
                        "intent": resN.intent
                    }
                    
                    return obj
                } else {
                    var obj = {
                        "answer": `Ayat tidak ditemukan. Surat *${nmSurah}** berjumlah **${arrAyat.length}** ayat saja.`,
                        "actions": [
                            { "action": `Tentang ${nmSurah}` },
                            { "action": `Acak Ayat` },
                            { "action": `Share Acak` },
                            { "action": `Bantuan` }
                        ],
                        "intent": resN.intent
                    }

                    return obj
                }
            }
            else if (resN.intent == 'qurani.perkenalan') {
                Step = 5; // Perkenalan
                var obj = {
                    "answer": resN.answer,
                    "actions": [
                        { "action": `Acak Ayat` },
                        { "action": `Share Acak` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }

                return obj
            }
            else if (resN.intent == 'qurani.salam') {
                Step = 6; // Salam
                var obj = {
                    "answer": resN.answer,
                    "actions": [
                        { "action": `Acak Ayat` },
                        { "action": `Share Acak` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }

                return obj
            }
            else if (resN.intent == 'qurani.terimaKasih') {
                Step = 7; // Terimakasih
                var obj = {
                    "answer": resN.answer,
                    "actions": [
                        { "action": `Acak Ayat` },
                        { "action": `Share Acak` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }

                return obj
            }
            else if (resN.intent == 'qurani.bantuan') {
                Step = 8; // Bantuan
                return resN
            }
            else if (resN.intent == 'qurani.setTerjemahan') {
                Step = 9; // setTerjemahan
                var obj = {
                    "answer": resN.answer,
                    "actions": [
                        { "action": `Acak Ayat` },
                        { "action": `Share Acak` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }

                return obj
            }
            else if (resN.intent == 'qurani.setTafsir') {
                Step = 10; // setTafsir
                var obj = {
                    "answer": resN.answer,
                    "actions": [
                        { "action": `Acak Ayat` },
                        { "action": `Share Acak` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }

                return obj
            }
            else if (resN.intent == 'infoLainnya.suratAyat') {
                Step = 11; // suratAyat (terpendek terpanjang)
                var obj = {
                    "answer": resN.answer,
                    "actions": [
                        { "action": `Acak Ayat` },
                        { "action": `Share Acak` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }

                return obj
            }
            else if (resN.intent == 'infoLainnya.suratTurunnya') {
                Step = 12; // suratTurunnya
                var obj = {
                    "answer": resN.answer,
                    "actions": [
                        { "action": `Acak Ayat` },
                        { "action": `Share Acak` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }

                return obj
            }
            else if (resN.intent == 'infoLainnya.suratTurunnya2') {
                Step = 13; // suratTurunnya (Mekkah + Madinah)
                var obj = {
                    "answer": resN.answer,
                    "actions": [
                        { "action": `Acak Ayat` },
                        { "action": `Share Acak` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }

                return obj
            }
            else if (resN.intent == 'qurani.tafsirAyatTertentu') {
                Step = 14; // tafsirAyatTertentu
                var noSurah = getNomorSurah(resN), noAyat = Number(resN.entities[resN.entities.length - 1].option) + 1
                obj = {
                    "answer": resN.answer,
                    "actions": [
                        { "action": `Tafsir Kemenag ${noSurah}:${noAyat}` },
                        { "action": `Tafsir Muyassar ${noSurah}:${noAyat}` },
                        { "action": `Tafsir Jalalain ${noSurah}:${noAyat}` },
                        { "action": `Tafsir Ringkas ${noSurah}:${noAyat}` },
                        { "action": `Share ${noSurah}:${noAyat}` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }
                return obj
            }
            else if (resN.intent == 'qurani.tafsirDefault') {
                Step = 15; // tafsirDefault
                var noSurah = getNomorSurah(resN), noAyat = Number(resN.entities[resN.entities.length - 1].option) + 1
                obj = {
                    "answer": resN.answer,
                    "actions": [
                        { "action": `Tafsir Kemenag ${noSurah}:${noAyat}` },
                        { "action": `Tafsir Muyassar ${noSurah}:${noAyat}` },
                        { "action": `Tafsir Jalalain ${noSurah}:${noAyat}` },
                        { "action": `Tafsir Ringkas ${noSurah}:${noAyat}` },
                        { "action": `Share ${noSurah}:${noAyat}` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }
                return obj
            }
            else if (resN.intent == 'nomorSurah.tafsirAyatTertentu') {
                Step = 16; // nomorSurah tafsir ayat tertentu
                noSurah = isNaN(resN.entities[0].option) ? Number(resN.entities[1].option) + 1 : Number(resN.entities[0].option) + 1,
                    noAyat = isNaN(resN.entities[0].option) && resN.entities.length == 2 ? 1 : resN.entities.length == 1 ? 1 : Number(resN.entities[resN.entities.length - 1].option) + 1
                obj = {
                    "answer": nomorSurahTafsirAyatTertentu(resN.entities[0].option, noSurah - 1, noAyat - 1),
                    "actions": [
                        { "action": `Tafsir Kemenag ${noSurah}:${noAyat}` },
                        { "action": `Tafsir Muyassar ${noSurah}:${noAyat}` },
                        { "action": `Tafsir Jalalain ${noSurah}:${noAyat}` },
                        { "action": `Tafsir Ringkas ${noSurah}:${noAyat}` },
                        { "action": `Share ${noSurah}:${noAyat}` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }

                return obj
            }
            else if (resN.intent == 'qurani.ayatSekianSampaiSekian' || resN.intent == 'nomorSurah.ayatSekianSampaiSekian') {
                Step = 17; // Ayat sekian sampai sekian, pake nomorSurah juga bisa
                var entitiesL = resN.entities.length,
                    arrSurah = Object.keys(require('./data/alquran.json')),
                    entitySurah = isNaN(resN.entities[0].option) ? resN.entities[0].option : arrSurah[resN.entities[0].option]

                return isi = ayatSekianSampaiSekian(entitySurah, resN.entities[entitiesL - 2].utteranceText, resN.entities[entitiesL - 1].utteranceText)
            }
            else if (resN.intent == 'qurani.informasiSurat') {
                Step = 18; // Informasi surat
                isi = informasiSurat(resN.entities[0].option, resN.entities[resN.entities.length - 1].option)
                var obj = {
                    "answer": isi,
                    "actions": [
                        { "action": `Acak Ayat` },
                        { "action": `Share Acak` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }

                return obj
            }
            else if (resN.intent == 'nomorSurah.infoSurat') {
                Step = 19; // nomorSurah informasi surat
                var nomorSurah = 0

                resN.entities.forEach(e => {
                    if (e.entity == 'ayat') {
                        nomorSurah = e.option
                        if (nomorSurah > 114) nomorSurah = isNaN(resN.entities[0].option) ? resN.entities[1].option : resN.entities[0].option
                    }
                })
                isi = nomorSurahInfoSurah(nomorSurah)

                return {
                    "answer": isi,
                    "actions": [{
                        "action": "Acak Ayat"
                    },
                    {
                        "action": "Share Acak"
                    },
                    {
                        "action": "Bantuan"
                    }
                    ],
                    "intent": resN.intent
                }
            }
            else if (resN.intent == 'qurani.ayatAcak') {
                Step = 20; // Ayat acak
                return ayatAcak();
            }
            else if (resN.intent == 'qurani.cariTeks') {
                Step = 21; // Cari teks
                var kata = input.replace(/^cari\s+/gi, '')
                return cariTeks(kata)
            }
            else if (resN.intent == 'qurani.share' || resN.intent == 'qurani.shareAcak') {
                Step = 22; // Share ayat
                var dir = ``, noSurah = '', noAyat = ''

                if (resN.entities.length > 0) {
                    noSurah = shareAyat(resN.entities[0].option)
                    noAyat = isNaN(Number(resN.entities[1].option) + 1) ? Number(resN.entities[2].option) + 1 : Number(resN.entities[1].option) + 1

                    //jika noSurah < 0 maka = 1
                    noSurah = noSurah < 1 ? 1 : noSurah

                    //cek jumlah ayat dari surah
                    var arrSurah = Object.keys(infoSurah.informasi),
                        entitySurah = arrSurah[noSurah - 1],
                        jmlAyat = infoSurah.informasi[entitySurah].jumlahayat
                    noAyat = noAyat > jmlAyat ? jmlAyat : noAyat

                    dir = `${noSurah}/${noAyat}`
                    obj = {
                        "answer": dir,
                        "share": true,
                        "pesan": `share ${noSurah}:${noAyat}`,
                        "actions": [
                            { "action": `Tafsir Kemenag ${noSurah}:${noAyat}` },
                            { "action": `Tafsir Muyassar ${noSurah}:${noAyat}` },
                            { "action": `Tafsir Jalalain ${noSurah}:${noAyat}` },
                            { "action": `Tafsir Ringkas ${noSurah}:${noAyat}` },
                            { "action": `${noSurah}:${noAyat}` },
                            { "action": `Bantuan` }
                        ],
                        "intent": resN.intent
                    }

                    return obj

                } else {
                    return shareAyat()
                }
            }
            else if (resN.intent == 'hadits.haditsTertentu' && (tipe == "H" || tipe == "ح")) {
                Step = 24; // haditstertentu
                var obj = {
                    "answer": resN.answer,
                    "actions": [
                        { "action": `Acak Ayat` },
                        { "action": `Share Acak` },
                        { "action": `Bantuan` }
                    ],
                    "intent": resN.intent
                }

                return obj
            }
            else if (resN.intent == 'None') {
                Step = 23; // None
                return {
                    "answer": resN.answer,
                    "intent": resN.intent
                }
            }else {
                Step = 23; // None
                return {
                    "answer": "Maaf, *IslamBot* tidak memahami permintaan Anda. Ketik *bantuan* untuk melihat panduan IslamBot.",
                    "intent": "None"
                }
            }
        }

    } catch (error) {
        console.log(`ProsesNlp Step ${Step} : ${error}`)
    }
}

ProsesNlp()

module.exports = { ProsesNlp }
