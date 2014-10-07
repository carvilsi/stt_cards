/**
The MIT License

Copyright (c) 2014 Carlos Villanueva

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var Stt_cards = {

    version: '0.1',

    /**
    Como siempre algunas variables útiles
    */

    recognition: '',
    camp: [],
    numeroFichas: 0,
    sepCSV: ";",
    enter: '\n',
    longArray: [],

    elemIn: '',
    divOut: '',
    listen: false,

    /**
    Inicializamos estos dos elementos, un input para tomar los campos y un div para crear los inputs
    */

    init: function (elemInput, divOutput) {
        'use strict';
        try {
            Stt_cards.elemIn = elemInput;
            Stt_cards.divOut = divOutput;
            return true;
        } catch (e) {
            console.log('error :/ ' + e);
            return false;
        }
    },


    /**
    Exporta los datos introducidos a un archivo csv para descargar
    */
    exportarDatos: function (button) {
        'use strict';
        var i = 0;
        var csv = Stt_cards.camp.join(";") + Stt_cards.enter;
        for (i; i < localStorage.length; i++) {
            csv = csv + localStorage.getItem(i);
        }
        var blob = new Blob([csv], {
            type: "text/csv"
        });
        var url = URL.createObjectURL(blob);
        var a = document.getElementById(button);
        a.href = url;
        var date = new Date();
        a.download = 'tuFicha_' + date + '.csv';
        localStorage.clear();
    },
    /**
        Mete los datos en el localStorage
    */

    datosOk: function () {
        try {
            var datos = "";
            Stt_cards.camp.forEach(function (campo, index) {
                datos += document.querySelector('[name="' + campo + '"]').value;
            });
            if (!datos) {
                return;
            }
            datos = "";
            Stt_cards.camp.forEach(function (campo, index) {
                datos += document.querySelector('[name="' + campo + '"]').value + Stt_cards.sepCSV;
            });
            datos += Stt_cards.enter;
            localStorage.setItem(this.numeroFichas, datos);
            Stt_cards.numeroFichas += 1;
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
    para empezar con la cosa de las transcripción
    */

    grabar: function () {
        if (!('webkitSpeechRecognition' in window)) {
            this.noVaLaCosa();
        } else {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.lang = "es-ES"; // seto molaría que fuera opcional
            this.recognition.continuous = true;
            var final_transcript = '';
            var match;
            this.recognition.onresult = function (event) {
                var interim_transcript = '';
                if (typeof (event.results) == 'undefined') {
                    this.recognition.onend = null;
                    this.recognition.stop();
                    return;
                }
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        var transcript = event.results[event.resultIndex][0].transcript;
                        transcript = transcript.trim();
                        var transArray = transcript.split(" ");
                        if (transArray.length > 1) {
                            var tmparry = transArray.slice(0, 2);
                            var find = Stt_cards.camp.indexOf(tmparry.join(" "));
                            if (find != -1) {
                                document.querySelector('[name="' + Stt_cards.camp[find] + '"]').focus();
                                var t = transArray.slice(2, transArray.length);
                                document.querySelector('[name="' + Stt_cards.camp[find] + '"]').value = t.join(" ");
                            } else {
                                find = Stt_cards.camp.indexOf(transArray[0]);
                                if (find != -1) {
                                    document.querySelector('[name="' + Stt_cards.camp[find] + '"]').focus();
                                    var t = transArray.slice(1, transArray.length);
                                    document.querySelector('[name="' + Stt_cards.camp[find] + '"]').value = t.join(" ");
                                } else {
                                    console.log('nada :/');
                                }
                            }
                        } else {
                            console.log('nada :/');
                        }
                    }
                }
            };

            // Empezamos con la cosa del escuchar para transcribir

            this.recognition.start();

            // Manejar esa clase de cosas relacionadas con la transcripción

            this.recognition.onstart = function () {
                Stt_cards.listen = true;
            }

            this.recognition.onstop = function () {
                Stt_cards.listen = false;
            }
        }
    },


    /**
    Para cuando paramos el dictado
    */

    stopstt: function () {
        this.recognition.stop();
    },

    /**
    Cuando empezamos el dictado
    */


    startstt: function () {
        this.camp.forEach(function (campo, index) {
            document.querySelector('[name="' + campo + '"]').value = '';
        });
        this.grabar();
    },

    /**
    El explorador web no soporta el dictado, y aunque digan ortas cosas, por ahí, solo lo soporta Google Chrome
    Mostramos un aviso al usuario 

    TODO: meter una comprobación al principio para evitar mal entendidos :P
    */


    noVaLaCosa: function () {
        if (Stt_cards.divOut) {
            document.getElementById(Stt_cards.divOut).innerHTML('<br/><br/><p id="nova" style="display:none">Web Speech API no rula en este explorador web. Usa mejor <a href="//www.google.com/chrome">Chrome</a> versión 25 o superior.</p>');
        } else {
            return;
        }
    },


    /**
    Tomar los campos del cuadro de texto y crear los input
    */

    getCampos: function () {
        if (Stt_cards.elemIn && Stt_cards.divOut) {
            console.warn(Stt_cards.divOut);
            var campos = document.getElementById(Stt_cards.elemIn).value;
            if (campos) {
                var ctmp = campos.split("\n");
                var htmlCode = '';
                ctmp.forEach(function (campo, index) {
                    var c = campo.trim();
                    if (c) {
                        Stt_cards.camp.push(c);
                        htmlCode += '<div style="width:98%" class="ui-field-contain"><label for="' + c + '">' + c + ':' + '</label><input data-clear-btn="false"  name="' + c + '" id="' + c + '" placeholder="" value="" type="text"></div>';
                    }
                });
                document.getElementById(Stt_cards.divOut).innerHTML = htmlCode;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
            console.log('need to init Stt_cards()');
        }
    }


};

Stt_cards.init();
