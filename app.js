let state = {};

state.init = function () {
  state.form = $("#form-stuff");

  state.slider = $(".slider input[type=range]");
  state.slider_min = $(".slider .min");
  state.slider_max = $(".slider .max");
  state.slider_type = $("input[type=radio][name=slider-type]");
  state.slider_heading = $(".summary p");
  state.slider_current = $(".slider .current-value");

  state.input_revenue = $("#target-revenue");
  state.input_subscription = $("#subscription");
  state.input_time = $("#time-frame");

  state.fetchInputs = function () {
    state.target_revenue = state.input_revenue.val();
    state.subscription = state.input_subscription.val();
    state.time_frame = state.input_time.val();
  };

  state.animate = function (duration) {
    $("body,html").animate(
      {
        scrollTop: $("section").offset().top,
      },
      duration
    );
  };

  state.doMath = function () {
    state.breakdown = [];
    for (let i = 0; i < 6; i++) {
      state.breakdown[i] = state.target_revenue * ((i + 1) / 6);
    }

    state.min_price = 1.0;
    state.max_price = 10.0;

    if (state.subscription == "true") {
      state.min_customers = Math.ceil(
        state.target_revenue / state.max_price / state.time_frame
      );
      state.max_customers = Math.ceil(
        state.target_revenue / state.min_price / state.time_frame
      );
    } else {
      state.min_customers = Math.ceil(state.target_revenue / state.max_price);
      state.max_customers = Math.ceil(state.target_revenue / state.min_price);
    }

    state.current_price = (state.max_price + state.min_price) / 2;
    state.current_customers = Math.ceil(
      (state.max_customers + state.min_customers) / 2
    );
  };

  state.setSlider = function (box) {
    if (box.value === "pricing") {
      state.slider.attr("min", state.min_price);
      state.slider.attr("max", state.max_price);
      state.slider.attr("step", "0.01");
      state.slider_min.text(state.min_price);
      state.slider_max.text(state.max_price);

      state.slider.val(state.current_price);
      state.slider_current.text(`$${state.slider.val()}`);
    } else {
      state.slider.attr("min", state.min_customers);
      state.slider.attr("max", state.max_customers);
      state.slider.attr("step", "1");
      state.slider_min.text(state.min_customers);
      state.slider_max.text(state.max_customers);

      state.slider.val(state.current_customers);
      state.slider_current.text(`${state.slider.val()} customers`);
    }

    state.slider_heading.html(
      `At <span class="accented">$${state.current_price}</span> per month, you would need <span class="accented">${state.current_customers}</span> monthly subscribers.`
    );
  };

  state.form.submit(function (e) {
    e.preventDefault();

    state.fetchInputs();
    state.doMath();
    state.setSlider(state.slider_type);

    $("#customers-radio").prop("checked", true);

    $(`.bar`).height("0px");
    state.breakdown.forEach((item, index) => {
      // This resource was used for this animation: https://stackoverflow.com/questions/2540277/jquery-counter-to-count-up-to-a-target-number
      $({ counter: 0 }).animate(
        { counter: item + 1 },
        {
          duration: 2000,
          easing: "swing",
          step: function () {
            $(`#period-${index + 1} .revenue`).text(
              `$${Math.floor(this.counter)}`
            );
          },
          complete: function () {
            $(`#period-${index + 1} .revenue`).text(`$${Math.ceil(item)}`);
          },
        }
      );

      $(`#bar-${index + 1}`).animate(
        {
          height: `${
            ((item * ((index + 1) / 6)) / state.target_revenue) * 100
          }%`,
        },
        2000
      );
      // $(`#bar-${index + 1}`).height(
      //   `${((item * ((index + 1) / 6)) / state.target_revenue) * 100}%`
      // );
    });

    $("section").show();

    state.animate(1000);
  });

  state.slider_type.change(function () {
    state.setSlider(this);
  });

  state.slider.on("input", function () {
    if ($("input[name=slider-type]:checked").val() === "pricing") {
      state.slider_current.text(`$${state.slider.val()}`);
      state.current_price = parseFloat(state.slider.val()).toFixed(2);

      if (state.subscription == "true") {
        state.current_customers = Math.ceil(
          state.target_revenue / state.current_price / state.time_frame
        );
        state.slider_heading.html(
          `At <span class="accented">$${state.current_price}</span> per month, you would need <span class="accented">${state.current_customers}</span> monthly subscribers.`
        );
      } else {
        state.current_customers = Math.ceil(
          state.target_revenue / state.current_price
        );
        state.slider_heading.html(
          `At <span class="accented">$${state.current_price}</span> per item, you would need <span class="accented">${state.current_customers}</span> customers.`
        );
      }
    } else {
      state.slider_current.text(`${Math.ceil(state.slider.val())} customers`);
      state.current_customers = Math.ceil(state.slider.val());
      if (state.subscription == "true") {
        state.current_price = parseFloat(
          state.target_revenue / state.current_customers / state.time_frame
        ).toFixed(2);
        state.slider_heading.html(
          `Having <span class="accented"> ${state.current_customers} </span> monthly subcribers, you would need to charge <span class="accented">$${state.current_price}</span> per month.`
        );
      } else {
        state.current_price = parseFloat(
          state.target_revenue / state.current_customers
        ).toFixed(2);
        state.slider_heading.html(
          `Having <span class="accented">${state.current_customers}</span> customers, you would need to charge <span class="accented">$${state.current_price}</span> per item.`
        );
      }
    }
  });
};

$(document).ready(function () {
  state.init();
});
