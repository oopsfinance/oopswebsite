const makeWhitelistInput = () => {
  const preloadUrl = "https://api.oops.finance/api/v1/public/preload";
  const whitelistSuccess = document.querySelector(".whitelist__success");
  const whitelistInput = document.querySelector("#whitelist-input");
  const phoneInput = document.querySelector("#whitelist-input input");
  const phoneButton = document.querySelector("#whitelist-input button");
  const phoneMask = IMask(phoneInput, { mask: "+{1} (000) 000-0000" });

  phoneButton.disabled = !phoneMask.masked.isComplete;
  phoneMask.on("accept", () => {
    phoneButton.disabled = !phoneMask.masked.isComplete;
  });

  phoneButton.onclick = async () => {
    phoneButton.disabled = true;
    const body = JSON.stringify({ phone: phoneMask.unmaskedValue });
    const res = await fetch(preloadUrl, { body, method: "POST" });

    phoneButton.disabled = false;
    if (res.ok == false) return alert("Error!");

    whitelistInput.style.display = "none";
    whitelistSuccess.style.display = "";
  };
};

const makeOopsTotal = () => {
  let actualTotal = 0;
  let currentTotal = 0;

  const loadOopsedTotal = async () => {
    const url = "https://api.oops.finance/api/v1/public/oops_total";
    const res = await fetch(url);
    const { oops_total } = await res.json();
    return Math.round(oops_total);
  };

  const renderTotal = (total) => {
    const money = document.querySelector(".main__total");
    money.innerHTML = total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    });
  };

  // Animation increment
  setInterval(() => {
    if (actualTotal == currentTotal) return;
    currentTotal += 1;
    renderTotal(currentTotal);
  }, 100);

  // Fetch first oopsed total
  loadOopsedTotal().then((total) => {
    currentTotal = Math.max(0, total - 100);
    actualTotal = total;
  });

  // Update actual oopsed total
  setInterval(() => {
    loadOopsedTotal().then((total) => (actualTotal = total));
  }, 60000);
};

window.addEventListener("load", () => {
  makeOopsTotal();
  makeWhitelistInput();
});
