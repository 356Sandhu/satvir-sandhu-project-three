$(document).ready(function () {
  console.log("ready!");
  $("#form-stuff").submit(function (e) {
    e.preventDefault();
    let target_revenue = $("#target-revenue").val();
    let subscription = $("#subscription").val();
    let time_frame = $("#time-frame").val();
    console.log(target_revenue, subscription, time_frame);
  });
});
