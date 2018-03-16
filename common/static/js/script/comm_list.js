/**
 * Created by dev on 2016. 11. 8..
 * Modified by redukyo on 2018. 1. 1
 */
var total_page = "";
var cur_page = "";
var start_page = 1;
$(document).ready(function () {
    search(1);

    $("#search").click(function () {
        search(1);
    });

    $("#search_search").keyup(function (e) {
        if (e.keyCode == 13)
            search(1);
    });
});

Date.prototype.yyyymmdd = function () {
    var mm = this.getUTCMonth() + 1; // getMonth() is zero-based
    var dd = this.getUTCDate();

    return [this.getUTCFullYear(), '/',
        (mm > 9 ? '' : '0') + mm, '/',
        (dd > 9 ? '' : '0') + dd
    ].join('');
};

function search(page_no) {

    if (page_no > 1 && $("#curr_page").val() == page_no)
        return;

    if (page_no)
        $("#curr_page").val(page_no);

    $.post(document.location.pathname,
        {
            'page_size': 10,
            'curr_page': $("#curr_page").val(),
            'search_str': $("#search_search").val(),
            'search_con': $("#search_con").val()
        },
        function (context) {
            var data = context.curr_data;
            var total_cnt = context.total_cnt;
            var all_pages = context.all_pages;
            var yesterday = new Date();
            var curr_page = Number($("#curr_page").val());
            $("#all_pages").val(all_pages);
            yesterday.setDate(yesterday.getDate() - 7); // 일주일 이내 등록글은 new 이미지 표시
            //console.log(data);

            //for table
            var html = "";

            for (var i = 0; i < data.length; i++) {

                var reg_date = new Date(data[i].reg_date);


                var title = '';
                switch (data[i].head_title) {
                    case 'noti_n':
                        title = '[공지] ';
                        break;
                    case 'advert_n':
                        title = '[공고] ';
                        break;
                    case 'guide_n':
                        title = '[안내] ';
                        break;
                    case 'event_n':
                        title = '[이벤트] ';
                        break;
                    case 'etc_n':
                        title = '[기타] ';
                        break;
                }

                //console.log(data[i].subject + ":" + data[i].board_id);

                html += "<li class='tbody'>";
                html += "   <span class='no'>" + eval(total_cnt - (10 * (curr_page - 1) + i)) + "</span>";
                html += "   <span class='title'><a href='/comm_view/" + data[i].board_id + "'>" + title + data[i].subject + " </a>";
                if (reg_date > yesterday)
                    html += "<img src='/static/images/new.jpeg' height='15px;'/>"
                html += "   </span>";
                html += "   <span class='date'>" + reg_date.yyyymmdd() + "</span>";
                html += "</li>";
            }//end for

            //for paging
            var paging = "";
            var page_size = 5;

            //페이징 10건씩 보이기
            var minNum = Math.floor((curr_page - 1) / page_size) * page_size + 1;
            var maxNum = minNum + page_size - 1;

            if (maxNum > all_pages)
                maxNum = all_pages;

            console.log(minNum + ":" + maxNum);

            paging += "<a href='#' class='first' id='first' title='처음으로'>first</a>";
            paging += "<a href='#' class='prev' id='prev' title='이전'>prev</a>";
            for (var i = minNum; i <= maxNum; i++) {
                if (i == curr_page)
                    paging += "<a href='#' class='page current' id='" + i + "' title='현재 페이지'>" + i + "</a>";
                else
                    paging += "<a href='#' class='page' id='" + i + "' title=''>" + i + "</a>";


            }
            paging += "<a href='#' class='next' id='next' title='다음'>next</a>";
            paging += "<a href='#' class='last' id='last' title='마지막으로'>last</a>";

            //console.log(paging);

            $('#tbody').html(html);
            $('#paging').html(paging);

            fnPaging();
        },
        "json");
}

function fnPaging() {
    $("#paging a").click(function () {
        var id = $(this).attr("id");
        var all_pages = $("#all_pages").val();
        var curr_page = $("#curr_page").val();
        var curr_page = $("#curr_page").val();
        var prev_page = Number($("#curr_page").val()) - 1 > 0 ? Number($("#curr_page").val()) - 1 : 1;
        var next_page = Number($("#curr_page").val()) + 1 <= all_pages ? Number($("#curr_page").val()) + 1 : all_pages;
        var last_page = all_pages;

        if (id == curr_page)
            return;
        if (id == 'first' && curr_page == '1')
            return;
        if (id == 'prev' && curr_page == prev_page)
            return;
        if (id == 'next' && curr_page == next_page)
            return;
        if (id == 'last' && curr_page == last_page)
            return;

        if (id == 'first')
            search(1);
        else if (id == 'prev')
            search(prev_page);
        else if (id == 'next')
            search(next_page);
        else if (id == 'last')
            search(last_page);
        else
            search(id);


        console.debug('id: ' + id);
        console.debug('curr_page: ' + curr_page);
        console.debug('prev_page: ' + prev_page);
        console.debug('next_page: ' + next_page);
        console.debug('last_page: ' + last_page);

    });
}