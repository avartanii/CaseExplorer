/* eslint comma-dangle: "off", prefer-template: "off" */

$(document).ready(() => {
  let query = '';
  let exportQuery = '';
  let i = 0;

  function exportCSV() {
    const token = window.sessionStorage.getItem('userInfo-token');
    $.ajax({
      url: `http://localhost:3000/export${exportQuery}`,
      type: 'GET',
      headers: {
        'x-access-token': token
      }
    }).done((response) => {
      const data = response.data;
      const filename = response.filename;
      const link = document.createElement('a');
      link.setAttribute('href', data);
      link.setAttribute('download', filename);
      link.click();
    });
  }
  $('#export-button').click(exportCSV);

  $('#query2Checkbox').change(() => {
    const enabled = $('#query2Checkbox').prop('checked');
    $('#query2Attribute').attr('disabled', !enabled);
    $('#query2Comparator').attr('disabled', !enabled);
    $('#query2Value').attr('disabled', !enabled);
  });
  $('#query3Checkbox').change(() => {
    const enabled = $('#query3Checkbox').prop('checked');
    $('#query3Attribute').attr('disabled', !enabled);
    $('#query3Comparator').attr('disabled', !enabled);
    $('#query3Value').attr('disabled', !enabled);
  });
  $('#query4Checkbox').change(() => {
    const enabled = $('#query4Checkbox').prop('checked');
    $('#query4Attribute').attr('disabled', !enabled);
    $('#query4Comparator').attr('disabled', !enabled);
    $('#query4Value').attr('disabled', !enabled);
  });
  $('#query5Checkbox').change(() => {
    const enabled = $('#query5Checkbox').prop('checked');
    $('#query5Attribute').attr('disabled', !enabled);
    $('#query5Comparator').attr('disabled', !enabled);
    $('#query5Value').attr('disabled', !enabled);
  });

  function getAddress(data) {
    return `${data.address.streetNumber} ${data.address.streetName} ${data.address.city} ${data.address.zipCode}`;
  }

  function formatVictimName(data) {
    return `${data.victim.victName.first} ${data.victim.victName.middle} ${data.victim.victName.last}`;
  }

  function formatSuspectName(data) {
    let displayString = '';
    data.suspects.forEach((suspect) => {
      displayString += `${suspect.suspName.first} ${suspect.suspName.middle} ${suspect.suspName.last} `;
    });
    return displayString;
  }

  function loadDataTable() {
    const uri = `http://localhost:3000/cases${query}`;
    const token = window.sessionStorage.getItem('userInfo-token');
    const table = $('#example').DataTable({
      destroy: true,
      ajax: {
        type: 'GET',
        url: uri,
        headers: {
          'x-access-token': token,
        },
        dataSrc: json => json,
      },
      columnDefs: [
        {
          targets: [4, 5, 8, 12],
          render: $.fn.dataTable.render.moment('x', 'Do MMM YY'),
        },
        {
          targets: [0, 1],
          width: '20px',
        },
      ],
      columns: [
        { data: 'drNumber' },
        { data: 'masterDrNumber' },
        { data: 'division' },
        { data: 'bureau' },
        { data: 'dateOccured' },
        { data: 'dateReported' },
        { data: 'weaponUsed[, ]' },
        { data: 'caseStatus' },
        { data: 'caseStatusDate' },
        { data: 'solvabilityFactor' },
        { data: 'reportingDistrict' },
        { data: 'motive[, ]' },
        { data: 'lastModifiedDate' },
        { data: 'lastModifiedBy.email' },
        { data: formatVictimName },
        { data: getAddress },
        { data: formatSuspectName },
        {
          targets: -1,
          data: null,
          defaultContent: '<button>Click!</button>'
        }
      ],
    });

    // https://datatables.net/examples/ajax/null_data_source.html
    $('#example tbody').on('click', 'button', () => {
      const $button = $(event.target); // TODO: WHY TF DOESN'T $(this) WORK?
      const row = $button.closest('tr.child').prev();
      const rowData = table.row(row[0]).data();
      document.cookie = `DR=${rowData['drNumber']}`;
      window.location = '/case';
    });
  }

  // default data table loads with no query
  loadDataTable();

  $('#submit-query').on('click', () => {
    // /cases?drNumber={"lt": 100, "gt": 30}&bureau=OSB
    const a = $('#query1Attribute').val();
    const c = $('#query1Comparator').val();
    const v = $('#query1Value').val();
    if (c === '=') {
      query = `${query}/?${a}${c}${v}`;
    } else {
      query = `${query}/?${a}={"${c}":${+v}}`;
    }

    if ($('#query2Checkbox').prop('checked')) {
      const A = $('#query2Attribute').val();
      const C = $('#query2Comparator').val();
      const V = $('#query2Value').val();
      if (C === '=') {
        query = query + '&' + A + C + V;
      } else {
        query = `${query}&${A}={"${C}":${+V}}`;
      }
    }

    if ($('#query3Checkbox').prop('checked')) {
      if ($('#query3Comparator').val() === '=') {
        query = query + '&' + $('#query3Attribute').val() + $('#query3Comparator').val() + $('#query3Value').val();
      } else {
        query = `${query}&${$('#query3Attribute').val()}={"${$('#query3Comparator').val()}":${+$('#query3Value').val()}}`;
      }
    }

    if ($('#query4Checkbox').prop('checked')) {
      if ($('#query4Comparator').val() === '=') {
        query = query + '&' + $('#query4Attribute').val() + $('#query4Comparator').val() + $('#query4Value').val();
      } else {
        query = `${query}&${$('#query4Attribute').val()}={"${$('#query4Comparator').val()}":${+$('#query4Value').val()}}`;
      }
    }
    loadDataTable();
    exportQuery = query;
    query = ''; // reset query string
  });
});
