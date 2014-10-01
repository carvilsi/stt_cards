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
    
    /**
    Exporta los datos introducidos a un archivo csv para descargar
    */
    
    exportarDatos: function () {
        'use strict';
        var i = 0;
        var csv = Stt_cards.camp.join(";") + Stt_cards.enter;
        for (i; i < localStorage.length; i++) {
            csv = csv + localStorage.getItem(i);
        }
        var blob = new Blob([csv], {type: "text/csv"});
        var url = URL.createObjectURL(blob);
        var a = document.querySelector("#csvDownload"); // id of the <a> element to render the download link
        a.href = url;
        var date = new Date();
        a.download = 'tuFicha_' + date + '.csv';  
        localStorage.clear();
    },
    
    /**
    Mete los datos en el localStorage
    */
    
    datosOk: function () {
            var datos = "";
            Stt_cards.camp.forEach(function (campo, index){
                datos += $("input[name='" + campo +"']").val();
            });
            if (!datos) {
                return;
            }
            datos = "";
            Stt_cards.camp.forEach(function (campo, index){
                datos += $("input[name='" + campo +"']").val() + Stt_cards.sepCSV;
            });
            datos += Stt_cards.enter;
            localStorage.setItem(this.numeroFichas,datos);
            Stt_cards.numeroFichas += 1;
            this.muestraOculta(false);
            if ( this.numeroFichas >= 1) {
              $('#csvDownload').css('display','inline');  
            }
            $('#empezar').css('display','inline');  
       },
    
    /**
    ejecutamos al iniciar
    */
    
    init: function () {
        setTimeout(function () {
            Stt_cards.muestraOculta(false);
        $('#parar').css('display','none');
        $('#empezar').css('display','none');
        }, 100);
    },
    
    /**
    para empezar con la cosa de las transcripción
    */
     
    grabar: function () {
        if (!('webkitSpeechRecognition' in window)) {
            this.noVaLaCosa();
        } else {
            $('#parar').css('display','inline');
            $('#empezar').css('display','none');
            this.recognition = new webkitSpeechRecognition();
            this.recognition.lang = "es-ES";
            this.recognition.continuous = true;
            var final_transcript = '';
            var match;
            this.recognition.onresult = function(event) {
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
                            var tmparry = transArray.slice(0,2);
                            var find = $.inArray(tmparry.join(" "),Stt_cards.camp);
                            if (find != -1) {
                                $("input[name='" + this.camp[find] +"']").focus();
                                var t = transArray.slice(2,transArray.length);
                                $("input[name='" + this.camp[find] +"']").val(t.join(" "));
                            } else {
                                find = $.inArray(transArray[0],Stt_cards.camp);
                                if (find != -1) {
                                    $('#' + Stt_cards.camp[find]).focus();
                                    var t = transArray.slice(1,transArray.length);
                                    $('#' + Stt_cards.camp[find]).val(t.join(" "));
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
                $('#escuchando').css('display','inline');
            }
            
            this.recognition.onstop = function () {
                $('#escuchando').css('display','none');
            }
        } 
    },
    
    /**
    Para cuando paramos el dictado
    */
    
        stopstt: function () {
            this.recognition.stop(); 
            $('#parar').css('display','none');
            $('#empezar').css('display','none');
            $('#datosOk').css('display','inline');
            $('#escuchando').css('display','none');
        },
    
    /**
    Cuando empezamos el dictado
    */
    
    
        startstt: function () {
            this.muestraOculta(false);
            this.camp.forEach(function (campo, index){
                    $("input[name='" + campo +"']").val('');
            });
            this.grabar();
        },
    
    /**
    El explorador web no soporta el dictado, y aunque dugan ortas cosas, por ahí, solo lo soporta Google Chrome
    Mostramos un aviso al usuario 
    
    TODO: meter una comprobación al principio para evitar mal entendidos :P
    */
    
        
        noVaLaCosa: function () {
            $('#nova').css('display','inline');
            $('#stop').css('display','none');        
            $('#start').css('display','none');        
        },
    
    
    /**
    mostar u ocultar algunos botones "a pajera abierta"
    */
        
        muestraOculta: function (bool) {
            if (bool) {
                $('#datosOk').css('display','inline');
                $('#csvDownload').css('display','inline');
            } else {
                $('#datosOk').css('display','none');
                $('#csvDownload').css('display','none');
            }
        },
    
    /**
    Tomar los campos del cuadro de texto y crear los input
    */
    
    getCampos: function () {
        var campos = $('#campos').val();
        if (campos) {
            var ctmp = campos.split("\n");
            ctmp.forEach(function(campo, index){
                var c = campo.trim();
                if (c) {
                    Stt_cards.camp.push(c);
                    $('#otro').append('<div style="width:98%" class="ui-field-contain"><label for="' + c + '">' + c + ':' + '</label><input data-clear-btn="true"  name="' + c + '" id="' + c + '" placeholder="" value="" type="text"></div>');
                    }
                });
            $('#otro').trigger("create");
            $('#empezar').css('display','inline');
            $('#getCampos').css('display','none');
        } else {
            return;
        }
        $('#texto').css('display','none');
        
    }
};      
    
Stt_cards.init();