var datenow = new Date();

$(document).ready(function () {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    $('#Placement').dataTable({
        "ajax": {
            url: "/Placement/LoadPlacement",
            type: "GET",
            dataType: "json",
            dataSrc: ""
        },
        "columnDefs": [
            { "orderable": false, "targets": 6 },
            { "searchable": false, "targets": 6 }
        ],
        "columns": [
            {
                data: null, render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: "fullName" },
            { data: "companyName" },
            { data: "interviewer" },
            {
                data: "interviewDate", render: function (data) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                data: "status", render: function (data) {
                    return "<span class='badge badge-pill badge-info'>Waiting</span>";
                }
            },
            {
                data: null, render: function (data, type, row) {
                    return `<td>
                    <div class='btn-group'> 
                        <button class='btn btn-info' id='BtnAcc' data-toggle='modal' data-target='#myModal' data-placement='top' title='Confirmation' data-original-title='Confirmation' onclick=Confirm('` + row.id + `');><i class='fa fa-check'></i></button> 

                        <button class='btn btn-danger' id='BtnCancel' data-toggle='tooltip' data-placement='top' title='Cancel' data-original-title='Cancel' onclick=Cancel('` + row.id + `');><i class='fa fa-minus'></i></button>
                    </div></td>`;
                }
            },
        ]
    });

    $('#History').dataTable({
        "ajax": {
            url: "/Placement/LoadHistory",
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
            { data: "fullName" },
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
            {
                data: "status", render: function (data, type, row) {
                    if (data == 1) {
                        return `<td>
                            <button class='btn btn-danger' id='BtnCancel' data-toggle='tooltip' data-placement='top' title='Cancel Site' data-original-title='Cancel Site' onclick=OffSite('` + row.id + `');><i class='fa fa-minus'></i></button>
                        </td>`;
                    }
                    else if (data == 0) {
                        return `<td>&nbsp;</td>`;
                    }
                    
                }
            },
        ]
    });

    $('#panel1').show();
    $('#panel2').hide();
}); //load table
/*--------------------------------------------------------------------------------------------------*/
function Confirm(id) {
    debugger;
    $.ajax({
        url: "/Interview/GetDataSendEmail/" + id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,
        success: function (result) {
            debugger;
            $('#InterviewId').val(result[0].id);
            $('#UserId').val(result[0].userId);
            $('#Email_User').val(result[0].emailUser);
            $('#FullName').val(result[0].fullName);
            $('#CompanyId').val(result[0].companyId);
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to Get Data',
            });
        }
    })
} //get data for confirm
/*--------------------------------------------------------------------------------------------------*/
function clearscreen() {
    $('#Id').val('');
    $('#StartContract').val('');
    $('#EndContract').val('');
} //clear field
/*--------------------------------------------------------------------------------------------------*/
function ConfirmPlacement() {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Placement').DataTable({
        "ajax": {
            url: "/Placement/LoadPlacement"
        }
    });
    var table2 = $('#History').DataTable({
        "ajax": {
            url: "/Placement/LoadHistory"
        }
    });

    var startDate = new Date($('#StartContract').val());
    var endDate = new Date($('#EndContract').val());

    if ($('#StartContract').val() == "" || $('#EndContract').val() == "") {
        Swal.fire({
            icon: 'error',
            position: 'center',
            title: 'Field cannot be Empty!',
            timer: 2000
        })
    }
    else if (startDate >= endDate) {
        Swal.fire({
            icon: 'error',
            position: 'center',
            title: 'Incorrect Start or End Date!',
            timer: 2000
        })
    } else {
        debugger;
        Swal.fire({
            title: "Are you sure ?",
            text: "You won't be able to Revert this!",
            showCancelButton: true,
            confirmButtonText: "Yes, Confirmation!",
        }).then((result) => {
            debugger;
            if (result.value) {
                var Placement = new Object();
                Placement.Id = $('#InterviewId').val();
                Placement.UserId = $('#UserId').val();
                Placement.EmailUser = $('#Email_User').val();
                Placement.FullName = $('#FullName').val();
                Placement.CompanyId = $('#CompanyId').val();
                Placement.StartContract = $('#StartContract').val();
                Placement.EndContract = $('#EndContract').val();
                $.ajax({
                    type: 'POST',
                    url: '/Placement/ConfirmPlacement',
                    data: Placement
                }).then((result) => {
                    debugger;
                    if (result.statusCode === 200) {
                        Swal.fire({
                            icon: 'success',
                            position: 'center',
                            title: 'Confirmation Placement Success',
                            timer: 2500
                        }).then(function () {
                            table.ajax.reload();
                            table2.ajax.reload();

                            $('#myModal').modal('hide');
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
}//function confirmation placement
/*--------------------------------------------------------------------------------------------------*/
function Cancel(id) {
    debugger;
    $.ajax({
        url: "/Interview/GetDataSendEmail/" + id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,
        success: function (result) {
            debugger;
            $('#InterviewId').val(result[0].id);
            $('#UserId').val(result[0].userId);
            $('#Email_User').val(result[0].emailUser);
            $('#FullName').val(result[0].fullName);
            $('#CompanyId').val(result[0].companyId);
            CancelPlacement();
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to Get Data',
            });
        }
    })
} //get data for confirm
/*--------------------------------------------------------------------------------------------------*/
function CancelPlacement() {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Placement').DataTable({
        "ajax": {
            url: "/Placement/LoadPlacement"
        }
    });
    var table2 = $('#History').DataTable({
        "ajax": {
            url: "/Placement/LoadHistory"
        }
    });

    Swal.fire({
        title: "Are you sure ?",
        text: "You won't be able to Revert this!",
        showCancelButton: true,
        confirmButtonText: "Yes, Cancel!",
    }).then((result) => {
        debugger;
        if (result.value) {
            var Placement = new Object();
            Placement.Id = $('#InterviewId').val();
            Placement.EmailUser = $('#Email_User').val();
            Placement.FullName = $('#FullName').val();
            $.ajax({
                type: 'POST',
                url: '/Placement/CancelPlacement',
                data: Placement
            }).then((result) => {
                debugger;
                if (result.statusCode === 200) {
                    Swal.fire({
                        icon: 'success',
                        position: 'center',
                        title: 'Cancel Placement Success',
                        timer: 2500
                    }).then(function () {
                        table.ajax.reload();
                        table2.ajax.reload();

                        clearscreen();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to Cancel',
                    });
                }
            })
        }
    })
}//function Cancel
/*--------------------------------------------------------------------------------------------------*/
function OffSite(Id) {
    $.ajax({
        url: "/Placement/GetDataPlacement/" + Id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,
        success: function (result) {
            $('#UserId').val(result.userId);
            ClearPlacement(Id);
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to Get Data',
            });
        }
    })
} //get data for clear
/*--------------------------------------------------------------------------------------------------*/
function ClearPlacement(Id) {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Placement').DataTable({
        "ajax": {
            url: "/Placement/LoadPlacement"
        }
    });
    var table2 = $('#History').DataTable({
        "ajax": {
            url: "/Placement/LoadHistory"
        }
    });
    
    Swal.fire({
        title: "Are you sure ?",
        text: "You won't be able to Revert this!",
        showCancelButton: true,
        confirmButtonText: "Yes, Confirmation!",
    }).then((result) => {
        debugger;
        if (result.value) {
            var Placement = new Object();
            Placement.Id = Id;
            Placement.UserId = $('#UserId').val();
            $.ajax({
                type: 'POST',
                url: '/Placement/ClearPlacement',
                data: Placement
            }).then((result) => {
                debugger;
                if (result.statusCode === 200) {
                    Swal.fire({
                        icon: 'success',
                        position: 'center',
                        title: 'Cancel Placement Success',
                        timer: 2500
                    }).then(function () {
                        table.ajax.reload();
                        table2.ajax.reload();

                        clearscreen();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to Cancel',
                    });
                }
            })
        }
    })
}//function Clear
/*--------------------------------------------------------------------------------------------------*/
