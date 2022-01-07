window.addEventListener("load", function () {
  function parseData(url) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    if (xhr.status == 200) {
      var totalSpendings = Math.floor(
        JSON.parse(xhr.responseText)["oops_total"]
      );
      return totalSpendings;
    } else console.log(xhr.status + " " + xhr.satusText);
  }

  function increaseValue(increase, currentValue) {
    let needTime = increase / 10;
    increasedValue = currentValue + increase;
    const countDown = setInterval(() => {
      currentValue++;
      money.innerHTML = currentValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });
      if (increasedValue - currentValue == 0) clearInterval(countDown);
    }, (1000 * needTime) / increase);
    return increasedValue;
  }

  function checkNew(url, currentValue) {
    let newValue = parseData(url) + 100;
    if (newValue != currentValue) increaseValue(newValue - currentValue);
  }

  let preloadUrl = "https://api.oops.finance/api/v1/public/preload";
  var whitelistSuccess = document.querySelector(".whitelist__success");
  var whitelistInput = document.querySelector("#whitelist-input");
  var phoneInput = document.querySelector("#whitelist-input input");
  var phoneButton = document.querySelector("#whitelist-input button");
  var phoneMask = IMask(phoneInput, {
    mask: "+{1} (000) 000-000",
  });

  phoneButton.disabled = !phoneMask.masked.isComplete;
  phoneMask.on("accept", function () {
    phoneButton.disabled = !phoneMask.masked.isComplete;
  });

  phoneButton.onclick = function () {
    phoneButton.disabled = true;
    fetch(preloadUrl, {
      method: "POST",
      body: JSON.stringify({ phone: phoneMask.unmaskedValue }),
    }).then((res) => {
      phoneButton.disabled = false;
      if (res.ok == false) {
        alert("Error!");
        return;
      }

      whitelistInput.style.display = "none";
      whitelistSuccess.style.display = "";
    });
  };

  const money = document.querySelector(".main__total");
  let url = "https://api.oops.finance/api/v1/public/oops_total";
  let value = parseInt(parseData(url)); //parse initial value
  money.innerHTML = value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  let difference = 100; // initial difference in money to make nice animation

  value = increaseValue(difference, value);
  setInterval(checkNew, 60000, url, value); // change the time when it parses new data
});
