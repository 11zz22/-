/* 
 * ---------------------------------------- *
 * Star Rating                              *
 * JavaScript                               *
 * v1.0                                     *
 * Matt O'Neill | www.matt-oneill.co.uk     *
 * ---------------------------------------- *
 */

(function ($) {
    $.fn.starRating = function (s) {
        return this.each(function () {
            var $ratingElement = $(this);
            $ratingElement.append("<ul />");
            var $ratingField = $(this).children("ul");
            for (var x = 0; x < $ratingElement.data("rating-max"); x++) {
                $ratingField.append("<li>");
            }
            $ratingFieldItem = $ratingField.children();
            var rating = 0;
            $ratingFieldItem.on({
                click: function () {
                    if ($(this).index() + 1 != rating) {
                        rating = $(this).index() + 1;
                        $ratingElement.attr("data-val", rating);
                        $("li:lt(" + ($(this).index() + 1) + ")", $ratingField).addClass("active");
                        $("li:gt(" + ($(this).index()) + ")", $ratingField).removeClass("active");
                    }
                    else {
                        $(this).parent().children("li").removeClass("active");
                        $ratingElement.attr("data-val", null);
                        rating = 0;
                    }
                },
                mouseenter: function () {
                    $("li:lt(" + ($(this).index() + 1) + ")", $ratingField).addClass("hover");
                    $("li:gt(" + ($(this).index()) + ")", $ratingField).removeClass("hover");
                },
                mouseleave: function () {
                    $(this).parent().children("li:gt(" + ($(this).index()) + ")").removeClass("hover");
                }
            });
            $ratingField.on({
                mouseleave: function () {
                    $ratingFieldItem.removeClass("hover");
                }
            });
            if (s.minus) {
                $ratingElement.prepend("<span class='less'></span>");
                $("span.less", $ratingElement).on("click", function () {
                    $("li.active:last", $ratingField).removeClass("active");
                });
            }
        });
    };
}(jQuery));
// 处理评价表单提交
document.getElementById('reviewForm').addEventListener('submit', function (e) {
    e.preventDefault();
    // 获取评分
    const ratings = {};
    this.querySelectorAll('.star-rating').forEach(group => {
        const label = group.previousElementSibling.textContent.replace('：', '');
        ratings[label] = group.dataset.rating || '0';
    });

    // 获取评价内容
    const content = document.getElementById('reviewContent').value;

    // 创建新评价元素
    const newReview = document.createElement('div');
    newReview.className = 'review-item';

    // 构建评价HTML
    newReview.innerHTML = `
        <h4>用户评价 来自 <a href="#">用户</a></h4>
        <div class="rating-list">
            ${Object.entries(ratings).map(([label, rating]) => `
                <div class="rating-item">
                    <span class="rating-title">${label}：</span>
                    <div class="stars">
                        ${Array(5).fill(0).map((_, i) => `
                            <span class="star ${i < rating ? 'active' : ''}">★</span>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        <p class="review-content">${content}</p>
        <span class="review-time">${new Date().toLocaleDateString()}</span>
    `;

    // 添加到评价列表的开头
    const reviewList = document.querySelector('.review-list');
    reviewList.insertBefore(newReview, reviewList.firstChild);

    // 重置表单
    this.reset();
    this.querySelectorAll('.star-rating').forEach(group => {
        group.dataset.rating = '0';
        group.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
    });
});