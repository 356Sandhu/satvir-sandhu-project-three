$(document).ready(function () {
  console.log("ready!");
  $("#form-stuff").submit(function (e) {
    e.preventDefault();
    let target_revenue = $("#target-revenue").val();
    let subscription = $("#subscription").val();
    let time_frame = $("#time-frame").val();
    let breakdown = [];
    for (let i = 0; i < 6; i++) {
      breakdown[i] = target_revenue * ((i + 1) / 6);
    }
    console.log(target_revenue, subscription, time_frame);
    console.table(breakdown);

    $("section").show();

    breakdown.forEach((item, index) => {
      $(`#period-${index + 1} .revenue`).text(`${item}`);
    });

    $("body,html").animate(
      {
        scrollTop: $("section").offset().top,
      },
      800
    );

    let min_price, max_price, min_customers, max_customers;
    if (subscription) {
      min_price = 1.0;
      max_price = 100.0;
      min_customers = target_revenue / max_price / time_frame;
      max_customers = target_revenue / min_price / time_frame;
    } else {
      min_price = 1.0;
      max_price = 1000.0;
      min_customers = target_revenue / max_price;
      max_customers = target_revenue / min_price;
    }

    $(".customers input[type=range]").attr("min", min_customers);
    $(".customers input[type=range]").attr("max", max_customers);

    $(".pricing input[type=range]").attr("min", min_price);
    $(".pricing input[type=range]").attr("max", max_price);

    $("input[type=range]").attr("max", 20);
    $("input[type=range]").on("input", function () {
      console.log($(this).val());
    });
  });
});
