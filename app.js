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
  });
});
