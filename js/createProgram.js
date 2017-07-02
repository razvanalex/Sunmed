function initTypesSoft() {
    $.getJSON("../../json/predefSofts.json", function(softs) {
        $.each(softs, function() {
            var object = `<div class="itemSoft">
                            <div class="imageField"><img src="` + this.imagine + `"/></div>
                            <div class="nameField"><span>` + this.nume + `</span></div>
                            <div class="descriptionField">`+ this.descriere +`</div>
                        </div>`;
            
            $("#selection").append(object);
        });
        
        $(".itemSoft").on("click", function() {
            $.each($(".itemSoft"), function() {
                $(this).removeClass("selected");
            });
            
            $(this).addClass("selected");
        });
    });
}

function buttons() {
    $("#closeInit").on("click", function() {
        window.location.href = "../Session/Admin/AdminPage.php";
    });
    
    $("#create").on("click", function() {
       $("#InitWorkspace").css("visibility", "hidden");
       $("#softContent").removeClass("foreground_window");
    });    
}

function InitWizard() {
    $("#s2").hide();
    
    $("#next").on("click", function() {
        $("#s1").hide();
        $("#s2").show();
    });
}

function InitToolbox() {
    $.getJSON("../../json/toolbox.json", function(tools) {
        $.each(tools, function() {
           $("#contentToolbox").append("<li class='toolItem'>" + this.nume + "</li>");
        });
        
        $(".toolItem").on("click", function() {
            var index = $("li").index(this);
            properties(tools[index]);
        });
    });
}

function properties(obj) {
    $("#preview").append(obj.cod);
    $("#contentProperties").empty();
    $.each(obj.proprietati, function() {
        $("#contentProperties").append("<li class='toolItem'>" + this + "</li>");
    });
}

function main() {
    /*global $*/
    InitWizard();
    initTypesSoft();
    buttons();
    InitToolbox();
}

$(document).ready(main());