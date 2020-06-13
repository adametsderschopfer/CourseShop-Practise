document.addEventListener("DOMContentLoaded", () => {
  const toCurrency = (price) => {
    return new Intl.NumberFormat("ru-Ru", {
      currency: "rub",
      style: "currency",
    }).format(price);
  };

  const toDate = (date) =>
    new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(date));

  document.querySelectorAll(".date").forEach((node) => {
    node.textContent = toDate(node.textContent);
  });

  document.querySelectorAll(".price").forEach((node) => {
    node.textContent = toCurrency(node.textContent);
  });

  const $cart = document.querySelector("#cart");

  if ($cart) {
    $cart.addEventListener("click", (e) => {
      if (e.target.classList.contains("js-remove")) {
        const id = e.target.dataset.id;
        const _csrf = e.target.dataset.csrf;

        fetch(`/cart/remove/${id}`, {
          method: "delete",
          headers: {
            "X-XSRF-TOKEN": _csrf
          }
        })
          .then((res) => res.json())
          .then((cart) => {
            if (cart.courses.length) {
              const html = cart.courses
                .map((c) => {
                  return `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.count}</td>
                  <td>
                    <button class="btn btn-small js-remove" data-id="${c.id}" data-csrf="${_csrf}">Delete</button>
                  </td>
                </tr> 
                `;
                })
                .join("");
              $cart.querySelector("tbody").innerHTML = html;
              $cart.querySelector(".price").textContent = toCurrency(
                cart.price
              );
            } else {
              $cart.innerHTML = `<p>Cart is currently empty</p>`;
            }
          });
      }
    });
  }

  M.Tabs.init(document.querySelectorAll(".tabs"));
});
