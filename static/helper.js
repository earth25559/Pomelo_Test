var request = new XMLHttpRequest()
const query = 'nodejs'
const number_of_query = '100'
const git_result = 'https://api.github.com/search/repositories?q=' +query+ '&order=desc+&per_page='+number_of_query
// Open a new connection, using the GET request on the URL endpoint
request.open('GET', git_result, true)

request.onload = function () {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  var data = data.items
  var state = {
      'querySet': data,
      'page': 1,
      'rows': 10,
      }


function pagination(querySet, page, rows){
      var trimStart = (page -1)* rows
      var trimEnd = trimStart + rows

      var trimmedData = querySet.slice(trimStart, trimEnd)
      var pages = Math.ceil(querySet.length/ rows)
      return {
          'querySet' : trimmedData,
          'pages' : pages
      }
    }

function pageButtons(pages, page_no) {
    var wrapper = document.getElementById('pagination-wrapper')

    wrapper.innerHTML = ``

    for (var page = 1; page <= pages; page++) {
      if(page == page_no){
        wrapper.innerHTML += `<button style = "margin:5px;" id=${page} value=${page} class="page btn btn-sm btn-info active">${page}</button>`
      } else {
    	wrapper.innerHTML += `<button style = "margin:5px;" id=${page} value=${page} class="page btn btn-sm btn-info">${page}</button>`
      }
    }


    $('.page').on('click', function(){
      $('tbody').empty()
      state.page = $(this).val()
      buildTable(state.page)
    })


}
function buildTable(page_no) {
  var data = pagination(state.querySet, state.page, state.rows)
  var statusHTML = '';
  $.each(data.querySet, function(i, status) {
    statusHTML += '<tr>';
    statusHTML += '<td>' + status.id + '</td>';
    statusHTML += '<td>' + status.full_name + '</td>';
    statusHTML += '<td>' + status.html_url + '</td>';
    statusHTML += '<td>' + status.watchers_count + '</td>';
    if (status.language == null) {
      statusHTML += '<td>' + '-' + '</td>';
    } else {
      statusHTML += '<td>' + status.language + '</td>';
    }
    statusHTML += '</tr>';
  });
  $('tbody').html(statusHTML);
  pageButtons(data.pages, page_no)
  
}
buildTable(1)

}
// // Send request
request.send();