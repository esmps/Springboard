const BASE_URL = "http://localhost:5000/api";

async function getInitialCupcakes() {
  const response = await axios.get(`${BASE_URL}/cupcakes`);

  for (let c of response.data.cupcakes) {
    const newCupcake = $(generateCupcake(c));
    $("#cupcakes").append(newCupcake);
  }
}

function generateCupcake(cupcake) {
  return `
    <div data-cupcake-id=${cupcake.id} class="card cupcake-info" style="width: 18rem;">
      <img class="card-img-top" src="${cupcake.image}" alt="Card image cap">
      <div class="card-body">
        <p class="card-text">Flavor: ${cupcake.flavor}</p>
        <p class="card-text">Size: ${cupcake.size}</p>
        <p class="card-text">Rating: ${cupcake.rating}</p>
        <button class=" btn btn-danger delete-button">Delete</button>
      </div>
    </div>
    `;
}

$('#cupcake-form').submit( async function(e) {
  e.preventDefault();
  const flavor = $("#flavor").val();
  const size = $("#size").val();
  const rating = $("#rating").val();
  const image = $("#image").val();
  
  const newCupcakeRes = await axios.post(`${BASE_URL}/cupcakes`, {flavor, size, rating, image})
  let newCupcake = $(generateCupcake(newCupcakeRes.data.cupcake));
  $("#cupcakes").append(newCupcake);
  $("#cupcake-form").trigger("reset");
});

$("#cupcakes").on("click", ".delete-button", async function (evt) {
  evt.preventDefault();
  let cupcake = $(evt.target).parent().parent();
  let cupcakeId = cupcake.attr("data-cupcake-id");

  await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`);
  cupcake.remove();
});

getInitialCupcakes()