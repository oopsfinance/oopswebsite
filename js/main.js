const makeOopsTotal = () => {
  let actualTotal = 0;
  let currentTotal = 0;

  const loadOopsedTotal = async () => {
    const url = "https://api.oops.finance/api/v3/public/oops_total";
    const res = await fetch(url);
    const { oops_total } = await res.json();
    return Math.round(oops_total);
  };

  const renderTotal = (total) => {
    const money = document.querySelector(".main__total");
    const totalContainter = document.querySelector(".total");
    totalContainter.style.transform = 'translateY(0px)'
    totalContainter.style.opacity = 1

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
});
