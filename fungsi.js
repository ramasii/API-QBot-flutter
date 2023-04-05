const alquran = require('./data/alquran.json')
const dataTafsir = require('./data/context-tafsir.json')
const dataStatic = require('./data/context-static.json')
const dataInformasi = require('./data/context-informasi.json')

function ayatSekianSampaiSekian(entitySurah, dariIndex, sampaiIndex){
    var Step = 0;
    try {
        Step = 1; // Deklarasi variabel ambil dari ./data/alquran.json
        // console.log("alquran[entitySurah] =", alquran[entitySurah])
        var noSurah = alquran[entitySurah].ayat[0].nomorsurah,
        artiNm = alquran[entitySurah].arti,
        nmSurah = alquran[entitySurah].nama,
        pesan = `*${nmSurah}* (${artiNm}) surat ke *${noSurah}* ayat *${alquran[entitySurah].ayat[dariIndex-1].nomorayat}-${alquran[entitySurah].ayat[sampaiIndex-1].nomorayat}*`,        
        rangeAyat = alquran[entitySurah].ayat.slice(dariIndex-1, sampaiIndex),
        isi = '', actions = [];

        Step = 2; // Ambil beberapa ayat
        rangeAyat.forEach(e => {
            isi = isi + '\n \n' + e.indopak + '\n \n' + e.nomorayat + '. ' + e.indonesia;
            actions.push({"action":`Tafsir ${noSurah}:${e.nomorayat}`})
        });

        Step = 3; // Fix pesan
        isi = pesan + isi + '\n \n' + dataStatic.dibuatOleh;
        actions.push({"action":`Bantuan`})
        
        Step = 4; // Jadikan object agar bisa bawa action (isi menu)
        var obj = {
            "answer":isi,
            "actions":actions
        }
    
        return obj

    } catch (error) {
        console.log(`ayatSekianSampaiSekian Step ${Step} : ${error}`);
    }    
}

function informasiSurat(entitySurah1, entitySurah2){
    var Step = 0;
    try {
        Step = 1; // Deklarasi variabel ambil dari ./data/context-informasi.json
        // console.log("dataInformasi.informasi[entitySurah1] =", dataInformasi.informasi[entitySurah1])
        var info = dataInformasi.informasi[entitySurah1] ? dataInformasi.informasi[entitySurah1] : dataInformasi.informasi[entitySurah2],
        mukadimah = info['mukadimah'],
        keimanan = info['keimanan'],
        hukum = info['hukum'],
        kisah = info['kisah'],
        lain = info['lain']

        Step = 2; // Jika data bukan tidak ada (-), maka ditambahkan ke pesan
        mukadimah = keimanan != '-' ? mukadimah + '\n \n*Keimanan :*\n' + keimanan : mukadimah
        mukadimah = hukum != '-' ? mukadimah + '\n \n*Hukum :*\n' + hukum : mukadimah
        mukadimah = kisah != '-' ? mukadimah + '\n \n*Kisah :*\n' + kisah : mukadimah
        mukadimah = lain != '-' ? mukadimah + '\n \n*Lainnya :*\n' + lain : mukadimah

        Step = 3; // Fix pesan
        var jawab = `*QS. ${info['namasurah']}* adalah surat ke *${info['idsurah']}* dari 114 surat di Al-Quran.\n \n` + mukadimah;
        jawab = jawab + '\n \n' + dataStatic.dibuatOleh

        return jawab;

    } catch (error) {
        console.log(`informasiSurat Step ${Step} : ${error}`);
    }    
}

function ayatAcak(){
    var Step = 0;
    try {
        Step = 1; // Ambil entity surah    
        var arrSurah = Object.keys(alquran),
        
        Step = 2; // Angka random *index* surah, minimal 0 maksimal 113
        randIndex = Math.floor(Math.random() * arrSurah.length), 
        
        Step = 3; // Ambil entity, nama, arti surah secara acak menggunakan random index
        randSurah = arrSurah[randIndex], 
        nmSurah = alquran[randSurah].nama,
        artiSurah = alquran[randSurah].arti,
        
        Step = 4; // Angka random *index* ayat, berdasarkan jumlah ayat dari surah yang dipilih
        randAyat = Math.floor(Math.random() * alquran[randSurah].ayat.length),

        Step = 5; // Ambil nomor surat, nomor ayat, arab, terjemahan, juz, halaman
        ayatSurahAcak = alquran[randSurah].ayat[randAyat],
        noSurah = ayatSurahAcak.nomorsurah,
        noAyat = ayatSurahAcak.nomorayat,
        arab = ayatSurahAcak.indopak,
        terjemah = ayatSurahAcak.indonesia,
        juz = ayatSurahAcak.juz,
        hal = ayatSurahAcak.page_num,

        Step = 6; // Fix pesan
        hasil = `*${nmSurah}* (${artiSurah}) surat ke *${noSurah}* ayat *${noAyat}* juz ${juz} halaman ${hal}\n \n${arab}\n \n${terjemah}\n \n${dataStatic.dibuatOleh}`

        Step = 7; // Jadikan object agar bisa bawa action (isi menu)
        var obj = {
            "answer":hasil,
            "actions":[
                {"action":`Tafsir Kemenag ${noSurah}:${noAyat}`},
                {"action":`Tafsir Muyassar ${noSurah}:${noAyat}`},
                {"action":`Tafsir Jalalain ${noSurah}:${noAyat}`},
                {"action":`Tafsir Ringkas ${noSurah}:${noAyat}`},
                {"action":`Share ${noSurah}:${noAyat}`},
                {"action":`Bantuan`}
            ]
        }
    
        return obj

    } catch (error) {
        console.log(`ayatAcak Step ${Step} : ${error}`);
    }    
}

function cariTeks(cariKata){
    var Step = 0;
    try {
        Step = 1; // Ambil entity surah dan deklarasi variabel
        var arrSurah = Object.keys(alquran), 
        jml = 0, urut = 1, hasil = '', arrIsi = [], isi = '', actions = [],
        cari = cariKata.split(':')[0].toLowerCase(), page = cariKata.split(':')[1] || 1
        
        Step = 2; // Cek setiap surah
        arrSurah.forEach(surah =>{                 
            Step = 3; // Cek jumlah ayat disetiap surah
            for(i = 0; i < alquran[surah].ayat.length; i++){
                Step = 4; // Cek setiap ayat yang terkandung kata pencarian
                if(alquran[surah].ayat[i].indonesia.match(RegExp(cari, 'gi'))){
                    Step = 5; // Fix pesan
                    isi = `${urut}. ${alquran[surah].nama} ${alquran[surah].ayat[i].nomorsurah}:${alquran[surah].ayat[i].nomorayat} halaman ${alquran[surah].ayat[i].page_num}\n`;
                    jml++; urut++;
                    arrIsi.push(" " + isi);
                    actions.push({"action":`${alquran[surah].nama} ayat ${alquran[surah].ayat[i].nomorayat}`})                     
                }
            }
        })
        Step = 6; // Deklarasi index dan page terakhir
        var index = page * 30 - 29, // Hasil pencarian teks (ayatnya)
        lastPage = Math.floor(arrIsi.length / 30 + 1);
                
        Step = 7; // Antisipasi jika inputan page lebih besar daripada page akhir
        if(page > lastPage){            
            index = lastPage * 30 - 29; // Hasil pencarian teks (ayatnya)
            hasil = arrIsi.slice(index-1, index+29).join('');
            actions = actions.slice(index-1, index+29);

            Step = 8; // Antisipasi jumlah ayat kurang dari 30            
            if(arrIsi.length <= index+29){
                hasil = hasil + `Akhir dari hasil pencarian teks *${cari}*\n`
            }
            hasil = hasil + `Page ${lastPage} dari ${lastPage}`
        }        
        else{
            hasil = arrIsi.slice(index-1, index+29).join('');
            actions = actions.slice(index-1, index+29);

            Step = 9; // Antisipasi jumlah ayat kurang dari 30 
            if(arrIsi.length <= index+29){
                hasil = hasil + `Akhir dari hasil pencarian teks *${cari}*\n`
            }
            hasil = hasil + `Page ${page} dari ${lastPage}`
        } 

        Step = 10; // Fix pesan
        var pesan = `Teks *${cari}* di Al-Quran berjumlah *${jml}*, diantaranya:\n \n`
        hasil = jml > 0 ? pesan + hasil + `\n \n${dataStatic.dibuatOleh}`: `Teks *${cari}* tidak ditemukan. Ketik *bantuan* untuk melihat panduan QuraniBot.\n \n${dataStatic.dibuatOleh}`
        
        Step = 11; // Jadikan object agar bisa bawa action (isi menu)
        var obj = {
            "answer":hasil,
            "actions":actions
        }

        return obj

    } catch (error) {
        console.log(`cariTeks Step ${Step} : ${error}`);
    }    
}

function nomorSurahAyatTertentu(noSurah, noAyat){
    var Step = 0;
    try {
        Step = 1; // Deklarasi variabel
        var arrSurah = Object.keys(alquran),
        entitySurah = arrSurah[noSurah],
        jsonQuran = alquran[entitySurah],
        nmSurah = jsonQuran.nama,
        artiNm = jsonQuran.arti,
        arrAyat = jsonQuran.ayat[noAyat],
        arab = arrAyat.indopak,
        terjemah = arrAyat.indonesia,
        juz = arrAyat.juz,
        hal = arrAyat.page_num,
        // info: noSurah dan noAyat ditambah 1 karena noSurah dan noAyat berisi index, berarti mulai dari 0
        jawab = `*${nmSurah}* (${artiNm}) surat ke *${Number(noSurah)+1}* ayat *${Number(noAyat)+1}* juz ${juz} halaman ${hal}\n \n${arab}\n \n${terjemah}\n \n${dataStatic.dibuatOleh}`

        return jawab

    } catch (error) {
        console.log(`nomorSurahAyatTertentu Step ${Step} : ${error}`);
    }    
}

function nomorSurahTafsirAyatTertentu(tafsir, noSurah, noAyat){
    var Step = 0;
    try {        
        Step = 1; // Deklarasi variabel
        var nmTafsir = isNaN(tafsir) ? tafsir : 'kemenag', // jika tafsir == null, maka defaultnya kemenag
        arrSurah = Object.keys(alquran),
        entitySurah = arrSurah[noSurah],
        jsonQuran = alquran[entitySurah],
        nmSurah = jsonQuran.nama,
        artiNm = jsonQuran.arti,
        isiTafsir = dataTafsir[nmTafsir][entitySurah].tafsir[noAyat].tafsir_text,
        // info: noSurah dan noAyat ditambah 1 karena noSurah dan noAyat berisi index, berarti mulai dari 0
        jawab = `*${nmSurah}* (${artiNm}) surat ke *${Number(noSurah)+1}* ayat ${Number(noAyat)+1}\n \n${isiTafsir}\n \n${dataStatic.dibuatOleh}`

        return jawab

    } catch (error) {
        console.log(`NomorSurahTafsirAyatTertentu Step ${Step} : ${error}`);
    }    
}

function nomorSurahInfoSurah(noSurah) {
    var Step = 0;
    try {
        Step = 1; // Deklarasi variabel ambil dari ./data/alquran.json
        var arrSurah = Object.keys(alquran),
        entitySurah = arrSurah[noSurah],

        info = dataInformasi.informasi[entitySurah],
        mukadimah = info['mukadimah'],
        keimanan = info['keimanan'],
        hukum = info['hukum'],
        kisah = info['kisah'],
        lain = info['lain']

        Step = 2; // Jika data bukan tidak ada (-), maka ditambahkan ke pesan
        mukadimah = keimanan != '-' ? mukadimah + '\n \n*Keimanan :*\n' + keimanan : mukadimah
        mukadimah = hukum != '-' ? mukadimah + '\n \n*Hukum :*\n' + hukum : mukadimah
        mukadimah = kisah != '-' ? mukadimah + '\n \n*Kisah :*\n' + kisah : mukadimah
        mukadimah = lain != '-' ? mukadimah + '\n \n*Lainnya :*\n' + lain : mukadimah

        Step = 3; // Fix pesan
        var jawab = `*QS. ${info['namasurah']}* adalah surat ke *${info['idsurah']}* dari 114 surat di Al-Quran.\n \n` + mukadimah
        jawab = jawab + '\n \n' + dataStatic.dibuatOleh

        return jawab;
        
    } catch (error) {
        console.log(`nomorSurahInfoSurah Step ${Step} : ${error}`);
    }    
}

function shareAyat(entitySurah){
    var Step = 0;
    try {
        Step = 1; // Deklarasi variabel ambil dari ./data/alquran.json
        var arrSurah = Object.keys(alquran),
        noSurah, noAyat
        
        Step = 2; // Share ayat
        if(entitySurah != undefined){            
            Step = 3; // Cek apakah menggunakan nmSurah atau noSurah, ditambah +1 karena nilai asli berupa index array
            noSurah = isNaN(entitySurah) ? arrSurah.indexOf(entitySurah)+1 : Number(entitySurah)+1

            return noSurah

        }else{
            Step = 4; // Share acak
            noSurah = Math.floor(Math.random() * 114 + 1)
            noAyat = Math.floor(Math.random() * alquran[arrSurah[noSurah-1]].ayat.length + 1)
            var obj = {
                "answer":`${noSurah}/${noAyat}`,
                "share":true,
                "pesan":`share ${noSurah}:${noAyat}`,
                // "actions":[
                //     {"action":`Tafsir Kemenag ${nomorSurah}:${nomorAyat}`},
                //     {"action":`Tafsir Muyassar ${nomorSurah}:${nomorAyat}`},
                //     {"action":`Tafsir Jalalain ${nomorSurah}:${nomorAyat}`},
                //     {"action":`Tafsir Ringkas ${nomorSurah}:${nomorAyat}`},
                //     {"action":`Surat ${nomorSurah}:${nomorAyat}`},
                //     {"action":`Bantuan`}
                // ]
            }

            return obj
        }

    } catch (error) {
        console.log(`shareAyat Step ${Step} : ${error}`);
    }    
}

function getNomorSurah(resultNlp){
    var Step = 0;
    try {
        Step = 1; // Deklarasi variabel ambil dari ./data/alquran.json
        var arrSurah = Object.keys(alquran),
        entities = resultNlp.entities, 
        index = 0, noSurah = -1
    
        Step = 2; // Ambil entity dari resultNlp
        while(noSurah == -1){
            noSurah = arrSurah.indexOf(entities[index].option)
            index++
        }
    
        return noSurah+1 

    } catch (error) {
        console.log(`getNomorSurah Step ${Step} : ${error}`);
    }    
}

module.exports = {ayatSekianSampaiSekian, informasiSurat, ayatAcak, cariTeks, nomorSurahAyatTertentu, nomorSurahTafsirAyatTertentu, nomorSurahInfoSurah, shareAyat, getNomorSurah}