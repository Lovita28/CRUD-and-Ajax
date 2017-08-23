//Load Data in Table when documents is ready
$(document).ready(function () {
    loadData();
    $('#EnrollmentDatePicker input').datepicker({ format: 'dd-mm-yyyy' });
    var table;
    var results;
});

//Load data Function
function loadData(){
    $.ajax({
        url: "/Home/List",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            //var html = '';
            //$.each(result, function (key, item) {
            //    html += '<tr>';
            //    html += '<td>' + item.ID + '</td>';
            //    html += '<td>' + item.LastName + '</td>';
            //    html += '<td>' + item.FirstName + '</td>';
            //    html += '<td>' + formatdate(item.EnrollmentDate) + '</td>';
            //    html += '<td><a href = "#" class="btn btn-info" role="button" onclick="return getbyID(' + item.ID + ' )"><span class="glyphicon glyphicon-pencil"></span>&nbspEdit</a> ';
            //    html += '<a href = "#" class="btn btn-danger" role="button" onclick="Delete(' + item.ID + ')"><span class="glyphicon glyphicon-trash"></span>&nbsp Delete</a></td>';
            //    html += '</tr>';
            //});
            //$('.tbody').html(html);
            table = $('#myTable').DataTable(
                {
                "retrieve": true,
                "processing": true,
               // "data" : result,
                "ajax": {
                    "url": "/Home/List",
                    "dataSrc": ""
                },
                "columns": [
                    { "data": "ID" },
                    { "data": "FirstName" },
                    { "data": "LastName" },
                    {
                        "data": "EnrollmentDate",
                        "render": function (data) {
                            if (data != null) {
                                return moment(data).format("DD/MM/YYYY");
                            }
                            else {
                                return "Not Available";
                            }
                        }
                    },
                    {
                        "mRender": function (data, type, row) {
                            return '<a href = "#" class="btn btn-info" role="button" onclick="return getbyID(' + row.ID + ' )"><span class="glyphicon glyphicon-pencil"></span>&nbspEdit</a>'+'&nbsp&nbsp'+
                                '<a href = "#" class="btn btn-danger" role="button" onclick="Delete(' + row.ID + ')"><span class="glyphicon glyphicon-trash"></span>&nbsp Delete</a>';
                        }
                    }
                ]
            } );
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//add Data Function
function Add() {
    var res = validate();
    if (res == false){
        return false;
    }
    var perObj = {
        ID: $('#ID').val(),
        LastName: $('#LastName').val(),
        FirstName: $('#FirstName').val(),
        EnrollmentDate: $('#EnrollmentDate').val(),
        Discriminator: 'Student'
    };
    $.ajax({
        url: "/Home/Add",
        data: JSON.stringify(perObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
        $('#myModal').modal('hide');
        $('.modal-backdrop').remove();
        loadData();
        swal({
            title: 'Success!',
            text: 'Adding data success!',
            timer: 2000
        }).then(
                 function (dismiss) {
                     if (dismiss === 'timer') {
                         console.log('I was closed by the timer')
                     }
                 }
               )
        table.ajax.reload(null, false);
        
        },
        error: function (errormessage) {
            swal({
                title: 'Error',
                text: 'Adding data Failed!, Try again',
                type: 'warning',
                timer: 2000
            }).then(
                 function (dismiss) {
                     if (dismiss === 'timer') {
                         console.log('I was closed by the timer')
                     }
                 }
               )
            alert(errormessage.responseText);
        }
    });
}

//function for getting the Data Based upon Employee ID
function getbyID(perID) {
    $('#LastName').css('border-color', 'lightgrey');
    $('#FirstName').css('border-color', 'lightgrey');
    $('#EnrollmentDate').css('border-color', 'lightgrey');
    $.ajax({
        url: "/Home/getbyID/" + perID,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('#ID').val(result.ID);
            $('#LastName').val(result.LastName);
            $('#FirstName').val(result.FirstName);
            $('#EnrollmentDate').val(formatdate(result.EnrollmentDate));

            $('#myModal').modal('show');
            $('#btnUpdate').show();
            $('#btnAdd').hide();
        },
        error: function (errormessage) {

            alert(errormessage.responseText);
        }
    });
    return false;
}

//function for updating person record
function Update() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var perObj = {
        ID: $('#ID').val(),
        LastName: $('#LastName').val(),
        FirstName: $('#FirstName').val(),
        EnrollmentDate: $('#EnrollmentDate').val(),
        Discriminator: 'Student'
    };
    $.ajax({
        url: "/Home/Update",
        data: JSON.stringify(perObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadData();
            table.ajax.reload(null, false);
            $('#myModal').modal('hide');
            $('#ID').val("");
            $('#LastName').val("");
            $('#FirstName').val("");
            $('#EnrollmentDate').val("");
            swal({
                title: 'Success!',
                text: 'Updating data success!',
                timer: 2000
            }).then(
                  function (dismiss) {
                      if (dismiss === 'timer') {
                          console.log('I was closed by the timer')
                      }
                  }
                )
        },
        error: function (errormessage) {
            swal(
                 'Error!',
                 'Updating Failed!',
                 'warning'
                )
           
            alert(errormessage.responseText);
        }
    });
}

//function for deleting person's record
function Delete(ID) {
    swal({
        title: "Are You Sure?",
        text: "Are you sure to go ahead with this change?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true,
    }).then( function (isConfirm) {
        if (!isConfirm) return;
            $.ajax({
                url: "/Home/Delete/" + ID,
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                dataType: "json",
                success: function (result) {
                    loadData();
                    table.ajax.reload(null, false);
                    swal(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                      )
                },
                error: function (errormessage) {
                    swal(
                    'Failed',
                    'Delete Failed',
                    'warning'
                    )
                    alert(errormessage.responseText);
                }
            });
    });
}
//Function for clearing the textboxes
function clearTextBox() {
    $('#ID').val("");
    $('#LastName').val("");
    $('#FirstName').val("");
    $('#EnrollmentDate').val("");
    $('#btnUpdate').hide();
    $('#btnAdd').show();
    $('#LastName').css('border-color', 'lightgrey');
    $('#FirstName').css('border-color', 'lightgrey');
    $('#EnrollmentDate').css('border-color', 'lightgrey');
}

//Valdidation using jquery
function validate() {
    var isValid = true;
    if ($('#LastName').val().trim() == "") {
        $('#LastName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#LastName').css('border-color', 'lightgrey');
    }
    if ($('#FirstName').val().trim() == "") {
        $('#FirstName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#FirstName').css('border-color', 'lightgrey');
    }
    return isValid;
}

function formatdate(date){
    if (date != null) {
        return moment(date).format('D/MM/YYYY');
    }
    else {
        return "Not Available";
    }
}