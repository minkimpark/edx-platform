$(document).ready(function(){
    var value_list;
    var board_id = $('#board_id').text();
    var html = "";
    $.ajax({
        url : '/comm_k_news_view/'+board_id,
            data : {
                method : 'view'
            }
    }).done(function(data){
        //console.log(data);
        var title = data[3]+data[0];
        $('#title').html(title);
        $('#context').html(data[1].replace(/\&\^\&/g, ','));
        $('#reg_date').html('작성일 : '+data[2]);
        if(data[4] != '' && data[4] != null){
            value_list = data[4].toString().split(',');
            for(var i=0; i<value_list.length; i++){
                html += "<li><a href='#' id='download' >"+value_list[i]+"</a></li>";
            }
        }
        $('#file').html(html);
    });
});

$(document).on('click', '#list', function(){
    location.href='/comm_k_news'
});

$(document).on('click', '#file > li > a', function(){
    var file_name = $(this).text();
    var board_id = $('#board_id').text();

    $.ajax({
        url : '/comm_k_news_view/'+board_id,
            data : {
                method : 'file_download',
                file_name : file_name
            }
    }).done(function(data){
        $("#download").prop("href", data);
        location.href=$("#download").attr('href');
    });
});

