function printTable(db, index, location) {
    var table = db[index];
    console.log();
    $.ajax({
        url: "../../Data/GenerateTableData.php",
        method: 'POST',
        dataType: 'html',
        data: {
            tableName: table.nume,
            tableFields: table.campuri,
            tableAlias: table.alias_campuri
        },
        success: function(data) {
            $(location).append(data);
            $(location + " tbody").on("mouseover", "tr",  function() {
                $(this).addClass("highlight");
            });
            $(location + " tbody").on("mouseleave", "tr",  function() {
                $(this).removeClass("highlight");
            });
            $(".EditUserBtn").on("click", function(){
                $("#EditUserWnd").css("visibility", "visible");
            });
        },
        error: function(err) {
            console.log(err);
            $(location).append("<p style='color:darkred;'>An error has occured while generating the table!</p>");
        }
    });
}

function tabs() {
        $.getJSON( "../../../json/tabele.json", function(db) {
        $("#softsContent").hide();
        printTable(db, 0, "#genTable");

        $("#users").click(function() {
            if (!$("#users").hasClass("tabSelected")) {
                $("#users").addClass("tabSelected");
                $("#softs").removeClass("tabSelected");
                $("#userContent").show();
                $("#softsContent").hide();
            }
        });
        
        $("#softs").click(function() {
            if (!$("#softs").hasClass("tabSelected")) {
                $("#softs").addClass("tabSelected");
                $("#users").removeClass("tabSelected");
                $("#userContent").hide();
                $("#softsContent").show();
            }
        });
    });
}

function buttons() {
    $("#AddUserBtn").on("click", function(){
        $("#AddUserWnd").css("visibility", "visible");
    });
    
    $("#closeAddUser").on("click", function(){
        $("#AddUserWnd").css("visibility", "hidden");
        document.getElementById("AddForm").reset();
    });
    
    $("#CancelBtn").on("click", function(){
        $("#AddUserWnd").css("visibility", "hidden");
        document.getElementById("AddForm").reset();
    });

    $("#closeEditUser").on("click", function(){
        $("#EditUserWnd").css("visibility", "hidden");
    });

}

function windows() {
    $(".topWindow").on("mousedown", function() {
        var id = $(this).parent().attr('id');
        $("#" + id).draggable({ 
            disabled: false, 
            containment: $(".bkg")
        });
        
        $(".window").css("z-index", "10");
        $("#" + id).css("z-index", "15");
    });
    
    $(".topWindow").on("mouseup", function() {
        var id = $(this).parent().attr('id');
        $("#" + id).draggable({ disabled: true });
    });
}

function main() {
    tabs();
    buttons();    
    windows();
}

$(document).ready(main());