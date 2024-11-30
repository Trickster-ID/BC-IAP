var Employee = [];
$(document).ready(function () {
    table = $('#Replacement').dataTable({
        "ajax": {
            url: "/Replacement/LoadReplacement",
            type: "GET",
            dataType: "json",
            dataSrc: "",
        },
        "columnDefs": [
            { "orderable": false, "targets": 5 },
            { "searchable": false, "targets": 5 }
        ],
        "columns": [
            {
                data: null, render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "data": "fullName" },
            { "data": "replacementReason" },
            { "data": "detail" },
            {
                data: "replacementDate", render: function (data) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                "data": "confirmation", "render": function (data) {
                    if (data == true) {
                        return "<span class='badge badge-pill badge-info'>Accepted</span>"
                    } else if (data == false){
                        return "<span class='badge badge-pill badge-info'>Rejected</span>"
                    }else if (data == null){
                        return "<span class='badge badge-pill badge-info'>Not Confirm yet</span>"
                    }
                }
            },
            {
                data: null, render: function (data, type, row) {
                    return " <td><div class='btn-group'></button> <button type='button' class='btn btn-info' data-toggle='tooltip' data-placement='top' title='Accept' id='BtnConfirm' onclick=GetByStatus('" + row.id + "');><i class='fa fa-check'></i></button > <button type='button' class='btn btn-danger' data-toggle='tooltip' data-placement='top' title='Reject' id='BtnConfirm' onclick=GetByStatus0('" + row.id + "');><i class='fa fa-minus'></i></button ></div></td >";
                }
            },
        ]
    });
    table = $('#History').dataTable({
        "ajax": {
            url: "/Replacement/LoadReplacementHistory",
            type: "GET",
            dataType: "json",
            dataSrc: "",
        },
        "columns": [
            {
                data: null, render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "data": "fullName" },
            { "data": "replacementReason" },
            { "data": "detail" },
            {
                data: "replacementDate", render: function (data) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                "data": "confirmation", "render": function (data) {
                    if (data == true) {
                        return "<span class='badge badge-pill badge-info'>Accepted</span>"
                    } else if (data == false) {
                        return "<span class='badge badge-pill badge-danger'>Rejected</span>"
                    } else if (data == null) {
                        return "<span class='badge badge-pill badge-info'>Not Confirm yet</span>"
                    }
                }
            }
        ]
    });
    LoadEmployee($('#EmployeeOption'));
    $('#panel1').show();
    $('#panel2').hide();
}); //load table Replacement
/*--------------------------------------------------------------------------------------------------*/
function LoadEmployee(element) {
    if (Employee.length === 0) {
        $.ajax({
            type: "Get",
            url: "/Replacement/LoadUser",
            success: function (data) {
                Employee = data.data;
                renderEmployee(element);
            }
        });
    }
    else {
        renderEmployee(element);
    }
} //load Employee
function renderEmployee(element) {
    var $option = $(element);
    $option.empty();
    $option.append($('<option/>').val('0').text('Select Employee').hide());
    $.each(Employee, function (i, val) {
        $option.append($('<option/>').val(val.id).text(val.firstName));
    });
} // Memasukan LoadEmployee ke dropdown
/*--------------------------------------------------------------------------------------------------*/
document.getElementById("BtnAdd").addEventListener("click", function () {
    $('#SaveBtn').show();
    $('#UpdateBtn').hide();
    LoadEmployee($('#EmployeeOption'));
    $('#divemail').show();
    $('#divpass').show();
    $('#Id').val('');
    $('#ReplacementReason').val('');
    $('#Detail').val('');
    $('#Email').val('');
    $('#FullName').val('');
    $('#ReplacementDate').val('');
}); //fungsi btn add
/*--------------------------------------------------------------------------------------------------*/
function clearscreen() {
    table.ajax.reload();
    $('#Id').val('');
    $('#ReplacementReason').val('');
    $('#Detail').val('');
    $('#Email').val('');
    $('#FullName').val('');
    $('#ReplacementDate').val('');
    $('#myModal').modal('hide');
    LoadEmployee($('#EmployeeOption'));
} //clear field
/*--------------------------------------------------------------------------------------------------*/
function GetById(Id) {
    debugger;
    $.ajax({
        url: "/Replacement/GetById/" + Id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,
        success: function (result) {
            debugger;
            $('#Id').val(result.id);
            $('#EmployeeOption').val(result.userId);
            $('#ReplacementReason').val(result.replacementReason);
            $('#Detail').val(result.detail);
            $('#ReplacementDate').val(moment(result.replacementDate).format('YYYY-MM-DD'));
            $('#myModal').modal('show');
            $('#UpdateBtn').show();
            $('#SaveBtn').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responsText);
        }
    })
} //get id to edit
/*--------------------------------------------------------------------------------------------------*/
function Save() {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Replacement').DataTable({
        "ajax": {
            url: "/Replacement/LoadReplacement"
        }
    });
    var Replacement = new Object();
    Replacement.userId = $('#EmployeeOption').val();
    Replacement.replacementReason = $('#ReplacementReason').val();
    Replacement.detail = $('#Detail').val();
    Replacement.replacementDate = $('#ReplacementDate').val();
    $.ajax({
        type: 'POST',
        url: '/Replacement/InsertOrUpdate',
        data: Replacement
    }).then((result) => {
        if (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 204) {
            Swal.fire({
                icon: 'success',
                position: 'center',
                title: 'Replacement Add Successfully',
                timer: 2500
            }).then(function () {
                table.ajax.reload();
                $('#myModal').modal('hide');
                clearscreen();
            });
        }
        else {
            Swal.fire('Error', 'Failed to Input', 'error');
        }
    })
} //function save
/*--------------------------------------------------------------------------------------------------*/
function Edit() {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Replacement').DataTable({
        "ajax": {
            url: "/Replacement/LoadReplacement"
        }
    });
    var Replacement = new Object();
    Replacement.id = $('#Id').val();
    Replacement.userId = $('#EmployeeOption').val();
    Replacement.replacementReason = $('#ReplacementReason').val();
    Replacement.detail = $('#Detail').val();
    $.ajax({
        type: 'POST',
        url: '/Replacement/InsertOrUpdate',
        data: Replacement
    }).then((result) => {
        debugger;
        if (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 204) {
            Swal.fire({
                icon: 'success',
                position: 'center',
                title: 'Replacement Update Successfully',
                timer: 2500
            }).then(function () {
                table.ajax.reload();
                clearscreen();
            });
        } else {
            Swal.fire('Error', 'Failed to Edit', 'error');
        }
    })
}//function edit
/*--------------------------------------------------------------------------------------------------*/
function Delete(Id) {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Replacement').DataTable({
        "ajax": {
            url: "/Replacement/LoadReplacement"
        }
    });
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.value) {
            //debugger;
            $.ajax({
                url: "/Replacement/Delete/",
                data: { Id: Id }
            }).then((result) => {
                debugger;
                if (result.statusCode == 200) {
                    Swal.fire({
                        icon: 'success',
                        position: 'center',
                        title: 'Delete Successfully',
                        timer: 2000
                    }).then(function () {
                        table.ajax.reload();
                        cls();
                        $('#Replacement').modal('hide');
                    });
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'error',
                        text: 'Failed to Delete',
                    })
                    ClearScreen();
                }
            })
        }
    });
} //function delete
/*--------------------------------------------------------------------------------------------------*/
function GetByStatus(id) {
    debugger;
    $.ajax({
        url: "/Replacement/GetByStatus/" + id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,
        success: function (result) {
            debugger;
            $('#Id').val(result[0].id);
            $('#Email').val(result[0].email);
            $('#FullName').val(result[0].fullName);
            $('#ReplacementReason').val(result[0].replacementReason);
            $('#Detail').val(result[0].detail);
            $('#RepDate').val(result[0].replacementDate);
            ConfirmReplacement();
        },
        error: function (errormessage) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to Get Data',
            });
        }
    })
} //get data for confirm
/*--------------------------------------------------------------------------------------------------*/
function GetByStatus0(id) {
    debugger;
    $.ajax({
        url: "/Replacement/GetByStatus/" + id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,
        success: function (result) {
            debugger;
            $('#Id').val(result[0].id);
            $('#Email').val(result[0].email);
            $('#FullName').val(result[0].fullName);
            $('#ReplacementReason').val(result[0].replacementReason);
            $('#Detail').val(result[0].detail);
            $('#RepDate').val(result[0].replacementDate);
            CancelReplacement();
        },
        error: function (errormessage) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to Get Data',
            });
        }
    })
} //get data for confirm
/*--------------------------------------------------------------------------------------------------*/
function ConfirmReplacement() {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Replacement').DataTable({
        "ajax": {
            url: "/Replacement/LoadReplacement"
        }
    });
    var table1 = $('#History').DataTable({
        "ajax": {
            url: "/Replacement/LoadReplacementHistory"
        }
    });
    Swal.fire({
        title: "Are you sure to Accept ?",
        text: "You won't be able to Revert this!",
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: "Yes, Confirmation!",
        cancelButtonColor: "Red",
    }).then((result) => {
        if (result.value) {
            debugger;
            var Replacement = new Object();
            Replacement.Id = $('#Id').val();
            Replacement.Email = $('#Email').val();
            Replacement.FullName = $('#FullName').val();
            Replacement.ReplacementReason = $('#ReplacementReason').val();
            Replacement.Detail = $('#Detail').val();
            Replacement.ReplacementDate = $('#RepDate').val();
            $.ajax({
                type: 'POST',
                url: '/Replacement/ConfirmReplacement',
                data: Replacement
            }).then((result) => {
                debugger;
                if (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 204) {
                    Swal.fire({
                        icon: 'success',
                        position: 'center',
                        title: 'Replacement has been Accepted',
                        timer: 2500
                    }).then(function () {
                        table.ajax.reload();
                        table1.ajax.reload();
                        clearscreen();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to Confirmation',
                    });
                }
            })
        }
    })
}
/*--------------------------------------------------------------------------------------------------*/
function CancelReplacement() {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Replacement').DataTable({
        "ajax": {
            url: "/Replacement/LoadReplacement"
        }
    });
    var table1 = $('#History').DataTable({
        "ajax": {
            url: "/Replacement/LoadReplacementHistory"
        }
    });
    Swal.fire({
        title: "Are you sure to Reject ?",
        text: "You won't be able to Revert this!",
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: "Yes, Reject !",
        cancelButtonColor: "Red",
    }).then((result) => {
        if (result.value) {
            var Replacement = new Object();
            debugger;
            Replacement.Id = $('#Id').val();
            Replacement.Email = $('#Email').val();
            Replacement.FullName = $('#FullName').val();
            Replacement.ReplacementReason = $('#ReplacementReason').val();
            Replacement.Detail = $('#Detail').val();
            Replacement.ReplacementDate = $('#RepDate').val();
            $.ajax({
                type: 'POST',
                url: '/Replacement/CancelReplacement',
                data: Replacement
            }).then((result) => {
                debugger;
                if (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 204) {
                    Swal.fire({
                        icon: 'success',
                        position: 'center',
                        title: 'Replacement has been Rejected',
                        timer: 2500
                    }).then(function () {
                        table.ajax.reload();
                        table1.ajax.reload();
                        clearscreen();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to Confirmation',
                    });
                }
            })
        }
    })
}
/*--------------------------------------------------------------------------------------------------*/
