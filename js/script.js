(function worker() {
    var ID = ["IX", "X", "XI", "XII"];
    var classL = ["A", "B", "C", "D", "E", "F"];
    
    var Clasa = [];    
    var NrElevi = [];
    var Ortodox = [];
    var Catolic = [];
    var Musulman = [];
    var AlteReligii = [];
    
    for(var Id = 0; Id < ID.length; Id++){
        for (var classl = 0;  classl < classL.length; classl++){
            var id = ID[Id] + classL[classl];
            Clasa[Id * classL.length + classl] = ID[Id] + " " + classL[classl];
            NrElevi[Id * classL.length + classl] = $("#IDELEVI" + id).text();
            Ortodox[Id * classL.length + classl] = $("#IDORTODOX" + id).text();
            Catolic[Id * classL.length + classl] = $("#IDCATOLIC" + id).text();
            Musulman[Id * classL.length + classl] = $("#IDMUSULMAN" + id).text();
            AlteReligii[Id * classL.length + classl] = $("#IDALTE" + id).text();
        }
    }

    $.ajax({
        method:'POST',    
        url: 'PHP/UpdateData.php',
        data:{
            action:'Update',
            clasa:Clasa,
            nr_elevi:NrElevi,
            ortodox:Ortodox,
            catolic:Catolic,
            musulman:Musulman,
            alte_religii:AlteReligii
        },
        success: function(data) {
            $.getJSON( "../data.json", function( Clase ) { 
                for(var Id = 0; Id < ID.length; Id++){
                        for (var classl = 0;  classl < classL.length; classl++){
                            var id = ID[Id] + classL[classl];
                            document.getElementById("IDELEVI" + id).innerHTML = Clase[id].NRElevi;
                            document.getElementById("IDORTODOX" + id).innerHTML = Clase[id].Ortodox;
                            document.getElementById("IDCATOLIC" + id).innerHTML = Clase[id].Catolic;
                            document.getElementById("IDMUSULMAN" + id).innerHTML = Clase[id].Musulman;
                            document.getElementById("IDALTE" + id).innerHTML = Clase[id].AlteReligii
                        }
                    } 
            });       
        },
        error: function(err){
            console.log(err);
        },
        complete: function() {
            setTimeout(worker, 5000);
        }
    });
})();

var BtnEdit = function(ID){
    var TBID = ".TB" + ID;
    var SPID = ".SP" + ID;
    var BEID = ".BE" + ID;
    var BSID = ".BS" + ID;
  
    document.getElementById("ELEVI" + ID).value=$("#IDELEVI" + ID).text();
    document.getElementById("ORTODOX" + ID).value=$("#IDORTODOX" + ID).text();
    document.getElementById("CATOLIC" + ID).value=$("#IDCATOLIC" + ID).text();
    document.getElementById("MUSULMAN" + ID).value=$("#IDMUSULMAN" + ID).text();
    document.getElementById("ALTE" + ID).value=$("#IDALTE" + ID).text();
    
    $(TBID).removeClass('NOTvisible');
    $(SPID).addClass('NOTvisible');
    $(BSID).removeClass('NOTvisible');
    $(BEID).addClass('NOTvisible');
};

var BtnSave = function(ID, Clasa){
    var TBID = ".TB" + ID;
    var SPID = ".SP" + ID;
    var BEID = ".BE" + ID;
    var BSID = ".BS" + ID;
    
    var NrElevi = document.getElementById("ELEVI" + ID).value;
    var Ortodox = document.getElementById("ORTODOX" + ID).value;
    var Catolic = document.getElementById("CATOLIC" + ID).value;
    var Musulman = document.getElementById("MUSULMAN" + ID).value;
    var AlteReligii = document.getElementById("ALTE" + ID).value;
    
    $(SPID).removeClass('NOTvisible');
    $(TBID).addClass('NOTvisible');
    $(BEID).removeClass('NOTvisible');
    $(BSID).addClass('NOTvisible'); 
    
    $.ajax({
        url: 'PHP/EditData.php',
        method: 'POST',
        dataType: 'html',
        data:{
            action:'YES',
            clasa:Clasa,
            nr_elevi:NrElevi,
            ortodox:Ortodox,
            catolic:Catolic,
            musulman:Musulman,
            alte_religii:AlteReligii
        },
        success:function(arg){
            console.log(arg);
            if(arg !== "Wrong numbers!"){
                $('.Error').addClass('NOTvisible');
                document.getElementById("IDELEVI" + ID).innerHTML = NrElevi;
                document.getElementById("IDORTODOX" + ID).innerHTML = Ortodox;
                document.getElementById("IDCATOLIC" + ID).innerHTML = Catolic;
                document.getElementById("IDMUSULMAN" + ID).innerHTML = Musulman;
                document.getElementById("IDALTE" + ID).innerHTML = AlteReligii;
            }
            else {
                $('.Error').removeClass('NOTvisible');
            }
        }
    });
};

var getClass = function(string){
    var clasa = "";
    for(var i = 0; i < string.length; i++)
    {
        if(string[i] !== " "){
            clasa +=string[i];
        }
        else break;
    }
    return clasa;
};

var getLetter = function(string){
    return string[string.length - 2];
}

var selectClass = function(val){
    var rows = $('#tbodyID tr');
    var cols = $('#tbodyID td');
    var colsN = cols.length / rows.length;
    var table = document.getElementById('tbodyID');
    
    if(val !== "toate"){
        for(var i=0; i < rows.length; i++){
            var cellValue = $(table.rows[i].cells[0]);
            
            if(getClass(cellValue.text()) !== val){
                for(var j = 0; j<colsN; j++){
                    if(!$(table.rows[i].cells[j]).hasClass("NOTvisible"))
                        $(table.rows[i].cells[j]).addClass("NOTvisible");
                }
            }
            else{
                for(var j = 0; j<colsN; j++){
                    if($(table.rows[i].cells[j]).hasClass("NOTvisible"))
                        $(table.rows[i].cells[j]).removeClass("NOTvisible");
                }
            }
        }
    }
    else {
        for(var i=0; i < rows.length; i++){
            for(var j = 0; j<colsN; j++){
                if($(table.rows[i].cells[j]).hasClass("NOTvisible"))
                    $(table.rows[i].cells[j]).removeClass("NOTvisible");
            }
        }
    }
};

var selectLetter = function(val){
    var rows = $('#tbodyID tr');
    var cols = $('#tbodyID td');
    var colsN = cols.length / rows.length;
    var table = document.getElementById('tbodyID');
    
    if(val !== "toate"){
        for(var i=0; i < rows.length; i++){
            var cellValue = $(table.rows[i].cells[0]);
            
            if(getLetter(cellValue.text()) !== val){
                for(var j = 0; j<colsN; j++){
                    if(!$(table.rows[i].cells[j]).hasClass("NOTvisible"))
                        $(table.rows[i].cells[j]).addClass("NOTvisible");
                }
            }
            else if($(table.rows[i].cells[0]).hasClass("NOTvisible")){
                for(var j = 0; j<colsN; j++){
                    if($(table.rows[i].cells[j]).hasClass("NOTvisible"))
                        $(table.rows[i].cells[j]).removeClass("NOTvisible");
                }
            }
        }
    }
    else{
        for(var i=0; i < rows.length; i++){
            for(var j = 0; j<colsN; j++){
                if($(table.rows[i].cells[j]).hasClass("NOTvisible"))
                    $(table.rows[i].cells[j]).removeClass("NOTvisible");
            }
        }
    }
};