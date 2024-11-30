var Employee = [];
$(document).ready(function () {
    $.fn.dataTable.ext.errMode = 'none';

    $('#Placement').dataTable({
        "ajax": {
            url: "/User/LoadUserPlacement",
            type: "GET",
            dataType: "json",
            dataSrc: ""
        },
        "columns": [
            {
                data: null, render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: "companyName" },
            { data: "addressInterview" },
            {
                data: "interviewDate", render: function (data) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                data: "status", render: function (data) {
                    return "<span class='badge badge-pill badge-info'>Waiting for Result</span>";

                }
            },
        ]
    });

    $('#History').dataTable({
        "ajax": {
            url: "/User/LoadUserHistory",
            type: "GET",
            dataType: "json",
            dataSrc: ""
        },
        "columns": [
            {
                data: null, render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: "companyName" },
            {
                data: "status", render: function (data) {
                    if (data == 1) {
                        return "<span class='badge badge-pill badge-success'>On Site</span>";
                    }
                    else if (data == 0) {
                        return "<span class='badge badge-pill badge-danger'>Off Site</span>";
                    }

                }
            },
        ]
    });

    $('#Replacement').dataTable({
        "ajax": {
            url: "/User/LoadByEmployee",
            type: "GET",
            dataType: "json",
            dataSrc: ""
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
                    } else if (data == false) {
                        return "<span class='badge badge-pill badge-info'>Rejected</span>"
                    } else if (data == null) {
                        return "<span class='badge badge-pill badge-info'>Not Confirm yet</span>"
                    }
                }
            },
            {
                data: null, render: function (data, type, row) {
                    return "<td><div class='btn-group'><button type='button' class='btn btn-warning' id='BtnEdit' data-toggle='tooltip' data-original-title='Edit' onclick=GetById('" + row.id + "');><i class='fa fa-pencil-alt'></i></button> <button type='button' class='btn btn-danger' id='BtnDelete' data-toggle='tooltip' data-placement='top' title='Delete' data-original-title='Delete' onclick=Delete('" + row.id + "');><i class='fa fa-trash'></i></button></div></td>";
                }
            },
        ]
    });

    $('#HistoryReplacement').dataTable({
        "ajax": {
            url: "/User/LoadHistoryByEmployee",
            type: "GET",
            dataType: "json",
            dataSrc: ""
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
    $('#panel1').hide();
    $('#panel2').show();
    LoadEmployee($('#EmployeeOption'));
}); //load table
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
    if ($('#EmployeeOption').val() == "0" || $('#ReplacementReason').val() == "" || $('#Detail').val() == "" || $('#ReplacementDate').val() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Input Cannot be Empty',
        })
        return false;
    } else {
        $.ajax({
            type: 'POST',
            url: '/Replacement/InsertOrUpdate',
            data: Replacement
        }).then((result) => {
            if (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 204) {
                Swal.fire({
                    icon: 'success',
                    potition: 'center',
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
    }
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
    Replacement.replacementDate = $('#ReplacementDate').val();
    if ($('#EmployeeOption').val() == "0" || $('#ReplacementReason').val() == "" || $('#Detail').val() == "" || $('#ReplacementDate').val() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Input Cannot be Empty',
        })
        return false;
    } else {
        $.ajax({
            type: 'POST',
            url: '/Replacement/InsertOrUpdate',
            data: Replacement
        }).then((result) => {
            debugger;
            if (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 204) {
                Swal.fire({
                    icon: 'success',
                    potition: 'center',
                    title: 'Replacement Update Successfully',
                    timer: 2500
                }).then(function () {
                    table.ajax.reload();
                    $('#myModal').modal('hide');
                    clearscreen();
                });
            } else {
                Swal.fire('Error', 'Failed to Edit', 'error');
            }
        })
    }
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