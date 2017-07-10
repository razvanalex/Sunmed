function printTable(db, indexDB, indexTab, location) {
    var table = db[indexDB].tabele[indexTab];

    $.ajax({
        url: "../../Data/GenerateTableData.php",
        method: 'POST',
        dataType: 'html',
        data: {
            DBName: "sunmed",
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
            tableButtons();
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
        printTable(db, 0, 0, "#genTable");

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
    // Add
    $("#AddUserBtn").on("click", function(){
        $("#AddUserWnd").css("visibility", "visible");
    });
    
    $("#closeAddUser").on("click", function(){
        $("#AddUserWnd").css("visibility", "hidden");
        document.getElementById("AddForm").reset();
    });
    
    $("#AddBtn").on("click", function(){
        addUser();
        $("#AddUserWnd").css("visibility", "hidden");
        document.getElementById("AddForm").reset();
    });
    
    $("#CancelBtn").on("click", function(){
        $("#AddUserWnd").css("visibility", "hidden");
        document.getElementById("AddForm").reset();
    });

    // Edit
    $("#closeEditUser").on("click", function(){
        $("#EditUserWnd").css("visibility", "hidden");
        document.getElementById("EditForm").reset();
    });
    
    $("#CancelEditBtn").on("click", function(){
        $("#EditUserWnd").css("visibility", "hidden");
        document.getElementById("EditForm").reset();
    });

    // Remove
    $("#closeRemoveUser").on("click", function(){
        $("#RemoveUserWnd").css("visibility", "hidden");
    });
    
    $("#CancelRemoveBtn").on("click", function(){
        $("#RemoveUserWnd").css("visibility", "hidden");
    });
    
    // Info box
    $("#closeInfoUser").on("click", function(){
        $("#InfoWnd").css("visibility", "hidden");
    });
    
    $("#infoOkBtn").on("click", function(){
        $("#InfoWnd").css("visibility", "hidden");
    });    
    
    // Create Soft
    $("#CreateProgram").on("click", function(){
       window.location.href = "../../Databases/CreateProgram.php";
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

function getPermissions(id_win) {
    var value = "";
    
    $("#" + id_win + " .permissions").each(function(){
        if($(this).is(":checked")) 
            value += "1";
        else 
            value += "0";
    });
    
    return value;
}

function addUser() {
    var In_nume = $("#AddNume").val();
    var In_prenume = $("#AddPrenume").val();
    var In_username = $("#AddUsername").val();
    var In_password = $("#AddPassword").val();
    var In_confPass = $("#AddConfPass").val();
    var permissions = getPermissions("AddUserWnd");
    
    $.ajax({
        url: "../AddUser.php",
        method: 'POST',
        dataType: "html",
        data: {
            nume: In_nume,
            prenume: In_prenume,
            username: In_username,
            password: In_password,
            conf_pass: In_confPass,
            permissions: permissions
        },
        success: function(data) {
            if (data)
            {
                var out = $.parseJSON(data);
                if(out.message != '') {
                    console.log(out.message);
                    infoWindow(out.message);
                }
                if (out.id != 0 && out.password != "")
                {
                    $("#genTable tbody").append("<tr><td>" + 
                        out.id + "</td><td>" +
                        In_nume + "</td><td>" + 
                        In_prenume + "</td><td>" + 
                        In_username+ "</td><td>" + 
                        out.password + "</td><td>" +
                        permissions + "</td><td><div class='edit EditUserBtn'></div><div class='remove RemoveUserBtn'></div></td></tr>");
                        tableButtons();
                }
                if (out.error != "")
                {
                    infoWindow(out.error);
                    console.log(out.error);
                }
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function removeUser(username, closest_tr) {
    $.ajax({
        url: "../RemoveUser.php",
        method: 'POST',
        dataType: "html",
        data: {
            username: username
        },
        success: function(data) {
            closest_tr.remove();
            console.log(data);
            var ID_ok = 0;
            $("#genTable tbody tr").each(function(){
                ID_ok++;
                $(this).find('td:eq(0)').text(ID_ok);
            });
            infoWindow(data);
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function initRemoveText(username) {
    $("#confirmRemove").text("Sigur doriti sa stergeti utilizatorul " + username + "?");
}

function tableButtons() {
    $(".EditUserBtn").on("click", function(){
        $("#EditUserWnd").css("visibility", "visible");
        
        var row = $(this).closest('tr');
        var utilizator = new Object();
        
        utilizator.id = $(this).closest('tr').find('td:eq(0)').text();
        utilizator.nume = $(this).closest('tr').find('td:eq(1)').text();
        utilizator.prenume = $(this).closest('tr').find('td:eq(2)').text();
        utilizator.username = $(this).closest('tr').find('td:eq(3)').text();
        utilizator.permisiuni = $(this).closest('tr').find('td:eq(5)').text();
        initEditWindow(utilizator);

        $("#EditBtn").unbind().on("click", function() {
            editWindow(utilizator, row);
            $("#EditUserWnd").css("visibility", "hidden");
            document.getElementById("EditForm").reset();
        });
    });
    
    $(".RemoveUserBtn").on("click", function(){
        var nume = $(this).closest('tr').find('td:eq(3)').text();
        var closest_tr = $(this).closest('tr');
        initRemoveText(nume);
        $("#RemoveUserWnd").css("visibility", "visible");
        $("#RemoveBtn").on("click", function(){
            removeUser(nume, closest_tr);
            $("#RemoveUserWnd").css("visibility", "hidden");
        });
    });
}

function initEditWindow(object) {
    $("#EditUserWnd #nume").val(object.nume);
    $("#EditUserWnd #prenume").val(object.prenume);
    $("#EditUserWnd #username").val(object.username);
    
    var i = 0;
    $("#EditUserWnd .permissions").each(function(){
        if(object.permisiuni[i] == '1')
            $(this).prop("checked", true);
        else if (object.permisiuni[i] == '0')
            $(this).prop("checked", false);
        i++;
    });
}

function editWindow(object, row) {
    var nume = $("#EditUserWnd #nume").val();
    var prenume = $("#EditUserWnd #prenume").val();
    var username = $("#EditUserWnd #username").val();
    var password = $("#EditUserWnd #password").val();
    var confPass = $("#EditUserWnd #confPass").val();
    var permissions = getPermissions("EditUserWnd");  
    
    $.ajax({
        url: "../EditUser.php",
        method: 'POST',
        dataType: "html",
        data: {
            id: object.id,
            nume: nume,
            prenume: prenume,
            username: username,
            password: password,
            confPass: confPass,
            permisiuni: permissions
        },
        success: function(data) {
            var out = $.parseJSON(data);
            if (out)
            {
                console.log("Success: " + out.success);
                console.log("Errors: " + out.error);
                if (out.error == "")
                {
                    row.find('td:eq(1)').text(nume);
                    row.find('td:eq(2)').text(prenume);
                    row.find('td:eq(3)').text(username);
                    if (out.password)
                        row.find('td:eq(4)').text(out.password);
                    row.find('td:eq(5)').text(permissions);
                    infoWindow(out.success);
                }
                else if (out.error != "")
                    infoWindow(out.error);
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
}

function infoWindow(text) {
    $("#InfoWnd #InfoText").text(text);
    $("#InfoWnd").css("visibility", "visible");
    
    $("#infoOkBtn").on("click", function() {
        $("#InfoWnd").css("visibility", "hidden");
    });
}

function main() {
    /*global $*/
    tabs();
    buttons();    
    windows();
}

$(document).ready(main());