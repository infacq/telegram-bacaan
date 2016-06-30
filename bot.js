'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const tg = new Telegram.Telegram('process.env.ACCESS_TOKEN_KEY') // @bacaan_bot
const fetchUrl = require("fetch").fetchUrl;

const Quran = require('quran')

class PembukaController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    pembukaHandler($) {
        $.sendMessage('Atas Nama Tuan Semesta Alam Yang Maha Pengasih dan Penyayang. Sila masukkan <kitab> <jilid> <ayat>', {parse_mode: 'Markdown'});
    }

    cariAyat($) {
        try {
            let kitab = $.query.kitab
            console.log(kitab)
                input = {
                    chapter: parseInt($.query.num1),
                    verse: [parseInt($.query.num2)]
                },
                setup = {
                    language: 'en',
                    debug: false //singkirkan sekiranya sudah berada di khalayak umum
                },
                tajuk = ' ~ _Surah '

            if (kitab === 'qs') {
                Quran.chapter(input.chapter,function(err,info) {
                  if (!err) {
                    tajuk += info[0].arname + ', ' + input.chapter + ':' + input.verse + '_'
                  }
                });
                Quran.select(input, setup, function(err,verse) {
                  if (!err) {
                    $.sendMessage('*' + verse[0].ar + '*', {parse_mode: 'Markdown'});
                    $.sendMessage('_' + verse[0].en + '_\n\n' + tajuk, {parse_mode: 'Markdown'});
                    if (setup.debug)
                        console.log(verse)
                  }
                });
            } else {
                fetchUrl("http://alkitab.gbippl.id/alkitab/TB/" + kitab + "/" + input.chapter + "/" + input.verse[0], function(error, meta, body){
                    if (!error) {
                        console.log(body.toString());
                    } else
                        console.log(error)
                });
            }
        } catch (e) {
            console.log(e)
        }
    }

    bantuan($) {
        // let tajuk = ':sun_with_face: Senarai arahan yang boleh difahami oleh bot :last_quarter_moon_with_face:\n\n',
        let tajuk = '🌀 Senarai arahan yang boleh difahami oleh bot\n\n',
            kandungan = '/start - untuk memilih kitab suci\n<surah> <nombor ayat> - bagi memilih ayat dari Al-Quran\n<nama kitab> <jilid> <ayat> - carian ayat untuk taurat atau injil'
        $.sendMessage(tajuk + kandungan, {parse_mode: 'Markdown'});
    }

    get routes() {
        return {
            'start': 'pembukaHandler',
            'bantuan': 'bantuan',
            ':kitab :num1 :num2': 'cariAyat'
        }
    }
}

class OtherwiseController extends TelegramBaseController {
    handle($) {
        $.sendMessage('_Maaf deh_ Kami tak jumpa ayat yang dicari', {parse_mode: 'Markdown'});
    }
}

tg.router.when(['start', 'bantuan', ':kitab :num1 :num2'], new PembukaController())
         // .otherwise(new OtherwiseController())