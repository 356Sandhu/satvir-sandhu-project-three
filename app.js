let state = {};

state.init = function () {
  state.form = $("#formStuff");

  state.slider = $(".slider input[type=range]");
  state.sliderMin = $(".slider .min");
  state.sliderMax = $(".slider .max");
  state.sliderType = $("input[type=radio][name=sliderType]");
  state.sliderHeading = $(".summary p");
  state.sliderCurrent = $(".slider .currentValue");

  state.inputRevenue = $("#targetRevenue");
  state.inputSubscription = $("#subscription");
  state.inputTime = $("#timeFrame");

  state.fetchInputs = function () {
    state.targetRevenue = state.inputRevenue.val();
    state.subscription = state.inputSubscription.val();
    state.timeFrame = state.inputTime.val();
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
      state.breakdown[i] = state.targetRevenue * ((i + 1) / 6);
    }

    state.minPrice = 1.0;
    state.maxPrice = 10.0;

    if (state.subscription == "true") {
      state.minCustomers = Math.ceil(
        state.targetRevenue / state.maxPrice / state.timeFrame
      );
      state.maxCustomers = Math.ceil(
        state.targetRevenue / state.minPrice / state.timeFrame
      );
    } else {
      state.minCustomers = Math.ceil(state.targetRevenue / state.maxPrice);
      state.maxCustomers = Math.ceil(state.targetRevenue / state.minPrice);
    }

    state.currentPrice = (state.maxPrice + state.minPrice) / 2;
    state.currentCustomers = Math.ceil(
      (state.maxCustomers + state.minCustomers) / 2
    );
  };

  state.setSlider = function (box) {
    console.log(box.value);
    if (box.value === "pricing") {
      state.slider.attr("min", state.minPrice);
      state.slider.attr("max", state.maxPrice);
      state.slider.attr("step", "0.01");
      state.sliderMin.text(state.minPrice);
      state.sliderMax.text(state.maxPrice);

      state.slider.val(state.currentPrice);
      state.sliderCurrent.text(`$${state.slider.val()}`);
    } else {
      state.slider.attr("min", state.minCustomers);
      state.slider.attr("max", state.maxCustomers);
      state.slider.attr("step", "1");
      state.sliderMin.text(state.minCustomers);
      state.sliderMax.text(state.maxCustomers);

      state.slider.val(state.currentCustomers);
      state.sliderCurrent.text(`${state.slider.val()} customers`);
    }

    state.sliderHeading.html(
      `At <span class="accented">$${state.currentPrice}</span> per month, you would need <span class="accented">${state.currentCustomers}</span> monthly subscribers.`
    );
  };

  state.form.submit(function (e) {
    e.preventDefault();

    state.fetchInputs();
    state.doMath();
    state.setSlider(state.sliderType);

    $("#customersRadio").prop("checked", true);

    $(`.bar`).height("0px");
    state.breakdown.forEach((item, index) => {
      // This resource was used for this animation: https://stackoverflow.com/questions/2540277/jquery-counter-to-count-up-to-a-target-number
      $({ counter: 0 }).animate(
        { counter: item + 1 },
        {
          duration: 2000,
          easing: "swing",
          step: function () {
            $(`#period${index + 1} .revenue`).text(
              `$${Math.floor(this.counter)}`
            );
          },
          complete: function () {
            $(`#period${index + 1} .revenue`).text(`$${Math.ceil(item)}`);
          },
        }
      );

      $(`#bar${index + 1}`).animate(
        {
          height: `${
            ((item * ((index + 1) / 6)) / state.targetRevenue) * 100
          }%`,
        },
        2000
      );
    });

    $("section").show();

    state.animate(1000);
  });

  state.sliderType.change(function () {
    state.setSlider(this);
  });

  state.slider.on("input", function () {
    if ($("input[name=sliderType]:checked").val() === "pricing") {
      state.sliderCurrent.text(`$${state.slider.val()}`);
      state.currentPrice = parseFloat(state.slider.val()).toFixed(2);

      if (state.subscription == "true") {
        state.currentCustomers = Math.ceil(
          state.targetRevenue / state.currentPrice / state.timeFrame
        );
        state.sliderHeading.html(
          `At <span class="accented">$${state.currentPrice}</span> per month, you would need <span class="accented">${state.currentCustomers}</span> monthly subscribers.`
        );
      } else {
        state.currentCustomers = Math.ceil(
          state.targetRevenue / state.currentPrice
        );
        state.sliderHeading.html(
          `At <span class="accented">$${state.currentPrice}</span> per item, you would need <span class="accented">${state.currentCustomers}</span> customers.`
        );
      }
    } else {
      state.sliderCurrent.text(`${Math.ceil(state.slider.val())} customers`);
      state.currentCustomers = Math.ceil(state.slider.val());
      if (state.subscription == "true") {
        state.currentPrice = parseFloat(
          state.targetRevenue / state.currentCustomers / state.timeFrame
        ).toFixed(2);
        state.sliderHeading.html(
          `Having <span class="accented"> ${state.currentCustomers} </span> monthly subcribers, you would need to charge <span class="accented">$${state.currentPrice}</span> per month.`
        );
      } else {
        state.currentPrice = parseFloat(
          state.targetRevenue / state.currentCustomers
        ).toFixed(2);
        state.sliderHeading.html(
          `Having <span class="accented">${state.currentCustomers}</span> customers, you would need to charge <span class="accented">$${state.currentPrice}</span> per item.`
        );
      }
    }
  });
};

$(document).ready(function () {
  state.init();
});
