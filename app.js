$(document).ready(function () {
  console.log("ready!");
  $("#form-stuff").submit(function (e) {
    e.preventDefault();
    console.log($("#target-revenue").val());
  });
});
